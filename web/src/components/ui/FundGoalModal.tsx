import React, { useState, useEffect } from 'react';
import { X, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { SavingsGoal } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onFund: (goalId: string, amount: number, isWithdrawal: boolean) => void;
  goal: SavingsGoal | null;
}

export function FundGoalModal({ isOpen, onClose, onFund, goal }: Props) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'add' | 'withdraw'>('add');

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setType('add');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) return;
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    onFund(goal.id, val, type === 'withdraw');
  };

  const handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && goal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={handleBackdropMouseDown}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-800"
          >
            <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Update Funds</h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div className="bg-slate-50 dark:bg-slate-900 flex justify-between rounded-xl p-1 mb-6">
                <button
                  type="button"
                  onClick={() => setType('add')}
                  className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                    type === 'add'
                      ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  <ArrowDownCircle size={16} /> Add
                </button>
                <button
                  type="button"
                  onClick={() => setType('withdraw')}
                  className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                    type === 'withdraw'
                      ? 'bg-white dark:bg-slate-800 text-rose-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  <ArrowUpCircle size={16} /> Withdraw
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-semibold focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400"
                  placeholder="$0.00"
                />
                {type === 'withdraw' && parseFloat(amount) > goal.currentAmount && (
                  <p className="text-xs text-rose-500 mt-2">
                    Cannot withdraw more than ${goal.currentAmount.toLocaleString()}!
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={type === 'withdraw' && parseFloat(amount) > goal.currentAmount}
                  className={`w-full py-3.5 rounded-xl font-bold transition-transform active:scale-95 text-white ${
                    type === 'add'
                      ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
                      : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
                  } shadow-sm disabled:opacity-50 disabled:pointer-events-none`}
                >
                  {type === 'add' ? 'Add Funds' : 'Withdraw Funds'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
