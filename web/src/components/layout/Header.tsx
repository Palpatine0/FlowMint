import {
  LayoutDashboard,
  Plus,
  Moon,
  Sun,
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
}

export function Header({
  activeNav,
  darkMode,
  onToggleDarkMode,
  onAddClick,
  onImportClick,
}: HeaderProps) {
  const Icon = navIconMap[activeNav] ?? LayoutDashboard;

  return (
    <header className="h-16 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between px-8 shrink-0 z-10 relative">
      <div className="flex items-center gap-2">
        <Icon className="text-slate-400 dark:text-slate-500" size={20} />
        <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{activeNav}</h1>
      </div>
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onImportClick}
          className="flex items-center gap-2 bg-slate-100/80 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <UploadCloud size={18} /> Import
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAddClick}
          className="flex items-center gap-2 bg-primary-400 hover:bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-primary-200"
        >
          <Plus size={18} /> Add Transaction
        </motion.button>
      </div>
    </header>
  );
}
