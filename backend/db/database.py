import sqlite3
import json
import os
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional

DB_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "resumeiq.db")

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS analyses (
            id TEXT PRIMARY KEY,
            filename TEXT,
            target_role TEXT,
            overall_score INTEGER,
            ats_score INTEGER,
            job_match_score INTEGER,
            skills_count INTEGER,
            created_at TEXT,
            analysis_data TEXT
        )
    """)
    conn.commit()
    conn.close()

def save_analysis(
    filename: str,
    target_role: str,
    overall_score: int,
    ats_score: int,
    job_match_score: int,
    skills_count: int,
    analysis_data: Dict[str, Any],
    analysis_id: Optional[str] = None
) -> str:
    init_db()
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    record_id = analysis_id or str(uuid.uuid4())
    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    cursor.execute("""
        INSERT OR REPLACE INTO analyses (
            id, filename, target_role, overall_score, ats_score, job_match_score, skills_count, created_at, analysis_data
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        record_id,
        filename,
        target_role,
        overall_score,
        ats_score,
        job_match_score,
        skills_count,
        created_at,
        json.dumps(analysis_data)
    ))
    conn.commit()
    conn.close()
    return record_id

def get_analysis(analysis_id: str) -> Optional[Dict[str, Any]]:
    init_db()
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT id, filename, target_role, overall_score, ats_score, job_match_score, skills_count, created_at, analysis_data FROM analyses WHERE id = ?", (analysis_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    data = json.loads(row[8])
    data["id"] = row[0]
    data["filename"] = row[1]
    data["target_role"] = row[2]
    data["created_at"] = row[7]
    return data

def get_all_analyses() -> List[Dict[str, Any]]:
    init_db()
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT id, filename, target_role, overall_score, ats_score, job_match_score, skills_count, created_at FROM analyses ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "id": r[0],
            "filename": r[1],
            "target_role": r[2],
            "overall_score": r[3],
            "ats_score": r[4],
            "job_match_score": r[5],
            "skills_count": r[6],
            "created_at": r[7]
        }
        for r in rows
    ]

def delete_analysis(analysis_id: str) -> bool:
    init_db()
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM analyses WHERE id = ?", (analysis_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted

def clear_all_history() -> int:
    init_db()
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM analyses")
    count = cursor.rowcount
    conn.commit()
    conn.close()
    return count
