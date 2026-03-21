import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  PieChart,
  Settings,
  LogOut,
  RefreshCw,
  Calendar as CalendarIcon,
  Target,
  HelpCircle,
  ExternalLink,
  RotateCcw,
  PieChart as PieChartIcon,
  Calculator,
  Users,
} from 'lucide-react';
import iconLogo from '../../assets/icon-logo.svg';

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview' },
  { icon: Wallet, label: 'Accounts' },
  { icon: CreditCard, label: 'Transactions' },
  { icon: PieChart, label: 'Budgets' },
  { icon: CalendarIcon, label: 'Calendar' },
  { icon: RefreshCw, label: 'Recurring' },
  { icon: Target, label: 'Goals' },
  { icon: PieChartIcon, label: 'Charts' },
  { icon: Calculator, label: 'Tax Estimator' },
  { icon: Users, label: 'Shared Expenses' },
  { icon: RotateCcw, label: 'Bank Sync' },
  { icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  activeNav: string;
  onNavChange: (label: string) => void;
  userName?: string;
  avatarUrl?: string;
}

export function Sidebar({ activeNav, onNavChange, userName, avatarUrl }: SidebarProps) {
  const initials = (userName || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  return (
    <aside className="w-64 h-screen bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shrink-0">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700">
        <h2 className="text-xl font-bold text-primary-500 flex items-center gap-2">
          <img src={iconLogo} alt="FlowMint logo" className="w-8 h-8" />
          Flow Mint
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavChange(item.label)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeNav === item.label
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-500 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
        <button
          onClick={() => onNavChange('Settings')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="w-8 h-8 rounded-full object-cover"
              style={{ border: '2px solid #76DDAA' }}
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #76DDAA, #5BB88A)' }}
            >
              {initials}
            </div>
          )}
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
            {userName || 'User'}
          </span>
        </button>
        <button
          onClick={() => onNavChange('Help')}
          className="w-full flex items-center justify-between px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-primary-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors rounded-xl"
        >
          <div className="flex items-center gap-3">
            <HelpCircle size={20} />
            Help
          </div>
          <ExternalLink size={14} className="opacity-40" />
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-xl">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
