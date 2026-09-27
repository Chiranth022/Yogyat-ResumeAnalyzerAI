export interface ResumeContact {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  coursework?: string;
}

export interface ResumeExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface ResumeProject {
  id: string;
  name: string;
  technologies: string;
  link?: string;
  startDate?: string;
  endDate?: string;
  bullets: string[];
}

export interface ResumeSkills {
  languages: string;
  frameworks: string;
  developerTools: string;
  librariesCloud: string;
}

export interface ResumeData {
  contact: ResumeContact;
  summary: string;
  education: ResumeEducation[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  skills: ResumeSkills;
  certifications: string[];
}

export type TemplateStyle = 'jakes' | 'classic' | 'minimal';
export type FontChoice = 'serif' | 'sans';
export type SpacingChoice = 'compact' | 'normal' | 'relaxed';
