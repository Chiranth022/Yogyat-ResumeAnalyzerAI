import React, { useEffect, useState } from 'react';
import { Check, Loader2, Sparkles, ArrowRight } from 'lucide-react';

interface ProcessingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  isBackendProcessing: boolean;
}

const STEPS = [
  { id: 1, label: 'Reading resume' },
  { id: 2, label: 'Extracting information' },
  { id: 3, label: 'Analyzing skills' },
  { id: 4, label: 'Comparing job description' },
  { id: 5, label: 'Generating recommendations' },
];

export const ProcessingModal: React.FC<ProcessingModalProps> = ({
  isOpen,
  onComplete,
  isBackendProcessing,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setIsFinished(false);
      return;
    }

    // Step progression animation
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          // If at last step and backend is done, mark finished
          if (!isBackendProcessing) {
            setIsFinished(true);
            clearInterval(interval);
          }
          return prev;
        }
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isOpen, isBackendProcessing]);

  // When backend finishes, ensure all steps mark completed
  useEffect(() => {
    if (!isBackendProcessing && isOpen) {
      const timer = setTimeout(() => {
        setCurrentStepIndex(STEPS.length);
        setIsFinished(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isBackendProcessing, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-6 sm:p-8 text-center relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-60 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-indigo-100 rounded-full blur-2xl opacity-60 pointer-events-none" />

        {/* Header Icon */}
        <div className="mx-auto w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
          <Sparkles size={24} className={isFinished ? '' : 'animate-spin'} />
        </div>

        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          {isFinished ? 'Analysis Complete' : 'AI Analysis in Progress'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">
          {isFinished
            ? 'Your resume and job alignment insights are ready to review.'
            : 'Extracting semantic keywords, evaluating ATS compatibility, and calculating skill gaps.'}
        </p>

        {/* Step-by-step progress checklist */}
        <div className="space-y-3 text-left mb-6 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
          {STEPS.map((step, idx) => {
            const isDone = isFinished || idx < currentStepIndex;
            const isCurrent = !isFinished && idx === currentStepIndex;
            const isPending = !isFinished && idx > currentStepIndex;

            return (
              <div key={step.id} className="flex items-center justify-between text-sm">
                <span
                  className={`font-medium transition-colors ${
                    isDone
                      ? 'text-slate-800'
                      : isCurrent
                      ? 'text-blue-600 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>

                <div className="flex items-center justify-center w-5 h-5">
                  {isDone ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  ) : isCurrent ? (
                    <Loader2 size={16} className="text-blue-600 animate-spin" />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-300" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-6">
          <div
            className="bg-blue-600 h-full transition-all duration-300 rounded-full"
            style={{
              width: isFinished
                ? '100%'
                : `${Math.min(95, ((currentStepIndex + 1) / STEPS.length) * 100)}%`,
            }}
          />
        </div>

        {/* CTA Button */}
        {isFinished ? (
          <button
            onClick={onComplete}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
          >
            <span>View Results</span>
            <ArrowRight size={16} />
          </button>
        ) : (
          <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
            <span>Processing NLP models...</span>
          </div>
        )}
      </div>
    </div>
  );
};
