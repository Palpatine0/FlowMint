import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

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

  return (
    <div className="flex h-screen w-full antialiased text-slate-900 dark:text-slate-100">
      <Sidebar
        activeNav={activeNav}
        onNavChange={onNavChange}
        onLogout={onLogout}
        userName={userName}
        avatarUrl={avatarUrl}
        badges={badges}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          activeNav={activeNav}
          darkMode={darkMode}
          onToggleDarkMode={onToggleDarkMode}
          onAddClick={onAddClick}
          onImportClick={onImportClick}
        />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
