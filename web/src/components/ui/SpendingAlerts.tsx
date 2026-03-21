import { useState } from 'react';
import { AlertTriangle, X, TrendingUp } from 'lucide-react';
import type { Transaction } from '../../types';

interface Anomaly {
  category: string;
  thisMonth: number;
  lastMonth: number;
  pctChange: number;
}

function getSpendingAnomalies(transactions: Transaction[], threshold = 30): Anomaly[] {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  const byCategory: Record<string, { thisMonth: number; lastMonth: number }> = {};

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const d = new Date(t.date);
      const cat = t.category;
      if (!byCategory[cat]) byCategory[cat] = { thisMonth: 0, lastMonth: 0 };
      if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) {
        byCategory[cat].thisMonth += t.amount - (t.splitAmount || 0);
      } else if (d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear) {
        byCategory[cat].lastMonth += t.amount - (t.splitAmount || 0);
      }
    });

  return Object.entries(byCategory)
    .filter(([, v]) => v.lastMonth > 0 && v.thisMonth > 0)
    .map(([category, v]) => ({
      category,
      thisMonth: v.thisMonth,
      lastMonth: v.lastMonth,
      pctChange: ((v.thisMonth - v.lastMonth) / v.lastMonth) * 100,
    }))
    .filter((a) => a.pctChange >= threshold)
    .sort((a, b) => b.pctChange - a.pctChange);
}

interface Props {
  transactions: Transaction[];
}

export function SpendingAlerts({ transactions }: Props) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const anomalies = getSpendingAnomalies(transactions).filter((a) => !dismissed.has(a.category));

  if (anomalies.length === 0) return null;

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  return (
    <div className="space-y-2 mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
      {anomalies.map((a) => (
        <div
          key={a.category}
          className="flex items-start justify-between gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-2xl"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-800/50 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle size={15} className="text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                {a.category} spending is up
                <span className="inline-flex items-center gap-0.5 text-rose-500 font-black">
                  <TrendingUp size={13} />
                  {a.pctChange.toFixed(0)}%
                </span>
                this month
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                Last month: {fmt(a.lastMonth)} → This month: {fmt(a.thisMonth)}
              </p>
            </div>
          </div>
          <button
            onClick={() => setDismissed((prev) => new Set(prev).add(a.category))}
            className="text-amber-400 hover:text-amber-600 dark:hover:text-amber-200 transition-colors shrink-0 mt-0.5"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
