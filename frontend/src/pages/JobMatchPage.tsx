import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Briefcase,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { ScoreGauge } from '../components/ScoreGauge';
import { AnalysisResult } from '../types';

interface JobMatchPageProps {
  analysis: AnalysisResult | null;
  onNavigate: (tab: string) => void;
}

export const JobMatchPage: React.FC<JobMatchPageProps> = ({ analysis, onNavigate }) => {
  const matchPct = analysis?.job_match?.match_pct ?? 78;
  const subtitle =
    analysis?.job_match?.subtitle ??
    'Your resume matches many of the requirements for this role.';

  const rawMatching = analysis?.job_match?.matching_skills ?? ['Python', 'SQL', 'Git', 'Machine Learning'];
  const matchingSkills: string[] = rawMatching.map((s: any) => typeof s === 'string' ? s : (s?.name || JSON.stringify(s)));

  const rawMissing = analysis?.job_match?.missing_skills ?? ['Docker', 'AWS', 'Kubernetes'];
  const missingSkills: string[] = rawMissing.map((s: any) => typeof s === 'string' ? s : (s?.name || JSON.stringify(s)));

  const rawReqs = analysis?.job_match?.requirements?.length
    ? analysis.job_match.requirements
    : [
        { requirement: 'Python Backend Engineering', category: 'Language', status: 'MATCHED', notes: 'Detected in resume skills and experience' },
        { requirement: 'SQL Database Design & Queries', category: 'Database', status: 'MATCHED', notes: 'Demonstrated in work experience and projects' },
        { requirement: 'Docker Containerization', category: 'DevOps', status: 'MISSING', notes: 'Mentioned in job description but not in resume' },
        { requirement: 'AWS Cloud Services (EC2, S3)', category: 'Cloud', status: 'MISSING', notes: 'Target requirement not explicitly found' },
        { requirement: 'RESTful API Architecture', category: 'Architecture', status: 'MATCHED', notes: 'Covered via FastAPI & Flask microservices' },
        { requirement: 'Git Version Control & PRs', category: 'Workflow', status: 'MATCHED', notes: 'Present in technical skills and projects' },
      ];

  const requirements = rawReqs.map((r: any) => ({
    requirement: r.requirement || r.description || 'Core Competency',
    category: r.category || 'General',
    status: (r.status || (r.matched ? 'MATCHED' : 'MISSING')) as 'MATCHED' | 'PARTIAL' | 'MISSING',
    notes: r.notes || (r.matched ? 'Verified in resume' : 'Target gap to address')
  }));

  const semanticPairs = analysis?.job_match?.semantic_analysis?.length
    ? analysis.job_match.semantic_analysis
    : [
        {
          job_concept: 'Experience developing RESTful APIs',
          resume_concept: 'Built backend services using FastAPI',
          relationship: 'Conceptually Related ✓',
          similarity_pct: 91,
          explanation: 'AI identifies related concepts even when the exact words are different.',
        },
        {
          job_concept: 'Relational and document database optimization',
          resume_concept: 'Designed normalized schemas in SQL and managed NoSQL documents in MongoDB',
          relationship: 'Strong Alignment ✓',
          similarity_pct: 88,
          explanation: "Translates your hands-on database experience to the hiring team's required competencies.",
        },
      ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'MATCHED':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            MATCHED
          </span>
        );
      case 'PARTIAL':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            PARTIAL
          </span>
        );
      case 'MISSING':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            MISSING
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / Heading */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Job Match Analysis
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Comparison between your resume profile and target role requirements.
        </p>
      </div>

      {/* Hero Circular Progress Match Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center gap-8">
        <div className="shrink-0">
          <ScoreGauge
            score={matchPct}
            size={140}
            strokeWidth={10}
            sublabel="Match"
            showPercent
            color="#2563eb"
          />
        </div>

        <div className="space-y-3 text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
            <Sparkles size={14} />
            <span>Target Role Alignment</span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">
            {matchPct}% Match
          </h3>
          <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
            {subtitle}
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-slate-500 justify-center md:justify-start">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              {matchingSkills.length} Core Skills Matched
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              {missingSkills.length} High-Impact Gaps
            </span>
          </div>
        </div>
      </div>

      {/* Matching Skills vs Missing Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matching Skills */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              Matching Skills
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {matchingSkills.length} Verified
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Skills explicitly identified both in your resume and the target role description.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {matchingSkills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50/70 border border-emerald-200/80 text-emerald-800 flex items-center gap-1.5"
              >
                <CheckCircle2 size={14} className="text-emerald-600" />
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle size={18} className="text-rose-600" />
              Missing Skills
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              {missingSkills.length} Gaps
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Important requirements requested by the employer not currently found in your resume.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {missingSkills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50/70 border border-rose-200/80 text-rose-800 flex items-center gap-1.5"
              >
                <span className="w-2.5 h-2.5 rounded-full border-2 border-rose-400" />
                {skill}
              </span>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('suggestions')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>See suggestions to integrate these skills</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Section 12: AI Semantic Analysis */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-blue-50 text-blue-600">
              <Sparkles size={18} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">AI Semantic Analysis</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Our models go beyond simple keyword counting to recognize functional equivalence and relevant engineering depth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {semanticPairs.map((pair, index) => (
            <div
              key={index}
              className="p-5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 flex items-center gap-1">
                  {pair.relationship}
                </span>
                <span className="text-xs font-bold text-slate-700">
                  Similarity: <strong className="text-blue-600">{pair.similarity_pct}%</strong>
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Job Requirement
                  </span>
                  <p className="font-semibold text-slate-800">"{pair.job_concept}"</p>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Your Resume Phrasing
                  </span>
                  <p className="font-semibold text-slate-800">"{pair.resume_concept}"</p>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed italic">
                "{pair.explanation}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Job Requirements Table */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Job Requirements Breakdown</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Detailed status for key competencies requested in the role description.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Requirement</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {requirements.map((req, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">{req.requirement}</td>
                  <td className="py-3 px-3 text-xs text-slate-500">{req.category}</td>
                  <td className="py-3 px-3">{getStatusBadge(req.status)}</td>
                  <td className="py-3 px-3 text-xs text-slate-500">{req.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
