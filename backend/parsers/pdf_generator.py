import os
import io
import re
import tempfile
import subprocess
import html
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable

def escape(text: str) -> str:
    """Escapes HTML special characters."""
    if not text:
        return ""
    return html.escape(str(text))

def find_browser_executable() -> str:
    """Locates Chrome or Edge for headless PDF compilation."""
    candidates = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
    return None

def generate_resume_html(data: dict, font_choice: str = "serif") -> str:
    """
    Renders pure Jake's Resume LaTeX HTML template with 100% authentic typography:
    - Computer Modern / Latin Modern Roman serif or clean sans-serif
    - Full name in bold small-caps
    - Real clickable hyperlinks (clean, non-underlined, recruiter-friendly)
    - Crisp horizontal rules under section titles
    - Right-aligned dates and locations
    - 0.42in margins for 1-page ATS perfection
    """
    c = data.get("contact") or data.get("personal_info") or {}
    if not isinstance(c, dict):
        c = {}
    font_family = "'Computer Modern', 'Latin Modern Roman', 'CMU Serif', 'Times New Roman', Times, serif" if font_choice == "serif" else "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

    # Contact line elements
    contact_parts = []
    phone = c.get("phone") or c.get("phoneNumber")
    if phone:
        contact_parts.append(f'<span>{escape(phone)}</span>')
    email = c.get("email")
    if email:
        em = escape(email)
        contact_parts.append(f'<a href="mailto:{em}">{em}</a>')
    linkedin = c.get("linkedin")
    if linkedin:
        lk = str(linkedin).strip()
        lk_url = lk if lk.startswith("http") else f"https://{lk}"
        clean_lk = escape(re.sub(r"^https?://(www\.)?", "", lk))
        contact_parts.append(f'<a href="{escape(lk_url)}">{clean_lk}</a>')
    github = c.get("github")
    if github:
        gh = str(github).strip()
        gh_url = gh if gh.startswith("http") else f"https://{gh}"
        clean_gh = escape(re.sub(r"^https?://(www\.)?", "", gh))
        contact_parts.append(f'<a href="{escape(gh_url)}">{clean_gh}</a>')
    portfolio = c.get("portfolio") or c.get("website")
    if portfolio:
        pf = str(portfolio).strip()
        pf_url = pf if pf.startswith("http") else f"https://{pf}"
        clean_pf = escape(re.sub(r"^https?://(www\.)?", "", pf))
        contact_parts.append(f'<a href="{escape(pf_url)}">{clean_pf}</a>')
    location = c.get("location")
    if location:
        contact_parts.append(f'<span>{escape(location)}</span>')

    contact_bar_html = ' <span class="sep">|</span> '.join(contact_parts)

    # Professional Summary (if provided)
    summary_html = ""
    summary_text = data.get("summary")
    if summary_text and summary_text.strip():
        summary_html = f"""
<div class="section-title">Professional Summary</div>
<p class="summary-text">{escape(summary_text.strip())}</p>
"""

    # Education
    education_html = ""
    education = data.get("education", [])
    if education:
        items = []
        for edu in education:
            extras = []
            if edu.get("gpa"):
                extras.append(f'<b>GPA:</b> {escape(edu["gpa"])}')
            if edu.get("coursework"):
                extras.append(f'<b>Coursework:</b> {escape(edu["coursework"])}')
            extra_line = f'<div class="extra-line">{" | ".join(extras)}</div>' if extras else ""

            items.append(f"""
<div class="entry">
  <div class="entry-row">
    <span class="bold">{escape(edu.get('institution', ''))}</span>
    <span class="location">{escape(edu.get('location', ''))}</span>
  </div>
  <div class="entry-row">
    <span class="italic">{escape(edu.get('degree', ''))}</span>
    <span class="date">{escape(edu.get('startDate', ''))} – {escape(edu.get('endDate', ''))}</span>
  </div>
  {extra_line}
</div>
""")
        education_html = f"""
<div class="section-title">Education</div>
{''.join(items)}
"""

    # Experience
    experience_html = ""
    experience = data.get("experience", [])
    if experience:
        items = []
        for exp in experience:
            bullets = [f"<li>{escape(b.strip())}</li>" for b in exp.get("bullets", []) if b and b.strip()]
            bullets_html = f'<ul class="bullets">{"".join(bullets)}</ul>' if bullets else ""

            items.append(f"""
<div class="entry">
  <div class="entry-row">
    <span class="bold">{escape(exp.get('position', ''))}</span>
    <span class="date">{escape(exp.get('startDate', ''))} – {escape(exp.get('endDate', ''))}</span>
  </div>
  <div class="entry-row">
    <span class="italic">{escape(exp.get('company', ''))}</span>
    <span class="location italic">{escape(exp.get('location', ''))}</span>
  </div>
  {bullets_html}
</div>
""")
        experience_html = f"""
<div class="section-title">Experience</div>
{''.join(items)}
"""

    # Projects
    projects_html = ""
    projects = data.get("projects", [])
    if projects:
        items = []
        for proj in projects:
            p_name = f"<span class='bold'>{escape(proj.get('name', ''))}</span>"
            if proj.get("technologies"):
                p_name += f" | <span class='italic'>{escape(proj['technologies'])}</span>"

            if proj.get("link"):
                lk_url = proj["link"] if proj["link"].startswith("http") else f"https://{proj['link']}"
                clean_link = escape(re.sub(r"^https?://(www\.)?", "", proj["link"]))
                p_name += f" | <a href='{escape(lk_url)}' class='proj-link'>{clean_link}</a>"

            p_date = f"{escape(proj.get('startDate', ''))} – {escape(proj.get('endDate', 'Present'))}" if proj.get("startDate") else ""

            bullets = [f"<li>{escape(b.strip())}</li>" for b in proj.get("bullets", []) if b and b.strip()]
            bullets_html = f'<ul class="bullets">{"".join(bullets)}</ul>' if bullets else ""

            items.append(f"""
<div class="entry">
  <div class="entry-row">
    <span>{p_name}</span>
    <span class="date">{p_date}</span>
  </div>
  {bullets_html}
</div>
""")
        projects_html = f"""
<div class="section-title">Projects</div>
{''.join(items)}
"""

    # Technical Skills
    skills_html = ""
    skills = data.get("skills", {})
    if skills:
        rows = []
        if isinstance(skills, dict):
            if skills.get("languages"):
                rows.append(f'<p><span class="bold">Languages:</span> {escape(skills["languages"])}</p>')
            if skills.get("frameworks"):
                rows.append(f'<p><span class="bold">Frameworks:</span> {escape(skills["frameworks"])}</p>')
            if skills.get("developerTools"):
                rows.append(f'<p><span class="bold">Developer Tools:</span> {escape(skills["developerTools"])}</p>')
            if skills.get("librariesCloud"):
                rows.append(f'<p><span class="bold">Libraries & Cloud:</span> {escape(skills["librariesCloud"])}</p>')
        elif isinstance(skills, list):
            rows.append(f'<p><span class="bold">Skills:</span> {escape(", ".join(str(s) for s in skills))}</p>')
        elif isinstance(skills, str):
            rows.append(f'<p><span class="bold">Skills:</span> {escape(skills)}</p>')

        if rows:
            skills_html = f"""
<div class="section-title">Technical Skills</div>
<div class="skills-list">
  {''.join(rows)}
</div>
"""

    # Certifications
    certs_html = ""
    certs = data.get("certifications", [])
    if certs:
        c_items = [f"<li>{escape(c.strip())}</li>" for c in certs if c and c.strip()]
        if c_items:
            certs_html = f"""
<div class="section-title">Certifications & Honors</div>
<ul class="bullets">
  {''.join(c_items)}
</ul>
"""

    full_name_display = escape(c.get("fullName") or c.get("full_name") or c.get("name") or "Alex Chen")
    job_title_display = f'<div class="job-title">{escape(c.get("jobTitle") or c.get("title") or "")}</div>' if (c.get("jobTitle") or c.get("title")) else ""

    html_doc = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>{full_name_display} Resume</title>
