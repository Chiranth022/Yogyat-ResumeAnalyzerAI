import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  Sparkles,
  Plus,
  Trash2,
  Check,
  ExternalLink,
  Layers,
  Briefcase,
  Award,
  User,
  CheckCircle2,
  Zap,
} from 'lucide-react';

const Printer = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect width="12" height="8" x="6" y="14" />
  </svg>
);

const RefreshCw = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
);

const Code2 = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const ChevronDown = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ChevronUp = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const GraduationCap = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const FolderGit2 = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    <circle cx="12" cy="13" r="2" />
    <path d="M14 13h3" />
  </svg>
);

const Sliders = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" x2="4" y1="21" y2="14" />
    <line x1="4" x2="4" y1="10" y2="3" />
    <line x1="12" x2="12" y1="21" y2="12" />
    <line x1="12" x2="12" y1="8" y2="3" />
    <line x1="20" x2="20" y1="21" y2="16" />
    <line x1="20" x2="20" y1="12" y2="3" />
    <line x1="1" x2="7" y1="14" y2="14" />
    <line x1="9" x2="15" y1="8" y2="8" />
    <line x1="17" x2="23" y1="16" y2="16" />
  </svg>
);
import {
  ResumeData,
  TemplateStyle,
  FontChoice,
  SpacingChoice,
  ResumeExperience,
  ResumeEducation,
  ResumeProject,
} from '../types/resumeBuilder';
import { INITIAL_RESUME_DATA } from '../utils/sampleResumeData';
import { generateLatexCode } from '../utils/latexGenerator';
import { importFromAnalysis } from '../utils/analysisImporter';
import { AnalysisResult } from '../types';
import { downloadResumePdf } from '../services/api';

interface ResumeBuilderPageProps {
  currentAnalysis: AnalysisResult | null;
  onAnalyzeResume?: (text: string, jobDesc: string, filename: string) => void;
}

