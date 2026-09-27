import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Search,
  Filter,
  Sparkles,
} from 'lucide-react';
import { AnalysisResult } from '../types';

interface SkillsPageProps {
  analysis: AnalysisResult | null;
}

export const SkillsPage: React.FC<SkillsPageProps> = ({ analysis }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const skillsFound = analysis?.skills_analysis?.skills_found?.length
    ? analysis.skills_analysis.skills_found
    : ['Python', 'Java', 'SQL', 'React', 'Node.js', 'MongoDB', 'Git', 'Machine Learning'];

  const skillsInJob = analysis?.skills_analysis?.skills_in_job?.length
    ? analysis.skills_analysis.skills_in_job
    : ['Python', 'SQL', 'Docker', 'AWS', 'REST APIs', 'Git', 'Linux'];

  const missingSkills = analysis?.skills_analysis?.missing_skills?.length
    ? analysis.skills_analysis.missing_skills
    : ['Docker', 'AWS', 'REST APIs', 'Linux'];

  const matchedCount = analysis?.skills_analysis?.matched_count ?? 7;
  const missingCount = analysis?.skills_analysis?.missing_count ?? 4;

  const filterList = (list: string[]) =>
    list.filter((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Heading */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Skills Analysis
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Detailed skill gap audit and keyword taxonomy comparison.
        </p>
      </div>

      {/* Visual Comparison Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Matched Count */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Matched Skills
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-emerald-600">{matchedCount}</span>
            <span className="text-xs text-slate-400 font-medium">shared with job requirements</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${(matchedCount / (matchedCount + missingCount || 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Missing Count */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Missing Skills
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-rose-600">{missingCount}</span>
            <span className="text-xs text-slate-400 font-medium">recommended competencies</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full"
              style={{ width: `${(missingCount / (matchedCount + missingCount || 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Total Resume Skills */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Total Resume Skills
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-900">{skillsFound.length}</span>
            <span className="text-xs text-slate-400 font-medium">verified competencies</span>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">
            Extracted from experience & projects
          </p>
        </div>
      </div>

      {/* Search Input Filter */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter skills across categories..."
          className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>

      {/* The 3 Core Sections as requested */}
      <div className="space-y-6">
        {/* Section 1: Skills Found */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-blue-50 text-blue-600">
                <Layers size={18} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Skills Found in Your Resume</h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              {filterList(skillsFound).length} Detected
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Technologies, libraries, and languages explicitly identified across all resume sections.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {filterList(skillsFound).map((skill) => (
              <span
                key={skill}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200/90 text-slate-800 hover:bg-blue-50/50 hover:border-blue-200 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Section 2: Skills Mentioned in Job */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-600">
                <Briefcase size={18} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Skills Mentioned in Job</h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {filterList(skillsInJob).length} Required
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Key tools and capabilities extracted from the job description posting.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {filterList(skillsInJob).map((skill) => {
              const isMatched = skillsFound.includes(skill);
              return (
                <span
                  key={skill}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 ${
                    isMatched
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {isMatched && <CheckCircle2 size={13} className="text-emerald-600" />}
                  {skill}
                </span>
              );
            })}
          </div>
        </div>

        {/* Section 3: Missing / Recommended Skills */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-rose-50 text-rose-600">
                <AlertCircle size={18} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Missing / Recommended Skills</h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              {filterList(missingSkills).length} Critical Gaps
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Adding evidence of these competencies will bring your job match score into the 90%+ tier.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {filterList(missingSkills).map((skill) => (
              <span
                key={skill}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-50/80 border border-rose-200 text-rose-800 flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