<style>
@page {{
  size: letter portrait;
  margin: 0.38in 0.42in 0.38in 0.42in;
}}
* {{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}}
body {{
  font-family: {font_family};
  color: #000000;
  background: #ffffff;
  line-height: 1.25;
  font-size: 10pt;
  -webkit-font-smoothing: antialiased;
}}
.header {{
  text-align: center;
  margin-bottom: 5px;
}}
.name {{
  font-size: 21pt;
  font-weight: bold;
  letter-spacing: 0.5px;
  font-variant: small-caps;
}}
.job-title {{
  font-size: 9.5pt;
  font-style: italic;
  color: #222222;
  margin-top: 1px;
}}
.contact-bar {{
  font-size: 9pt;
  margin-top: 3px;
  color: #111111;
}}
.contact-bar a {{
  color: #000000;
  text-decoration: none;
}}
.contact-bar a:hover {{
  text-decoration: underline;
}}
.contact-bar span.sep {{
  margin: 0 4px;
  color: #555555;
}}
.section-title {{
  font-size: 11pt;
  font-weight: bold;
  font-variant: small-caps;
  letter-spacing: 0.5px;
  border-bottom: 0.9pt solid #000000;
  padding-bottom: 1px;
  margin-top: 7px;
  margin-bottom: 3px;
}}
.summary-text {{
  font-size: 9pt;
  line-height: 1.3;
  text-align: left;
  margin-bottom: 3px;
}}
.entry {{
  margin-bottom: 3.5px;
}}
.entry-row {{
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 9.5pt;
}}
.bold {{ font-weight: bold; }}
.italic {{ font-style: italic; }}
.date, .location {{
  font-size: 9pt;
  text-align: right;
  white-space: nowrap;
}}
.proj-link {{
  color: #000000;
  text-decoration: underline;
  font-size: 8.8pt;
}}
.extra-line {{
  font-size: 8.5pt;
  color: #222222;
  margin-top: 1px;
  margin-bottom: 2px;
}}
ul.bullets {{
  margin-left: 17px;
  margin-top: 2px;
  margin-bottom: 2px;
  list-style-type: disc;
}}
ul.bullets li {{
  font-size: 9pt;
  line-height: 1.28;
  margin-bottom: 1.5px;
  text-align: left;
}}
.skills-list p {{
  font-size: 9pt;
  line-height: 1.32;
  margin-bottom: 2px;
}}
</style>
</head>
<body>

