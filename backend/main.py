import os
import io
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel

from backend.parsers.extractor import extract_text_from_file, extract_sections_from_text, ExtractionError
from backend.nlp.engine import analyze_resume_pipeline, extract_skills_from_text
from backend.nlp.gemini_evaluator import evaluate_with_gemini
from backend.nlp.copilot import handle_copilot_chat
from backend.db.database import (
    init_db,
    save_analysis,
    get_analysis,
    get_all_analyses,
    delete_analysis,
    clear_all_history
)
from backend.sample_data.samples import (
    SAMPLE_RESUME_TEXT,
    SAMPLE_JOB_DESCRIPTION,
    generate_sample_pdf,
    generate_sample_docx
)

app = FastAPI(
    title="Yogyat API",
    description="Backend API for Yogyat: Understand your resume. Match your career.",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
def on_startup():
    init_db()
    # Pre-populate sample analyses if database is empty so Dashboard has rich initial data
    existing = get_all_analyses()
    if not existing:
        # Pre-populate the requested sample records:
        # 1. Software Engineer Resume (Software Engineer, 82% match, Today)
        res1 = analyze_resume_pipeline(SAMPLE_RESUME_TEXT, SAMPLE_JOB_DESCRIPTION, "Software Engineer Resume.pdf")
        res1["resume_text"] = SAMPLE_RESUME_TEXT
        res1["job_description"] = SAMPLE_JOB_DESCRIPTION
        save_analysis(
            filename="Software Engineer Resume.pdf",
            target_role="Software Engineer",
            overall_score=82,
            ats_score=86,
            job_match_score=82,
            skills_count=24,
            analysis_data=res1,
            analysis_id="demo-analysis-1"
        )
        # 2. ML Resume (Machine Learning Intern, 76% match, Yesterday)
        res2_jd = "Machine Learning Intern at AI Startup. Required: Python, Machine Learning, PyTorch, SQL."
        res2 = analyze_resume_pipeline(SAMPLE_RESUME_TEXT, res2_jd, "ML Resume.docx")
        res2["resume_text"] = SAMPLE_RESUME_TEXT
        res2["job_description"] = res2_jd
        save_analysis(
            filename="ML Resume.docx",
            target_role="Machine Learning Intern",
            overall_score=76,
            ats_score=80,
            job_match_score=76,
            skills_count=18,
            analysis_data=res2,
            analysis_id="demo-analysis-2"
        )

from dotenv import load_dotenv
load_dotenv()

# Request Models
class AnalyzeResumeRequest(BaseModel):
    resume_text: str
    job_description: Optional[str] = ""
    filename: Optional[str] = "Resume.pdf"
    target_role: Optional[str] = "Software Engineer"

class JobAnalyzeRequest(BaseModel):
    job_description: str

class CopilotChatRequest(BaseModel):
    query: str
    messages: Optional[List[Dict[str, str]]] = []
    analysis_data: Optional[Dict[str, Any]] = None
    job_description: Optional[str] = None

class ChatRequest(BaseModel):
    userInput: str
    resumeText: Optional[str] = ""

from backend.parsers.pdf_generator import build_pdf_resume
import re

class ExportPdfRequest(BaseModel):
    resume_data: Dict[str, Any]
    font_choice: Optional[str] = "serif"

@app.get("/api/health")
def health_check():
    gemini_key = os.getenv("GEMINI_API_KEY")
    return {
        "status": "ok",
        "product": "Yogyat",
        "version": "1.0.0",
        "gemini_active": bool(gemini_key and len(gemini_key) > 10),
        "gemini_model": os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
    }

@app.post("/api/resume/builder/export-pdf")
async def export_resume_pdf(request: ExportPdfRequest):
    try:
        contact = request.resume_data.get("contact") or request.resume_data.get("personal_info") or {}
        if not isinstance(contact, dict):
            contact = {}
        raw_name = str(contact.get("fullName") or contact.get("full_name") or contact.get("name") or "Resume").strip()
        safe_name = re.sub(r'[^\w\-_.]', '_', raw_name) or "Resume"
        filename = f"{safe_name}_Resume.pdf"
        
        pdf_bytes = build_pdf_resume(request.resume_data, request.font_choice)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Content-Type": "application/pdf"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate vector PDF: {str(e)}")

from backend.nlp.gemini_client import generate_chat_response, GeminiClientError

@app.post("/api/chat")
def chat_endpoint(request: ChatRequest):
    if not request.userInput or not request.userInput.strip():
        raise HTTPException(status_code=400, detail="userInput is required")

    system_instruction = f"""You are a versatile, general-purpose AI assistant. 
Answer ANY question the user asks directly, naturally, and completely (including general knowledge, coding, math, casual conversation, or advice).

You also have background access to the user's resume/profile:
\"\"\"
{request.resumeText or "No resume uploaded yet."}
\"\"\"

Rules:
1. For general queries (e.g. greetings, science, coding questions, chit-chat), answer normally like a standard AI assistant. Do NOT bring up or audit the resume unless relevant.
2. Only reference the resume data or career metrics if the user explicitly asks about their resume, qualifications, or job preparation."""

    gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
    reply = None

    if gemini_key:
        try:
            reply = generate_chat_response(
                messages=[{"role": "user", "content": request.userInput}],
                system_instruction=system_instruction,
                temperature=0.2,
                max_output_tokens=450
            )
        except Exception as e:
            print(f"[Chat API] Gemini chat error: {e}. Falling back to grounded Copilot engine.")

    if not reply:
        # Grounded intelligent fallback
        reply = handle_copilot_chat(
            query=request.userInput,
            messages=[],
            analysis_data={"resume_text": request.resumeText} if request.resumeText else None
        )

    return {"reply": reply}

