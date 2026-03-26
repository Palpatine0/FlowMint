import { useState, useRef, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { BarChart3, Filter, ChevronDown, Check } from 'lucide-react';
import type { Transaction, FilterRange } from '../types';
import { DailyBarChart } from '../components/ui/DailyBarChart';

interface Props {
  transactions: Transaction[];
}

export function Charts({ transactions }: Props) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeRange, setActiveRange] = useState<FilterRange>('week');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const categories = Array.from(new Set(transactions.map((t) => t.category))).sort();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  // Filter transactions based on selection AND time range
  const filteredTxs = transactions.filter((t) => {
    const catMatch = selectedCategories.length === 0 || selectedCategories.includes(t.category);

    // Time Filter Logic
    const txDate = new Date(t.date);
    const now = new Date();
    let timeMatch = true;

    if (activeRange === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      timeMatch = txDate >= startOfWeek;
    } else if (activeRange === 'month') {
      timeMatch =
        txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    } else if (activeRange === 'year') {
      timeMatch = txDate.getFullYear() === now.getFullYear();
    }

    return catMatch && timeMatch;
  });

  // Total Amount by Type logic
  const totalByType = [
    {
      name: 'Expense',
      amount: filteredTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      fill: '#ef4444',
    },
    {
      name: 'Income',
      amount: filteredTxs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      fill: '#10b981',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="text-primary-500" />
            Detailed Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Advanced breakdown with multi-category filtering.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Range Selector */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {(['week', 'month', 'year', 'all'] as FilterRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setActiveRange(range)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeRange === range
                    ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                } uppercase tracking-wider`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Category Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-primary-400 transition-all font-semibold"
            >
              <Filter size={14} />
              Categories
              {selectedCategories.length > 0 && (
                <span className="bg-primary-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {selectedCategories.length}
                </span>
              )}
              <ChevronDown
                size={14}
                className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden py-2">
                <button
                  onClick={() => setSelectedCategories([])}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-primary-500 hover:bg-slate-50 dark:hover:bg-slate-700 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700 mb-1"
                >
                  Clear All
                </button>
                <div className="max-h-60 overflow-y-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className="flex items-center justify-between w-full px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 group transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full bg-primary-400 group-hover:scale-125 transition-transform`}
                        />
                        {cat}
                      </span>
                      {selectedCategories.includes(cat) && (
                        <Check size={14} className="text-primary-500" strokeWidth={3} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Main Bar Chart - Amount by Category */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 text-center mb-10">
            Total Amount by Category
          </h2>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={totalByType} margin={{ top: 40, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid
                  strokeDasharray="1 1"
                  vertical={true}
                  stroke="#e2e8f0"
                  className="dark:stroke-slate-700"
                />
                <XAxis
                  dataKey="name"
                  axisLine={{ stroke: '#94a3b8' }}
                  tickLine={false}
                  tick={{ fontSize: 13, fill: '#475569', fontWeight: 600 }}
                  dy={20}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis
                  width={70}
                  label={{
                    value: 'Amount ($)',
                    angle: -90,
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fill: '#475569', fontWeight: 700, fontSize: 13 },
                    offset: -10,
                  }}
                  axisLine={{ stroke: '#94a3b8' }}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
                  tickFormatter={(v) => {
                    if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
                    if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
                    return `$${v}`;
                  }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(v: any) => [`$${Number(v).toLocaleString()}`, 'Total']}
                />
                <Bar
                  dataKey="amount"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={80}
                  label={{
                    position: 'top',
                    formatter: (v: any) => `$${Number(v).toFixed(0)}`,
                    fill: '#334155',
                    fontSize: 12,
                    fontWeight: 700,
                    offset: 10,
                  }}
                >
                  {totalByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Second Chart - Weekly/Daily Cash Flow (Moved from Overview) */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-sm h-[560px] flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight mb-8">
            {activeRange.toUpperCase()} CASH FLOW
          </h2>
          <div className="flex-1 w-full min-h-0">
            <DailyBarChart transactions={filteredTxs} activeRange={activeRange} />
          </div>
        </div>
      </div>

      {/* Insight Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/50 rounded-2xl">
          <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-1">
            Total Expenses
          </p>
          <p className="text-2xl font-black text-rose-900 dark:text-rose-100">
            $
            {totalByType[0].amount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl">
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">
            Total Income
          </p>
          <p className="text-2xl font-black text-emerald-900 dark:text-emerald-100">
            $
            {totalByType[1].amount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="p-6 bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800/50 rounded-2xl">
          <p className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">
            Net Impact
          </p>
          <p className="text-2xl font-black text-primary-900 dark:text-primary-100">
            $
            {(totalByType[1].amount - totalByType[0].amount).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
