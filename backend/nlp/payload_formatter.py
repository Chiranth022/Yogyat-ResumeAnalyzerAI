import json
from typing import Dict, Any, Optional

ATS_EVALUATION_RULES = [
    "1. Single-Column ATS Standard: Flag multi-column layouts, tables, textboxes, or headers/footers that standard ATS scanners drop.",
    "2. Contact Information: Must detect Full Name, professional Email, Phone, LinkedIn, GitHub, and Location.",
    "3. Section Readability: Verify standard headers: Education, Experience, Projects, Technical Skills, Summary/Certifications.",
    "4. Impact & Quantification (Google XYZ formula): Bullet points should start with strong action verbs and contain measurable metrics (%, $, scale, users, latency, count).",
    "5. Job Matching: Compare hard skills, frameworks, cloud platforms, and architecture requirements against the provided Job Description (JD). Identify exact matches, semantic matches, and high-priority missing skills.",
    "6. Objective Scoring: Score each dimension objectively between 0 and 100 based on realistic technical recruiter rubrics."
]

def format_evaluation_payload(
    resume_text: str,
    sections: Optional[Dict[str, str]] = None,
    job_description: Optional[str] = "",
    target_role: Optional[str] = "Software Engineer",
    custom_rules: Optional[list] = None
) -> Dict[str, Any]:
    """
    Stage 2: Payload Formatter
    Bundles extracted text, segmented sections, target role/JD, and evaluation rules
    into a structured prompt payload for Gemini 2.5 Flash.
    """
    rules = custom_rules or ATS_EVALUATION_RULES
    if not isinstance(sections, dict):
        sections = {}

    sections_summary = "\n".join(
        f"--- SECTION: {sec.upper()} ---\n{content.strip()}\n"
        for sec, content in sections.items()
        if content and content.strip() and sec != "other"
    )

    if not sections_summary:
        sections_summary = resume_text[:2500]

    system_instruction = (
        "You are a Principal Technical Recruiter and Senior ATS Architecture Auditor. "
        "Your task is to perform an exhaustive, rigorous resume analysis and ATS evaluation against the provided Job Description (JD). "
        "You must return ONLY a structured JSON response conforming strictly to the requested schema."
    )

    user_prompt = f"""
EVALUATION CONTEXT & CANDIDATE DATA:

TARGET ROLE: {target_role or 'Software Engineer'}

JOB DESCRIPTION (JD):
\"\"\"
{job_description.strip() if job_description and job_description.strip() else "General Software Engineer position requiring proficiency in modern backend/frontend frameworks, system design, databases, Docker/cloud environments, and CI/CD pipelines."}
\"\"\"

RESUME SECTION SEGMENTATION:
{sections_summary}

FULL EXTRACTED RESUME TEXT:
\"\"\"
{resume_text.strip()}
\"\"\"

EVALUATION RULES & AUDIT CRITERIA:
{chr(10).join(rules)}

TASK:
Evaluate the candidate's resume strictly according to the rules and provide:
1. Overall 0-100 score, ATS compatibility score, Job match score, and Content quality score.
2. Section-by-section breakdown (Contact, Education, Experience, Projects, Skills) with individual scores and constructive feedback.
3. Categorized skills detected in the resume and prioritized missing skills required by the JD.
4. Specific, dynamic bullet rewrites following the Google XYZ formula ("Accomplished [X] as measured by [Y], by doing [Z]").
5. Critical ATS warnings (e.g., formatting flags, missing metrics, buzzwords).
"""

    return {
        "system_instruction": system_instruction,
        "user_prompt": user_prompt.strip(),
        "metadata": {
            "target_role": target_role,
            "has_jd": bool(job_description and job_description.strip()),
            "sections_count": len([s for s, v in sections.items() if v.strip()])
        }
    }
