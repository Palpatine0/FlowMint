import { LayoutDashboard, Plus, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  activeNav: string;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onAddClick: () => void;
}

export function Header({ activeNav, darkMode, onToggleDarkMode, onAddClick }: HeaderProps) {
  return (
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
  );
}
