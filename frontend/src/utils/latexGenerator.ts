import { ResumeData, TemplateStyle, FontChoice } from '../types/resumeBuilder';

export function escapeLatex(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([&%$#_{}])/g, '\\$1')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

export function generateLatexCode(
  data: ResumeData,
  template: TemplateStyle = 'jakes',
  font: FontChoice = 'serif'
): string {
  const c = data.contact;

  const fontConfig =
    font === 'sans'
      ? `\\usepackage[sfdefault]{roboto}\n\\usepackage[T1]{fontenc}`
      : `% Serif font default (Computer Modern / Charter)\n% \\usepackage{charter}`;

  const contactLinks: string[] = [];
  if (c.phone) contactLinks.push(escapeLatex(c.phone));
  if (c.email) contactLinks.push(`\\href{mailto:${c.email}}{\\underline{${escapeLatex(c.email)}}}`);
  if (c.linkedin) {
    const cleanLi = c.linkedin.replace(/^https?:\/\/(www\.)?/, '');
    contactLinks.push(`\\href{${c.linkedin.startsWith('http') ? c.linkedin : 'https://' + c.linkedin}}{\\underline{${escapeLatex(cleanLi)}}}`);
  }
  if (c.github) {
    const cleanGh = c.github.replace(/^https?:\/\/(www\.)?/, '');
    contactLinks.push(`\\href{${c.github.startsWith('http') ? c.github : 'https://' + c.github}}{\\underline{${escapeLatex(cleanGh)}}}`);
  }
  if (c.portfolio) {
    const cleanPort = c.portfolio.replace(/^https?:\/\/(www\.)?/, '');
    contactLinks.push(`\\href{${c.portfolio.startsWith('http') ? c.portfolio : 'https://' + c.portfolio}}{\\underline{${escapeLatex(cleanPort)}}}`);
  }
  if (c.location) contactLinks.push(escapeLatex(c.location));

  const contactLine = contactLinks.join(' $|$ \n    ');

  let educationLatex = '';
  if (data.education && data.education.length > 0) {
    educationLatex = `\\section{Education}
  \\resumeSubHeadingListStart
${data.education
  .map(
    (edu) => `    \\resumeSubheading
      {${escapeLatex(edu.institution)}}{${escapeLatex(edu.location)}}
      {${escapeLatex(edu.degree)}}{${escapeLatex(edu.startDate)} -- ${escapeLatex(edu.endDate)}}
${edu.gpa ? `      \\resumeItemListStart\n        \\resumeItem{\\textbf{GPA:} ${escapeLatex(edu.gpa)}${edu.coursework ? ` $|$ \\textbf{Coursework:} ${escapeLatex(edu.coursework)}` : ''}}\n      \\resumeItemListEnd` : ''}`
  )
  .join('\n')}
  \\resumeSubHeadingListEnd`;
  }

  let experienceLatex = '';
  if (data.experience && data.experience.length > 0) {
    experienceLatex = `\\section{Experience}
  \\resumeSubHeadingListStart
${data.experience
  .map(
    (exp) => `    \\resumeSubheading
      {${escapeLatex(exp.position)}}{${escapeLatex(exp.startDate)} -- ${escapeLatex(exp.endDate)}}
      {${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}
      \\resumeItemListStart
${exp.bullets
  .filter((b) => b.trim().length > 0)
  .map((b) => `        \\resumeItem{${escapeLatex(b)}}`)
  .join('\n')}
      \\resumeItemListEnd`
  )
  .join('\n')}
  \\resumeSubHeadingListEnd`;
  }

  let projectsLatex = '';
  if (data.projects && data.projects.length > 0) {
    projectsLatex = `\\section{Projects}
  \\resumeSubHeadingListStart
${data.projects
  .map(
    (proj) => `    \\resumeProjectHeading
      {\\textbf{${escapeLatex(proj.name)}}${proj.technologies ? ` $|$ \\emph{${escapeLatex(proj.technologies)}}` : ''}}${proj.startDate ? `{${escapeLatex(proj.startDate)} -- ${escapeLatex(proj.endDate || 'Present')}}` : '{GitHub/Demo}'}
      \\resumeItemListStart
${proj.bullets
  .filter((b) => b.trim().length > 0)
  .map((b) => `        \\resumeItem{${escapeLatex(b)}}`)
  .join('\n')}
      \\resumeItemListEnd`
  )
  .join('\n')}
  \\resumeSubHeadingListEnd`;
  }

  let skillsLatex = '';
  if (data.skills) {
    const s = data.skills;
    const skillItems: string[] = [];
    if (s.languages) skillItems.push(`\\textbf{Languages}{: ${escapeLatex(s.languages)}}`);
    if (s.frameworks) skillItems.push(`\\textbf{Frameworks}{: ${escapeLatex(s.frameworks)}}`);
    if (s.developerTools) skillItems.push(`\\textbf{Developer Tools}{: ${escapeLatex(s.developerTools)}}`);
    if (s.librariesCloud) skillItems.push(`\\textbf{Libraries \\& Cloud}{: ${escapeLatex(s.librariesCloud)}}`);

    if (skillItems.length > 0) {
      skillsLatex = `\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
${skillItems.map((item) => `     ${item} \\\\`).join('\n')}
    }}
 \\end{itemize}`;
    }
  }

  let certificationsLatex = '';
  if (data.certifications && data.certifications.length > 0) {
    certificationsLatex = `\\section{Certifications \\& Honors}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
${data.certifications.map((cert) => `     \\textbf{--} ${escapeLatex(cert)} \\\\`).join('\n')}
    }}
 \\end{itemize}`;
  }

  let summaryLatex = '';
  if (data.summary && data.summary.trim()) {
    summaryLatex = `\\section{Professional Summary}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     ${escapeLatex(data.summary)}
    }}
 \\end{itemize}`;
  }

  return `%-------------------------
% Resume in LaTeX - Overleaf Compatible
% Inspired by Jake Gutierrez's Overleaf Resume Template
% License : MIT
% Generated via Yogyat ATS Resume Builder
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

${fontConfig}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins for ATS standard readability
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure generated PDF is machine readable / ATS parsable
\\pdfgentounicode=1

% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(c.fullName || 'Your Name')}} \\\\ \\vspace{1pt}
${c.jobTitle ? `    \\small \\textit{${escapeLatex(c.jobTitle)}} \\\\ \\vspace{2pt}\n` : ''}    \\small ${contactLine}
\\end{center}

${summaryLatex ? `${summaryLatex}\n\n` : ''}${educationLatex ? `${educationLatex}\n\n` : ''}${experienceLatex ? `${experienceLatex}\n\n` : ''}${projectsLatex ? `${projectsLatex}\n\n` : ''}${skillsLatex ? `${skillsLatex}\n\n` : ''}${certificationsLatex ? `${certificationsLatex}\n\n` : ''}
\\end{document}
`;
}
