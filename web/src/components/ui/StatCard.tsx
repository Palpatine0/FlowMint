import { ArrowUpRight, ArrowDownRight, type LucideIcon } from 'lucide-react';
import CountUpLib from 'react-countup';

const CountUp = (CountUpLib as any).default || CountUpLib;

interface StatCardProps {
  title: string;
  amount: number;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
  iconBg: string;
  iconText: string;
}

export function StatCard({
  title,
  amount,
  change,
  isPositive,
  icon: Icon,
  iconBg,
  iconText,
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${iconBg}`}>
          <Icon className={iconText} size={24} />
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}
        >
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {change}
        </div>
      </div>

      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
          <CountUp
            end={amount}
            duration={1.5}
            separator=","
            prefix="$"
            decimals={Math.abs(amount % 1) > 0.01 ? 2 : 0}
          />
        </h3>
      </div>
    </div>
  );
}
