import {
  LayoutDashboard,
  Plus,
  Moon,
  Sun,
  Menu,
  UploadCloud,
  Wallet,
  CreditCard,
  PieChart,
  Settings,
  RefreshCw,
  Calendar as CalendarIcon,
  Target,
  RotateCcw,
  PieChart as PieChartIcon,
  Calculator,
  Users,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';

const navIconMap: Record<string, LucideIcon> = {
  Overview: LayoutDashboard,
  Accounts: Wallet,
  Transactions: CreditCard,
  Budgets: PieChart,
  Calendar: CalendarIcon,
  Recurring: RefreshCw,
  Goals: Target,
  Charts: PieChartIcon,
  'Tax Estimator': Calculator,
  'Shared Expenses': Users,
  'Bank Sync': RotateCcw,
  Settings: Settings,
  Help: HelpCircle,
};

interface HeaderProps {
  activeNav: string;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onAddClick: () => void;
  onImportClick: () => void;
  onOpenMobileNav: () => void;
}

export function Header({
  activeNav,
  darkMode,
  onToggleDarkMode,
  onAddClick,
  onImportClick,
  onOpenMobileNav,
}: HeaderProps) {
  const Icon = navIconMap[activeNav] ?? LayoutDashboard;

  return (
    <header className="h-16 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between gap-2 px-4 md:px-8 shrink-0 z-10 relative">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenMobileNav}
          className="md:hidden p-2 -ml-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-700/50 transition-colors shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </motion.button>
        <Icon className="text-slate-400 dark:text-slate-500 shrink-0 hidden sm:block" size={20} />
        <h1 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-100 truncate">
          {activeNav}
        </h1>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onImportClick}
          className="flex items-center gap-1.5 sm:gap-2 bg-slate-100/80 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-2.5 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <UploadCloud size={18} className="shrink-0" />
          <span className="hidden sm:inline">Import</span>
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAddClick}
          className="flex items-center gap-1.5 sm:gap-2 bg-primary-400 hover:bg-primary-500 text-white px-2.5 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-primary-200"
        >
          <Plus size={18} className="shrink-0" />
          <span className="hidden sm:inline">Add</span>
          <span className="hidden md:inline"> Transaction</span>
        </motion.button>
      </div>
    </header>
  );
}