@app.post("/api/copilot/chat")
def copilot_chat(request: CopilotChatRequest):
    if not request.query or not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
        
    response_text = handle_copilot_chat(
        query=request.query,
        messages=request.messages or [],
        analysis_data=request.analysis_data,
        job_description=request.job_description
    )
    return {
        "success": True,
        "reply": response_text
    }

@app.post("/api/resume/upload")
async def upload_resume(file: UploadFile = File(...)):
    try:
        content = await file.read()
        if len(content) == 0:
            raise HTTPException(status_code=400, detail="The uploaded file is empty.")
            
        text, metadata = extract_text_from_file(file.filename, content)
        
        # Extract initial preview skills
        initial_skills = [s["name"] for s in extract_skills_from_text(text)]
        
        return {
            "success": True,
            "filename": file.filename,
            "file_size": metadata["size_bytes"],
            "file_size_formatted": metadata["size_formatted"],
            "format": metadata["format"],
            "word_count": metadata["word_count"],
            "extracted_text": text,
            "text_preview": text[:400] + ("..." if len(text) > 400 else ""),
            "detected_skills_count": len(initial_skills),
            "preview_skills": initial_skills[:8]
        }
    except ExtractionError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error during file parsing: {str(e)}")

@app.post("/api/resume/analyze")
def analyze_resume(request: AnalyzeResumeRequest):
    if not request.resume_text or not request.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text is required for analysis.")
    
    # Stage 1 & 2: Extract structured sections from text
    sections = extract_sections_from_text(request.resume_text)
    target_role = request.target_role or ("Software Engineer" if "Software" in (request.job_description or "") else "Software Engineer")

    # Stage 3 & 4: Structured Evaluation via Gemini 2.5 Flash (with resilient local engine fallback)
    analysis = evaluate_with_gemini(
        resume_text=request.resume_text,
        sections=sections,
        job_description=request.job_description or "",
        target_role=target_role,
        filename=request.filename or "Resume.pdf"
    )

    # Attach raw text, sections, and JD for full downstream Copilot & Builder access
    analysis["resume_text"] = request.resume_text
    analysis["sections"] = sections
    analysis["job_description"] = request.job_description or ""

    # Save to history database
    target_role = request.target_role or ("Software Engineer" if "Software" in (request.job_description or "") else "Candidate Profile")
    record_id = save_analysis(
        filename=request.filename or "Resume.pdf",
        target_role=target_role,
        overall_score=analysis["overall_score"],
        ats_score=analysis["kpis"]["ats_compatibility"],
        job_match_score=analysis["kpis"]["job_match"],
        skills_count=analysis["kpis"]["skills_found_count"],
        analysis_data=analysis
    )
    
    analysis["id"] = record_id
    analysis["filename"] = request.filename
    analysis["target_role"] = target_role
    return analysis

@app.post("/api/job/analyze")
async def analyze_job(request: JobAnalyzeRequest):
    if not request.job_description or not request.job_description.strip():
        raise HTTPException(status_code=400, detail="Job description text is empty.")
        
    skills = extract_skills_from_text(request.job_description)
    return {
        "success": True,
        "extracted_skills": [s["name"] for s in skills],
        "skills_by_category": skills,
        "word_count": len(request.job_description.split())
    }

@app.get("/api/analysis/history")
async def list_analyses():
    history = get_all_analyses()
    return {"history": history, "total": len(history)}

@app.get("/api/analysis/{analysis_id}")
async def get_single_analysis(analysis_id: str):
    data = get_analysis(analysis_id)
    if not data:
        raise HTTPException(status_code=404, detail="Analysis record not found.")
    return data

@app.delete("/api/analysis/history/clear")
async def clear_history():
    count = clear_all_history()
    return {"success": True, "deleted_count": count}

@app.delete("/api/analysis/{analysis_id}")
async def delete_single_analysis(analysis_id: str):
    deleted = delete_analysis(analysis_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Analysis not found or already deleted.")
    return {"success": True, "id": analysis_id}

@app.get("/api/sample-data")
async def get_sample_data():
    return {
        "sample_resume_text": SAMPLE_RESUME_TEXT,
        "sample_job_description": SAMPLE_JOB_DESCRIPTION,
        "sample_filename": "Alex_Chen_Software_Engineer_Resume.pdf",
        "sample_target_role": "Full Stack / Backend Software Engineer"
    }

@app.get("/api/sample-file/{file_format}")
async def download_sample_file(file_format: str):
    file_format = file_format.lower()
    temp_dir = os.path.join(os.path.dirname(__file__), "sample_data")
    os.makedirs(temp_dir, exist_ok=True)
    
    if file_format == "pdf":
        file_path = os.path.join(temp_dir, "Alex_Chen_Resume.pdf")
        generate_sample_pdf(file_path)
        with open(file_path, "rb") as f:
            content = f.read()
        return Response(
            content=content,
            media_type="application/pdf",
            headers={"Content-Disposition": 'attachment; filename="Alex_Chen_Resume.pdf"'}
        )
    elif file_format in ["docx", "doc"]:
        file_path = os.path.join(temp_dir, "Alex_Chen_Resume.docx")
        generate_sample_docx(file_path)
        with open(file_path, "rb") as f:
            content = f.read()
        return Response(
            content=content,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": 'attachment; filename="Alex_Chen_Resume.docx"'}
        )
    else:
        raise HTTPException(status_code=400, detail="Invalid format. Supported: pdf, docx")

# Serve built React frontend in production if dist/ exists
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    from fastapi.staticfiles import StaticFiles
    from starlette.responses import FileResponse

    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API route not found")
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        index_file = os.path.join(frontend_dist, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="Page not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
