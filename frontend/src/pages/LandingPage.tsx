import React from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  Layers,
  Briefcase,
  UploadCloud,
  ChevronRight,
  TrendingUp,
  Cpu,
  Shield,
  Zap,
  Sun,
  Moon,
} from 'lucide-react';
import { ScoreGauge } from '../components/ScoreGauge';

interface LandingPageProps {
  onStartAnalysis: () => void;
  onExploreDemo: () => void;
  onOpenBuilder?: () => void;
  theme?: 'light' | 'dark' | 'system';
  onToggleTheme?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAnalysis,
  onExploreDemo,
  onOpenBuilder,
  theme = 'light',
  onToggleTheme,
}) => {
  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navbar */}
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/yogyat-logo-transparent.png"
              alt="Yogyat"
              className="h-9 w-auto max-w-[180px] object-contain"
            />
            <span className="ml-1 px-2 py-0.5 text-[10px] font-semibold tracking-wide bg-blue-50 text-blue-700 rounded-full border border-blue-100">
              AI Powered
            </span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenBuilder && (
              <button
                onClick={onOpenBuilder}
                className="text-xs sm:text-sm font-medium text-slate-700 hover:text-blue-600 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200 hover:border-blue-300"
              >
                <span>ATS Builder</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded font-bold">LaTeX</span>
              </button>
            )}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun size={18} className="text-amber-400" />
                ) : (
                  <Moon size={18} className="text-slate-600" />
                )}
              </button>
            )}
            <button
              onClick={onExploreDemo}
              className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg transition-colors"
            >
              Live Demo
            </button>
            <button
              onClick={onStartAnalysis}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-all"
            >
              <span>Analyze My Resume</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200 text-xs font-semibold text-slate-700 mb-6 shadow-2xs">
          <Sparkles size={14} className="text-blue-600" />
          <span>Understand your resume. Match your career.</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-[1.12]">
          Build a Resume That <span className="text-blue-600">Gets Noticed</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-5 text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Analyze your resume with AI, discover missing skills, improve your content, or build an ATS-proof LaTeX resume styled after Overleaf.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={onStartAnalysis}
            className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm sm:text-base font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Analyze My Resume</span>
            <ArrowRight size={18} />
          </button>
          {onOpenBuilder && (
            <button
              onClick={onOpenBuilder}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-sm sm:text-base font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <span>ATS Resume Builder</span>
              <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-mono">LaTeX</span>
            </button>
          )}
          <button
            onClick={onExploreDemo}
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 text-sm sm:text-base font-semibold rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2"
          >
            <span>See Demo</span>
            <ChevronRight size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Hero Visual Mockup */}
        <div className="mt-14 max-w-5xl mx-auto text-left">
          <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-xl overflow-hidden">
            {/* Mock browser bar */}
            <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="ml-3 text-xs text-slate-400 font-mono">yogyat.app/analysis/demo</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                Live Analysis Preview
              </span>
            </div>

            {/* Dashboard Content Mockup */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Top Row: Circular Score & Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Main Score Card */}
                <div className="p-5 rounded-xl bg-slate-50/60 border border-slate-200/70 flex flex-col items-center justify-center text-center">
                  <ScoreGauge score={82} size={110} strokeWidth={8} sublabel="Overall" color="#2563eb" />
                  <span className="mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Strong Resume
                  </span>
                </div>

                {/* KPI 1 */}
                <div className="p-5 rounded-xl bg-white border border-slate-200/70 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">ATS Compatibility</span>
                    <h4 className="text-2xl font-bold text-slate-900 mt-1">86%</h4>
                  </div>
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 size={13} /> Clean ATS format
                  </span>
                </div>

                {/* KPI 2 */}
                <div className="p-5 rounded-xl bg-white border border-slate-200/70 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Job Match</span>
                    <h4 className="text-2xl font-bold text-slate-900 mt-1">78%</h4>
                  </div>
                  <span className="text-xs text-blue-600 font-medium">Software Engineer match</span>
                </div>

                {/* KPI 3 */}
                <div className="p-5 rounded-xl bg-white border border-slate-200/70 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Skills Extracted</span>
                    <h4 className="text-2xl font-bold text-slate-900 mt-1">24</h4>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">Languages & Cloud</span>
                </div>
              </div>

              {/* Second Row: Skills & AI Recommendation Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-white border border-slate-200/70">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Detected Core Competencies
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {['Python', 'Java', 'SQL', 'React', 'Git', 'Machine Learning', 'MongoDB', 'Node.js', 'FastAPI'].map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-md border border-slate-200/60"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-blue-50/50 border border-blue-100/80">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-blue-600" />
                    <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                      Featured AI Recommendation
                    </h4>
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    <span className="font-semibold text-slate-900">Quantify Project Impact:</span> Add measurable results (e.g., "Reduced SQL latency by 35% across 50K daily users") to increase recruiter callback rate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Yogyat Section */}
      <section className="py-16 bg-slate-50/60 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Why Yogyat?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Modern engineering hiring moves fast. Yogyat provides deep, actionable feedback that helps your resume navigate automated systems and impress hiring managers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
                <FileCheck2 size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Resume Analysis</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Understand the strengths and weaknesses of your resume across structure, content quality, and ATS readiness.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                <Briefcase size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Job Matching</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Compare your resume against a specific job description to evaluate keyword density and semantic alignment.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                <Layers size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Skill Gap Detection</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Discover important skills missing from your profile (e.g., Docker, AWS, REST APIs) before applying.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block mb-2">
            Simple 4-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How Yogyat Works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            From raw document to recruiter-ready profile in less than 30 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 relative text-left">
            <div className="text-xs font-bold text-blue-600 mb-2">STEP 01</div>
            <h4 className="text-base font-bold text-slate-900 mb-1">Upload Resume</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Drag and drop your PDF or DOCX file. Our engine parses sections and formatting instantly.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 relative text-left">
            <div className="text-xs font-bold text-blue-600 mb-2">STEP 02</div>
            <h4 className="text-base font-bold text-slate-900 mb-1">AI Analysis</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              NLP models evaluate readability, bullet strength, section completeness, and ATS compatibility.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 relative text-left">
            <div className="text-xs font-bold text-blue-600 mb-2">STEP 03</div>
            <h4 className="text-base font-bold text-slate-900 mb-1">Job Matching</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Paste your target job description to compute semantic similarity and detect missing requirements.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 relative text-left">
            <div className="text-xs font-bold text-blue-600 mb-2">STEP 04</div>
            <h4 className="text-base font-bold text-slate-900 mb-1">Personalized Suggestions</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Apply tailored before/after recommendations with 1 click to strengthen your bullets and metrics.
            </p>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 p-8 sm:p-10 rounded-2xl bg-slate-900 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Ready to elevate your job search?
            </h3>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Join candidates improving their response rates with Yogyat's automated career intelligence.
            </p>
          </div>
          <button
            onClick={onStartAnalysis}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-2"
          >
            <span>Analyze My Resume</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-8 text-center text-xs text-slate-400">
        <p>© 2026 Yogyat. Understand your resume. Match your career.</p>
      </footer>
    </div>
  );
};
