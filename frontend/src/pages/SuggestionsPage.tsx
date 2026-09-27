import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Copy,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { AnalysisResult } from '../types';

interface SuggestionsPageProps {
  analysis: AnalysisResult | null;
}

export const SuggestionsPage: React.FC<SuggestionsPageProps> = ({ analysis }) => {
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const recommendations = analysis?.recommendations?.length
    ? analysis.recommendations
    : [
        {
          id: 'rec-1',
          title: 'Improve Your Project Description',
          category: 'Project Impact',
          priority: 'High' as const,
          current: 'Created a machine learning project.',
          suggested:
            'Developed a machine learning model using Python and scikit-learn to classify customer data with measurable performance improvements (92% accuracy, 25% lower latency).',
          impact: '+12% recruiter engagement',
          action_text: 'Apply Suggestion',
        },
        {
          id: 'rec-2',
          title: 'Add Measurable Results & Scale',
          category: 'Experience Metrics',
          priority: 'High' as const,
          current: 'Handled database queries and backend API requests for user services.',
          suggested:
            'Optimized SQL indexing and refactored backend endpoints, reducing p99 API response latency by 35% across 50,000+ daily active users.',
          impact: '+15% ATS relevance',
          action_text: 'Apply Suggestion',
        },
        {
          id: 'rec-3',
          title: 'Add Missing Technical Skills',
          category: 'Keyword Optimization',
          priority: 'High' as const,
          current: 'General mention of web development and programming tools.',
          suggested:
            'Incorporate target job competencies: Docker, AWS, REST APIs within your technical summary and relevant project bullets.',
          impact: '+18% job match score',
          action_text: 'Apply Suggestion',
        },
        {
          id: 'rec-4',
          title: 'Elevate Professional Summary',
          category: 'Executive Summary',
          priority: 'Medium' as const,
          current: 'Software developer looking for opportunities in tech.',
          suggested:
            'Results-oriented Software Engineer specializing in scalable Python/React services and robust database architecture, committed to delivering high-impact user experiences.',
          impact: '+8% first impression',
          action_text: 'Apply Suggestion',
        },
        {
          id: 'rec-5',
          title: 'Use Stronger Action Verbs',
          category: 'Content Quality',
          priority: 'Low' as const,
          current: 'Worked on frontend user interface with React.',
          suggested:
            'Architected and delivered interactive React components, boosting user session duration by 18%.',
          impact: '+6% clarity',
          action_text: 'Apply Suggestion',
        },
      ];

  const handleApply = (id: string, textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setAppliedIds((prev) => new Set(prev).add(id));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Personalized AI Recommendations
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Actionable rewrite suggestions designed to boost clarity, quantifiable impact, and ATS matching.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 self-start sm:self-auto">
          <Sparkles size={14} />
          <span>{appliedIds.size} of {recommendations.length} Suggestions Applied</span>
        </div>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-6">
        {recommendations.map((rec: any, idx: number) => {
          const recId = rec.id || `rec-${idx + 1}`;
          const isApplied = appliedIds.has(recId);
          const isJustCopied = copiedId === recId;
          const currentText = rec.current || rec.original || '';
          const suggestedText = rec.suggested || rec.improved || '';
          const title = rec.title || `Bullet Point Suggestion #${idx + 1}`;
          const category = rec.category || 'Experience & Projects';
          const impact = rec.impact || '+18% ATS Impact';
          const priority = rec.priority || 'High';
          const actionText = rec.action_text || 'Apply Suggestion';

          return (
            <div
              key={recId}
              className={`p-6 sm:p-8 rounded-2xl bg-white border transition-all ${
                isApplied
                  ? 'border-emerald-200 shadow-xs ring-1 ring-emerald-100'
                  : 'border-slate-200/80 shadow-2xs hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isApplied
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-blue-50 text-blue-600'
                    }`}
                  >
                    {isApplied ? <Check size={18} strokeWidth={2.5} /> : <Lightbulb size={18} />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{title}</h3>
                    <span className="text-xs text-slate-400 font-medium">{category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    {impact}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      priority === 'High'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : priority === 'Medium'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {priority}
                  </span>
                </div>
              </div>

              {/* Current vs Suggested Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                {/* Current */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Current Version
                  </span>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-mono">
                    "{currentText}"
                  </p>
                </div>

                {/* Suggested */}
                <div className="p-4 rounded-xl bg-blue-50/40 border border-blue-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                      AI Suggested Rewrite
                    </span>
                    <span className="text-[10px] text-blue-600 font-semibold bg-blue-100/70 px-1.5 py-0.5 rounded">
                      High Impact
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-medium">
                    "{suggestedText}"
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  {isApplied
                    ? '✓ Copied to clipboard & marked as applied'
                    : 'Click below to copy this rewrite into your document.'}
                </span>

                <button
                  onClick={() => handleApply(recId, suggestedText)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shadow-2xs ${
                    isApplied
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check size={15} />
                      <span>{isJustCopied ? 'Copied to Clipboard!' : 'Applied'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} />
                      <span>{actionText}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
