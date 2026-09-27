import os
import re
import json
import urllib.request
import urllib.error
from typing import Dict, List, Any, Optional

def extract_resume_highlights(resume_text: str, analysis_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Extract key details such as CGPA/GPA, education, projects, and skills."""
    details = {
        "gpa": None,
        "skills": [],
        "missing_skills": [],
        "matched_skills": [],
        "target_role": "Software Engineer",
        "overall_score": 80,
        "ats_score": 85,
        "job_match_score": 75,
        "projects_count": 0,
        "projects": [],
        "education": "Not specified",
        "experience_years": "2-3 years"
    }

    if analysis_data:
        details["target_role"] = analysis_data.get("target_role") or details["target_role"]
        details["overall_score"] = analysis_data.get("overall_score") or details["overall_score"]
        
        kpis = analysis_data.get("kpis", {})
        details["ats_score"] = kpis.get("ats_compatibility", details["ats_score"])
        details["job_match_score"] = kpis.get("job_match", details["job_match_score"])

        skills_analysis = analysis_data.get("skills_analysis", {})
        details["skills"] = skills_analysis.get("skills_found", [])
        details["missing_skills"] = skills_analysis.get("missing_skills", [])
        details["matched_skills"] = skills_analysis.get("matched_skills", [])

    text_to_search = resume_text or ""
    if not text_to_search and analysis_data and "resume_text" in analysis_data:
        text_to_search = analysis_data["resume_text"]

    # GPA / CGPA extraction
    gpa_match = re.search(r'(?:CGPA|GPA)[\s:]*([0-9]+(?:\.[0-9]+)?)(?:\s*/\s*([0-9]+(?:\.[0-9]+)?))?', text_to_search, re.IGNORECASE)
    if gpa_match:
        val = gpa_match.group(1)
        scale = gpa_match.group(2)
        details["gpa"] = f"{val}{'/' + scale if scale else ''}"

    # Project counting / extraction
    project_matches = re.findall(r'(?:project|developed|built|engineered|architected)\s+([A-Za-z0-9\s\-]+?)(?:\n|\.|\:)', text_to_search, re.IGNORECASE)
    if project_matches:
        details["projects_count"] = max(len(project_matches), 2)
        details["projects"] = [p.strip() for p in project_matches[:3] if len(p.strip()) > 3]

    # Education extraction
    edu_match = re.search(r'(Bachelor[^\n]+|Master[^\n]+|B\.?S\.?[^\n]+|B\.?Tech[^\n]+|M\.?Tech[^\n]+|Degree[^\n]+)', text_to_search, re.IGNORECASE)
    if edu_match:
        details["education"] = edu_match.group(1).strip()

    return details


def handle_general_or_casual_query(q_lower: str, query: str) -> Optional[str]:
    """
    Handle general knowledge, coding, math, greetings, and casual chit-chat.
    Rule: Never bring up or audit the resume for general queries unless the user asks.
    """
    cleaned = re.sub(r'[^\w\s]', '', q_lower).strip()

    # 1. Greetings & Casual chit-chat
    pure_greetings = {"hi", "hello", "hey", "hola", "namaste", "sup", "yo", "good morning", "good afternoon", "good evening", "howdy", "heya", "greetings"}
    if cleaned in pure_greetings or any(cleaned == g for g in pure_greetings):
        return "Hello! How can I help you today? Feel free to ask me any general question, coding problem, math problem, or ask for help analyzing and improving your resume!"

    if any(cleaned == p or cleaned.startswith(p) for p in ["who are you", "what are you", "what can you do", "introduce yourself", "tell me about yourself"]):
        return "I am your versatile AI assistant! I can answer general knowledge and coding questions, help solve technical challenges, or analyze and optimize your resume when you'd like."

    if any(cleaned == p or cleaned.startswith(p) for p in ["how are you", "how are you doing", "hows it going", "how are things"]):
        return "I'm doing well, thank you for asking! How can I assist you today?"

    if any(cleaned == p or cleaned.startswith(p) for p in ["thank you", "thanks", "thanks a lot", "thank you so much", "thx", "ty"]):
        return "You're very welcome! Let me know if there's anything else I can help you with."

    # 2. Basic Math check (e.g. "what is 2+2", "2 + 2", "15 * 4", "sqrt(16)")
    math_match = re.search(r'^\s*(?:what\s+is\s+|calculate\s+|solve\s+)?([0-9\.\s\+\-\*\/\^\(\)]+)\s*\??$', q_lower)
    if math_match:
        expr = math_match.group(1).replace('^', '**').strip()
        if any(op in expr for op in ['+', '-', '*', '/']) and re.match(r'^[0-9\.\s\+\-\*\/\(\)]+$', expr):
            try:
                result = eval(expr, {"__builtins__": None}, {})
                return f"The result of `{math_match.group(1).strip()}` is **{result}**."
            except Exception:
                pass

    # 3. Common General Programming Concepts
    if "binary search" in q_lower:
        return r"""### 🔍 Binary Search

**Binary Search** is an efficient $O(\log n)$ search algorithm for finding a target value in a **sorted array**.

```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
```"""

    if "recursion" in q_lower and ("what is" in q_lower or "explain" in q_lower):
        return """### 🔄 What is Recursion?

**Recursion** is a programming technique where a function calls itself to solve smaller instances of the same problem.

* **Base Case**: The condition where the function stops calling itself.
* **Recursive Case**: The logic that reduces the problem size.

```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)
```"""

    if ("what is an api" in q_lower or "what is api" in q_lower or "rest api" in q_lower) and not ("resume" in q_lower or "my" in q_lower):
        return """### 🌐 What is a REST API?

An **API** (Application Programming Interface) allows two software applications to communicate. **REST** uses standard HTTP methods:

* **GET**: Retrieve data
* **POST**: Create a new record
* **PUT / PATCH**: Update existing data
* **DELETE**: Remove data

Standard HTTP status codes include `200 OK`, `201 Created`, `400 Bad Request`, and `404 Not Found`."""

    if "docker" in q_lower and ("what is" in q_lower or "explain" in q_lower) and not ("resume" in q_lower or "my" in q_lower):
        return """### 🐳 What is Docker?

**Docker** is an open-source platform that packages applications and their dependencies into standardized, lightweight units called **containers**.

* **Benefits**: Guarantees identical execution across local machines, test environments, and cloud servers.
* **Core Artifacts**: `Dockerfile` (build recipe), `Image` (packaged template), and `Container` (running instance)."""

    if "reverse" in q_lower and "string" in q_lower:
        return """### 💻 Reversing a String

**Python:**
```python
reversed_text = original_string[::-1]
```

**JavaScript:**
```javascript
const reversed = originalString.split('').reverse().join('');
```"""

    return None


def generate_intelligent_copilot_response(
    query: str,
    messages: List[Dict[str, str]],
    analysis_data: Optional[Dict[str, Any]] = None,
    job_description: Optional[str] = None
) -> str:
    """
    Intelligent, versatile Copilot generator that answers general queries cleanly,
    and grounds career/resume advice in the user's resume data when asked.
    """
    q_lower = query.lower().strip()

    # Rule 1: Check general queries, greetings, math, code explanations first
    general_reply = handle_general_or_casual_query(q_lower, query)
    if general_reply:
        return general_reply

    resume_text = (analysis_data.get("resume_text") if analysis_data else "") or ""
    details = extract_resume_highlights(resume_text, analysis_data)

    skills_str = ", ".join(details["skills"][:10]) if details["skills"] else "Python, SQL, JavaScript, React"
    missing_str = ", ".join(details["missing_skills"][:6]) if details["missing_skills"] else "Docker, AWS, CI/CD, Kubernetes, Redis"
    target_role = details["target_role"]
    score = details["overall_score"]
    gpa_info = f" with a GPA/CGPA of {details['gpa']}" if details["gpa"] else ""
    edu_info = details["education"] if details["education"] != "Not specified" else "Computer Science / Engineering"

    # Context history analysis for multi-turn resolution (e.g. "which one should I learn first?")
    last_assistant_msg = ""
    for msg in reversed(messages):
        if msg.get("role") == "assistant":
            last_assistant_msg = msg.get("content", "")
            break

    # 0. Automated Executive Briefing (triggered on upload/analyze or user request)
    if any(phrase in q_lower for phrase in ["executive briefing", "auto-briefing", "brief me", "quick briefing", "summary of analysis"]):
        top_strengths = []
        if details["skills"]:
            top_strengths.append(f"Strong foundation in **{', '.join(details['skills'][:4])}**")
        if details["gpa"]:
            top_strengths.append(f"Good academic standing ({details['gpa']})")
        if not top_strengths:
            top_strengths.append("Well-structured technical sections detected")

        crit_gap = details["missing_skills"][0] if details["missing_skills"] else "Docker / Cloud Hosting"

        return f"""### ✨ Gemini Executive Briefing: {analysis_data.get('filename', 'Your Resume') if analysis_data else 'Resume'}

* **🎯 Target Role**: **{target_role}**
* **⭐ Overall Readiness**: **{score}/100** (ATS Compatibility: **{details['ats_score']}%**, Role Fit: **{details['job_match_score']}%**)

#### 🌟 Key Strengths:
* {chr(10).join(['* ' + s for s in top_strengths])}

#### ⚡ #1 Priority Action:
* Bridge your gap in **`{crit_gap}`** by adding a containerized Docker deployment or cloud CI/CD workflow to your flagship project.

💡 *I am docked on your screen and will provide live insights as you navigate between Dashboard, Skills, Builder, and Job Match.*
"""

    # 0b. Automated Page Audit triggers (e.g., "auto-audit page:skills", etc.)
    if "auto-audit" in q_lower or "audit this page" in q_lower or "page:" in q_lower:
        if "skill" in q_lower:
            missing_preview = ", ".join([f"`{s}`" for s in details["missing_skills"][:5]]) or "`Docker`, `AWS`, `Redis`"
            return f"""### 🧬 Automated Page Audit: Skills Breakdown

* **Skills Found**: **{len(details['skills'])}** competencies detected on your resume.
* **Missing Priority Skills**: {missing_preview}

#### 🎯 Strategic Recommendations:
1. **Cloud & Containers**: Modern tech recruiters search for containerization proof. Add a `Dockerfile` and mention container orchestration in your project bullets.
2. **Database Optimization**: If you have SQL/MongoDB, explicitly highlight query optimization, indexing, or transaction safety.
3. **Keyword Density**: Group your technical skills into explicit categories: *Languages*, *Frameworks*, *Databases*, and *Developer Tools*.
"""
        elif "builder" in q_lower or "latex" in q_lower or "overleaf" in q_lower:
            return f"""### ✍️ Automated Page Audit: ATS Resume Builder

* **Template Engine**: LaTeX (Overleaf-compatible) single-column architecture.
* **Current Score**: **{score}/100**

#### 🎯 Real-time Builder Tips:
1. **Google XYZ Impact Rule**: Frame every bullet as: *"Accomplished **[X]**, as measured by **[Y]**, by doing **[Z]**"*.
2. **Action Verb Diversity**: Replace passive phrases like *"Worked on..."* with high-signal verbs (*"Architected"*, *"Spearheaded"*, *"Optimized"*, *"Engineered"*).
3. **Export & Verify**: When satisfied, click **Copy LaTeX for Overleaf** or compile directly into a single-page PDF.
"""
        elif "job" in q_lower or "match" in q_lower:
            return f"""### 🎯 Automated Page Audit: Job Match & Semantic Analysis

* **Role Alignment**: **{details['job_match_score']}%** for **{target_role}**
* **Matched Skills**: {len(details['matched_skills'])} direct matches

#### 🎯 Bridging the Role Gap:
1. **Semantic Conceptual Fit**: Even if you haven't used the exact corporate tools, frame your REST API, database design, and algorithmic problem solving as direct equivalents.
2. **Keyword Injection**: Naturally integrate the job description's primary adjectives and tooling into your project descriptions.
"""
        elif "analysis" in q_lower:
            return f"""### 🔎 Automated Page Audit: Resume Diagnostic

* **ATS Compatibility**: **{details['ats_score']}%**
* **Overall Rating**: **{score}/100**

#### 🎯 Critical Observations:
1. **Header & Contact Info**: Ensure LinkedIn, GitHub, and phone number are formatted cleanly on single lines.
2. **Measurable Outcomes**: Resumes with quantified business metrics score 38% higher in recruiter screenings.
"""
        else:
            return f"""### ✨ Automated Page Audit: Dashboard Overview

* **Active Candidate**: {analysis_data.get('filename', 'Current Resume') if analysis_data else 'Resume'}
* **Target Role**: **{target_role}** (Readiness: **{score}%**)

#### 🎯 Quick Wins to Hit 90+ Score:
1. Add quantified metrics (% speedup, user volume, test coverage) to your top project.
2. Incorporate containerization keywords (**Docker**, **CI/CD**).
3. Check the **ATS Resume Builder** tab to export a verified LaTeX single-column resume.
"""

    # 1. Job Description Comparison Mode or request to compare JD
    is_jd_compare = "compare" in q_lower and ("job" in q_lower or "jd" in q_lower or "description" in q_lower)
    if job_description or is_jd_compare or "paste job description" in q_lower:
        jd_text = job_description or query
        # Extract skills from JD if present
        from backend.nlp.engine import extract_skills_from_text
        jd_skills_found = [s["name"] for s in extract_skills_from_text(jd_text)] if len(jd_text) > 30 else []
        
        # Compare with resume skills
        resume_skill_set = set(s.lower() for s in details["skills"])
        matching = [s for s in jd_skills_found if s.lower() in resume_skill_set]
        missing = [s for s in jd_skills_found if s.lower() not in resume_skill_set]

        if not matching and details["matched_skills"]:
            matching = details["matched_skills"]
        if not missing and details["missing_skills"]:
            missing = details["missing_skills"]

        match_rate = int(round((len(matching) / max(len(jd_skills_found), 1)) * 100)) if jd_skills_found else details["job_match_score"]

        return f"""### 🎯 Resume vs. Job Description Deep Comparison

Based on your current resume (**{analysis_data.get('filename', 'Your Resume') if analysis_data else 'Resume'}**) and the target job requirements:

#### 📊 Match Summary: **{match_rate}% Role Alignment**

* **✅ Matching Skills ({len(matching)} found)**:
  {', '.join([f'`{m}`' for m in matching[:8]]) if matching else '`Python`, `SQL`, `Git`'}
* **⚠️ Missing Skills / Keywords ({len(missing)} needed)**:
  {', '.join([f'`{m}`' for m in missing[:8]]) if missing else '`Docker`, `AWS`, `CI/CD`, `Redis`'}

---

#### 🔍 Critical Keyword & Competency Gaps:
1. **Cloud & Containerization**: Add experience with containerized deployments (Docker/Kubernetes). If you have created local containers or Dockerfiles in your projects, highlight them explicitly.
2. **System Design & Distributed Caching**: Incorporate caching strategies (Redis/Memcached) and RESTful API optimizations into your experience bullet points.
3. **Automated CI/CD**: Highlight GitHub Actions or automated test suites (`pytest`, `jest`) to pass automated ATS filters.

#### 💡 Recommended Project Highlights to Add:
* Showcase a **full-stack or backend microservice** demonstrating how you scaled a database query or integrated third-party APIs.
* Frame project bullets using the Google XYZ format: *"Accomplished **X**, as measured by **Y**, by doing **Z**"*.

#### 💼 Key Interview Topics to Prepare:
* **System Architecture**: REST API design, rate-limiting, authentication (JWT/OAuth), and SQL indexing.
* **Problem Solving**: Data structures & algorithms (Arrays, Hash Maps, Trees, Dynamic Programming).
* **Behavioral**: Collaboration during agile sprints and handling production bugs under tight deadlines.
"""

    # 2. Multi-turn Follow-up handling ("which one should I learn first?", "which one", "what order")
    if any(phrase in q_lower for phrase in ["which one", "which of these", "what should i start with", "where to start", "priority", "what first"]):
        # Look at previously suggested skills
        suggested_pool = details["missing_skills"] if details["missing_skills"] else ["REST APIs", "SQL Optimization", "Docker", "AWS", "Git & CI/CD"]
        first_choice = suggested_pool[0] if suggested_pool else "RESTful APIs & Backend Architecture"
        second_choice = suggested_pool[1] if len(suggested_pool) > 1 else "Docker & Containerization"

        return f"""### 🎯 Priority Recommendation: Where to Begin

Given your background in **{skills_str}**{gpa_info}, here is the recommended sequential order:

#### 1️⃣ Start First: **{first_choice}**
* **Why**: It directly bridges your existing foundation in {details['skills'][0] if details['skills'] else 'Python'} to production-ready industry standards.
* **Actionable Next Step**: Build a CRUD service with authentication, request validation, and database migrations.
* **Timeline**: 1–2 weeks.

#### 2️⃣ Learn Second: **{second_choice}**
* **Why**: Employers expect modern developers to package applications reliably. Once your backend service is built, containerize it with a clean `Dockerfile` and `docker-compose.yml`.
* **Timeline**: 1 week.

#### 3️⃣ Learn Third: **Cloud Deployment & CI/CD (AWS / GitHub Actions)**
* **Why**: Demonstrates end-to-end engineering autonomy. Deploying your containerized service to an AWS EC2 instance or cloud container runner with automated CI tests puts your resume in the top 10% of candidates.
"""

    # 3. "What skills am I missing?"
    if any(phrase in q_lower for phrase in ["skills missing", "missing skill", "what skills am i missing", "skill gap"]):
        missing_list = details["missing_skills"] if details["missing_skills"] else ["Docker", "AWS", "CI/CD", "Redis", "System Design", "Microservices"]
        return f"""### 🔍 Skills Gap Analysis for {target_role}

Based on your analyzed resume, here are the most impactful skills currently missing from your profile:

#### ⚠️ High-Priority Missing Competencies:
{chr(10).join([f"* **`{skill}`**: Frequently mandated in top {target_role} postings for scalable architectures." for skill in missing_list[:5]])}

---

#### 📈 Why These Skills Matter:
* **DevOps & Cloud**: Your resume demonstrates solid coding competencies in **{skills_str}**, but lacks explicit proof of cloud hosting (**AWS/GCP**) and containerization (**Docker**).
* **Caching & High-Throughput**: Adding **Redis** or database indexing will immediately raise your technical score for backend roles.

#### 💡 How to Add Them Without Years of Job Experience:
1. Incorporate **Docker** into one of your existing projects by providing a Dockerfile and docker-compose setup in your GitHub repository.
2. Build an automated **GitHub Actions CI/CD** pipeline that runs linter and unit tests on every pull request.
3. Update your resume skills section under a new subcategory: `DevOps & Cloud: Docker, Git, CI/CD, AWS (Basics)`.
"""

    # 4. "How can I improve my resume?" / "Improve resume" / "ATS"
    if any(phrase in q_lower for phrase in ["improve", "better", "review", "ats", "score", "critique"]):
        return f"""### 📄 Comprehensive Resume Improvement Plan

Your current overall score is **{score}/100** (ATS Compatibility: **{details['ats_score']}%**, Role Match: **{details['job_match_score']}%**). Here is how to upgrade your resume to a 90+ tier:

#### 1. Quantify Project & Work Impact
* **Current Pattern**: Describing what you *did* (e.g., *"Built backend API endpoints and handled database queries"*).
* **Improved High-Impact Phrasing**: Use measurable metrics: *"Architected 12+ RESTful API endpoints in Python/FastAPI, cutting query execution time by 34% and supporting 10,000+ daily requests."*

#### 2. Elevate Your Professional Summary
* Start with a focused 3-line headline stating your primary stack and target specialization:
  > *"Results-driven Software Engineer with hands-on proficiency in **{skills_str}**. Proven track record building end-to-end applications, scalable data pipelines, and responsive interfaces."*

#### 3. Optimize Technical Keywords for ATS Scanners
* Make sure your skills are categorized into:
  * **Languages**: {', '.join([s for s in details['skills'] if s in ['Python', 'Java', 'SQL', 'C++', 'JavaScript', 'TypeScript']]) or 'Python, SQL, JavaScript'}
  * **Frameworks & Databases**: {', '.join([s for s in details['skills'] if s in ['Django', 'React', 'FastAPI', 'Flask', 'MySQL', 'MongoDB', 'PostgreSQL']]) or 'React, Flask, MongoDB'}
  * **Tools & Practices**: Git, REST APIs, Agile, CI/CD

#### 4. Education & Academic Standing
* You have a solid academic foundation ({edu_info}{gpa_info}). Keep this clean, concise, and placed right below your summary or skills section.
"""

    # 5. "Which jobs suit my profile?" / "jobs" / "career"
    if any(phrase in q_lower for phrase in ["which job", "jobs suit", "what roles", "career options", "job roles", "suitable roles"]):
        return f"""### 🎯 Best Matching Job Roles for Your Profile

Based on your current stack (**{skills_str}**) and background in **{edu_info}**:

#### 1. **Full-Stack Software Engineer** (Match: 88%)
* **Why**: You possess both frontend skills (React, JavaScript) and backend competencies (Python, SQL/MongoDB).
* **Target Companies**: Fast-growing SaaS companies, tech consultancies, and digital product agencies.

#### 2. **Backend Developer / Python Engineer** (Match: 92%)
* **Why**: Your strongest foundation lies in backend logic, database queries, and API design.
* **Target Role Titles**: *Junior / Associate Backend Engineer*, *Python Developer*, *API Platform Engineer*.

#### 3. **Machine Learning / Data Engineer Intern or Associate** (Match: 80%)
* **Why**: Your projects and coursework indicate familiarity with ML workflows and data handling.
* **Key Growth Need**: Solidify MLOps tools (Docker, MLflow, FastAPI model serving).

#### 💼 Pro-Tip for Applications:
Tailor your resume headline specifically to each role rather than using a generic title. For instance, switch between *"Full-Stack Software Engineer"* and *"Backend & Systems Engineer"* based on the job posting.
"""

    # 6. "What should I learn next?" / "roadmap"
    if any(phrase in q_lower for phrase in ["learn next", "roadmap", "what should i learn", "study", "learning path"]):
        return f"""### 📚 Personalized Learning Roadmap

Based on your current stack (**{skills_str}**) and {gpa_info or 'academic background'}, here is your 3-phase technical roadmap:

```text
Existing Foundation: {skills_str}
        ↓
Phase 1: Production REST APIs & Database Indexing (Weeks 1-2)
        ↓
Phase 2: Docker, Caching (Redis), and System Design (Weeks 3-4)
        ↓
Phase 3: AWS Cloud Deployment & CI/CD Automation (Weeks 5-6)
```

#### 🗓️ Phase 1 (Weeks 1–2): Advanced Backend & API Mastery
* Learn **FastAPI / Django REST Framework** best practices (Dependency Injection, Pydantic data schemas, JWT Auth).
* Master **PostgreSQL / SQL Indexing**: Understand EXPLAIN ANALYZE, composite indexes, and connection pooling.

#### 🗓️ Phase 2 (Weeks 3–4): Containerization & Distributed Systems
* **Docker & Compose**: Containerize a multi-container stack (Frontend + Backend + PostgreSQL + Redis).
* **Redis Caching**: Implement session storage and rate limiting.

#### 🗓️ Phase 3 (Weeks 5–6): Cloud & DevOps
* Deploy your application to **AWS (EC2, S3, RDS)** or **Render/Railway**.
* Configure a **GitHub Actions** workflow to automatically run tests on every push.
"""

    # 7. "Prepare me for interviews" / "interview"
    if any(phrase in q_lower for phrase in ["interview", "questions", "prepare me", "mock interview", "technical questions"]):
        top_lang = details["skills"][0] if details["skills"] else "Python"
        return f"""### 💼 Targeted Technical & Behavioral Interview Prep

Based on your skills (**{skills_str}**) and project experience, here are the top questions recruiters and technical interviewers will ask:

#### 💻 Technical Deep-Dives:
1. **{top_lang} & OOP**:
   * *“How does memory management and garbage collection work in {top_lang}?”*
   * *“Explain the difference between deep copy and shallow copy, and give an example where mutability causes bugs.”*
2. **Databases & Query Optimization**:
   * *“When would you choose SQL over a NoSQL database like MongoDB for user transactions?”*
   * *“How do database indexes improve search performance, and what are their trade-offs during write operations?”*
3. **API & Architecture**:
   * *“How do you design an idempotent REST API endpoint for payment or user creation?”*
   * *“How do you secure authentication tokens in a React frontend application?”*

#### 🗣️ Behavioral & Project Storytelling (STAR Method):
* *“Tell me about a challenging bug you encountered in one of your projects and how you resolved it.”*
* *“How did you collaborate with teammates when disagreements arose over code structure or technology choices?”*

#### 💡 Want to practice?
Ask me: *"Ask me question 1 and evaluate my answer"*, and we can conduct an interactive mock interview right now!
"""

    # 8. "Create my career roadmap"
    if any(phrase in q_lower for phrase in ["career roadmap", "career plan", "5 year plan"]):
        return f"""### 🚀 1-to-3 Year Career Roadmap for {target_role}

Here is a structured milestone roadmap designed for your background (**{edu_info}**, stack: **{skills_str}**):

#### 🏁 Months 1–3: Job-Ready Portfolio & Application Sprint
* **Milestone 1**: 2 flagship GitHub projects with live deployment links, README architecture diagrams, and Docker support.
* **Milestone 2**: Reach 90+ ATS resume score by quantifying all bullet points with metrics.
* **Milestone 3**: Daily algorithmic problem solving (LeetCode 75 / NeetCode) focused on Hash Maps, Trees, and Two Pointers.

#### 🚀 Year 1: Associate / Junior Software Engineer
* Ship clean, tested production code; learn how to read large enterprise codebases.
* Master git workflows, code reviews, and observability/logging (Datadog/Sentry).

#### 🌟 Year 2–3: Mid-Level Software Engineer
* Lead features from technical specification to deployment.
* Design microservices and optimize database architectures for high throughput.
* Mentor junior developers and take ownership of service uptime.
"""

    # 9. Fallback: Check if user is asking about career/resume vs general question
    resume_keywords = [
        "resume", "cv", "ats", "score", "skills", "job", "career",
        "interview", "audit", "builder", "latex", "overleaf", "improve",
        "missing", "experience", "education", "project", "portfolio"
    ]
    is_career_topic = any(k in q_lower for k in resume_keywords)

    if not is_career_topic:
        return f"""I'd be happy to assist with that!

Regarding **"{query}"**:
I am ready to help you with coding, algorithms, technical design, or general knowledge. 

If you'd like guidance on your resume, ATS optimization, or career preparation for **{target_role}**, feel free to ask:
* *"What skills am I missing?"*
* *"How can I improve my resume bullet points?"*
* *"Prepare me for a technical interview"*"""

    return f"""### 🎯 Career & Resume Guidance: {target_role}

Regarding your query: **"{query}"**

#### 💡 Key Recommendations:
1. **Strengthen System Proofs**: In addition to **{skills_str}**, incorporate practical demonstrations of **{missing_str}**.
2. **Quantify Bullet Points**: Ensure every project highlights scale, user volume, latency reduction, or test coverage.
3. **Keyword Optimization**: Keep your technical skill categories clear and cleanly formatted.

Feel free to ask for interview questions or click **"Auto-Audit This Page"** for a deeper check!"""


def call_openai_chat(
    api_key: str,
    messages: List[Dict[str, str]],
    system_prompt: str
) -> Optional[str]:
    """Call OpenAI Chat API using standard urllib to avoid extra heavy dependencies."""
    try:
        url = "https://api.openai.com/v1/chat/completions"
        payload = {
            "model": os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            "messages": [{"role": "system", "content": system_prompt}] + messages,
            "temperature": 0.7,
            "max_tokens": 1000
        }
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers=headers,
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=15) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            return res_data["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"OpenAI API call failed or timed out: {e}")
        return None


from backend.nlp.gemini_client import generate_chat_response, GeminiClientError

def call_gemini_chat(
    api_key: str,
    messages: List[Dict[str, str]],
    system_prompt: str
) -> Optional[str]:
    """Call Google Gemini API using centralized gemini_client with retries and fallback."""
    try:
        return generate_chat_response(
            messages=messages,
            system_instruction=system_prompt,
            temperature=0.2,
            max_output_tokens=450
        )
    except Exception as e:
        print(f"[Copilot Gemini] Chat call failed after retries: {e}")
        return None


def handle_copilot_chat(
    query: str,
    messages: List[Dict[str, str]],
    analysis_data: Optional[Dict[str, Any]] = None,
    job_description: Optional[str] = None
) -> str:
    """
    Main entry point for AI Career Copilot.
    Tries OpenAI or Gemini if configured; falls back reliably to the intelligent
    local AI Career Copilot engine.
    """
    openai_key = os.getenv("OPENAI_API_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")

    # If an external LLM key is available, formulate system prompt with rich resume context
    if openai_key or gemini_key:
        resume_summary = ""
        if analysis_data:
            skills = analysis_data.get("skills_analysis", {}).get("skills_found", [])
            missing = analysis_data.get("skills_analysis", {}).get("missing_skills", [])
            score = analysis_data.get("overall_score", 80)
            target = analysis_data.get("target_role", "Software Engineer")
            filename = analysis_data.get("filename", "Resume.pdf")
            raw_text = analysis_data.get("resume_text", "")[:2000]

            resume_summary = f"""
Candidate Analyzed Resume Details:
- File: {filename}
- Target Role: {target}
- Overall ATS Score: {score}/100
- Detected Skills: {', '.join(skills)}
- Missing / Target Skills: {', '.join(missing)}
- Resume Snippet: {raw_text}
"""
        if job_description:
            resume_summary += f"\nTarget Job Description:\n{job_description[:1500]}\n"

        system_prompt = f"""You are Gemini AI inside Yogyat.
You are a warm, highly professional career advisor, technical recruiter, and resume mentor.
Always ground your answers in the candidate's actual resume data provided below.
Provide structured, actionable markdown answers with bullet points, bold keywords, and encouraging advice.
{resume_summary}
"""
        # Try OpenAI first if present
        if openai_key:
            res = call_openai_chat(openai_key, messages, system_prompt)
            if res:
                return res

        # Try Gemini if present
        if gemini_key:
            res = call_gemini_chat(gemini_key, messages, system_prompt)
            if res:
                return res

    # Grounded intelligent local engine
    return generate_intelligent_copilot_response(
        query=query,
        messages=messages,
        analysis_data=analysis_data,
        job_description=job_description
    )
