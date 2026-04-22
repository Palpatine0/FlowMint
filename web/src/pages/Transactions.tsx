import { useState, useRef, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  Check,
  ArrowDownCircle,
  ArrowUpCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { TransactionList } from '../components/ui/TransactionList';
import type { Transaction, UserProfile } from '../types';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (tx: Transaction) => void;
  dateFormat?: UserProfile['dateFormat'];
}

export function Transactions({ transactions, onDelete, onEdit, dateFormat = 'MM/DD/YYYY' }: Props) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'income' | 'expense'>('All');
  const [displayLimit, setDisplayLimit] = useState(15);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const categories = ['All', ...Array.from(new Set(transactions.map((tx) => tx.category))).sort()];

  const filtered = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter((tx) => tx.description.toLowerCase().includes(search.toLowerCase()))
    .filter((tx) => categoryFilter === 'All' || tx.category === categoryFilter)
    .filter((tx) => typeFilter === 'All' || tx.type === typeFilter);

  const visible = filtered.slice(0, displayLimit);
  const hasMore = displayLimit < filtered.length;

  const totalIncome = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);
  const fmt = (n: number) =>
    `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const isFiltered = search.trim() !== '' || categoryFilter !== 'All' || typeFilter !== 'All';
  const emptyMessage = isFiltered
    ? 'No transactions match your filters.'
    : 'No transactions yet. Add your first one!';

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Transactions</h1>
        <p className="text-slate-500 dark:text-slate-400">
          A complete record of all your financial activity.
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-1 gap-2.5 min-[520px]:grid-cols-3 sm:gap-4">
        <div className="flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-white p-3.5 dark:border-slate-700 dark:bg-slate-800 sm:gap-3 sm:p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 sm:h-10 sm:w-10">
            <SlidersHorizontal size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 sm:text-xs">Showing</p>
            <p className="truncate text-base font-black text-slate-800 dark:text-slate-100 sm:text-lg">
              {filtered.length}{' '}
              <span className="text-xs font-normal text-slate-400 sm:text-sm">transactions</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-white p-3.5 dark:border-slate-700 dark:bg-slate-800 sm:gap-3 sm:p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-900/30 sm:h-10 sm:w-10">
            <ArrowUpCircle size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 sm:text-xs">
              Total Income
            </p>
            <p className="truncate text-base font-black text-emerald-600 sm:text-lg">
              {fmt(totalIncome)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-white p-3.5 dark:border-slate-700 dark:bg-slate-800 sm:gap-3 sm:p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-500 dark:bg-rose-900/30 sm:h-10 sm:w-10">
            <ArrowDownCircle size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 sm:text-xs">
              Total Expenses
            </p>
            <p className="truncate text-base font-black text-rose-500 sm:text-lg">
              {fmt(totalExpense)}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setDisplayLimit(15);
            }}
            placeholder="Search transactions..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-400 bg-white dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
          />
        </div>

        {/* Type toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 gap-1">
          {(['All', 'income', 'expense'] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTypeFilter(t);
                setDisplayLimit(15);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
                typeFilter === t
                  ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Category dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-primary-400 outline-none min-w-[140px] justify-between"
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
                    setDisplayLimit(15);
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

      {/* List */}
      <TransactionList
        transactions={visible}
        onDelete={onDelete}
        onEdit={onEdit}
        emptyMessage={emptyMessage}
        dateFormat={dateFormat}
      />

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={() => setDisplayLimit((prev) => prev + 15)}
            className="text-sm font-semibold text-primary-500 hover:text-primary-600 bg-primary-50 hover:bg-primary-100 px-8 py-2.5 rounded-full transition-all"
          >
            Load More ({filtered.length - displayLimit} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
