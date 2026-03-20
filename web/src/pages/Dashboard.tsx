import { Wallet, TrendingUp, TrendingDown, Search, ChevronDown, Check } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { TransactionList } from '../components/ui/TransactionList';
import type { Transaction, DashboardStats, FilterRange, UserProfile } from '../types';
import { useState, useRef, useEffect } from 'react';
import { BalanceChart } from '../components/ui/BalanceChart';
import { CategoryChart } from '../components/ui/CategoryChart';

interface DashboardProps {
  activeRange: FilterRange;
  stats: DashboardStats;
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (tx: Transaction) => void;
  dateFormat?: UserProfile['dateFormat'];
}

export function Dashboard({
  activeRange,
  stats,
  transactions,
  onDeleteTransaction,
  onEditTransaction,
  dateFormat = 'MM/DD/YYYY',
}: DashboardProps) {
  const [displayLimit, setDisplayLimit] = useState(5);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = ['All', ...Array.from(new Set(transactions.map((tx) => tx.category))).sort()];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const sortedTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter((tx) => tx.description.toLowerCase().includes(search.toLowerCase()))
    .filter((tx) => categoryFilter === 'All' || tx.category === categoryFilter);

  const visibleTransactions = sortedTransactions.slice(0, displayLimit);
  const hasMore = displayLimit < sortedTransactions.length;
  const isFiltered = search.trim() !== '' || categoryFilter !== 'All';
  const emptyMessage = isFiltered
    ? 'No transactions match your search or filter.'
    : 'No transactions yet. Add your first one!';

  const getPeriodLabel = () => {
    switch (activeRange) {
      case 'week':
        return 'Weekly';
      case 'month':
        return 'Monthly';
      case 'year':
        return 'Yearly';
      case 'all':
        return 'All-Time';
      case 'custom':
        return 'Period';
      default:
        return 'Monthly';
    }
  };

  const periodLabel = getPeriodLabel();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Balance"
          amount={`$${stats.balance.toLocaleString()}`}
          change={`${stats.balanceChange.toFixed(1)}%`}
          isPositive={stats.balance >= 0}
          icon={Wallet}
          iconColor="bg-primary-400"
        />
        <StatCard
          title={`${periodLabel} Income`}
          amount={`$${stats.income.toLocaleString()}`}
          change={`${stats.incomeChange.toFixed(1)}%`}
          isPositive={true}
          icon={TrendingUp}
          iconColor="bg-emerald-600"
        />
        <StatCard
          title={`${periodLabel} Expenses`}
          amount={`$${stats.expenses.toLocaleString()}`}
          change={`${stats.expensesChange.toFixed(1)}%`}
          isPositive={false}
          icon={TrendingDown}
          iconColor="bg-rose-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setDisplayLimit(5);
                }}
                placeholder="Search transactions..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-400 bg-white dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
              />
            </div>
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-primary-400 focus:ring-2 focus:ring-primary-400 outline-none min-w-[130px] justify-between"
              >
                <span>{categoryFilter}</span>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-20 overflow-hidden">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategoryFilter(cat);
                        setDisplayLimit(5);
                        setDropdownOpen(false);
                      }}
                      className="flex items-center justify-between w-full px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-slate-700 hover:text-primary-600 transition-colors"
                    >
                      {cat}
                      {cat === categoryFilter && <Check size={13} className="text-primary-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-6">
            <TransactionList
              transactions={visibleTransactions}
              onDelete={onDeleteTransaction}
              onEdit={onEditTransaction}
              emptyMessage={emptyMessage}
              dateFormat={dateFormat}
            />
          </div>

          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setDisplayLimit((prev) => prev + 5)}
                className="text-sm font-semibold text-primary-500 hover:text-primary-600 bg-primary-50 hover:bg-primary-100 px-8 py-2.5 rounded-full transition-all"
              >
                Load More
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                  Balance Trend
                </h3>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-primary-50 text-primary-500">
                  LIVE
                </span>
              </div>

              <div className="flex-1 w-full min-h-0">
                <BalanceChart transactions={transactions} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm h-[340px] flex flex-col">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4">
                Spending by Category
              </h3>
              <div className="flex-1 w-full min-h-0">
                <CategoryChart transactions={transactions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