export const ResumeBuilderPage: React.FC<ResumeBuilderPageProps> = ({
  currentAnalysis,
  onAnalyzeResume,
}) => {
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [template, setTemplate] = useState<TemplateStyle>('jakes');
  const [fontChoice, setFontChoice] = useState<FontChoice>('serif');
  const [spacing, setSpacing] = useState<SpacingChoice>('compact');
  const [activeTab, setActiveTab] = useState<'form' | 'latex'>('form');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Accordion open/collapse states
  const [openSections, setOpenSections] = useState({
    contact: true,
    summary: false,
    experience: true,
    projects: true,
    education: true,
    skills: true,
    certifications: false,
  });

  // Action feedback states
  const [copiedLatex, setCopiedLatex] = useState(false);
  const [copiedPlainText, setCopiedPlainText] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Convert current resume state into plain text for testing in analyzer or copying
  const generatePlainTextResume = (): string => {
    const c = resumeData.contact;
    let out = `${c.fullName}\n${c.jobTitle}\n${c.email} | ${c.phone} | ${c.location} | ${c.linkedin} | ${c.github}\n\n`;

    if (resumeData.summary) {
      out += `PROFESSIONAL SUMMARY\n${resumeData.summary}\n\n`;
    }

    if (resumeData.experience.length > 0) {
      out += `EXPERIENCE\n`;
      resumeData.experience.forEach((exp) => {
        out += `${exp.position} - ${exp.company}, ${exp.location} (${exp.startDate} - ${exp.endDate})\n`;
        exp.bullets.forEach((b) => {
          if (b.trim()) out += `• ${b}\n`;
        });
        out += '\n';
      });
    }

    if (resumeData.projects.length > 0) {
      out += `PROJECTS\n`;
      resumeData.projects.forEach((proj) => {
        out += `${proj.name} | ${proj.technologies}\n`;
        proj.bullets.forEach((b) => {
          if (b.trim()) out += `• ${b}\n`;
        });
        out += '\n';
      });
    }

    if (resumeData.education.length > 0) {
      out += `EDUCATION\n`;
      resumeData.education.forEach((edu) => {
        out += `${edu.degree} - ${edu.institution}, ${edu.location} (${edu.startDate} - ${edu.endDate})\n`;
        if (edu.gpa) out += `GPA: ${edu.gpa}\n`;
        if (edu.coursework) out += `Coursework: ${edu.coursework}\n`;
        out += '\n';
      });
    }

    if (resumeData.skills) {
      out += `TECHNICAL SKILLS\n`;
      if (resumeData.skills.languages) out += `Languages: ${resumeData.skills.languages}\n`;
      if (resumeData.skills.frameworks) out += `Frameworks: ${resumeData.skills.frameworks}\n`;
      if (resumeData.skills.developerTools) out += `Developer Tools: ${resumeData.skills.developerTools}\n`;
      if (resumeData.skills.librariesCloud) out += `Libraries & Cloud: ${resumeData.skills.librariesCloud}\n`;
      out += '\n';
    }

    if (resumeData.certifications.length > 0) {
      out += `CERTIFICATIONS\n`;
      resumeData.certifications.forEach((c) => (out += `• ${c}\n`));
    }

    return out;
  };

  // Generate current LaTeX code
  const latexCode = generateLatexCode(resumeData, template, fontChoice);

  // Copy LaTeX code to clipboard
  const handleCopyLatex = () => {
    navigator.clipboard.writeText(latexCode);
    setCopiedLatex(true);
    showNotification('LaTeX code copied! Paste directly into an Overleaf project.');
    setTimeout(() => setCopiedLatex(false), 2000);
  };

  // Copy Plain Text
  const handleCopyPlainText = () => {
    const text = generatePlainTextResume();
    navigator.clipboard.writeText(text);
    setCopiedPlainText(true);
    showNotification('Plain text resume copied to clipboard!');
    setTimeout(() => setCopiedPlainText(false), 2000);
  };

  // Download .tex file
  const handleDownloadTex = () => {
    const element = document.createElement('a');
    const file = new Blob([latexCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${resumeData.contact.fullName.replace(/\s+/g, '_')}_Resume.tex`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showNotification('Downloaded resume.tex file!');
  };

  // Direct Vector PDF Download (Text-Selectable with Clickable Links)
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    showNotification('Generating authentic ATS PDF with selectable text & clickable links...');

    try {
      // Call backend vector generator for authentic text-selectable PDF with active hyperlinks
      await downloadResumePdf(resumeData, fontChoice);
      showNotification('ATS Resume PDF downloaded successfully!');
    } catch (err) {
      console.error('Backend vector generator error:', err);
      showNotification('Error generating PDF. Please ensure the server is active.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Print / Save as PDF
  const handlePrint = () => {
    window.print();
  };

  // Import from existing analysis
  const handleImportAnalysis = () => {
    if (!currentAnalysis) {
      alert('No active analysis found. Please run an analysis first or use the sample template.');
      return;
    }
    const imported = importFromAnalysis(currentAnalysis, resumeData.contact.fullName, resumeData.contact.email);
    setResumeData(imported);
    showNotification('Imported skills and details from your Yogyat analysis!');
  };

  // Reset to default sample
  const handleResetSample = () => {
    if (window.confirm('Reset resume to the default Jake\'s Overleaf sample?')) {
      setResumeData(INITIAL_RESUME_DATA);
      showNotification('Loaded Jake\'s Resume sample data.');
    }
  };

  // Calculate ATS metrics for live checker
  const allBullets = [
    ...resumeData.experience.flatMap((e) => e.bullets),
    ...resumeData.projects.flatMap((p) => p.bullets),
  ];
  const bulletCount = allBullets.filter((b) => b.trim().length > 0).length;
  const metricsCount = allBullets.filter((b) => /\d+%|\$[\d,]+|\b\d+x\b|\b\d+\s*(ms|s|hours|days|requests|users|squads)\b/i.test(b)).length;
  const actionVerbsList = ['Architected', 'Engineered', 'Deployed', 'Refactored', 'Spearheaded', 'Optimized', 'Automated', 'Constructed', 'Built', 'Implemented', 'Developed', 'Integrated'];
  const actionVerbsFound = actionVerbsList.filter((v) => allBullets.some((b) => new RegExp(`\\b${v}\\b`, 'i').test(b))).length;

  return (
    <div className="space-y-6">
      {/* Status toast notification */}
      {statusMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-sm border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200 no-print">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              ATS Resume Builder
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Sparkles size={12} />
              Overleaf Standard
            </span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
              Jake's Resume LaTeX Format
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Engineered for 100% ATS readability, single-column parsing, and instant export to Overleaf or print PDF.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {currentAnalysis && (
            <button
              onClick={handleImportAnalysis}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 transition-colors"
              title="Auto-fill detected skills and target role from your Yogyat analysis"
            >
              <Zap size={14} className="text-blue-600" />
              <span>Import from Analysis</span>
            </button>
          )}

          <button
            onClick={handleResetSample}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 transition-colors"
            title="Reset to standard Jake's Resume software engineer sample"
          >
            <RefreshCw size={14} />
            <span>Load Sample</span>
          </button>

          <button
            onClick={handleCopyLatex}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 shadow-2xs transition-colors"
            title="Copy pure LaTeX source code to paste into Overleaf"
          >
            {copiedLatex ? <Check size={14} className="text-emerald-600" /> : <Code2 size={14} className="text-blue-600" />}
            <span>{copiedLatex ? 'Copied LaTeX!' : 'Copy LaTeX'}</span>
          </button>

          <button
            onClick={handleDownloadTex}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 shadow-2xs transition-colors"
            title="Download resume.tex file for Overleaf"
          >
            <Download size={14} className="text-slate-600" />
            <span>Download .tex</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            title="Download ATS-compliant PDF file directly to your device"
          >
            {isGeneratingPdf ? (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download size={14} />
            )}
            <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 transition-colors"
            title="Open browser print dialog to save as clean ATS PDF"
          >
            <Printer size={14} />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Editor & Preview Split Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Side: Form Editor or LaTeX Code View (5 or 6 cols on xl) */}
        <div className="xl:col-span-5 space-y-4 no-print editor-panel">
          {/* Editor Header Navigation & Mode Selector */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('form')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  activeTab === 'form'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sliders size={14} />
                <span>Visual Form</span>
              </button>
              <button
                onClick={() => setActiveTab('latex')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  activeTab === 'latex'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code2 size={14} />
                <span>LaTeX Code (.tex)</span>
              </button>
            </div>

            {/* Typography / Font Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium hidden sm:inline">Font:</span>
              <select
                value={fontChoice}
                onChange={(e) => setFontChoice(e.target.value as FontChoice)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="serif">Computer Modern (Serif)</option>
                <option value="sans">Roboto / Inter (Sans)</option>
              </select>
            </div>
          </div>

          {/* TAB 1: FORM EDITOR */}
          {activeTab === 'form' && (
            <div className="space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              {/* 1. Contact Information */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
                <button
                  onClick={() => toggleSection('contact')}
                  className="w-full px-4 py-3.5 flex items-center justify-between text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <User size={16} className="text-blue-600" />
                    <span className="text-sm">Personal & Contact Info</span>
                  </div>
                  {openSections.contact ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>

                {openSections.contact && (
                  <div className="p-4 pt-1 border-t border-slate-100 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={resumeData.contact.fullName}
                          onChange={(e) => setResumeData({ ...resumeData, contact: { ...resumeData.contact, fullName: e.target.value } })}
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden"
                          placeholder="e.g. Alex Chen"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Job Title / Target Role</label>
                        <input
                          type="text"
                          value={resumeData.contact.jobTitle}
                          onChange={(e) => setResumeData({ ...resumeData, contact: { ...resumeData.contact, jobTitle: e.target.value } })}
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden"
                          placeholder="e.g. Software Engineer"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email</label>
                        <input
                          type="email"
                          value={resumeData.contact.email}
                          onChange={(e) => setResumeData({ ...resumeData, contact: { ...resumeData.contact, email: e.target.value } })}
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden"
                          placeholder="alex.chen@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phone</label>
                        <input
                          type="text"
                          value={resumeData.contact.phone}
                          onChange={(e) => setResumeData({ ...resumeData, contact: { ...resumeData.contact, phone: e.target.value } })}
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden"
                          placeholder="+1 (555) 234-5678"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Location</label>
                        <input
                          type="text"
                          value={resumeData.contact.location}
                          onChange={(e) => setResumeData({ ...resumeData, contact: { ...resumeData.contact, location: e.target.value } })}
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden"
                          placeholder="San Francisco, CA"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">LinkedIn URL</label>
                        <input
                          type="text"
                          value={resumeData.contact.linkedin}
                          onChange={(e) => setResumeData({ ...resumeData, contact: { ...resumeData.contact, linkedin: e.target.value } })}
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden"
                          placeholder="linkedin.com/in/alexchen"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">GitHub URL</label>
                        <input
                          type="text"
                          value={resumeData.contact.github}
                          onChange={(e) => setResumeData({ ...resumeData, contact: { ...resumeData.contact, github: e.target.value } })}
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden"
                          placeholder="github.com/alexchen"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Portfolio / Website</label>
                        <input
                          type="text"
                          value={resumeData.contact.portfolio}
                          onChange={(e) => setResumeData({ ...resumeData, contact: { ...resumeData.contact, portfolio: e.target.value } })}
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden"
                          placeholder="alexchen.dev"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Professional Summary */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
                <button
                  onClick={() => toggleSection('summary')}
                  className="w-full px-4 py-3.5 flex items-center justify-between text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText size={16} className="text-blue-600" />
                    <span className="text-sm">Professional Summary</span>
                    <span className="text-[10px] font-normal text-slate-400">(Optional)</span>
                  </div>
                  {openSections.summary ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>

                {openSections.summary && (
                  <div className="p-4 pt-1 border-t border-slate-100">
                    <textarea
                      rows={3}
                      value={resumeData.summary}
                      onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                      placeholder="Brief 2-3 sentence overview of your domain expertise, core skills, and quantifiable achievements..."
                      className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden leading-relaxed"
                    />
                  </div>
                )}
              </div>

              {/* 3. Work Experience */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
                <button
                  onClick={() => toggleSection('experience')}
                  className="w-full px-4 py-3.5 flex items-center justify-between text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Briefcase size={16} className="text-blue-600" />
                    <span className="text-sm">Experience</span>
                    <span className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded-full font-medium">
                      {resumeData.experience.length}
                    </span>
                  </div>
                  {openSections.experience ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>

                {openSections.experience && (
                  <div className="p-4 pt-1 border-t border-slate-100 space-y-5">
                    {resumeData.experience.map((exp, expIdx) => (
                      <div key={exp.id} className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">
                            #{expIdx + 1} {exp.company || 'New Company'}
                          </span>
                          <button
                            onClick={() => {
                              const updated = resumeData.experience.filter((_, i) => i !== expIdx);
                              setResumeData({ ...resumeData, experience: updated });
                            }}
                            className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                            title="Remove job"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              const updated = [...resumeData.experience];
                              updated[expIdx].company = e.target.value;
                              setResumeData({ ...resumeData, experience: updated });
                            }}
                            placeholder="Company Name"
                            className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500"
                          />
                          <input
                            type="text"
                            value={exp.position}
                            onChange={(e) => {
                              const updated = [...resumeData.experience];
                              updated[expIdx].position = e.target.value;
                              setResumeData({ ...resumeData, experience: updated });
                            }}
                            placeholder="Job Title"
                            className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500"
                          />
                          <input
                            type="text"
                            value={exp.location}
                            onChange={(e) => {
                              const updated = [...resumeData.experience];
                              updated[expIdx].location = e.target.value;
                              setResumeData({ ...resumeData, experience: updated });
                            }}
                            placeholder="Location (e.g. San Francisco, CA)"
                            className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500"
                          />
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={exp.startDate}
                              onChange={(e) => {
                                const updated = [...resumeData.experience];
                                updated[expIdx].startDate = e.target.value;
                                setResumeData({ ...resumeData, experience: updated });
                              }}
                              placeholder="Start Date (e.g. Jun 2022)"
                              className="w-1/2 text-xs px-2 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500"
                            />
                            <input
                              type="text"
                              value={exp.endDate}
                              onChange={(e) => {
                                const updated = [...resumeData.experience];
                                updated[expIdx].endDate = e.target.value;
                                setResumeData({ ...resumeData, experience: updated });
                              }}
                              placeholder="End Date (e.g. Present)"
                              className="w-1/2 text-xs px-2 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500"
                            />
                          </div>
                        </div>

                        {/* Bullets */}
                        <div className="space-y-2 pt-1">
                          <label className="block text-[11px] font-semibold text-slate-600">
                            Bullet Points (Impact & Quantifiable Metrics)
                          </label>
                          {exp.bullets.map((b, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-1.5">
                              <span className="text-slate-400 text-xs mt-1.5">•</span>
                              <textarea
                                rows={2}
                                value={b}
                                onChange={(e) => {
                                  const updated = [...resumeData.experience];
                                  updated[expIdx].bullets[bIdx] = e.target.value;
                                  setResumeData({ ...resumeData, experience: updated });
                                }}
                                placeholder="Describe your achievements using action verbs and quantifiable results..."
                                className="flex-1 text-xs p-2 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500 leading-snug"
                              />
                              <button
                                onClick={() => {
                                  const updated = [...resumeData.experience];
                                  updated[expIdx].bullets = updated[expIdx].bullets.filter((_, i) => i !== bIdx);
                                  setResumeData({ ...resumeData, experience: updated });
                                }}
                                className="text-slate-400 hover:text-rose-600 p-1 mt-1 transition-colors"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}

                          <button
                            onClick={() => {
                              const updated = [...resumeData.experience];
                              updated[expIdx].bullets.push('');
                              setResumeData({ ...resumeData, experience: updated });
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 py-1"
                          >
                            <Plus size={13} />
                            <span>Add Bullet Point</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        const newExp: ResumeExperience = {
                          id: `exp-${Date.now()}`,
                          company: '',
                          position: '',
                          location: '',
                          startDate: '',
                          endDate: 'Present',
                          bullets: [''],
                        };
                        setResumeData({ ...resumeData, experience: [...resumeData.experience, newExp] });
                      }}
                      className="w-full py-2 border border-dashed border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus size={14} />
                      <span>Add Work Experience</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 4. Projects */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
                <button
                  onClick={() => toggleSection('projects')}
                  className="w-full px-4 py-3.5 flex items-center justify-between text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FolderGit2 size={16} className="text-blue-600" />
                    <span className="text-sm">Projects</span>
                    <span className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded-full font-medium">
                      {resumeData.projects.length}
                    </span>
                  </div>
                  {openSections.projects ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>

                {openSections.projects && (
                  <div className="p-4 pt-1 border-t border-slate-100 space-y-4">
                    {resumeData.projects.map((proj, pIdx) => (
                      <div key={proj.id} className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">
                            #{pIdx + 1} {proj.name || 'Project Name'}
                          </span>
                          <button
                            onClick={() => {
                              const updated = resumeData.projects.filter((_, i) => i !== pIdx);
                              setResumeData({ ...resumeData, projects: updated });
                            }}
                            className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <input
                            type="text"
                            value={proj.name}
                            onChange={(e) => {
                              const updated = [...resumeData.projects];
                              updated[pIdx].name = e.target.value;
                              setResumeData({ ...resumeData, projects: updated });
                            }}
                            placeholder="Project Title"
                            className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500"
                          />
                          <input
                            type="text"
                            value={proj.technologies}
                            onChange={(e) => {
                              const updated = [...resumeData.projects];
                              updated[pIdx].technologies = e.target.value;
                              setResumeData({ ...resumeData, projects: updated });
                            }}
                            placeholder="Technologies (e.g. Python, FastAPI, Docker)"
                            className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500"
                          />
                          <input
                            type="text"
                            value={proj.link || ''}
                            onChange={(e) => {
                              const updated = [...resumeData.projects];
                              updated[pIdx].link = e.target.value;
                              setResumeData({ ...resumeData, projects: updated });
                            }}
                            placeholder="Link / GitHub (e.g. github.com/user/project)"
                            className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500"
                          />
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={proj.startDate || ''}
                              onChange={(e) => {
                                const updated = [...resumeData.projects];
                                updated[pIdx].startDate = e.target.value;
                                setResumeData({ ...resumeData, projects: updated });
                              }}
                              placeholder="Start Date"
                              className="w-1/2 text-xs px-2 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500"
                            />
                            <input
                              type="text"
                              value={proj.endDate || ''}
                              onChange={(e) => {
                                const updated = [...resumeData.projects];
                                updated[pIdx].endDate = e.target.value;
                                setResumeData({ ...resumeData, projects: updated });
                              }}
                              placeholder="End Date"
                              className="w-1/2 text-xs px-2 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500"
                            />
                          </div>
                        </div>

                        {/* Bullets */}
                        <div className="space-y-2 pt-1">
                          {proj.bullets.map((b, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-1.5">
                              <span className="text-slate-400 text-xs mt-1.5">•</span>
                              <textarea
                                rows={2}
                                value={b}
                                onChange={(e) => {
                                  const updated = [...resumeData.projects];
                                  updated[pIdx].bullets[bIdx] = e.target.value;
                                  setResumeData({ ...resumeData, projects: updated });
                                }}
                                placeholder="Key achievement or technical implementation..."
                                className="flex-1 text-xs p-2 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500 leading-snug"
                              />
                              <button
                                onClick={() => {
                                  const updated = [...resumeData.projects];
                                  updated[pIdx].bullets = updated[pIdx].bullets.filter((_, i) => i !== bIdx);
                                  setResumeData({ ...resumeData, projects: updated });
                                }}
                                className="text-slate-400 hover:text-rose-600 p-1 mt-1 transition-colors"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}

                          <button
                            onClick={() => {
                              const updated = [...resumeData.projects];
                              updated[pIdx].bullets.push('');
                              setResumeData({ ...resumeData, projects: updated });
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 py-1"
                          >
                            <Plus size={13} />
                            <span>Add Project Bullet</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        const newProj: ResumeProject = {
                          id: `proj-${Date.now()}`,
                          name: '',
                          technologies: '',
                          bullets: [''],
                        };
                        setResumeData({ ...resumeData, projects: [...resumeData.projects, newProj] });
                      }}
                      className="w-full py-2 border border-dashed border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus size={14} />
                      <span>Add Project</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 5. Education */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
                <button
                  onClick={() => toggleSection('education')}
                  className="w-full px-4 py-3.5 flex items-center justify-between text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <GraduationCap size={16} className="text-blue-600" />
                    <span className="text-sm">Education</span>
                    <span className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded-full font-medium">
                      {resumeData.education.length}
                    </span>
                  </div>
                  {openSections.education ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>

                {openSections.education && (
                  <div className="p-4 pt-1 border-t border-slate-100 space-y-4">
                    {resumeData.education.map((edu, eduIdx) => (
                      <div key={edu.id} className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">
                            #{eduIdx + 1} {edu.institution || 'University'}
                          </span>
                          <button
                            onClick={() => {
                              const updated = resumeData.education.filter((_, i) => i !== eduIdx);
                              setResumeData({ ...resumeData, education: updated });
                            }}
                            className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => {
                              const updated = [...resumeData.education];
                              updated[eduIdx].institution = e.target.value;
                              setResumeData({ ...resumeData, education: updated });
                            }}
                            placeholder="University / College"
                            className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500"
                          />
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const updated = [...resumeData.education];
                              updated[eduIdx].degree = e.target.value;
                              setResumeData({ ...resumeData, education: updated });
                            }}
                            placeholder="Degree & Major (e.g. B.S. in Computer Science)"
                            className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500"
                          />
                          <input
                            type="text"
                            value={edu.location}
                            onChange={(e) => {
                              const updated = [...resumeData.education];
                              updated[eduIdx].location = e.target.value;
                              setResumeData({ ...resumeData, education: updated });
                            }}
                            placeholder="Location (e.g. Berkeley, CA)"
                            className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500"
                          />
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={edu.startDate}
                              onChange={(e) => {
                                const updated = [...resumeData.education];
                                updated[eduIdx].startDate = e.target.value;
                                setResumeData({ ...resumeData, education: updated });
                              }}
                              placeholder="Start Date"
                              className="w-1/2 text-xs px-2 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500"
                            />
                            <input
                              type="text"
                              value={edu.endDate}
                              onChange={(e) => {
                                const updated = [...resumeData.education];
                                updated[eduIdx].endDate = e.target.value;
                                setResumeData({ ...resumeData, education: updated });
                              }}
                              placeholder="Graduation Date"
                              className="w-1/2 text-xs px-2 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500"
                            />
                          </div>
                          <input
                            type="text"
                            value={edu.gpa || ''}
                            onChange={(e) => {
                              const updated = [...resumeData.education];
                              updated[eduIdx].gpa = e.target.value;
                              setResumeData({ ...resumeData, education: updated });
                            }}
                            placeholder="GPA (e.g. 3.85 / 4.0)"
                            className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500"
                          />
                          <input
                            type="text"
                            value={edu.coursework || ''}
                            onChange={(e) => {
                              const updated = [...resumeData.education];
                              updated[eduIdx].coursework = e.target.value;
                              setResumeData({ ...resumeData, education: updated });
                            }}
                            placeholder="Relevant Coursework (comma separated)"
                            className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500"
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        const newEdu: ResumeEducation = {
                          id: `edu-${Date.now()}`,
                          institution: '',
                          degree: '',
                          location: '',
                          startDate: '',
                          endDate: '',
                        };
                        setResumeData({ ...resumeData, education: [...resumeData.education, newEdu] });
                      }}
                      className="w-full py-2 border border-dashed border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus size={14} />
                      <span>Add Education</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 6. Technical Skills */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
                <button
                  onClick={() => toggleSection('skills')}
                  className="w-full px-4 py-3.5 flex items-center justify-between text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Layers size={16} className="text-blue-600" />
                    <span className="text-sm">Technical Skills Taxonomy</span>
                  </div>
                  {openSections.skills ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>

                {openSections.skills && (
                  <div className="p-4 pt-1 border-t border-slate-100 space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Languages (comma separated)
                      </label>
                      <input
                        type="text"
                        value={resumeData.skills.languages}
                        onChange={(e) => setResumeData({ ...resumeData, skills: { ...resumeData.skills, languages: e.target.value } })}
                        placeholder="Python, TypeScript, JavaScript, Go, SQL, C++, HTML5, CSS3"
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Frameworks & Libraries (comma separated)
                      </label>
                      <input
                        type="text"
                        value={resumeData.skills.frameworks}
                        onChange={(e) => setResumeData({ ...resumeData, skills: { ...resumeData.skills, frameworks: e.target.value } })}
                        placeholder="FastAPI, React, Django, Express, Node.js, Next.js, Tailwind CSS"
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Developer Tools & Platforms
                      </label>
                      <input
                        type="text"
                        value={resumeData.skills.developerTools}
                        onChange={(e) => setResumeData({ ...resumeData, skills: { ...resumeData.skills, developerTools: e.target.value } })}
                        placeholder="Git, Docker, Kubernetes, Linux, AWS, CI/CD, Terraform"
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Databases, Architecture & Cloud
                      </label>
                      <input
                        type="text"
                        value={resumeData.skills.librariesCloud}
                        onChange={(e) => setResumeData({ ...resumeData, skills: { ...resumeData.skills, librariesCloud: e.target.value } })}
                        placeholder="PostgreSQL, Redis, Apache Kafka, Elasticsearch, REST APIs, Microservices"
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 7. Certifications */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
                <button
                  onClick={() => toggleSection('certifications')}
                  className="w-full px-4 py-3.5 flex items-center justify-between text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Award size={16} className="text-blue-600" />
                    <span className="text-sm">Certifications & Honors</span>
                    <span className="text-[10px] font-normal text-slate-400">({resumeData.certifications.length})</span>
                  </div>
                  {openSections.certifications ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>

                {openSections.certifications && (
                  <div className="p-4 pt-1 border-t border-slate-100 space-y-2">
                    {resumeData.certifications.map((cert, cIdx) => (
                      <div key={cIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={cert}
                          onChange={(e) => {
                            const updated = [...resumeData.certifications];
                            updated[cIdx] = e.target.value;
                            setResumeData({ ...resumeData, certifications: updated });
                          }}
                          placeholder="e.g. AWS Certified Solutions Architect (2024)"
                          className="flex-1 text-xs px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500"
                        />
                        <button
                          onClick={() => {
                            const updated = resumeData.certifications.filter((_, i) => i !== cIdx);
                            setResumeData({ ...resumeData, certifications: updated });
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setResumeData({ ...resumeData, certifications: [...resumeData.certifications, ''] })}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 py-1"
                    >
                      <Plus size={13} />
                      <span>Add Certification</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: LATEX CODE EDITOR */}
          {activeTab === 'latex' && (
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-sm flex flex-col h-[calc(100vh-220px)]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span className="text-xs font-mono text-slate-300">resume.tex (Overleaf Jake's Format)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLatex}
                    className="flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-white px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
                  >
                    {copiedLatex ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedLatex ? 'Copied' : 'Copy'}</span>
                  </button>
                  <a
                    href="https://www.overleaf.com/docs"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-400 hover:underline"
                  >
                    <span>Overleaf Docs</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
              <textarea
                readOnly
                value={latexCode}
                className="flex-1 mt-3 w-full bg-transparent text-slate-200 font-mono text-[11px] leading-relaxed p-1 focus:outline-hidden resize-none selection:bg-blue-600 selection:text-white"
              />
              <div className="pt-2 text-[10px] text-slate-500 flex justify-between items-center border-t border-slate-800">
                <span>UTF-8 • LaTeX Document</span>
                <span>{latexCode.length} characters</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Live Overleaf-Grade Resume Sheet Preview (7 cols on xl) */}
        <div className="xl:col-span-7 space-y-4">
          {/* Preview Toolbar */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
            {/* ATS Quality Pills */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                <CheckCircle2 size={13} />
                <span>100% ATS Single-Column</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 font-medium">
                <span>{metricsCount} Quantified Metrics</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 font-medium">
                <span>{actionVerbsFound} Strong Action Verbs</span>
              </span>
            </div>

            {/* Quick Export & Zoom */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold px-3 py-1 rounded-md shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                title="Download ATS Resume PDF directly"
              >
                {isGeneratingPdf ? (
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download size={13} />
                )}
                <span>Download PDF</span>
              </button>

              <button
                onClick={handleCopyPlainText}
                className="text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors"
                title="Copy plain text for quick ATS portal paste"
              >
                {copiedPlainText ? 'Copied Text!' : 'Copy Text'}
              </button>
              <div className="flex items-center border border-slate-200 rounded-md overflow-hidden text-xs">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
                  className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold"
                  title="Zoom Out"
                >
                  -
                </button>
                <span className="px-2 py-1 bg-white text-slate-600 font-mono text-[11px]">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                  className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold"
                  title="Zoom In"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* The Resume Sheet Container */}
          <div className="resume-sheet-wrapper overflow-x-auto pb-8 flex justify-center bg-slate-200/60 p-4 sm:p-6 rounded-2xl border border-slate-300/80">
            {/* Authentic 8.5 x 11 inch Document Container */}
            <div
              id="resume-preview-sheet"
              style={{
                width: '8.5in',
                minHeight: '11in',
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
              }}
              className={`print-sheet bg-white text-black p-[0.45in] shadow-2xl rounded-xs border border-slate-300 transition-transform duration-150 ${
                fontChoice === 'serif' ? 'font-latex-serif' : 'font-latex-sans'
              }`}
            >
              {/* Header / Contact Area */}
              <div className="text-center pb-3 border-b-0 border-black">
                <h1 className="text-2xl sm:text-[25px] font-bold tracking-tight" style={{ fontVariant: 'small-caps' }}>
                  {resumeData.contact.fullName || 'Your Name'}
                </h1>
                {resumeData.contact.jobTitle && (
                  <p className="text-xs italic text-slate-700 font-medium mt-0.5">
                    {resumeData.contact.jobTitle}
                  </p>
                )}

                {/* Contact links bar */}
                <div className="mt-1 text-[11px] text-slate-900 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 leading-snug">
                  {resumeData.contact.phone && <span>{resumeData.contact.phone}</span>}
                  {resumeData.contact.email && (
                    <>
                      <span>|</span>
                      <a href={`mailto:${resumeData.contact.email}`} className="text-slate-900 hover:underline">
                        {resumeData.contact.email}
                      </a>
                    </>
                  )}
                  {resumeData.contact.linkedin && (
                    <>
                      <span>|</span>
                      <a
                        href={resumeData.contact.linkedin.startsWith('http') ? resumeData.contact.linkedin : `https://${resumeData.contact.linkedin}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-900 hover:underline"
                      >
                        {resumeData.contact.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                      </a>
                    </>
                  )}
                  {resumeData.contact.github && (
                    <>
                      <span>|</span>
                      <a
                        href={resumeData.contact.github.startsWith('http') ? resumeData.contact.github : `https://${resumeData.contact.github}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-900 hover:underline"
                      >
                        {resumeData.contact.github.replace(/^https?:\/\/(www\.)?/, '')}
                      </a>
                    </>
                  )}
                  {resumeData.contact.portfolio && (
                    <>
                      <span>|</span>
                      <a
                        href={resumeData.contact.portfolio.startsWith('http') ? resumeData.contact.portfolio : `https://${resumeData.contact.portfolio}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-900 hover:underline"
                      >
                        {resumeData.contact.portfolio.replace(/^https?:\/\/(www\.)?/, '')}
                      </a>
                    </>
                  )}
                  {resumeData.contact.location && (
                    <>
                      <span>|</span>
                      <span>{resumeData.contact.location}</span>
                    </>
                  )}
                </div>
              </div>

              {/* SECTION: SUMMARY (if provided) */}
              {resumeData.summary && resumeData.summary.trim() && (
                <div className="mt-3">
                  <div className="border-b border-black pb-0.5 mb-1.5 flex items-center justify-between">
                    <h2 className="text-[13px] font-bold tracking-wider" style={{ fontVariant: 'small-caps' }}>
                      Professional Summary
                    </h2>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-900 text-left">
                    {resumeData.summary}
                  </p>
                </div>
              )}

              {/* SECTION: EDUCATION */}
              {resumeData.education && resumeData.education.length > 0 && (
                <div className="mt-3.5">
                  <div className="border-b border-black pb-0.5 mb-1.5 flex items-center justify-between">
                    <h2 className="text-[13px] font-bold tracking-wider" style={{ fontVariant: 'small-caps' }}>
                      Education
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="text-[11px]">
                        <div className="flex justify-between items-baseline font-bold">
                          <span>{edu.institution}</span>
                          <span className="font-normal text-[10.5px]">{edu.location}</span>
                        </div>
                        <div className="flex justify-between items-baseline italic text-[10.5px] text-slate-800">
                          <span>{edu.degree}</span>
                          <span className="not-italic">{edu.startDate} – {edu.endDate}</span>
                        </div>
                        {(edu.gpa || edu.coursework) && (
                          <div className="text-[10px] text-slate-700 mt-0.5">
                            {edu.gpa && <span><span className="font-bold">GPA:</span> {edu.gpa}</span>}
                            {edu.gpa && edu.coursework && <span> | </span>}
                            {edu.coursework && <span><span className="font-bold">Coursework:</span> {edu.coursework}</span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION: EXPERIENCE */}
              {resumeData.experience && resumeData.experience.length > 0 && (
                <div className="mt-3.5">
                  <div className="border-b border-black pb-0.5 mb-1.5 flex items-center justify-between">
                    <h2 className="text-[13px] font-bold tracking-wider" style={{ fontVariant: 'small-caps' }}>
                      Experience
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {resumeData.experience.map((exp) => (
                      <div key={exp.id} className="text-[11px]">
                        <div className="flex justify-between items-baseline font-bold">
                          <span>{exp.position}</span>
                          <span className="font-normal text-[10.5px]">{exp.startDate} – {exp.endDate}</span>
                        </div>
                        <div className="flex justify-between items-baseline italic text-[10.5px] text-slate-800">
                          <span>{exp.company}</span>
                          <span className="italic">{exp.location}</span>
                        </div>
                        {exp.bullets && exp.bullets.length > 0 && (
                          <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[10.5px] leading-snug text-slate-900 text-left">
                            {exp.bullets
                              .filter((b) => b.trim().length > 0)
                              .map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION: PROJECTS */}
              {resumeData.projects && resumeData.projects.length > 0 && (
                <div className="mt-3.5">
                  <div className="border-b border-black pb-0.5 mb-1.5 flex items-center justify-between">
                    <h2 className="text-[13px] font-bold tracking-wider" style={{ fontVariant: 'small-caps' }}>
                      Projects
                    </h2>
                  </div>
                  <div className="space-y-2.5">
                    {resumeData.projects.map((proj) => (
                      <div key={proj.id} className="text-[11px]">
                        <div className="flex justify-between items-baseline">
                          <div>
                            <span className="font-bold">{proj.name}</span>
                            {proj.technologies && (
                              <span className="text-slate-700 italic text-[10.5px]"> | {proj.technologies}</span>
                            )}
                            {proj.link && (
                              <span className="text-slate-700 text-[10.5px]">
                                {' '}|{' '}
                                <a
                                  href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-slate-900 hover:underline"
                                >
                                  {proj.link.replace(/^https?:\/\/(www\.)?/, '')}
                                </a>
                              </span>
                            )}
                          </div>
                          <span className="text-[10.5px] text-slate-700">
                            {proj.startDate ? `${proj.startDate} – ${proj.endDate || 'Present'}` : ''}
                          </span>
                        </div>
                        {proj.bullets && proj.bullets.length > 0 && (
                          <ul className="list-disc pl-4 mt-0.5 space-y-0.5 text-[10.5px] leading-snug text-slate-900 text-left">
                            {proj.bullets
                              .filter((b) => b.trim().length > 0)
                              .map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION: TECHNICAL SKILLS */}
              {resumeData.skills && (
                <div className="mt-3.5">
                  <div className="border-b border-black pb-0.5 mb-1.5 flex items-center justify-between">
                    <h2 className="text-[13px] font-bold tracking-wider" style={{ fontVariant: 'small-caps' }}>
                      Technical Skills
                    </h2>
                  </div>
                  <div className="text-[10.5px] space-y-0.5 text-slate-900 leading-snug">
                    {resumeData.skills.languages && (
                      <p>
                        <span className="font-bold">Languages:</span> {resumeData.skills.languages}
                      </p>
                    )}
                    {resumeData.skills.frameworks && (
                      <p>
                        <span className="font-bold">Frameworks:</span> {resumeData.skills.frameworks}
                      </p>
                    )}
                    {resumeData.skills.developerTools && (
                      <p>
                        <span className="font-bold">Developer Tools:</span> {resumeData.skills.developerTools}
                      </p>
                    )}
                    {resumeData.skills.librariesCloud && (
                      <p>
                        <span className="font-bold">Libraries & Cloud:</span> {resumeData.skills.librariesCloud}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION: CERTIFICATIONS (if any) */}
              {resumeData.certifications && resumeData.certifications.length > 0 && (
                <div className="mt-3.5">
                  <div className="border-b border-black pb-0.5 mb-1.5 flex items-center justify-between">
                    <h2 className="text-[13px] font-bold tracking-wider" style={{ fontVariant: 'small-caps' }}>
                      Certifications & Honors
                    </h2>
                  </div>
                  <ul className="list-disc pl-4 text-[10.5px] space-y-0.5 text-slate-900">
                    {resumeData.certifications
                      .filter((c) => c.trim().length > 0)
                      .map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
