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
    <div className="flex h-dvh min-h-dvh w-full min-h-0 antialiased text-slate-900 dark:text-slate-100">
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
          'shrink-0 z-50 transition-transform duration-200 ease-out',
          isDesktop
            ? 'relative h-dvh max-h-dvh min-h-dvh translate-x-0'
            : [
                'fixed top-0 left-0 box-border flex h-dvh max-h-dvh min-h-0 flex-col py-safe shadow-xl shadow-slate-900/10',
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
      <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden">
        <Header
          activeNav={activeNav}
          darkMode={darkMode}
          onToggleDarkMode={onToggleDarkMode}
          onAddClick={onAddClick}
          onImportClick={onImportClick}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />
        <main className="min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] md:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
