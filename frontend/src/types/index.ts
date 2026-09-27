export interface SkillItem {
  name: string;
  category: string;
}

export interface SectionBreakdownItem {
  title: string;
  score: number;
  status: string;
  feedback: string;
}

export interface ImprovementItem {
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  explanation: string;
  suggested_action: string;
}

export interface RecommendationItem {
  id: string;
  title: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  current: string;
  suggested: string;
  impact: string;
  action_text: string;
}

export interface JobRequirementItem {
  requirement: string;
  category: string;
  status: 'MATCHED' | 'PARTIAL' | 'MISSING';
  notes: string;
}

export interface SemanticPairItem {
  job_concept: string;
  resume_concept: string;
  relationship: string;
  similarity_pct: number;
  explanation: string;
}

export interface AtsAnalysis {
  score: number;
  checks: string[];
  warnings: string[];
  disclaimer: string;
}

export interface AnalysisResult {
  id?: string;
  filename: string;
  target_role: string;
  created_at?: string;
  resume_text?: string;
  job_description?: string;
  overall_score: number;
  score_label: string;
  score_explanation: string;
  evaluator?: string;
  is_gemini?: boolean;
  kpis: {
    resume_score: number;
    ats_compatibility: number;
    job_match: number;
    skills_found_count: number;
  };
  score_breakdown: {
    ats_compatibility: number;
    skills_match: number;
    experience: number;
    content_quality: number;
  };
  strengths: string[];
  improvements: ImprovementItem[];
  skills_analysis: {
    skills_found: string[];
    skills_in_job: string[];
    missing_skills: string[];
    matched_skills: string[];
    matched_count: number;
    missing_count: number;
  };
  job_match: {
    match_pct: number;
    subtitle: string;
    matching_skills: string[];
    missing_skills: string[];
    requirements: JobRequirementItem[];
    semantic_analysis: SemanticPairItem[];
  };
  recommendations: RecommendationItem[];
  ats_analysis: AtsAnalysis;
  section_breakdown: Record<string, SectionBreakdownItem>;
}

export interface HistoryItem {
  id: string;
  filename: string;
  target_role: string;
  overall_score: number;
  ats_score: number;
  job_match_score: number;
  skills_count: number;
  created_at: string;
}

export interface UploadResponse {
  success: boolean;
  filename: string;
  file_size: number;
  file_size_formatted: string;
  format: string;
  word_count: number;
  extracted_text: string;
  text_preview: string;
  detected_skills_count: number;
  preview_skills: string[];
}
