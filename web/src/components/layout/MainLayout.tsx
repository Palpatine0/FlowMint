import { useState, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
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
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (isDesktop) setMobileNavOpen(false);
  }, [isDesktop]);

  const handleNavChange = (label: string) => {
    onNavChange(label);
    if (!isDesktop) setMobileNavOpen(false);
  };

  const mobileDrawerTransition = shouldReduceMotion
    ? ({ duration: 0 } as const)
    : ({ type: 'spring', stiffness: 460, damping: 42, mass: 0.75 } as const);

  const overlayTransition = shouldReduceMotion
    ? ({ duration: 0 } as const)
    : ({ duration: 0.22, ease: [0.22, 1, 0.36, 1] } as const);

  return (
    <div className="flex h-dvh min-h-dvh w-full min-h-0 antialiased text-slate-900 dark:text-slate-100">
      {!isDesktop && (
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={overlayTransition}
              className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setMobileNavOpen(false)}
            />
          )}
        </AnimatePresence>
      )}

      {isDesktop ? (
        <div className="relative z-50 h-dvh max-h-dvh min-h-dvh shrink-0">
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
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
            isMobileDrawer={false}
            onCloseMobileDrawer={() => setMobileNavOpen(false)}
          />
        </div>
      ) : (
        <motion.div
          animate={{
            x: mobileNavOpen ? 0 : shouldReduceMotion ? 0 : '-100%',
            opacity: mobileNavOpen ? 1 : shouldReduceMotion ? 0 : 1,
          }}
          transition={mobileDrawerTransition}
          className={[
            'fixed top-0 left-0 z-50 box-border flex h-dvh max-h-dvh min-h-0 shrink-0 flex-col py-safe shadow-xl shadow-slate-900/10',
            mobileNavOpen ? 'pointer-events-auto' : 'pointer-events-none',
          ].join(' ')}
          aria-hidden={!mobileNavOpen}
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
            collapsed={false}
            isMobileDrawer
            onCloseMobileDrawer={() => setMobileNavOpen(false)}
          />
        </motion.div>
      )}

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
