import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { RecurringTransaction, TransactionType, RecurringFrequency } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: RecurringTransaction) => void;
  editTransaction?: RecurringTransaction;
  defaultCurrency?: string;
}

const PRESET_CATEGORIES = [
  'Rent',
  'Food',
  'Clothes',
  'Transport',
  'Utilities',
  'Entertainment',
  'Salary',
  'Other',
];

const PRESET_ACCOUNTS = ['Wallet', 'Bank Account', 'Credit Card'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD'];
const FREQUENCIES: { label: string; value: RecurringFrequency }[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
];

const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 1.09,
  GBP: 1.27,
  INR: 0.012,
  JPY: 0.0067,
  CAD: 1,
};

export function AddRecurringModal({
  isOpen,
  onClose,
  onAdd,
  editTransaction,
  defaultCurrency = 'USD',
}: Props) {
  const isEdit = !!editTransaction;
  const isPreset = (cat: string) => PRESET_CATEGORIES.includes(cat);

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(PRESET_CATEGORIES[0]);
  const getLocalDateString = (d: Date) => {
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState(getLocalDateString(new Date()));
  const [frequency, setFrequency] = useState<RecurringFrequency>('monthly');
  const [type, setType] = useState<TransactionType>('expense');
  const [account, setAccount] = useState(PRESET_ACCOUNTS[0]);
  const [currency, setCurrency] = useState(defaultCurrency);
  const [customCategory, setCustomCategory] = useState('');
  const [errors, setErrors] = useState<{
    amount?: string;
    description?: string;
  }>({});
  const amountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && editTransaction) {
      setAmount(String(editTransaction.originalAmount || editTransaction.amount));
      setDescription(editTransaction.description);
      setType(editTransaction.type);
      setStartDate(getLocalDateString(new Date(editTransaction.startDate)));
      setFrequency(editTransaction.frequency);
      if (isPreset(editTransaction.category)) {
        setCategory(editTransaction.category);
        setCustomCategory('');
      } else {
        setCategory('Other');
        setCustomCategory(editTransaction.category);
      }
      setAccount(editTransaction.account || PRESET_ACCOUNTS[0]);
      setCurrency(editTransaction.currency || defaultCurrency);
    } else if (isOpen && !editTransaction) {
      setAmount('');
      setDescription('');
      setCategory(PRESET_CATEGORIES[0]);
      setCustomCategory('');
      setAccount(PRESET_ACCOUNTS[0]);
      setCurrency(defaultCurrency);
      setStartDate(getLocalDateString(new Date()));
      setFrequency('monthly');
      setType('expense');
      setErrors({});
    }
  }, [isOpen, editTransaction, defaultCurrency]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => amountRef.current?.focus(), 0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { amount?: string; description?: string } = {};
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = 'Amount must be greater than 0.';
    if (!description.trim()) newErrors.description = 'Description is required.';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const finalCategory = category === 'Other' ? customCategory : category;

    const typedAmount = parseFloat(amount);
    const rate = EXCHANGE_RATES[currency] || 1;
    const baseAmountValue = currency === 'USD' ? typedAmount : typedAmount * rate;

    onAdd({
      id: editTransaction ? editTransaction.id : crypto.randomUUID(),
      amount: baseAmountValue,
      originalAmount: typedAmount,
      currency: currency,
      description,
      type,
      startDate: new Date(startDate + 'T00:00:00').toISOString(),
      frequency,
      isActive: editTransaction ? editTransaction.isActive : true,
      lastProcessedDate: editTransaction ? editTransaction.lastProcessedDate : null,
      category: finalCategory || 'Uncategorized',
      account: account,
    });
    onClose();
  };

  const handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-slate-800"
          >
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {isEdit ? 'Edit Recurring' : 'Add Recurring'}
              </h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Amount
                  </label>
                  <input
                    ref={amountRef}
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setErrors((p) => ({ ...p, amount: undefined }));
                    }}
                    className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-400 outline-none bg-white dark:bg-slate-700 dark:text-slate-100 ${errors.amount ? 'border-rose-400' : 'border-slate-200 dark:border-slate-600'}`}
                    placeholder="0.00"
                  />
                  {errors.amount && <p className="text-rose-500 text-xs mt-1">{errors.amount}</p>}
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-primary-400 bg-white dark:bg-slate-700 dark:text-slate-100"
                  >
                    {CURRENCIES.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setErrors((p) => ({ ...p, description: undefined }));
                  }}
                  className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-400 outline-none bg-white dark:bg-slate-700 dark:text-slate-100 ${errors.description ? 'border-rose-400' : 'border-slate-200 dark:border-slate-600'}`}
                  placeholder="e.g. Netflix Subscription"
                />
                {errors.description && (
                  <p className="text-rose-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-primary-400 bg-white dark:bg-slate-700 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as RecurringFrequency)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-primary-400 bg-white dark:bg-slate-700 dark:text-slate-100"
                  >
                    {FREQUENCIES.map((freq) => (
                      <option key={freq.value} value={freq.value}>
                        {freq.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Account
                  </label>
                  <select
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-primary-400 bg-white dark:bg-slate-700 dark:text-slate-100"
                  >
                    {PRESET_ACCOUNTS.map((acc) => (
                      <option key={acc} value={acc}>
                        {acc}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-primary-400 bg-white dark:bg-slate-700 dark:text-slate-100"
                  >
                    {PRESET_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {category === 'Other' && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Custom Category
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gym, Subscriptions..."
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-primary-200 dark:border-slate-600 bg-primary-50/30 dark:bg-slate-700 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-primary-400 outline-none"
                  />
                </div>
              )}

              <div className="flex gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`flex-1 py-2 rounded-xl border-2 transition-all ${type === 'income' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 dark:border-slate-600 text-slate-500 dark:text-slate-400'}`}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`flex-1 py-2 rounded-xl border-2 transition-all ${type === 'expense' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-slate-100 dark:border-slate-600 text-slate-500 dark:text-slate-400'}`}
                >
                  Expense
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-400 text-white py-3 rounded-xl font-bold hover:bg-primary-500 transition-colors mt-4"
              >
                {isEdit ? 'Update Recurring' : 'Save Recurring'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
