import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { Transaction, UserProfile } from '../types';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { TransactionList } from '../components/ui/TransactionList';
import { formatDate } from '../utils/formatDate';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (tx: Transaction) => void;
  dateFormat?: UserProfile['dateFormat'];
}

export function CalendarView({ transactions, onDelete, onEdit, dateFormat = 'MM/DD/YYYY' }: Props) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11

  // Navigation
  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => setCurrentDate(new Date());

  // Calculations for grid
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday

  const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Create blank cells for offset
  const blanks = Array.from({ length: firstDayOfMonth }).map(() => null);
  // Create day cells
  const days = Array.from({ length: daysInMonth }).map((_, i) => i + 1);
  const totalCells = [...blanks, ...days];

  // Make sure we have enough cells to complete the final row (multiple of 7)
  const remainder = totalCells.length % 7;
  if (remainder > 0) {
    const extraBlanks = Array.from({ length: 7 - remainder }).map(() => null);
    totalCells.push(...extraBlanks);
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Calendar</h2>
        <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-semibold px-4 min-w-[160px] text-center text-slate-800 dark:text-slate-200">
            {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={handleToday}
            className="px-4 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-slate-700 rounded-lg mx-1 transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="p-4 text-center text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-fr">
          {totalCells.map((dayNumber, i) => {
            // Null means empty padding cell at start/end of month
            if (dayNumber === null) {
              return (
                <div
                  key={`blank-${i}`}
                  className="min-h-[140px] bg-slate-50/30 dark:bg-slate-800/30 border-b border-r border-slate-100 dark:border-slate-700"
                />
              );
            }

            // Format dates simply using local time string construction to match transactions
            const mStr = String(month + 1).padStart(2, '0');
            const dStr = String(dayNumber).padStart(2, '0');
            const cellDatePrefix = `${year}-${mStr}-${dStr}`; // Format: YYYY-MM-DD

            const isToday =
              new Date().toLocaleDateString() ===
              new Date(year, month, dayNumber).toLocaleDateString();

            // Filter tx for this day (tx.date is an ISO string starting with YYYY-MM-DD)
            const dailyTxs = transactions.filter((t) => t.date.startsWith(cellDatePrefix));
            const income = dailyTxs
              .filter((t) => t.type === 'income')
              .reduce((s, t) => s + t.amount, 0);
            const expense = dailyTxs
              .filter((t) => t.type === 'expense')
              .reduce((s, t) => s + t.amount, 0);

            return (
              <div
                key={`day-${dayNumber}`}
                onClick={() => {
                  if (dailyTxs.length > 0) {
                    setSelectedDateStr(cellDatePrefix);
                  }
                }}
                className={`min-h-[140px] p-3 border-b border-r border-slate-100 dark:border-slate-700 group transition-colors ${dailyTxs.length > 0 ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50' : ''} ${isToday ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary-500 text-white shadow-md' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    {dayNumber}
                  </span>
                  {dailyTxs.length > 0 && (
                    <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-full">
                      {dailyTxs.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 mt-2 flex flex-col items-start w-full">
                  {income > 0 && (
                    <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded w-full truncate">
                      +${income.toLocaleString()}
                    </div>
                  )}
                  {expense > 0 && (
                    <div className="text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 px-2 py-1 rounded w-full truncate">
                      -${expense.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog
        open={selectedDateStr !== null}
        onClose={() => setSelectedDateStr(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          className: 'bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl',
        }}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
          <DialogTitle className="!p-0 !text-xl !font-bold text-slate-800 dark:text-slate-100">
            Transactions for {selectedDateStr ? formatDate(selectedDateStr, dateFormat) : ''}
          </DialogTitle>
          <IconButton
            onClick={() => setSelectedDateStr(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={20} />
          </IconButton>
        </div>
        <DialogContent className="!p-6 bg-slate-50 dark:bg-slate-900/50">
          {selectedDateStr &&
            (() => {
              const modalTransactions = transactions.filter((t) =>
                t.date.startsWith(selectedDateStr),
              );
              return (
                <TransactionList
                  transactions={modalTransactions}
                  onDelete={(id) => {
                    onDelete(id);
                    if (modalTransactions.length <= 1) setSelectedDateStr(null);
                  }}
                  onEdit={onEdit}
                  dateFormat={dateFormat}
                  emptyMessage="No transactions occurred on this day."
                />
              );
            })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
