import { Trash2, Edit2, Play, Pause } from 'lucide-react';
import type { RecurringTransaction, UserProfile } from '../types';

interface RecurringProps {
  recurringTransactions: RecurringTransaction[];
  onDelete: (id: string) => void;
  onEdit: (tx: RecurringTransaction) => void;
  onToggleActive: (id: string, currentlyActive: boolean) => void;
  dateFormat?: UserProfile['dateFormat'];
}

export function Recurring({
  recurringTransactions,
  onDelete,
  onEdit,
  onToggleActive,
  dateFormat = 'MM/DD/YYYY',
}: RecurringProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    if (dateFormat === 'DD/MM/YYYY') return `${day}/${month}/${year}`;
    if (dateFormat === 'YYYY-MM-DD') return `${year}-${month}-${day}`;
    return `${month}/${day}/${year}`;
  };

  if (recurringTransactions.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden p-8 text-center text-slate-500">
          No recurring transactions set up yet. Add your first one to automate your finances!
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm">
                <th className="py-4 px-6 font-medium">Description</th>
                <th className="py-4 px-6 font-medium">Category</th>
                <th className="py-4 px-6 font-medium text-right">Amount</th>
                <th className="py-4 px-6 font-medium">Frequency</th>
                <th className="py-4 px-6 font-medium">Start Date</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recurringTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                      {tx.description}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span
                      className={`font-bold ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-800 dark:text-slate-100'}`}
                    >
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                    </span>
                    {tx.currency && tx.currency !== 'USD' && (
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {tx.originalAmount} {tx.currency}
                      </p>
                    )}
                  </td>
                  <td className="py-4 px-6 capitalize">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      {tx.frequency}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(tx.startDate)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => onToggleActive(tx.id, tx.isActive)}
                      className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md transition-colors ${
                        tx.isActive
                          ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700'
                      }`}
                    >
                      {tx.isActive ? (
                        <>
                          <Pause size={12} /> Active
                        </>
                      ) : (
                        <>
                          <Play size={12} /> Paused
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(tx)}
                        className="p-1.5 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this recurring transaction?')) {
                            onDelete(tx.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
