import React, { useState } from 'react';
import {
  User,
  Bell,
  Sun,
  Moon,
  Laptop,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
} from 'lucide-react';
import { clearAllHistory } from '../services/api';

interface SettingsPageProps {
  userName: string;
  userEmail: string;
  theme: 'light' | 'dark' | 'system';
  onUpdateTheme: (theme: 'light' | 'dark' | 'system') => void;
  onUpdateProfile: (name: string, email: string) => void;
  onHistoryCleared: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  userName,
  userEmail,
  theme,
  onUpdateTheme,
  onUpdateProfile,
  onHistoryCleared,
}) => {
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [notifications, setNotifications] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(name, email);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to delete all saved resume analysis history? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await clearAllHistory();
        onHistoryCleared();
        setDeleteSuccess(true);
        setTimeout(() => setDeleteSuccess(false), 3000);
      } catch (err) {
        alert('Failed to clear analysis history.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-200">
      {/* Heading */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Settings & Preferences
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage your candidate profile details, notification preferences, and privacy controls.
        </p>
      </div>

      {/* Profile Section */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-6">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <div className="p-1.5 rounded-md bg-blue-50 text-blue-600">
            <User size={18} />
          </div>
          <h3 className="text-base font-bold text-slate-900">Profile Details</h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {saveSuccess ? (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 size={14} /> Profile updated successfully
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Save size={15} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Preferences Section */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-6">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-600">
            <Bell size={18} />
          </div>
          <h3 className="text-base font-bold text-slate-900">Application Preferences</h3>
        </div>

        {/* Theme */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Display Theme
          </label>
          <div className="grid grid-cols-3 gap-3 max-w-sm">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'System', icon: Laptop },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onUpdateTheme(t.id as any)}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 text-blue-700 dark:border-blue-500 dark:bg-blue-900/40 dark:text-blue-300 ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon size={14} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-400">
            {theme === 'dark'
              ? 'Dark theme active for high-focus, night-time work.'
              : theme === 'system'
              ? 'Synchronized with your device system preferences.'
              : 'Sleek clean SaaS light theme active.'}
          </p>
        </div>

        {/* Notifications toggle */}
        <div className="pt-2 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Analysis Notifications</h4>
            <p className="text-xs text-slate-500">Receive in-browser alerts when large batch analyses finish.</p>
          </div>
          <button
            type="button"
            onClick={() => setNotifications(!notifications)}
            className={`w-11 h-6 rounded-full transition-colors relative focus:outline-hidden ${
              notifications ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                notifications ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Privacy Section */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-rose-100 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-rose-50">
          <div className="p-1.5 rounded-md bg-rose-50 text-rose-600">
            <Trash2 size={18} />
          </div>
          <h3 className="text-base font-bold text-rose-900">Data & Privacy</h3>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-900">Delete Analysis History</h4>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            Permanently remove all cached resume evaluations, extracted skill logs, and match records from the local SQLite database.
          </p>
        </div>

        {deleteSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 size={15} /> All analysis history records have been permanently cleared.
          </div>
        )}

        <div className="pt-2">
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleClearHistory}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 text-xs sm:text-sm font-semibold rounded-xl border border-rose-200 transition-colors flex items-center gap-2"
          >
            <Trash2 size={15} />
            <span>{isDeleting ? 'Clearing Records...' : 'Clear All Analysis History'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
