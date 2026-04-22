import React, { useState, useRef } from 'react';
import { X, UploadCloud, AlertCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Papa from 'papaparse';
import type {
  Transaction,
  TransactionType,
  RecurringTransaction,
  RecurringFrequency,
} from '../../types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (transactions: Transaction[], recurring: RecurringTransaction[]) => void;
  defaultCurrency?: string;
}

export function ImportModal({
  isOpen,
  onClose,
  onImport,
  defaultCurrency = 'USD',
}: ImportModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    setError(null);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsed = results.data as Record<string, string>[];
          if (!parsed || parsed.length === 0) {
            throw new Error('The file appears to be empty or improperly formatted.');
          }

          const newlyImported: Transaction[] = [];
          const newlyImportedRecurring: RecurringTransaction[] = [];

          for (const row of parsed) {
            // Find keys regardless of case
            const keys = Object.keys(row);
            const getVal = (possibleKeys: string[]) => {
              const key = keys.find((k) => possibleKeys.includes(k.toLowerCase().trim()));
              return key ? row[key]?.trim() : '';
            };

            const rawDate = getVal(['date', 'time', 'timestamp']);
            const rawAmount = getVal(['amount', 'value', 'price', 'cost']);
            const rawDesc = getVal(['description', 'name', 'memo', 'title', 'payee']);
            const rawCat = getVal(['category', 'group']);
            const rawType = getVal(['type', 'transaction type']);
            const rawAcc = getVal(['account', 'bank', 'card']);
            const rawFreq = getVal(['frequency', 'recurring', 'recurrence', 'repeat']);

            if (!rawDate || !rawAmount) {
              continue; // Skip invalid rows broadly
            }

            const parsedAmount = Math.abs(parseFloat(rawAmount.replace(/[^0-9.-]+/g, '')));
            if (isNaN(parsedAmount)) continue;

            let dateStr = rawDate.trim();
            // If the date is exactly YYYY-MM-DD without time, JS parses it as UTC midnight.
            // This causes it to shift to the previous day in timezones behind UTC (like Pacific Time).
            // Appending T12:00:00 forces it to mid-day, avoiding date shifts.
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
              dateStr += 'T12:00:00';
            }
            const dateObj = new Date(dateStr);
            if (isNaN(dateObj.getTime())) continue;

            let determinedType: TransactionType = 'expense';
            if (rawType.toLowerCase() === 'income' || rawType.toLowerCase() === 'credit') {
              determinedType = 'income';
            } else if (parseFloat(rawAmount) > 0 && !rawType) {
              // some banks use positive for income, negative for expense
              determinedType = 'income';
            }

            const cleanFreq = rawFreq.toLowerCase();
            const validFrequencies = ['daily', 'weekly', 'monthly', 'yearly'];

            if (validFrequencies.includes(cleanFreq)) {
              newlyImportedRecurring.push({
                id: crypto.randomUUID(),
                amount: parsedAmount,
                originalAmount: parsedAmount,
                currency: defaultCurrency,
                description: rawDesc || 'Imported Recurring',
                category: rawCat || 'Other',
                type: determinedType,
                account: rawAcc || 'Imported',
                frequency: cleanFreq as RecurringFrequency,
                startDate: dateObj.toISOString(),
                lastProcessedDate: null,
                isActive: true,
              });
            } else {
              newlyImported.push({
                id: crypto.randomUUID(),
                amount: parsedAmount,
                originalAmount: parsedAmount,
                currency: defaultCurrency,
                date: dateObj.toISOString(),
                description: rawDesc || 'Imported Transaction',
                category: rawCat || 'Other',
                type: determinedType,
                account: rawAcc || 'Imported',
              });
            }
          }

          if (newlyImported.length === 0 && newlyImportedRecurring.length === 0) {
            throw new Error(
              'No valid standard or recurring transactions were found. Make sure columns contain Date and Amount.',
            );
          }

          onImport(newlyImported, newlyImportedRecurring);
          onClose();
        } catch (err: any) {
          setError(err.message || 'Failed to parse CSV file.');
        }
      },
      error: (error) => {
        setError(`Failed to read file: ${error.message}`);
      },
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
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
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Import CSV</h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Upload your bank statement as a `.csv` file. We look for columns like{' '}
                <strong>Date</strong>, <strong>Amount</strong>, and <strong>Description</strong>.
                Add a <strong>Frequency</strong> column (daily, weekly, monthly, yearly) to
                automatically create Recurring Transactions!
              </p>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all ${
                  isDragging
                    ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <UploadCloud
                  size={48}
                  className={`mb-4 ${isDragging ? 'text-primary-500' : 'text-slate-400'}`}
                />
                <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Click or drag file here
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  CSV files only (max 5MB)
                </p>
              </div>
              <input
                type="file"
                accept=".csv, application/vnd.ms-excel, text/csv"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />

              {error && (
                <div className="mt-4 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex gap-3 text-rose-600 dark:text-rose-400 text-sm">
                  <AlertCircle size={20} className="shrink-0" />
                  <p>{error}</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
