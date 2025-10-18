import React, { useEffect, useState } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showPalette, setShowPalette] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      if ((isMac && e.metaKey && e.key.toLowerCase() === 'k') || (!isMac && e.ctrlKey && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setShowPalette((s) => !s);
      }
      if (e.key === 'Escape') {
        setShowPalette(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const actions = [
    { label: 'Go to Dashboard', href: '/dashboard' },
    { label: 'Manage Posts', href: '/manage-posts' },
    { label: 'Post Occupancy', href: '/post-occupancy' },
    { label: 'Organogram', href: '/organogram' },
    { label: 'Roles Management', href: '/roles' },
    { label: 'Appraisal Settings', href: '/appraisal-settings' },
  ];

  const handleActionClick = (href: string) => {
    setShowPalette(false);
    window.location.href = href;
  };

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          {children}

          {/* Command Palette */}
          {showPalette && (
            <div className="fixed inset-0 z-50">
              <div className="absolute inset-0 bg-black/30" onClick={() => setShowPalette(false)} />
              <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-xl">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    Press Esc to close • Ctrl/Cmd+K to toggle
                  </div>
                  <div className="max-h-80 overflow-auto">
                    {actions.map((a) => (
                      <button
                        key={a.href}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-gray-50 dark:focus:bg-gray-700 focus:outline-none text-gray-900 dark:text-gray-100"
                        onClick={() => handleActionClick(a.href)}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
        </main>
      </div>
    </div>
  );
};

export default Layout;
