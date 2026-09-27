import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Download,
  ArrowRight,
  FileCode,
} from 'lucide-react';
import { uploadResumeFile, fetchSampleData } from '../services/api';

interface UploadPageProps {
  onAnalyze: (resumeText: string, jobDescription: string, filename: string) => void;
  isAnalyzing: boolean;
}

export const UploadPage: React.FC<UploadPageProps> = ({ onAnalyze, isAnalyzing }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [extractedText, setExtractedText] = useState<string>('');
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string; count?: number } | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processSelectedFile = async (selectedFile: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage(`File is too large (${(selectedFile.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed size is 10 MB.`);
      return;
    }

    // Validate extension
    const nameLower = selectedFile.name.toLowerCase();
    if (!nameLower.endsWith('.pdf') && !nameLower.endsWith('.docx') && !nameLower.endsWith('.doc') && !nameLower.endsWith('.txt')) {
      setErrorMessage('Unsupported file format. Please upload a PDF or DOCX resume.');
      return;
    }

    setFile(selectedFile);
    setIsUploading(true);
    setUploadProgress(20);

    const progressTimer = setInterval(() => {
      setUploadProgress((p) => {
        if (p < 85) return p + 15;
        return p;
      });
    }, 150);

    try {
      const result = await uploadResumeFile(selectedFile);
      clearInterval(progressTimer);
      setUploadProgress(100);
      setIsUploading(false);
      setExtractedText(result.extracted_text);
      setFileDetails({
        name: result.filename,
        size: result.file_size_formatted,
        count: result.word_count,
      });
      setSuccessMessage(`Resume parsed successfully: ${result.word_count} words extracted, ${result.detected_skills_count} skills detected.`);
    } catch (err: any) {
      clearInterval(progressTimer);
      setIsUploading(false);
      setUploadProgress(0);
      setErrorMessage(err.message || 'Failed to extract text from this resume file.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setExtractedText('');
    setFileDetails(null);
    setUploadProgress(0);
    setErrorMessage(null);
    setSuccessMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadSample = async () => {
    setErrorMessage(null);
    try {
      const data = await fetchSampleData();
      setExtractedText(data.sample_resume_text);
      setJobDescription(data.sample_job_description);
      setFileDetails({
        name: data.sample_filename,
        size: '124.5 KB',
        count: data.sample_resume_text.split(/\s+/).length,
      });
      setSuccessMessage('Sample Senior Software Engineer resume & job description loaded.');
    } catch {
      setErrorMessage('Could not load sample data from backend.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extractedText.trim()) {
      setErrorMessage('Please upload a resume file or load sample data before analyzing.');
      return;
    }
    const currentFilename = fileDetails?.name || 'Candidate_Resume.pdf';
    onAnalyze(extractedText, jobDescription, currentFilename);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Heading */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Analyze Your Resume
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Upload your resume and let AI identify strengths, gaps and improvement opportunities.
        </p>
      </div>

      {/* Error or Success notification */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5">
          <AlertCircle size={18} className="shrink-0 text-rose-600 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-700">
            <X size={16} />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-2.5">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600 mt-0.5" />
          <div className="flex-1 font-medium">{successMessage}</div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-500 hover:text-emerald-700">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Resume Document
            </span>
            {/* Quick Demo Button */}
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50/70 hover:bg-blue-100 transition-colors"
            >
              <Sparkles size={13} />
              <span>Load Sample Resume & Job (1-Click Demo)</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileInputChange}
            className="hidden"
            id="resume-file-input"
          />

          {!fileDetails ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-blue-500 bg-blue-50/40'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <div className="mx-auto w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
                <UploadCloud size={24} />
              </div>
              <p className="text-base font-semibold text-slate-900">
                Drop your resume here
              </p>
              <p className="text-xs text-slate-400 mt-1">
                or <span className="text-blue-600 font-semibold underline underline-offset-2">Browse Files</span>
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-4 text-[11px] text-slate-400">
                <span>Supported: <strong className="text-slate-600">PDF, DOCX</strong></span>
                <span>•</span>
                <span>Maximum size: <strong className="text-slate-600">10 MB</strong></span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 truncate max-w-sm">
                      {fileDetails.name}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {fileDetails.size} {fileDetails.count ? `• ${fileDetails.count} words` : ''}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Remove resume"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  Ready for AI analysis
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Replace file
                </button>
              </div>
            </div>
          )}

          {/* Sample downloads helper */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Need a test file?</span>
            <div className="flex items-center gap-2">
              <a
                href="/api/sample-file/pdf"
                download="Alex_Chen_Resume.pdf"
                className="text-slate-600 hover:text-blue-600 flex items-center gap-1 font-medium underline"
              >
                <Download size={12} />
                Download Sample PDF
              </a>
              <span>•</span>
              <a
                href="/api/sample-file/docx"
                download="Alex_Chen_Resume.docx"
                className="text-slate-600 hover:text-blue-600 flex items-center gap-1 font-medium underline"
              >
                <Download size={12} />
                Download Sample DOCX
              </a>
            </div>
          </div>
        </div>

        {/* Optional Target Job Description Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Target Job Description
            </h3>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
              Optional
            </span>
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            rows={6}
            className="w-full p-4 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans leading-relaxed"
          />

          <p className="text-xs text-slate-500">
            Adding a job description enables detailed skill and keyword matching.
          </p>
        </div>

        {/* Submit CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isAnalyzing || isUploading || !extractedText.trim()}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm sm:text-base font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Analyze Resume</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};
