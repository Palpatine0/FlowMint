import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { StatCard } from "../components/ui/StatCard";
import { TransactionList } from "../components/ui/TransactionList";
import type { Transaction, DashboardStats } from "../types";
import { useState } from "react";

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

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const visibleTransactions = sortedTransactions.slice(0, displayLimit);
  const hasMore = displayLimit < sortedTransactions.length;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Balance"
          amount={`$${stats.balance.toLocaleString()}`}
          change={`${stats.balanceChange.toFixed(1)}%`}
          isPositive={stats.balance >= 0}
          icon={Wallet}
          iconColor="bg-blue-600"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <TransactionList
            transactions={visibleTransactions}
            onDelete={onDeleteTransaction}
          />
          {hasMore && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setDisplayLimit((prev) => prev + 5)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-6 py-2 rounded-full transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[350px]"></div>
          </div>
        </div>
      </div>
    </>
  );
}
