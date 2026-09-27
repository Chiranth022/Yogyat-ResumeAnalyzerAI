import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ProcessingModal } from './components/ProcessingModal';
import { HelpModal } from './components/HelpModal';
import { AiChatPanel } from './components/AiChatPanel';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { UploadPage } from './pages/UploadPage';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { JobMatchPage } from './pages/JobMatchPage';
import { SkillsPage } from './pages/SkillsPage';
import { SuggestionsPage } from './pages/SuggestionsPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { ErrorBoundary } from './components/ErrorBoundary';

import {
  analyzeResumeData,
  fetchAnalysisHistory,
  fetchAnalysisById,
  deleteAnalysisById,
  fetchSampleData,
} from './services/api';
import { AnalysisResult, HistoryItem } from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [helpOpen, setHelpOpen] = useState<boolean>(false);

  // User Profile
  const [userName, setUserName] = useState<string>('Alex Chen');
  const [userEmail, setUserEmail] = useState<string>('alex.chen@example.com');

  // Gemini AI Copilot Sidebar State
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gemini_copilot_open');
      if (saved !== null) return saved === 'true';
      return window.innerWidth >= 1024;
    }
    return true;
  });

  const [isCopilotDocked, setIsCopilotDocked] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gemini_copilot_docked');
      if (saved !== null) return saved === 'true';
      return window.innerWidth >= 1024;
    }
    return true;
  });

  const toggleCopilot = () => {
    setIsCopilotOpen((prev) => {
      const next = !prev;
      localStorage.setItem('gemini_copilot_open', String(next));
      return next;
    });
  };

  const toggleDock = () => {
    setIsCopilotDocked((prev) => {
      const next = !prev;
      localStorage.setItem('gemini_copilot_docked', String(next));
      return next;
    });
  };

  // Global hotkey Ctrl+J / Cmd+J to toggle Gemini Copilot
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        toggleCopilot();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Theme State ('light' | 'dark' | 'system')
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yogyat_theme') as 'light' | 'dark' | 'system' | null;
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        return saved;
      }
    }
    return 'light';
  });

  // Synchronize theme with document classes and localStorage
  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('yogyat_theme', theme);

    const applyTheme = () => {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (isDark) {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark');
        document.body.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
        document.body.classList.remove('dark');
        document.body.setAttribute('data-theme', 'light');
      }
    };

    applyTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Analysis State
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState<boolean>(false);
  const [isBackendProcessing, setIsBackendProcessing] = useState<boolean>(false);

  // Load initial history and active analysis on mount
  useEffect(() => {
    const initData = async () => {
      try {
        const historyData = await fetchAnalysisHistory();
        setHistory(historyData);

        if (historyData.length > 0) {
          const first = await fetchAnalysisById(historyData[0].id);
          setCurrentAnalysis(first);
        } else {
          // If no history exists, pre-load sample analysis from backend
          const sample = await fetchSampleData();
          const initialAnalysis = await analyzeResumeData(
            sample.sample_resume_text,
            sample.sample_job_description,
            sample.sample_filename,
            sample.sample_target_role
          );
          setCurrentAnalysis(initialAnalysis);
          const updatedHistory = await fetchAnalysisHistory();
          setHistory(updatedHistory);
        }
      } catch (err) {
        console.error('Initial data load error:', err);
      }
    };

    initData();
  }, []);

  // Handler for analyzing new resume
  const handleAnalyzeResume = async (
    resumeText: string,
    jobDescription: string,
    filename: string
  ) => {
    setIsProcessingModalOpen(true);
    setIsBackendProcessing(true);

    try {
      const result = await analyzeResumeData(resumeText, jobDescription, filename);
      setCurrentAnalysis(result);

      // Refresh history
      const updatedHistory = await fetchAnalysisHistory();
      setHistory(updatedHistory);
    } catch (err: any) {
      alert(`Analysis failed: ${err.message || 'Unknown error'}`);
      setIsProcessingModalOpen(false);
    } finally {
      setIsBackendProcessing(false);
    }
  };

  const handleProcessingComplete = () => {
    setIsProcessingModalOpen(false);
    setCurrentTab('analysis');
    setIsCopilotOpen(true); // Automatically expand the Gemini Copilot sidebar!
  };

  const handleSelectHistoryItem = async (id: string) => {
    try {
      const item = await fetchAnalysisById(id);
      setCurrentAnalysis(item);
      setCurrentTab('analysis');
    } catch (err) {
      alert('Failed to load analysis record.');
    }
  };

  const handleDeleteHistoryItem = async (id: string) => {
    if (window.confirm('Delete this analysis record?')) {
      try {
        await deleteAnalysisById(id);
        const updated = await fetchAnalysisHistory();
        setHistory(updated);
        if (currentAnalysis?.id === id) {
          if (updated.length > 0) {
            const next = await fetchAnalysisById(updated[0].id);
            setCurrentAnalysis(next);
          } else {
            setCurrentAnalysis(null);
          }
        }
      } catch {
        alert('Could not delete record.');
      }
    }
  };

  const handleDownloadReport = (item: HistoryItem) => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(currentAnalysis || item, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${item.filename.replace(/\.[^/.]+$/, '')}_Report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // If user is on the Landing Page, show full-bleed landing view without sidebar
  if (currentTab === 'landing') {
    return (
      <>
        <LandingPage
          onStartAnalysis={() => setCurrentTab('upload')}
          onExploreDemo={() => setCurrentTab('dashboard')}
          onOpenBuilder={() => setCurrentTab('builder')}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
        <AiChatPanel
          currentAnalysis={currentAnalysis}
          currentTab={currentTab}
          isOpen={isCopilotOpen}
          onClose={toggleCopilot}
          isDocked={false}
          onToggleDock={toggleDock}
          onNavigate={setCurrentTab}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onOpenHelp={() => setHelpOpen(true)}
        userName={userName}
        userEmail={userEmail}
      />

      {/* Main Content Area - dynamically adjusts padding when Gemini Copilot is docked */}
      <div
        className={`flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300 ${
          isCopilotOpen && isCopilotDocked ? 'lg:pr-[420px] xl:pr-[460px]' : ''
        }`}
      >
        {/* Sticky Top Header with Gemini Toggle & Theme Toggle */}
        <Header
          currentTab={currentTab}
          onOpenMobile={() => setMobileMenuOpen(true)}
          onAnalyzeNew={() => setCurrentTab('upload')}
          onOpenHelp={() => setHelpOpen(true)}
          isCopilotOpen={isCopilotOpen}
          onToggleCopilot={toggleCopilot}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Content Body Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <ErrorBoundary fallbackTab={() => setCurrentTab('dashboard')}>
            {currentTab === 'dashboard' && (
              <DashboardPage
                analysis={currentAnalysis}
                history={history}
                onNavigate={setCurrentTab}
                onSelectHistoryItem={handleSelectHistoryItem}
                onAnalyzeNew={() => setCurrentTab('upload')}
              />
            )}

            {currentTab === 'upload' && (
              <UploadPage
                onAnalyze={handleAnalyzeResume}
                isAnalyzing={isBackendProcessing}
              />
            )}

            {currentTab === 'builder' && (
              <ResumeBuilderPage
                currentAnalysis={currentAnalysis}
                onAnalyzeResume={(txt, jd, fn) => {
                  handleAnalyzeResume(txt, jd, fn);
                }}
              />
            )}

            {currentTab === 'analysis' && (
              <AnalysisPage
                analysis={currentAnalysis}
                onNavigate={setCurrentTab}
              />
            )}

            {currentTab === 'job-match' && (
              <JobMatchPage
                analysis={currentAnalysis}
                onNavigate={setCurrentTab}
              />
            )}

            {currentTab === 'skills' && (
              <SkillsPage analysis={currentAnalysis} />
            )}

            {currentTab === 'suggestions' && (
              <SuggestionsPage analysis={currentAnalysis} />
            )}

            {currentTab === 'history' && (
              <HistoryPage
                history={history}
                onSelect={handleSelectHistoryItem}
                onDelete={handleDeleteHistoryItem}
                onDownloadReport={handleDownloadReport}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsPage
                userName={userName}
                userEmail={userEmail}
                theme={theme}
                onUpdateTheme={setTheme}
                onUpdateProfile={(n, e) => {
                  setUserName(n);
                  setUserEmail(e);
                }}
                onHistoryCleared={() => {
                  setHistory([]);
                  setCurrentAnalysis(null);
                }}
              />
            )}
          </ErrorBoundary>
        </main>
      </div>

      {/* AI Processing Screen Modal */}
      <ProcessingModal
        isOpen={isProcessingModalOpen}
        onComplete={handleProcessingComplete}
        isBackendProcessing={isBackendProcessing}
      />

      {/* Help & Documentation Modal */}
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />

      {/* Gemini AI Career Copilot Sidebar */}
      <AiChatPanel
        currentAnalysis={currentAnalysis}
        currentTab={currentTab}
        isOpen={isCopilotOpen}
        onClose={toggleCopilot}
        isDocked={isCopilotDocked}
        onToggleDock={toggleDock}
        onNavigate={setCurrentTab}
      />
    </div>
  );
}

export default App;