<div class="header">
  <div class="name">{full_name_display}</div>
  {job_title_display}
  <div class="contact-bar">
    {contact_bar_html}
  </div>
</div>

{summary_html}
{education_html}
{experience_html}
{projects_html}
{skills_html}
{certs_html}

</body>
</html>"""
    return html_doc

def build_pdf_resume(resume_data: dict, font_choice: str = "serif") -> bytes:
    """
    Compiles an authentic Jake's Resume LaTeX vector PDF with selectable text and active links.
    Uses headless Chromium/Edge with --no-pdf-header-footer for pixel-perfect Overleaf formatting.
    Falls back to complete ReportLab vector generator if no browser is available.
    """
    browser_exe = find_browser_executable()
    
    if browser_exe:
        html_code = generate_resume_html(resume_data, font_choice)
        with tempfile.TemporaryDirectory() as tmpdir:
            html_file = os.path.join(tmpdir, "resume.html")
            pdf_file = os.path.join(tmpdir, "resume.pdf")

            with open(html_file, "w", encoding="utf-8") as f:
                f.write(html_code)

            cmd = [
                browser_exe,
                "--headless=new",
                "--disable-gpu",
                "--no-pdf-header-footer",
                f"--print-to-pdf={pdf_file}",
                html_file
            ]
            try:
                res = subprocess.run(cmd, capture_output=True, timeout=15)
                if res.returncode == 0 and os.path.exists(pdf_file) and os.path.getsize(pdf_file) > 1000:
                    with open(pdf_file, "rb") as f:
                        return f.read()
            except Exception as e:
                print(f"Browser PDF generation error: {e}, falling back to ReportLab")

    # Fallback to ReportLab pure vector generator
    return build_reportlab_pdf(resume_data, font_choice)

def build_reportlab_pdf(resume_data: dict, font_choice: str = "serif") -> bytes:
    """ReportLab pure vector generator fallback containing all sections."""
    buffer = io.BytesIO()
    margin = 28
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        leftMargin=margin,
        rightMargin=margin,
        topMargin=margin,
        bottomMargin=margin
    )
    
    font_name = "Times-Roman" if font_choice == "serif" else "Helvetica"
    font_bold = "Times-Bold" if font_choice == "serif" else "Helvetica-Bold"
    font_italic = "Times-Italic" if font_choice == "serif" else "Helvetica-Oblique"
    
    styles = getSampleStyleSheet()
    name_style = ParagraphStyle('RName', fontName=font_bold, fontSize=20, leading=22, alignment=1, textColor=colors.black)
    title_style = ParagraphStyle('RTitle', fontName=font_italic, fontSize=9.5, leading=11, alignment=1, textColor=colors.HexColor('#222222'))
    contact_style = ParagraphStyle('RContact', fontName=font_name, fontSize=9, leading=11, alignment=1, textColor=colors.black)
    sec_style = ParagraphStyle('RSec', fontName=font_bold, fontSize=11, leading=13, textColor=colors.black, spaceBefore=6, spaceAfter=2)
    entry_title_style = ParagraphStyle('REntryTitle', fontName=font_bold, fontSize=9.5, leading=11, textColor=colors.black)
    entry_right_style = ParagraphStyle('REntryRight', fontName=font_name, fontSize=9, leading=11, alignment=2, textColor=colors.black)
    entry_sub_style = ParagraphStyle('REntrySub', fontName=font_italic, fontSize=9, leading=11, textColor=colors.HexColor('#222222'))
    entry_sub_right_style = ParagraphStyle('REntrySubRight', fontName=font_italic, fontSize=9, leading=11, alignment=2, textColor=colors.HexColor('#222222'))
    bullet_style = ParagraphStyle('RBullet', fontName=font_name, fontSize=9, leading=11.5, leftIndent=14, firstLineIndent=-9, spaceAfter=1.5, textColor=colors.black)
    skills_style = ParagraphStyle('RSkills', fontName=font_name, fontSize=9, leading=12, spaceAfter=1.5, textColor=colors.black)

    story = []
    c = resume_data.get('contact') or resume_data.get('personal_info') or {}
    if not isinstance(c, dict):
        c = {}
    display_name = c.get('fullName') or c.get('full_name') or c.get('name') or 'Alex Chen'
    story.append(Paragraph(f"<b>{display_name.upper()}</b>", name_style))
    if c.get("jobTitle") or c.get("title"):
        story.append(Paragraph(c.get("jobTitle") or c.get("title"), title_style))
    story.append(Spacer(1, 2))

    contact_parts = []
    if c.get('phone') or c.get('phoneNumber'): contact_parts.append(str(c.get('phone') or c.get('phoneNumber')))
    if c.get('email'): contact_parts.append(f'<a href="mailto:{c["email"]}">{c["email"]}</a>')
    if c.get('linkedin'): contact_parts.append(f'<a href="https://{str(c["linkedin"]).replace("https://", "")}">{str(c["linkedin"]).replace("https://", "")}</a>')
    if c.get('github'): contact_parts.append(f'<a href="https://{str(c["github"]).replace("https://", "")}">{str(c["github"]).replace("https://", "")}</a>')
    if c.get('location'): contact_parts.append(str(c['location']))

    story.append(Paragraph(" | ".join(contact_parts), contact_style))
    story.append(Spacer(1, 3))

    def add_section_header(title):
        story.append(Paragraph(title.upper(), sec_style))
        story.append(HRFlowable(width="100%", thickness=0.8, color=colors.black, spaceBefore=1, spaceAfter=3))

    # Summary
    if resume_data.get("summary") and resume_data["summary"].strip():
        add_section_header("Professional Summary")
        story.append(Paragraph(resume_data["summary"].strip(), skills_style))

    # Education
    edu_list = resume_data.get("education", [])
    if edu_list:
        add_section_header("Education")
        for edu in edu_list:
            t = Table([
                [Paragraph(f"<b>{edu.get('institution', '')}</b>", entry_title_style), Paragraph(edu.get('location', ''), entry_right_style)],
                [Paragraph(edu.get('degree', ''), entry_sub_style), Paragraph(f"{edu.get('startDate', '')} – {edu.get('endDate', '')}", entry_right_style)]
            ], colWidths=['75%', '25%'])
            t.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('BOTTOMPADDING', (0,0), (-1,-1), 0), ('TOPPADDING', (0,0), (-1,-1), 0)]))
            story.append(t)
            extras = []
            if edu.get("gpa"): extras.append(f"<b>GPA:</b> {edu['gpa']}")
            if edu.get("coursework"): extras.append(f"<b>Coursework:</b> {edu['coursework']}")
            if extras:
                story.append(Paragraph(" | ".join(extras), skills_style))
            story.append(Spacer(1, 2))

    # Experience
    exp_list = resume_data.get("experience", [])
    if exp_list:
        add_section_header("Experience")
        for exp in exp_list:
            t = Table([
                [Paragraph(f"<b>{exp.get('position', '')}</b>", entry_title_style), Paragraph(f"{exp.get('startDate', '')} – {exp.get('endDate', '')}", entry_right_style)],
                [Paragraph(exp.get('company', ''), entry_sub_style), Paragraph(exp.get('location', ''), entry_sub_right_style)]
            ], colWidths=['75%', '25%'])
            t.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('BOTTOMPADDING', (0,0), (-1,-1), 0), ('TOPPADDING', (0,0), (-1,-1), 0)]))
            story.append(t)
            for b in exp.get("bullets", []):
                if b and b.strip():
                    story.append(Paragraph(f"&bull; {b.strip()}", bullet_style))
            story.append(Spacer(1, 2))

    # Projects
    proj_list = resume_data.get("projects", [])
    if proj_list:
        add_section_header("Projects")
        for proj in proj_list:
            p_desc = f"<b>{proj.get('name', '')}</b>"
            if proj.get("technologies"):
                p_desc += f" | <i>{proj['technologies']}</i>"
            p_date = f"{proj.get('startDate', '')} – {proj.get('endDate', 'Present')}" if proj.get("startDate") else ""
            t = Table([
                [Paragraph(p_desc, entry_title_style), Paragraph(p_date, entry_right_style)]
            ], colWidths=['75%', '25%'])
            t.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('BOTTOMPADDING', (0,0), (-1,-1), 0), ('TOPPADDING', (0,0), (-1,-1), 0)]))
            story.append(t)
            for b in proj.get("bullets", []):
                if b and b.strip():
                    story.append(Paragraph(f"&bull; {b.strip()}", bullet_style))
            story.append(Spacer(1, 2))

    # Technical Skills
    skills = resume_data.get("skills", {})
    if skills:
        add_section_header("Technical Skills")
        if isinstance(skills, dict):
            if skills.get("languages"):
                story.append(Paragraph(f"<b>Languages:</b> {skills['languages']}", skills_style))
            if skills.get("frameworks"):
                story.append(Paragraph(f"<b>Frameworks:</b> {skills['frameworks']}", skills_style))
            if skills.get("developerTools"):
                story.append(Paragraph(f"<b>Developer Tools:</b> {skills['developerTools']}", skills_style))
            if skills.get("librariesCloud"):
                story.append(Paragraph(f"<b>Libraries & Cloud:</b> {skills['librariesCloud']}", skills_style))
        elif isinstance(skills, list):
            story.append(Paragraph(f"<b>Skills:</b> {', '.join(str(s) for s in skills)}", skills_style))
        elif isinstance(skills, str):
            story.append(Paragraph(f"<b>Skills:</b> {skills}", skills_style))

    # Certifications
    certs = resume_data.get("certifications", [])
    if certs:
        add_section_header("Certifications & Honors")
        for cert in certs:
            if cert and cert.strip():
                story.append(Paragraph(f"&bull; {cert.strip()}", bullet_style))

    doc.build(story)
    return buffer.getvalue()
