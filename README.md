# ResumeIQ

> **"Understand your resume. Match your career."**
> AI-powered resume analysis, job matching, skill-gap detection, and personalized improvement suggestions.

---

## Overview

**ResumeIQ** is a modern, production-style AI SaaS web application that parses resumes (PDF, DOCX, and TXT), extracts technical skills and section structures, compares candidates against target job descriptions, computes semantic conceptual similarity, and provides actionable rewrite suggestions.

---

## Key Features

1. **AI Resume Analysis**:
   - Overall Resume Score (0–100) with visual circular gauge.
   - Core metric breakdown: ATS Compatibility, Skills Match, Experience Depth, and Content Quality.
   - Evidence-based strengths checklist (*What You're Doing Well*).
   - Prioritized improvement areas (*What Could Be Improved*) labeled High, Medium, and Low.
   - Component-by-component section analysis (*Contact Info, Summary, Education, Experience, Projects, Skills, Certifications*).
   - ATS compatibility audit with format checks, warnings, and heuristic estimate disclaimer.

2. **Job Matching & Semantic Analysis**:
   - Role alignment percentage indicator.
   - Matched vs. Missing skill tags.
   - Conceptual semantic matching (e.g., recognizing that *"Built backend services using FastAPI"* conceptually aligns with *"Experience developing RESTful APIs"* at 91% similarity).
   - Structured Job Requirements breakdown table (*MATCHED*, *PARTIAL*, *MISSING*).

3. **Skill Gap Detection**:
   - Comprehensive skills taxonomy spanning 200+ canonical technical and domain competencies.
   - Categorized views: Skills Found, Skills Mentioned in Job, and Missing / Recommended Skills.
   - Live search and category filtering.

4. **Personalized AI Recommendations**:
   - Before/After rewrite cards demonstrating high-impact phrasing.
   - One-click **Apply Suggestion** button that copies rewrites to the clipboard and marks suggestions as applied.

5. **Analysis History & Settings**:
   - SQLite-backed history tracking across resume iterations.
   - Search, filter by target role, view past results, delete records, and download JSON reports.
   - Settings page for profile management, theme selection, and privacy controls.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Vite
- **Backend**: Python 3.13, FastAPI, Uvicorn, Pydantic
- **NLP & Document Processing**: PyMuPDF (`fitz`), `python-docx`, `scikit-learn` (TF-IDF & Cosine Similarity)
- **Database**: SQLite (persisted in `resumeiq.db`, ready for PostgreSQL/MongoDB migration)

---

## Project Structure

```text
resumeanalyzer/
├── backend/
│   ├── db/
│   │   └── database.py        # SQLite schema, session history & persistence
│   ├── nlp/
│   │   └── engine.py          # Section detection, skill extraction, ATS scoring & semantic analysis
│   ├── parsers/
│   │   └── extractor.py       # PDF (PyMuPDF) and DOCX (python-docx) text extraction
│   ├── sample_data/
│   │   └── samples.py         # Sample resumes, job postings, and PDF/DOCX generators
│   └── main.py                # FastAPI REST API endpoints & CORS setup
├── frontend/
│   ├── src/
│   │   ├── components/        # Sidebar, Header, ScoreGauge, ProcessingModal, HelpModal
│   │   ├── pages/             # LandingPage, DashboardPage, UploadPage, AnalysisPage,
│   │   │                      # JobMatchPage, SkillsPage, SuggestionsPage, HistoryPage, SettingsPage
│   │   ├── services/api.ts    # REST API client
│   │   ├── types/index.ts     # TypeScript data contracts
│   │   ├── App.tsx            # Main router & state orchestration
│   │   └── index.css          # Design system tokens & Tailwind CSS v4 setup
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## Running the Application Locally

### 1. Start the FastAPI Backend
```bash
# From workspace root
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```
Backend API docs will be available at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Start the Frontend Dev Server
```bash
cd frontend
npm run dev
```
Web application will be running at: [http://127.0.0.1:5173/](http://127.0.0.1:5173/)
