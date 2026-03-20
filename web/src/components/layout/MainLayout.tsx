import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  onAddClick: () => void;
  activeNav: string;
  onNavChange: (label: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  userName?: string;
  avatarUrl?: string;
}

export function MainLayout({
  children,
  onAddClick,
  activeNav,
  onNavChange,
  darkMode,
  onToggleDarkMode,
  userName,
  avatarUrl,
}: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 antialiased">
      <Sidebar
        activeNav={activeNav}
        onNavChange={onNavChange}
        userName={userName}
        avatarUrl={avatarUrl}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          activeNav={activeNav}
          darkMode={darkMode}
          onToggleDarkMode={onToggleDarkMode}
          onAddClick={onAddClick}
        />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
