import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  ShieldCheck,
  Briefcase,
  Layers,
  Award,
} from 'lucide-react';
import { ScoreGauge } from '../components/ScoreGauge';
import { AnalysisResult } from '../types';

interface AnalysisPageProps {
  analysis: AnalysisResult | null;
  onNavigate: (tab: string) => void;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({ analysis, onNavigate }) => {
  const overallScore = analysis?.overall_score ?? 82;
  const breakdown = analysis?.score_breakdown ?? {
    ats_compatibility: 86,
    skills_match: 79,
    experience: 82,
    content_quality: 88,
  };

  const strengths = analysis?.strengths ?? [
    'Strong technical skills',
    'Clear project descriptions',
    'Good education section',
    'Relevant technologies',
  ];

  const improvements = analysis?.improvements ?? [
    {
      title: 'Improve professional summary',
      priority: 'Medium',
      explanation: 'Your summary should immediately highlight target role title, years of focus, and core technical competencies.',
      suggested_action: 'Condense into a strong 3-sentence hook focused on your target engineering specialty.',
    },
    {
      title: 'Add measurable project results',
      priority: 'High',
      explanation: 'Recruiters look for quantifiable business or technical outcomes (e.g., % speedup, user scale).',
      suggested_action: 'Include metrics such as latency reduction, accuracy percentages, or team velocity gains.',
    },
    {
      title: 'Add relevant keywords',
      priority: 'High',
      explanation: 'Missing target keywords (Docker, AWS, REST APIs) mentioned in target software roles.',
      suggested_action: 'Incorporate target skills into hands-on project and experience bullets.',
    },
    {
      title: 'Improve experience descriptions',
      priority: 'Low',
      explanation: 'Transform passive statements into high-impact action verbs.',
      suggested_action: "Begin bullets with strong verbs like 'Architected', 'Spearheaded', or 'Optimized'.",
    },
  ];

  const atsData = analysis?.ats_analysis ?? {
    score: 86,
    checks: [
      'Standard section headings',
      'Contact information detected',
      'Relevant keywords',
      'Readable structure',
      'Appropriate file format',
    ],
    warnings: [
      'Some bullet points are too long',
      'Add more job-specific keywords',
    ],
    disclaimer:
      "Note: This score is an application-generated estimate based on standard applicant tracking system heuristics, not a guarantee of how an employer's ATS will evaluate the resume.",
  };

  const sections = analysis?.section_breakdown ?? {
    contact: { title: 'Contact Information', score: 100, status: 'Complete', feedback: 'All essential contact details and links detected.' },
    summary: { title: 'Professional Summary', score: 82, status: '82%', feedback: 'Solid positioning statement, could add target metrics.' },
    education: { title: 'Education', score: 95, status: '95%', feedback: 'Accredited degree and graduation details verified.' },
    experience: { title: 'Experience', score: 78, status: '78%', feedback: 'Good technical duties; add more quantifiable scale outcomes.' },
    projects: { title: 'Projects', score: 86, status: '86%', feedback: 'Clear technical stacks and problem-solving demonstrated.' },
    skills: { title: 'Skills', score: 91, status: '91%', feedback: 'Comprehensive modern tool and framework representation.' },
    certifications: { title: 'Certifications', score: 74, status: '74%', feedback: 'Adding recognized cloud credentials will boost credibility.' },
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">High</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">Medium</span>;
      case 'Low':
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">Low</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Section: Score Card & 4 Metrics */}
      <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Resume Analysis
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Comprehensive evaluation of your resume's technical strength, readability, and ATS compliance.
          </p>
        </div>

        <button
          onClick={() => onNavigate('builder')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Sparkles size={16} className="text-blue-400" />
          <span>Build Overleaf ATS Resume</span>
        </button>
      </div>

        {/* Large Score Card & Smaller Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Score Box (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-3">
              <Sparkles size={13} className="text-indigo-600 animate-pulse" />
              <span>{analysis?.evaluator || 'Evaluated by Gemini AI (3.5 Flash Lite)'}</span>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Overall Resume Score
            </span>
            <div className="my-2">
              <ScoreGauge
                score={overallScore}
                size={150}
                strokeWidth={10}
                sublabel="Score"
                color="#2563eb"
              />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mt-2">
              {overallScore} / 100
            </h3>
            <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
              Based on structure, skills, experience, projects and job relevance.
            </p>
          </div>

          {/* 4 Smaller KPI Cards (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ATS */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">ATS Compatibility</span>
                <ShieldCheck size={18} className="text-emerald-600" />
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-900">{breakdown.ats_compatibility}%</span>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${breakdown.ats_compatibility}%` }} />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">Heuristic parser compatibility</p>
            </div>

            {/* Skills Match */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Skills Match</span>
                <Layers size={18} className="text-blue-600" />
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-900">{breakdown.skills_match}%</span>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${breakdown.skills_match}%` }} />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">Target technical keywords</p>
            </div>

            {/* Experience */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Experience</span>
                <Briefcase size={18} className="text-indigo-600" />
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-900">{breakdown.experience}%</span>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${breakdown.experience}%` }} />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">Role depth and impact</p>
            </div>

            {/* Content Quality */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Content Quality</span>
                <Sparkles size={18} className="text-amber-500" />
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-900">{breakdown.content_quality}%</span>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${breakdown.content_quality}%` }} />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">Clarity & phrasing strength</p>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Improvement Areas Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 8: What You're Doing Well */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={18} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">What You're Doing Well</h3>
          </div>
          <p className="text-xs text-slate-500">
            These areas meet or exceed modern recruiting industry standards.
          </p>

          <div className="space-y-3 pt-2">
            {strengths.map((strength: any, index: number) => {
              const text = typeof strength === 'string'
                ? strength
                : (strength?.title ? `${strength.title}${strength?.detail ? `: ${strength.detail}` : ''}` : JSON.stringify(strength));
              return (
                <div
                  key={index}
                  className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100/80 flex items-start gap-3"
                >
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-800">
                    {text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 9: What Could Be Improved */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-rose-50 text-rose-600">
                <AlertTriangle size={18} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">What Could Be Improved</h3>
            </div>
            <button
              onClick={() => onNavigate('suggestions')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              View AI Suggestions
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Prioritized areas that will significantly boost recruiter callbacks.
          </p>

          <div className="space-y-3 pt-2">
            {improvements.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  {getPriorityBadge(item.priority)}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.explanation}
                </p>
                <div className="pt-1 text-xs text-blue-700 font-medium bg-blue-50/70 p-2 rounded-lg border border-blue-100">
                  <span className="font-semibold text-blue-900">Action: </span>
                  {item.suggested_action}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 14: ATS Compatibility Detailed View */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              ATS Analysis
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              ATS Compatibility ({atsData.score}%)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Parser Ready
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Checks */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Format Checklist
            </h4>
            <div className="space-y-2">
              {atsData.checks.map((check: any, i: number) => {
                const text = typeof check === 'string'
                  ? check
                  : (check?.name ? `${check.name}${check?.description ? `: ${check.description}` : ''}` : JSON.stringify(check));
                return (
                  <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-800">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>{text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Warnings */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              ATS Warnings
            </h4>
            <div className="space-y-2">
              {atsData.warnings.map((warn: any, i: number) => {
                const text = typeof warn === 'string'
                  ? warn
                  : (warn?.message || warn?.description || warn?.name || JSON.stringify(warn));
                return (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-amber-800 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/60">
                    <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <span>{text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Disclaimer as specified */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 leading-relaxed">
          <span className="font-semibold text-slate-700">Heuristic Disclaimer: </span>
          {atsData.disclaimer}
        </div>
      </div>

      {/* Section 15: Resume Section Analysis Breakdown */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-6">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Completeness & Depth
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            Resume Breakdown
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Component-by-component analysis of section formatting and depth.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(sections).map(([key, section]: [string, any]) => {
            const title = section?.title || (key.charAt(0).toUpperCase() + key.slice(1));
            const score = typeof section?.score === 'number' ? section.score : 80;
            const status = section?.status || `${score}%`;
            const feedback = typeof section?.feedback === 'string' ? section.feedback : (section?.detail || '');
            return (
              <div
                key={key}
                className="p-5 rounded-xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between space-y-3 hover:bg-white hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{title}</h4>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    {status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${Math.min(100, score)}%` }}
                  />
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {feedback}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
