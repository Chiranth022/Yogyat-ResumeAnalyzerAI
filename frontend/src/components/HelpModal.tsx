import React from 'react';
import { X, CheckCircle2, AlertCircle, HelpCircle, BookOpen, ShieldCheck } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-100/70 text-blue-700">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">Yogyat Documentation & Help</h3>
              <p className="text-xs text-slate-500">Guides for ATS optimization, semantic matching, and resume scoring</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-600">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-blue-600" />
              How Yogyat Works
            </h4>
            <p className="leading-relaxed text-slate-600 text-xs sm:text-sm">
              Yogyat parses your resume using computer vision text extractors (PyMuPDF & python-docx) and applies natural language processing (NLP) to extract technical competencies, work chronology, and educational credentials. When a job description is provided, our semantic similarity engine calculates match percentage and detects missing skill gaps.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-600" />
              ATS Compatibility Best Practices
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
              <li>• Use standard section headers: <span className="font-medium text-slate-800">Experience, Education, Skills, Projects, Summary</span>.</li>
              <li>• Keep bullet points between 15–35 words and lead with strong action verbs.</li>
              <li>• Quantify metrics (e.g., “reduced latency by 35% across 50K users”).</li>
              <li>• Avoid multi-column text boxes and graphic charts that traditional ATS parsers scramble.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-600" />
              Understanding the ATS Score Estimate
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-500">
              The ATS Compatibility score provided by Yogyat is an application-generated estimate based on standard applicant tracking system heuristics, parsing success rates, and keyword matching. It is not an absolute guarantee of how an employer's specific proprietary ATS (e.g., Workday, Greenhouse, Taleo) will rank your profile.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-slate-50/50">
          <span className="text-xs text-slate-400">Yogyat Version 1.0.0 • Production AI</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
