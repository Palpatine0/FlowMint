import { Wallet, TrendingUp, TrendingDown, Search } from "lucide-react";
import { StatCard } from "../components/ui/StatCard";
import { TransactionList } from "../components/ui/TransactionList";
import type { Transaction, DashboardStats } from "../types";
import { useState } from "react";
import { BalanceChart } from "../components/ui/BalanceChart";

interface DashboardProps {
  stats: DashboardStats;
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export function Dashboard({
  stats,
  transactions,
  onDeleteTransaction,
}: DashboardProps) {
  const [displayLimit, setDisplayLimit] = useState(5);
  const [search, setSearch] = useState("");

  const sortedTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter((tx) =>
      tx.description.toLowerCase().includes(search.toLowerCase()),
    );

  const visibleTransactions = sortedTransactions.slice(0, displayLimit);
  const hasMore = displayLimit < sortedTransactions.length;

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
          title="Monthly Income"
          amount={`$${stats.income.toLocaleString()}`}
          change={`${stats.incomeChange.toFixed(1)}%`}
          isPositive={true}
          icon={TrendingUp}
          iconColor="bg-emerald-600"
        />
        <StatCard
          title="Monthly Expenses"
          amount={`$${stats.expenses.toLocaleString()}`}
          change={`${stats.expensesChange.toFixed(1)}%`}
          isPositive={false}
          icon={TrendingDown}
          iconColor="bg-rose-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setDisplayLimit(5); }}
              placeholder="Search transactions..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-400 bg-white"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <TransactionList
              transactions={visibleTransactions}
              onDelete={onDeleteTransaction}
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
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
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
          </div>
        </div>
      </div>
    </div>
  );
}
