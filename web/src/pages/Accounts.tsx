import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Transaction } from '../types';

function buildNetWorthData(transactions: Transaction[]) {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  let running = 0;
  const points: { date: string; balance: number }[] = [];
  for (const tx of sorted) {
    running += tx.type === 'income' ? tx.amount : -tx.amount;
    const label = new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    points.push({ date: label, balance: Math.round(running) });
  }
  // Deduplicate: keep last balance per date label
  const map = new Map<string, number>();
  for (const p of points) map.set(p.date, p.balance);
  return Array.from(map.entries()).map(([date, balance]) => ({ date, balance }));
}

interface Props {
  transactions: Transaction[];
}

const CATEGORY_META: Record<string, { pillBg: string; pillText: string; bar: string }> = {
  Rent: { pillBg: '#f3e8ff', pillText: '#7e22ce', bar: '#c084fc' },
  Food: { pillBg: '#fff7ed', pillText: '#c2410c', bar: '#fb923c' },
  Clothes: { pillBg: '#eff6ff', pillText: '#1d4ed8', bar: '#60a5fa' },
  Transport: { pillBg: '#ecfeff', pillText: '#0e7490', bar: '#22d3ee' },
  Utilities: { pillBg: '#fefce8', pillText: '#a16207', bar: '#facc15' },
  Entertainment: { pillBg: '#fdf2f8', pillText: '#be185d', bar: '#f472b6' },
  Salary: { pillBg: '#f0fdf4', pillText: '#15803d', bar: '#4ade80' },
};
const DEFAULT_META = { pillBg: '#f8fafc', pillText: '#475569', bar: '#94a3b8' };

export function Accounts({ transactions }: Props) {
  // Restoring these since the category breakdown part still uses them:
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);
  const categoryTotals = Object.entries(
    transactions
      .filter((t) => t.type === 'expense')
      .reduce<Record<string, number>>((acc, t) => {
        acc[t.category] = (acc[t.category] ?? 0) + t.amount;
        return acc;
      }, {}),
  )
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);
  const maxCat = categoryTotals[0]?.total ?? 1;

  const accountNames = Array.from(new Set(transactions.map((t) => t.account || 'Wallet')));

  const accountSummaries = accountNames.map((accName) => {
    const accTxs = transactions.filter((t) => (t.account || 'Wallet') === accName);
    const inc = accTxs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const exp = accTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const bal = inc - exp;
    const spentPct = inc > 0 ? Math.min((exp / inc) * 100, 100) : 0;
    return {
      name: accName,
      balance: bal,
      income: inc,
      expenses: exp,
      spentPct,
      txCount: accTxs.length,
    };
  });

  return (
    <div
      className="max-w-3xl mx-auto"
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest px-2 pb-2">
        My Accounts
      </p>

      {accountSummaries.map((acc) => (
        <div
          key={acc.name}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-6 mb-4"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{acc.name}</h3>
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              ${acc.balance.toLocaleString()}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  Income
                </p>
                <ArrowUpRight size={14} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                ${acc.income.toLocaleString()}
              </p>
            </div>
            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-rose-700 dark:text-rose-400">Expenses</p>
                <ArrowDownRight size={14} className="text-rose-600 dark:text-rose-400" />
              </div>
              <p className="text-xl font-bold text-rose-700 dark:text-rose-300">
                ${acc.expenses.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* ── Net Worth Trend ──────────────────────────── */}
      {(() => {
        const data = buildNetWorthData(transactions);
        const isPositive = (data[data.length - 1]?.balance ?? 0) >= 0;
        const lineColor = isPositive ? '#76DDAA' : '#f87171';
        return (
          <div
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm"
            style={{ padding: '24px' }}
          >
            <p
              className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
              style={{ marginBottom: '20px' }}
            >
              Net Worth Over Time
            </p>
            {data.length < 2 ? (
              <p className="text-slate-400 dark:text-slate-500 text-sm text-center py-6">
                Add more transactions to see your trend.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={lineColor} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${Number(v).toLocaleString()}`}
                    width={70}
                  />
                  <Tooltip
                    formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Net Worth']}
                    contentStyle={{
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke={lineColor}
                    strokeWidth={2.5}
                    fill="url(#netWorthGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: lineColor }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        );
      })()}

      {/* ── Category breakdown ───────────────────────── */}
      <div
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm"
        style={{ padding: '24px' }}
      >
        <p
          className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
          style={{ marginBottom: '20px' }}
        >
          Spending by Category
        </p>

        {categoryTotals.length === 0 ? (
          <p className="text-slate-400 dark:text-slate-500 text-sm text-center py-6">
            No expense transactions yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {categoryTotals.map(({ name, total }) => {
              const c = CATEGORY_META[name] ?? DEFAULT_META;
              const barPct = Math.round((total / maxCat) * 100);
              const ofTotal = totalExpenses > 0 ? Math.round((total / totalExpenses) * 100) : 0;
              return (
                <div key={name}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        background: c.pillBg,
                        color: c.pillText,
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '3px 10px',
                        borderRadius: '999px',
                      }}
                    >
                      {name}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>{ofTotal}%</span>
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#334155',
                          minWidth: '72px',
                          textAlign: 'right',
                        }}
                      >
                        ${total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      height: '6px',
                      background: '#f1f5f9',
                      borderRadius: '999px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '6px',
                        width: `${barPct}%`,
                        background: c.bar,
                        borderRadius: '999px',
                        transition: 'width .5s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
