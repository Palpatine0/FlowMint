import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { StatCard } from "../components/ui/StatCard";
import { TransactionList } from "../components/ui/TransactionList";
import type { Transaction, DashboardStats } from "../types";

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
        <div className="lg:col-span-2">
          <TransactionList
            transactions={transactions.slice(0, 5)}
            onDelete={onDeleteTransaction}
          />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 h-full min-h-[300px] flex items-center justify-center text-slate-400 shadow-sm">
          Chart View
        </div>
      </div>
    </>
  );
}
