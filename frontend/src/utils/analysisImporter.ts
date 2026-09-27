import { AnalysisResult } from '../types';
import { ResumeData } from '../types/resumeBuilder';
import { INITIAL_RESUME_DATA } from './sampleResumeData';

export function importFromAnalysis(analysis: AnalysisResult | null, fallbackName = 'Alex Chen', fallbackEmail = 'alex.chen@example.com'): ResumeData {
  if (!analysis) {
    return { ...INITIAL_RESUME_DATA };
  }

  // Group detected skills if possible
  const foundSkills = analysis.skills_analysis?.skills_found || [];
  
  // Categorize skills into languages, frameworks, developer tools, libraries/cloud
  const languagesList: string[] = [];
  const frameworksList: string[] = [];
  const devToolsList: string[] = [];
  const othersList: string[] = [];

  const langSet = new Set(['python', 'javascript', 'typescript', 'go', 'java', 'c++', 'c#', 'ruby', 'php', 'rust', 'sql', 'html', 'css', 'scala', 'kotlin', 'swift']);
  const fwSet = new Set(['react', 'vue', 'angular', 'django', 'fastapi', 'flask', 'express', 'node.js', 'next.js', 'spring', 'spring boot', 'laravel']);
  const devToolsSet = new Set(['git', 'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'linux', 'ci/cd', 'terraform', 'jenkins', 'github actions']);

  foundSkills.forEach((s) => {
    const lower = s.toLowerCase();
    if (langSet.has(lower)) {
      languagesList.push(s);
    } else if (fwSet.has(lower)) {
      frameworksList.push(s);
    } else if (devToolsSet.has(lower)) {
      devToolsList.push(s);
    } else {
      othersList.push(s);
    }
  });

  return {
    ...INITIAL_RESUME_DATA,
    contact: {
      ...INITIAL_RESUME_DATA.contact,
      fullName: fallbackName || INITIAL_RESUME_DATA.contact.fullName,
      email: fallbackEmail || INITIAL_RESUME_DATA.contact.email,
      jobTitle: analysis.target_role || 'Software Engineer',
    },
    summary:
      analysis.strengths && analysis.strengths.length > 0
        ? `Dedicated ${analysis.target_role || 'professional'} with proven expertise in ${foundSkills.slice(0, 4).join(', ')}. Demonstrated success in driving measurable engineering results and high-impact project delivery.`
        : INITIAL_RESUME_DATA.summary,
    skills: {
      languages: languagesList.length > 0 ? languagesList.join(', ') : INITIAL_RESUME_DATA.skills.languages,
      frameworks: frameworksList.length > 0 ? frameworksList.join(', ') : INITIAL_RESUME_DATA.skills.frameworks,
      developerTools: devToolsList.length > 0 ? devToolsList.join(', ') : INITIAL_RESUME_DATA.skills.developerTools,
      librariesCloud: othersList.length > 0 ? othersList.join(', ') : INITIAL_RESUME_DATA.skills.librariesCloud,
    },
  };
}
