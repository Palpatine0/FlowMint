import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  PieChart,
  Settings,
  LogOut,
} from "lucide-react";
import iconLogo from "../../assets/icon-logo.svg";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview" },
  { icon: Wallet, label: "Accounts" },
  { icon: CreditCard, label: "Transactions" },
  { icon: PieChart, label: "Budgets" },
  { icon: Settings, label: "Settings" },
];

interface SidebarProps {
  activeNav: string;
  onNavChange: (label: string) => void;
}

export function Sidebar({ activeNav, onNavChange }: SidebarProps) {
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
                ? "bg-primary-50 dark:bg-primary-900/30 text-primary-500 font-semibold"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-700">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-xl">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
