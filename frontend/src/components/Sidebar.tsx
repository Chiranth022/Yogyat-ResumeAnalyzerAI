import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Layers,
  Sparkles,
  History,
  Settings,
  HelpCircle,
  X,
  ExternalLink,
  FileCode,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenHelp: () => void;
  userName?: string;
  userEmail?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
  onOpenHelp,
  userName = 'Alex Chen',
  userEmail = 'alex.chen@example.com',
}) => {
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'My Resume', icon: FileText },
    { id: 'builder', label: 'ATS Builder (Overleaf)', icon: FileCode, badge: 'LaTeX' },
    { id: 'analysis', label: 'Resume Analysis', icon: Sparkles },
    { id: 'job-match', label: 'Job Match', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Layers },
    { id: 'suggestions', label: 'Suggestions', icon: Sparkles },
    { id: 'history', label: 'History', icon: History },
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-slate-200/90 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
          <button
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2 text-left group focus:outline-hidden"
            aria-label="Yogyat Home"
          >
            <img
              src="/yogyat-logo-transparent.png"
              alt="Yogyat"
              className="h-8 w-auto max-w-[165px] object-contain transition-transform group-hover:scale-105"
            />
          </button>
          
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Overview & Tools
          </div>
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50/80 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={isActive ? 'text-blue-600' : 'text-slate-400'}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 pb-2">
            <div className="border-t border-slate-100 my-1" />
            <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Preferences & Support
            </div>
          </div>

          <button
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentTab === 'settings'
                ? 'bg-blue-50/80 text-blue-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Settings
              size={18}
              className={currentTab === 'settings' ? 'text-blue-600' : 'text-slate-400'}
            />
            <span>Settings</span>
          </button>

          <button
            onClick={() => {
              onOpenHelp();
              onCloseMobile();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <HelpCircle size={18} className="text-slate-400" />
            <span>Help</span>
          </button>

          <button
            onClick={() => handleNavClick('landing')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
          >
            <span>Landing Page</span>
            <ExternalLink size={14} className="text-slate-400" />
          </button>
        </div>

        {/* User profile footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-colors cursor-pointer" onClick={() => handleNavClick('settings')}>
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold text-sm shadow-xs">
              {userName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate leading-tight">
                {userName}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {userEmail}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
