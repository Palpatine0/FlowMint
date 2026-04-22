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
  ChevronsLeft,
  X,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
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
  onLogout: () => void;
  userName?: string;
  avatarUrl?: string;
  badges?: Record<string, number>;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export function Sidebar({
  activeNav,
  onNavChange,
  onLogout,
  userName,
  avatarUrl,
  badges = {},
  collapsed = false,
  onToggleCollapse,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}: SidebarProps) {
  const shouldReduceMotion = useReducedMotion();
  const initials = (userName || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 256 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: 'easeInOut' }}
      className="relative z-20 flex h-full min-h-0 max-h-full shrink-0 flex-col bg-white/70 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 dark:bg-slate-900/70"
    >
      {/* Header */}
      <div
        className={`border-b border-slate-100/50 dark:border-slate-700/50 flex items-center ${collapsed ? 'px-3 py-5 justify-center' : 'px-6 py-5 justify-between'}`}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={collapsed ? onToggleCollapse : undefined}
          className={`flex items-center gap-2 overflow-hidden ${collapsed ? 'cursor-pointer' : 'cursor-default'}`}
          title={collapsed ? 'Expand sidebar' : undefined}
        >
          <img src={iconLogo} alt="FlowMint logo" className="w-8 h-8 shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xl font-bold text-primary-500 whitespace-nowrap overflow-hidden"
              >
                Flow Mint
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        {isMobileDrawer && onCloseMobileDrawer && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onCloseMobileDrawer}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-700/60 transition-colors"
            title="Close menu"
            type="button"
          >
            <X size={18} />
          </motion.button>
        )}
        {!isMobileDrawer && !collapsed && onToggleCollapse && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-700/60 transition-colors"
            title="Collapse sidebar"
            type="button"
          >
            <ChevronsLeft size={18} />
          </motion.button>
        )}
      </div>

      {/* Nav items */}
      <nav className={`flex-1 ${collapsed ? 'px-2 py-3' : 'p-4'} space-y-1 overflow-y-auto`}>
        {menuItems.map((item) => (
          <motion.button
            whileHover={shouldReduceMotion ? undefined : { scale: 1.02, x: collapsed ? 0 : 4 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            key={item.label}
            onClick={() => onNavChange(item.label)}
            title={collapsed ? item.label : undefined}
            className={`relative w-full rounded-xl py-3 transition-all duration-200 ${
              collapsed ? 'flex items-center justify-center px-2' : 'flex items-center gap-3 px-4'
            } ${
              activeNav === item.label
                ? 'text-primary-500 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {activeNav === item.label && (
              <>
                <motion.span
                  layoutId="sidebar-active-bg"
                  className="absolute inset-0 rounded-xl bg-primary-50/80 dark:bg-primary-900/30"
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 520, damping: 40, mass: 0.75 }
                  }
                />
                {!collapsed && (
                  <motion.span
                    layoutId="sidebar-active-rail"
                    className="absolute left-1 top-2 bottom-2 w-1 rounded-full bg-primary-400 dark:bg-primary-500"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 560, damping: 42, mass: 0.7 }
                    }
                  />
                )}
              </>
            )}
            <motion.span
              className="relative z-10 shrink-0"
              animate={
                shouldReduceMotion
                  ? { scale: 1 }
                  : activeNav === item.label
                    ? { scale: 1.06 }
                    : { scale: 1 }
              }
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
            >
              <item.icon size={20} />
            </motion.span>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10 flex-1 overflow-hidden whitespace-nowrap text-left"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {badges[item.label] ? (
              <span
                className={`z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ${collapsed ? 'absolute -top-1 -right-1' : 'ml-auto'}`}
              >
                {badges[item.label]}
              </span>
            ) : null}
          </motion.button>
        ))}
      </nav>

      {/* Bottom section */}
      <div
        className={`${collapsed ? 'px-2 py-3' : 'p-4'} border-t border-slate-100 dark:border-slate-700 space-y-2`}
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavChange('Settings')}
          title={collapsed ? userName || 'User' : undefined}
          className={`w-full flex items-center ${collapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-3 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors`}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="w-8 h-8 rounded-full object-cover shrink-0"
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
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate overflow-hidden"
              >
                {userName || 'User'}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavChange('Help')}
          title={collapsed ? 'Help' : undefined}
          className={`w-full flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-4'} py-3 text-slate-500 dark:text-slate-400 hover:text-primary-500 hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors rounded-xl`}
        >
          <div className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
            <HelpCircle size={20} />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  Help
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          {!collapsed && <ExternalLink size={14} className="opacity-40" />}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          title={collapsed ? 'Logout' : undefined}
          className={`w-full flex items-center ${collapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-3 text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50/80 dark:hover:bg-red-900/20 transition-colors rounded-xl`}
        >
          <LogOut size={20} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
}
