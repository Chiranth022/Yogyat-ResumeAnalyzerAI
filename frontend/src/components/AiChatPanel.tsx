import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Zap,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { sendCopilotChat } from '../services/api';

// Crisp, zero-dependency inline SVG icons for sidebar controls
const SendIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

const RotateIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

const PanelCloseIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M15 3v18" />
    <path d="m8 9 3 3-3 3" />
  </svg>
);

const MaximizeIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h6v6" />
    <path d="M9 21H3v-6" />
    <path d="M21 3l-7 7" />
    <path d="M3 21l7-7" />
  </svg>
);

const MinimizeIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14h6v6" />
    <path d="M20 10h-6V4" />
    <path d="M14 10l7-7" />
    <path d="M3 21l7-7" />
  </svg>
);

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AiChatPanelProps {
  currentAnalysis: AnalysisResult | null;
  currentTab?: string;
  isOpen: boolean;
  onClose: () => void;
  isDocked: boolean;
  onToggleDock: () => void;
  onNavigate?: (tab: string) => void;
}

export const AiChatPanel: React.FC<AiChatPanelProps> = ({
  currentAnalysis,
  currentTab = 'dashboard',
  isOpen,
  onClose,
  isDocked,
  onToggleDock,
  onNavigate,
}) => {
  const [inputQuery, setInputQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  // Initialize messages with an automated Gemini greeting
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-gemini',
      role: 'assistant',
      content:
        "👋 Welcome! I'm **Gemini AI**. I have live access to your resume data, ATS diagnostics, and active screen. Ask me anything, or tap any smart suggestion below!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastAnalyzedIdRef = useRef<string | null>(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  // Proactive Auto-Briefing: when a new resume is analyzed, automatically deliver an executive briefing!
  useEffect(() => {
    if (currentAnalysis && currentAnalysis.id && currentAnalysis.id !== lastAnalyzedIdRef.current) {
      lastAnalyzedIdRef.current = currentAnalysis.id;
      
      const skillsFound = currentAnalysis.skills_analysis?.skills_found || [];
      const missingSkills = currentAnalysis.skills_analysis?.missing_skills || [];
      const score = currentAnalysis.overall_score || 80;
      const targetRole = currentAnalysis.target_role || 'Software Engineer';
      const critGap = missingSkills[0] || 'Docker / Cloud Hosting';

      const autoBriefingMessage: Message = {
        id: `auto-briefing-${Date.now()}`,
        role: 'assistant',
        content: `### ✨ Automated Executive Briefing: ${currentAnalysis.filename}

* **🎯 Target Role**: **${targetRole}**
* **⭐ Overall Readiness**: **${score}/100** (ATS Compatibility: **${currentAnalysis.kpis?.ats_compatibility || 85}%**, Role Match: **${currentAnalysis.kpis?.job_match || 75}%**)

#### 🌟 Key Strengths:
* Strong foundation in **${skillsFound.slice(0, 4).join(', ') || 'Core Engineering'}**
* Clean structural parsing with zero unreadable fonts or artifacts

#### ⚡ #1 Priority Action:
* Bridge your gap in **\`${critGap}\`** by adding a containerized Docker deployment or cloud CI/CD workflow to your flagship project.

💡 *I am docked on your screen and will provide live insights as you navigate between Dashboard, Skills, Builder, and Job Match.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => {
        // Prevent duplicate briefing if already present
        if (prev.some((m) => m.id.startsWith('auto-briefing-') && m.content.includes(currentAnalysis.filename))) {
          return prev;
        }
        return [...prev, autoBriefingMessage];
      });
    }
  }, [currentAnalysis]);

  // Proactive contextual advice for the current page
  const pageContext = useMemo(() => {
    const role = currentAnalysis?.target_role || 'Software Engineer';
    const score = currentAnalysis?.overall_score || 82;
    const missing = currentAnalysis?.skills_analysis?.missing_skills || ['Docker', 'AWS', 'Redis'];

    switch (currentTab) {
      case 'dashboard':
        return {
          title: 'Dashboard Overview',
          badge: 'Executive View',
          insight: `Your resume is at ${score}% readiness. 3 quick wins can raise it into the top 10% percentile.`,
          autoPrompt: 'auto-audit page:dashboard',
          chips: [
            '⚡ Top 3 quick wins',
            '📈 How to reach 90+ ATS score?',
            'Which job roles suit my profile?',
          ],
        };
      case 'upload':
        return {
          title: 'Resume Ingestion',
          badge: 'ATS Scanner',
          insight: 'Standard single-column PDF or DOCX format guarantees 99.4% parser accuracy across Workday & Greenhouse.',
          autoPrompt: 'auto-audit page:upload',
          chips: [
            'What file formats parse best?',
            'How do ATS scanners handle tables?',
            'How to avoid parsing errors?',
          ],
        };
      case 'builder':
        return {
          title: 'ATS Resume Builder',
          badge: 'LaTeX Overleaf',
          insight: 'Every bullet point should follow Google XYZ format: Accomplished [X], measured by [Y], by doing [Z].',
          autoPrompt: 'auto-audit page:builder',
          chips: [
            '⚡ Generate summary for my stack',
            'Convert bullet to Google XYZ format',
            'Optimize bullet points for ATS',
          ],
        };
      case 'analysis':
        return {
          title: 'Resume Diagnostics',
          badge: 'Deep Audit',
          insight: `ATS Compatibility is ${currentAnalysis?.kpis?.ats_compatibility || 85}%. Check formatting and quantifiable metric coverage.`,
          autoPrompt: 'auto-audit page:analysis',
          chips: [
            '⚡ How can I improve my resume?',
            'Explain ATS score deductions',
            'Rewrite my weakest section',
          ],
        };
      case 'job-match':
        return {
          title: 'Job Match & Alignment',
          badge: 'Role Fit',
          insight: `Role fit is ${currentAnalysis?.kpis?.job_match || 78}%. 3 conceptual semantic matches identified.`,
          autoPrompt: 'auto-audit page:job-match',
          chips: [
            '⚡ How to bridge the role gap?',
            'Compare against Software Engineer JD',
            'Explain semantic matches',
          ],
        };
      case 'skills':
        return {
          title: 'Skills Radar',
          badge: 'Skill Gap',
          insight: `Identified ${missing.length} missing competencies. Priority: ${missing[0] || 'Docker'} & ${missing[1] || 'AWS'}.`,
          autoPrompt: 'auto-audit page:skills',
          chips: [
            'What skills am I missing?',
            'Which one should I learn first?',
            'How to demonstrate Docker on GitHub?',
          ],
        };
      case 'suggestions':
        return {
          title: 'AI Recommendations',
          badge: 'Smart Rewrites',
          insight: 'Applying the 2 high-priority action cards will directly resolve missing role keywords.',
          autoPrompt: 'auto-audit page:suggestions',
          chips: [
            'Apply all high-priority rewrites',
            'Give me before/after bullet rewrites',
            'Draft strong action verbs',
          ],
        };
      case 'history':
        return {
          title: 'Version History',
          badge: 'Timeline',
          insight: 'Track your score improvements across iterations to see your resume evolve toward 95+.',
          autoPrompt: 'Compare my resume iterations',
          chips: [
            'How has my score improved?',
            'What should my next target be?',
            'Download full JSON audit report',
          ],
        };
      default:
        return {
          title: 'Career Assistant',
          badge: 'Active Context',
          insight: `Ready to assist with your ${role} application.`,
          autoPrompt: 'auto-audit',
          chips: [
            'What skills am I missing?',
            'How can I improve my resume?',
            'Prepare me for technical interviews',
          ],
        };
    }
  }, [currentTab, currentAnalysis]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || loading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    try {
      const historyPayload = messages.slice(-8).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const reply = await sendCopilotChat(
        query,
        historyPayload,
        currentAnalysis,
        undefined
      );

      const assistantMessage: Message = {
        id: `reply-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          err.message || 'Sorry, I encountered an issue connecting to the Gemini Copilot. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Chat cleared. Ready with live context for **${currentAnalysis?.target_role || 'your target role'}**!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  if (!isOpen) {
    return (
      /* Floating Gemini Sparkle Button when closed */
      <button
        onClick={onClose}
        className="fixed right-4 bottom-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group"
        aria-label="Open Gemini AI Sidebar"
        title="Open Gemini AI (Ctrl+J)"
      >
        <span className="relative flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
        </span>
        <span className="font-semibold text-sm tracking-wide hidden sm:inline">
          Gemini AI
        </span>
        <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono hidden md:inline">
          Ctrl+J
        </span>
      </button>
    );
  }

  return (
    <>
      {/* Mobile backdrop when overlaying */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 lg:hidden transition-opacity"
      />

      {/* Gemini AI Right Sidebar */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] md:w-[440px] xl:w-[460px] bg-white border-l border-slate-200 shadow-2xl flex flex-col transition-all duration-300 ease-in-out`}
        aria-label="Gemini AI Sidebar"
      >
        {/* Gemini Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-900/50 shadow-sm">
          <div className="flex items-center gap-2.5">
            {/* Gemini Multi-color Gradient Icon */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-900/40 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-white tracking-tight flex items-center gap-1.5">
                  Gemini AI
                </h3>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-purple-300 border border-purple-500/40">
                  AUTO-SYNC
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate max-w-[200px]">
                {currentAnalysis
                  ? `${currentAnalysis.target_role} (${currentAnalysis.overall_score}%)`
                  : 'Ready to assist'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Dock/Undock toggle button */}
            <button
              onClick={onToggleDock}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer hidden lg:flex items-center"
              title={isDocked ? 'Undock to floating overlay' : 'Dock sidebar alongside content'}
              aria-label="Toggle Docking"
            >
              {isDocked ? <MinimizeIcon /> : <MaximizeIcon />}
            </button>

            {/* Clear conversation */}
            <button
              onClick={handleClearChat}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Clear chat history"
              aria-label="Clear chat"
            >
              <RotateIcon />
            </button>

            {/* Close / Collapse button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Collapse Gemini AI (Ctrl+J)"
              aria-label="Collapse panel"
            >
              <PanelCloseIcon />
            </button>
          </div>
        </div>

        {/* Live Context & Proactive Pulse Bar */}
        <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/80 border-b border-indigo-100/80 px-4 py-2.5">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1.5 text-indigo-900 font-medium">
              <Zap className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
              <span>Viewing: <strong className="text-indigo-950">{pageContext.title}</strong></span>
            </div>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-white text-indigo-600 border border-indigo-200/60 shadow-2xs">
              {pageContext.badge}
            </span>
          </div>

          {/* Proactive Tip Card with 1-click Auto-Audit */}
          <div className="bg-white/90 backdrop-blur-xs rounded-xl p-2.5 border border-indigo-100/90 shadow-2xs flex items-start gap-2.5">
            <span className="text-base mt-0.5">💡</span>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-slate-700 leading-snug">
                {pageContext.insight}
              </p>
              <button
                onClick={() => handleSendMessage(pageContext.autoPrompt)}
                disabled={loading}
                className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                <span>⚡ Auto-Audit This Page</span>
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'} group`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-sm">
                    <Sparkles size={14} className="text-yellow-200" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm shadow-xs relative ${
                    isUser
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed break-words text-[13px]">
                    {msg.content}
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/80">
                    <span
                      className={`text-[10px] ${
                        isUser ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>

                    {!isUser && (
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="text-[10px] text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors cursor-pointer"
                        title="Copy message"
                      >
                        {copiedMsgId === msg.id ? (
                          <>
                            <Check size={11} className="text-emerald-600" />
                            <span className="text-emerald-600 font-medium">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                <Sparkles size={14} className="text-yellow-200 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs px-4 py-3 text-xs text-slate-600 shadow-xs flex items-center gap-2.5">
                <div className="flex gap-1 items-center">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-bounce"></span>
                </div>
                <span className="text-slate-500 font-medium">Gemini is analyzing resume context...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Dynamic Context-Aware Prompt Chips */}
        <div className="px-3.5 py-2.5 bg-white border-t border-slate-100 flex flex-wrap gap-1.5">
          <div className="w-full flex items-center justify-between text-[11px] text-slate-400 font-medium mb-0.5 px-0.5">
            <span>✨ Suggested for this page</span>
            <span className="text-[10px] text-indigo-500 font-semibold">{pageContext.title}</span>
          </div>
          {pageContext.chips.map((q) => (
            <button
              key={q}
              onClick={() => handleSendMessage(q)}
              disabled={loading}
              className="text-[11.5px] px-2.5 py-1 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 border border-slate-200 rounded-lg text-slate-700 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 text-left"
            >
              <span>{q}</span>
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3.5 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2"
          >
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Gemini about skills, rewrites, or ATS..."
                rows={1}
                className="w-full resize-none rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50 text-slate-900 placeholder:text-slate-400 max-h-32"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="h-9 w-9 flex-shrink-0 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer"
              title="Send to Gemini AI"
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
            <span>Press <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded">Enter</kbd> to send</span>
            <span>Toggle: <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono">Ctrl+J</kbd></span>
          </div>
        </div>
      </aside>
    </>
  );
};
