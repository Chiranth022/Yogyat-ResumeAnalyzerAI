import os
import io
from typing import Tuple, Dict, Any
import pymupdf  # PyMuPDF
import docx

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

class ExtractionError(Exception):
    pass

def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        doc = pymupdf.open(stream=file_bytes, filetype="pdf")
        if len(doc) == 0:
            raise ExtractionError("PDF file contains 0 pages.")

        page_texts = []
        for page_num in range(len(doc)):
            page = doc[page_num]
            rect = page.rect
            page_width = rect.width

            # Extract layout blocks: (x0, y0, x1, y1, text, block_no, block_type)
            # block_type == 0 indicates text
            blocks = [b for b in page.get_text("blocks") if b[6] == 0 and b[4].strip()]
            
            if not blocks:
                # Fallback to plain text stream if blocks empty
                raw_text = page.get_text("text").strip()
                if raw_text:
                    page_texts.append(raw_text)
                continue

            # Detect if layout is multi-column: check if blocks are distinctly distributed horizontally
            midpoint = page_width * 0.45
            left_blocks = [b for b in blocks if b[0] < midpoint]
            right_blocks = [b for b in blocks if b[0] >= midpoint]
            
            # If both columns have significant content, sort column-by-column (left then right)
            is_two_column = len(left_blocks) >= 2 and len(right_blocks) >= 2
            if is_two_column:
                # Sort left column top-to-bottom, then right column top-to-bottom
                left_blocks.sort(key=lambda b: (b[1], b[0]))
                right_blocks.sort(key=lambda b: (b[1], b[0]))
                sorted_blocks = left_blocks + right_blocks
            else:
                # Standard single-column or linear flow: sort strictly by vertical Y coordinate with slight X tolerance
                sorted_blocks = sorted(blocks, key=lambda b: (round(b[1] / 12) * 12, b[0]))

            page_content = "\n\n".join(b[4].strip() for b in sorted_blocks if b[4].strip())
            page_texts.append(page_content)

        doc.close()
        full_text = "\n\n".join(page_texts).strip()
        if not full_text or len(full_text) < 30:
            raise ExtractionError("No readable text could be extracted from this PDF. It might be scanned, flattened, or image-based.")
        return full_text
    except Exception as e:
        if isinstance(e, ExtractionError):
            raise
        raise ExtractionError(f"Failed to process PDF file: {str(e)}")

def extract_text_from_docx(file_bytes: bytes) -> str:
    try:
        doc = docx.Document(io.BytesIO(file_bytes))
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        
        # Also extract table text if present
        table_texts = []
        for table in doc.tables:
            for row in table.rows:
                row_str = " | ".join([cell.text.strip() for cell in row.cells if cell.text.strip()])
                if row_str:
                    table_texts.append(row_str)
                    
        full_text = "\n".join(paragraphs + table_texts).strip()
        if not full_text:
            raise ExtractionError("DOCX file appears empty or contains no readable text.")
        return full_text
    except Exception as e:
        if isinstance(e, ExtractionError):
            raise
        raise ExtractionError(f"Failed to process DOCX file: {str(e)}")

import re

SECTION_PATTERNS = {
    "summary": r"(?:^|\n)\s*(?:PROFESSIONAL\s+SUMMARY|EXECUTIVE\s+SUMMARY|CAREER\s+OBJECTIVE|SUMMARY|PROFILE|ABOUT\s+ME)\s*(?:\n|:)",
    "education": r"(?:^|\n)\s*(?:EDUCATION|ACADEMIC\s+BACKGROUND|QUALIFICATIONS)\s*(?:\n|:)",
    "experience": r"(?:^|\n)\s*(?:PROFESSIONAL\s+EXPERIENCE|WORK\s+EXPERIENCE|EMPLOYMENT\s+HISTORY|EXPERIENCE)\s*(?:\n|:)",
    "projects": r"(?:^|\n)\s*(?:KEY\s+PROJECTS|PERSONAL\s+PROJECTS|ACADEMIC\s+PROJECTS|PROJECTS)\s*(?:\n|:)",
    "skills": r"(?:^|\n)\s*(?:TECHNICAL\s+SKILLS|CORE\s+COMPETENCIES|SKILLS\s*&?\s*EXPERTISE|TECHNOLOGIES|SKILLS)\s*(?:\n|:)",
    "certifications": r"(?:^|\n)\s*(?:CERTIFICATIONS\s*&?\s*HONORS|CERTIFICATIONS|CERTIFICATES|AWARDS)\s*(?:\n|:)"
}

def extract_sections_from_text(text: str) -> Dict[str, str]:
    """Segment resume text into structured sections (Contact, Summary, Education, Experience, Projects, Skills, Certifications)."""
    matches = []
    for sec_name, pattern in SECTION_PATTERNS.items():
        for m in re.finditer(pattern, text, re.IGNORECASE):
            matches.append((m.start(), m.end(), sec_name))
            
    matches.sort(key=lambda x: x[0])
    
    sections: Dict[str, str] = {
        "contact": "",
        "summary": "",
        "education": "",
        "experience": "",
        "projects": "",
        "skills": "",
        "certifications": "",
        "other": ""
    }
    
    if not matches:
        sections["other"] = text.strip()
        return sections
        
    # Content before the first matched header is typically contact info & header
    first_start = matches[0][0]
    sections["contact"] = text[:first_start].strip()
    
    for i in range(len(matches)):
        start_idx = matches[i][1]
        sec_name = matches[i][2]
        end_idx = matches[i+1][0] if i + 1 < len(matches) else len(text)
        chunk = text[start_idx:end_idx].strip()
        if sections.get(sec_name):
            sections[sec_name] += "\n\n" + chunk
        else:
            sections[sec_name] = chunk
            
    return sections

def extract_text_from_file(filename: str, file_bytes: bytes) -> Tuple[str, Dict[str, Any]]:
    if len(file_bytes) > MAX_FILE_SIZE:
        raise ExtractionError(f"File exceeds maximum size limit of 10MB ({len(file_bytes)/(1024*1024):.1f}MB)")
    
    ext = os.path.splitext(filename)[1].lower()
    
    if ext == ".pdf":
        text = extract_text_from_pdf(file_bytes)
        format_name = "PDF"
    elif ext in [".docx", ".doc"]:
        text = extract_text_from_docx(file_bytes)
        format_name = "DOCX"
    elif ext in [".txt", ".md"]:
        try:
            text = file_bytes.decode("utf-8")
        except UnicodeDecodeError:
            text = file_bytes.decode("latin-1", errors="ignore")
        format_name = "Text"
    else:
        raise ExtractionError(f"Unsupported file format '{ext}'. Please upload a PDF or DOCX file.")

    sections = extract_sections_from_text(text)

    metadata = {
        "filename": filename,
        "format": format_name,
        "size_bytes": len(file_bytes),
        "size_formatted": f"{len(file_bytes) / 1024:.1f} KB" if len(file_bytes) < 1024 * 1024 else f"{len(file_bytes) / (1024 * 1024):.2f} MB",
        "word_count": len(text.split()),
        "character_count": len(text),
        "sections_detected": [k for k, v in sections.items() if v.strip() and k != "other"],
        "sections": sections
    }
    
    return text, metadata
