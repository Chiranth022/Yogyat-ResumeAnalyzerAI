import { AnalysisResult, HistoryItem, UploadResponse } from '../types';

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');

export async function uploadResumeFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/resume/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(errorData.detail || `Upload failed with status ${response.status}`);
  }

  return response.json();
}

export async function analyzeResumeData(
  resumeText: string,
  jobDescription: string = '',
  filename: string = 'Resume.pdf',
  targetRole: string = 'Software Engineer'
): Promise<AnalysisResult> {
  const response = await fetch(`${API_BASE}/resume/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      resume_text: resumeText,
      job_description: jobDescription,
      filename,
      target_role: targetRole,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Analysis failed' }));
    throw new Error(errorData.detail || `Analysis failed with status ${response.status}`);
  }

  return response.json();
}

export async function fetchAnalysisHistory(): Promise<HistoryItem[]> {
  try {
    const response = await fetch(`${API_BASE}/analysis/history`);
    if (!response.ok) {
      throw new Error(`Failed to fetch history (${response.status})`);
    }
    const data = await response.json();
    return data.history || [];
  } catch (error) {
    console.error('History fetch error:', error);
    return [];
  }
}

export async function fetchAnalysisById(id: string): Promise<AnalysisResult> {
  const response = await fetch(`${API_BASE}/analysis/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to load analysis record ${id}`);
  }
  return response.json();
}

export async function deleteAnalysisById(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE}/analysis/${id}`, {
    method: 'DELETE',
  });
  return response.ok;
}

export async function clearAllHistory(): Promise<boolean> {
  const response = await fetch(`${API_BASE}/analysis/history/clear`, {
    method: 'DELETE',
  });
  return response.ok;
}

export async function fetchSampleData(): Promise<{
  sample_resume_text: string;
  sample_job_description: string;
  sample_filename: string;
  sample_target_role: string;
}> {
  const response = await fetch(`${API_BASE}/sample-data`);
  if (!response.ok) {
    throw new Error('Failed to load sample data');
  }
  return response.json();
}

export async function sendMessageToCopilot(
  userInput: string,
  resumeText: string = ''
): Promise<{ reply: string }> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userInput,
      resumeText,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Chat request failed' }));
    throw new Error(errorData.detail || errorData.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function sendCopilotChat(
  query: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  analysisData?: AnalysisResult | null,
  jobDescription?: string
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(`${API_BASE}/copilot/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        query,
        messages,
        analysis_data: analysisData,
        job_description: jobDescription,
      }),
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.reply) return data.reply;
    }
  } catch (e: any) {
    clearTimeout(timeoutId);
    console.warn('Copilot endpoint failed, trying fallback:', e);
  }

  // Fallback to /api/chat
  const resumeText = analysisData?.resume_text || '';
  const data = await sendMessageToCopilot(query, resumeText);
  return data.reply;
}

export async function downloadResumePdf(
  resumeData: any,
  fontChoice: string = 'serif'
): Promise<void> {
  const response = await fetch(`${API_BASE}/resume/builder/export-pdf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      resume_data: resumeData,
      font_choice: fontChoice,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate PDF (${response.status})`);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (resumeData.contact?.fullName || 'Resume').trim().replace(/\s+/g, '_');
  a.href = url;
  a.download = `${safeName}_Resume.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}


