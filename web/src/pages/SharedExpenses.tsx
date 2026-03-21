import { Users, CheckCircle2 } from 'lucide-react';
import { getSharedBalances } from '../services/transactionService';
import type { Transaction } from '../types';

interface SharedExpensesProps {
  transactions: Transaction[];
  onSettleUp: (personName: string) => void;
  defaultCurrency: string;
}

export function SharedExpenses({ transactions, onSettleUp, defaultCurrency }: SharedExpensesProps) {
  const balances = getSharedBalances(transactions);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: defaultCurrency || 'USD',
    }).format(amount);
  };

  if (balances.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mb-4">
          <Users size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          No Shared Expenses
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm">
          You don't have any outstanding balances. When you split an expense, the people who owe you
          will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
            Shared Expenses
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Keep track of who owes you money.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {balances.map((balance) => (
          <div
            key={balance.person}
            className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-500 flex items-center justify-center font-bold text-xl mb-4">
                {balance.person.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
                {balance.person}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Owes you</p>
              <div className="text-3xl font-black text-rose-500 mb-6">
                {formatCurrency(balance.amount)}
              </div>
            </div>

            <button
              onClick={() => onSettleUp(balance.person)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl transition-colors"
            >
              <CheckCircle2 size={20} />
              Mark as Settled
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
