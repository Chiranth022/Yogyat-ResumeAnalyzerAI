import React from 'react';
import {
  FileText,
  Briefcase,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  ChevronRight,
  ShieldCheck,
  Plus,
  FileCode,
} from 'lucide-react';
import { ScoreGauge } from '../components/ScoreGauge';
import { AnalysisResult, HistoryItem } from '../types';

interface DashboardPageProps {
  analysis: AnalysisResult | null;
  history: HistoryItem[];
  onNavigate: (tab: string) => void;
  onSelectHistoryItem: (id: string) => void;
  onAnalyzeNew: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  analysis,
  history,
  onNavigate,
  onSelectHistoryItem,
  onAnalyzeNew,
}) => {
  // Use loaded analysis or fallback to standard demo metrics
  const resumeScore = analysis?.overall_score ?? 82;
  const atsCompatibility = analysis?.kpis?.ats_compatibility ?? 86;
  const jobMatch = analysis?.kpis?.job_match ?? 78;
  const skillsCount = analysis?.kpis?.skills_found_count ?? 24;

  const scoreLabel = analysis?.score_label ?? 'Strong Resume';
  const scoreExplanation =
    analysis?.score_explanation ??
    'Your resume has a strong technical foundation, but several improvements could increase its relevance for your target roles.';

  const skillsList = analysis?.skills_analysis?.skills_found?.length
    ? analysis.skills_analysis.skills_found
    : ['Python', 'Java', 'SQL', 'React', 'Git', 'Machine Learning', 'MongoDB', 'HTML', 'CSS'];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Good morning, Candidate
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Here's an overview of your resume performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('builder')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold rounded-xl border border-slate-200/90 shadow-2xs transition-colors"
          >
            <FileCode size={16} className="text-blue-600" />
            <span>ATS Resume Builder</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-bold">LaTeX</span>
          </button>
          <button
            onClick={onAnalyzeNew}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Plus size={16} />
            <span>Analyze New Resume</span>
          </button>
        </div>
      </div>

      {/* Four KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Resume Score</span>
            <Sparkles size={16} className="text-blue-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900">{resumeScore}</span>
            <span className="text-sm font-medium text-slate-400">/ 100</span>
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <CheckCircle2 size={13} /> High quartile profile
          </p>
        </div>

        {/* KPI 2 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">ATS Compatibility</span>
            <ShieldCheck size={16} className="text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900">{atsCompatibility}%</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-2">
            Standard headings detected
          </p>
        </div>

        {/* KPI 3 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Job Match</span>
            <Briefcase size={16} className="text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900">{jobMatch}%</span>
          </div>
          <p className="text-xs text-blue-600 font-medium mt-2">
            Software Engineer aligned
          </p>
        </div>

        {/* KPI 4 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Skills Found</span>
            <TrendingUp size={16} className="text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900">{skillsCount}</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-2">
            Technical & framework tags
          </p>
        </div>
      </div>

      {/* Large Resume Overview Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Resume Overview
          </h3>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold">
            <Sparkles size={13} className="text-indigo-600 animate-pulse" />
            <span>{analysis?.evaluator || 'Evaluated by Gemini AI (3.5 Flash Lite)'}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="shrink-0 flex flex-col items-center">
            <ScoreGauge score={resumeScore} size={130} strokeWidth={9} sublabel="Overall" color="#2563eb" />
            <span className="mt-3 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              {scoreLabel}
            </span>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <h4 className="text-lg font-bold text-slate-900">
              Strong technical foundation with high recruiter appeal
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
              {scoreExplanation}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => onNavigate('analysis')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <span>View Full Analysis</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => onNavigate('suggestions')}
                className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 transition-colors"
              >
                View Suggestions ({analysis?.recommendations?.length ?? 5})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Snapshot Section */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Skills Snapshot</h3>
            <p className="text-xs text-slate-500 mt-0.5">Top technical keywords identified in your resume</p>
          </div>
          <button
            onClick={() => onNavigate('skills')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Explore Skills Gap</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {skillsList.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 border border-slate-200/80 text-slate-700 hover:bg-blue-50/50 hover:border-blue-200 transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Recent Analysis Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Analysis</h3>
            <p className="text-xs text-slate-500 mt-0.5">Your most recent resume evaluations and role matches</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All History</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Resume</th>
                <th className="py-3 px-3">Job Role</th>
                <th className="py-3 px-3">Match</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {history.length > 0 ? (
                history.slice(0, 4).map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3 font-medium text-slate-900 flex items-center gap-2">
                      <FileText size={16} className="text-blue-500 shrink-0" />
                      <span className="truncate max-w-[200px]">{item.filename}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">{item.target_role || 'Software Engineer'}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-900">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {item.job_match_score || 82}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-xs text-slate-400">
                      {item.created_at ? item.created_at.split(' ')[0] : (index === 0 ? 'Today' : 'Yesterday')}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => onSelectHistoryItem(item.id)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3 font-medium text-slate-900 flex items-center gap-2">
                      <FileText size={16} className="text-blue-500" />
                      <span>Software Engineer Resume</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">Software Engineer</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-900">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        82%
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-xs text-slate-400">Today</td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => onNavigate('analysis')}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3 font-medium text-slate-900 flex items-center gap-2">
                      <FileText size={16} className="text-indigo-500" />
                      <span>ML Resume</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">Machine Learning Intern</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-900">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        76%
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-xs text-slate-400">Yesterday</td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => onNavigate('analysis')}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
