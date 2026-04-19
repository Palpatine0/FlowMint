import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const MD_MIN = 768;

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(`(min-width: ${MD_MIN}px)`).matches : true,
  );

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${MD_MIN}px)`);
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isDesktop;
}

interface MainLayoutProps {
  children: React.ReactNode;
  onAddClick: () => void;
  activeNav: string;
  onNavChange: (label: string) => void;
  onImportClick: () => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  userName?: string;
  avatarUrl?: string;
  badges?: Record<string, number>;
}

export function MainLayout({
  children,
  onAddClick,
  activeNav,
  onNavChange,
  onImportClick,
  onLogout,
  darkMode,
  onToggleDarkMode,
  userName,
  avatarUrl,
  badges,
}: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (isDesktop) setMobileNavOpen(false);
  }, [isDesktop]);

  const handleNavChange = (label: string) => {
    onNavChange(label);
    if (!isDesktop) setMobileNavOpen(false);
  };

  return (
    <div className="flex h-screen w-full antialiased text-slate-900 dark:text-slate-100">
      {!isDesktop && mobileNavOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      <div
        className={[
          'shrink-0 h-screen z-50 transition-transform duration-200 ease-out',
          isDesktop
            ? 'relative translate-x-0'
            : [
                'fixed left-0 top-0 bottom-0 shadow-xl shadow-slate-900/10',
                mobileNavOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none',
              ].join(' '),
        ].join(' ')}
      >
        <Sidebar
          activeNav={activeNav}
          onNavChange={handleNavChange}
          onLogout={() => {
            if (!isDesktop) setMobileNavOpen(false);
            onLogout();
          }}
          userName={userName}
          avatarUrl={avatarUrl}
          badges={badges}
          collapsed={isDesktop ? sidebarCollapsed : false}
          onToggleCollapse={isDesktop ? () => setSidebarCollapsed((c) => !c) : undefined}
          isMobileDrawer={!isDesktop}
          onCloseMobileDrawer={() => setMobileNavOpen(false)}
        />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden w-full">
        <Header
          activeNav={activeNav}
          darkMode={darkMode}
          onToggleDarkMode={onToggleDarkMode}
          onAddClick={onAddClick}
          onImportClick={onImportClick}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
