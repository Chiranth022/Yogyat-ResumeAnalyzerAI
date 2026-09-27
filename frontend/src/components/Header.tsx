import React from 'react';
import { Menu, Plus, Sparkles, HelpCircle, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onOpenMobile: () => void;
  onAnalyzeNew: () => void;
  onOpenHelp: () => void;
  isCopilotOpen?: boolean;
  onToggleCopilot?: () => void;
  theme?: 'light' | 'dark' | 'system';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobile,
  onAnalyzeNew,
  onOpenHelp,
  isCopilotOpen = false,
  onToggleCopilot,
  theme = 'light',
  onToggleTheme,
}) => {
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Dashboard';
      case 'upload':
        return 'Upload & Analyze Resume';
      case 'builder':
        return 'ATS Resume Builder (Overleaf)';
      case 'analysis':
        return 'Resume Analysis';
      case 'job-match':
        return 'Job Match Analysis';
      case 'skills':
        return 'Skills Breakdown';
      case 'suggestions':
        return 'Personalized AI Recommendations';
      case 'history':
        return 'Analysis History';
      case 'settings':
        return 'Settings & Preferences';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-8 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-3">
          <img
            src="/yogyat-logo-transparent.png"
            alt="Yogyat"
            className="h-6 w-auto object-contain hidden sm:inline-block"
          />
          <h1 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight">
            {getTabTitle(currentTab)}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Status Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50/90 border border-indigo-200/80 text-[11px] font-medium text-indigo-700 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Sparkles className="w-3 h-3 text-indigo-600" />
          <span>Gemini AI Connected (Flash Lite)</span>
        </div>

        {/* Gemini AI Sidebar Toggle Button */}
        {onToggleCopilot && (
          <button
            onClick={onToggleCopilot}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer shadow-xs ${
              isCopilotOpen
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-indigo-200 text-indigo-700 ring-2 ring-indigo-500/20'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
            title="Toggle Gemini AI (Ctrl+J)"
            aria-label="Toggle Gemini AI"
          >
            <span className="relative flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
              {isCopilotOpen && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </span>
            <span className="font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline">
              Gemini AI
            </span>
            <kbd className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 border border-slate-200">
              Ctrl+J
            </kbd>
          </button>
        )}

        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
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
          onClick={onOpenHelp}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Help & ATS Guides"
        >
          <HelpCircle size={18} />
        </button>

        <button
          onClick={onAnalyzeNew}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-medium shadow-xs transition-colors"
        >
          <Plus size={16} />
          <span>Analyze New Resume</span>
        </button>
      </div>
    </header>
  );
};
