import { Sidebar } from "./Sidebar";
import { LayoutDashboard, Plus, Moon, Sun } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
  onAddClick: () => void;
  activeNav: string;
  onNavChange: (label: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function MainLayout({ children, onAddClick, activeNav, onNavChange, darkMode, onToggleDarkMode }: MainLayoutProps) {

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 antialiased">
      <Sidebar activeNav={activeNav} onNavChange={onNavChange} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-slate-400 dark:text-slate-500" size={20} />
            <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{activeNav}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={onAddClick}
              className="flex items-center gap-2 bg-primary-400 hover:bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-primary-200"
            >
              <Plus size={18} /> Add Transaction
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
