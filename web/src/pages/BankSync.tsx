import { useState } from 'react';
import { Building2, ShieldCheck, RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';
import type { Transaction } from '../types';

interface Props {
  onSync: (transactions: Transaction[]) => void;
}

const BANKS = [
  { name: 'Chase', color: '#117aca', logo: 'CH' },
  { name: 'Bank of America', color: '#dc143c', logo: 'BA' },
  { name: 'Wells Fargo', color: '#ffff00', textColor: '#d71e28', logo: 'WF' },
  { name: 'Citibank', color: '#003b70', logo: 'CI' },
  { name: 'Capital One', color: '#004a75', logo: 'CO' },
  { name: 'American Express', color: '#006fcf', logo: 'AX' },
];

export function BankSync({ onSync }: Props) {
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'connecting' | 'syncing' | 'success'>(
    'idle',
  );
  const [progress, setProgress] = useState(0);

  const startSync = () => {
    setSyncStatus('connecting');
    setProgress(0);

    // Simulated connection phase
    setTimeout(() => {
      setSyncStatus('syncing');
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 100);

      // Simulated completion
      setTimeout(() => {
        setSyncStatus('success');

        // Mock data to inject
        const mockTransactions: Transaction[] = [
          {
            id: crypto.randomUUID(),
            amount: 45.5,
            category: 'Food',
            date: new Date().toISOString(),
            description: 'Starbucks Coffee (Synced)',
            type: 'expense',
          },
          {
            id: crypto.randomUUID(),
            amount: 1200.0,
            category: 'Income',
            date: new Date().toISOString(),
            description: 'Payroll Deposit (Synced)',
            type: 'income',
          },
          {
            id: crypto.randomUUID(),
            amount: 15.99,
            category: 'Entertainment',
            date: new Date().toISOString(),
            description: 'Netflix Subscription (Synced)',
            type: 'expense',
          },
        ];

        onSync(mockTransactions);
      }, 2500);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <RotateCcw className="text-primary-500" />
          Bank Synchronization
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Connect your accounts to automatically import and categorize your transactions.
        </p>
      </div>

      {syncStatus === 'idle' && (
        <div className="grid gap-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
              <ShieldCheck className="text-emerald-500" size={32} />
              <div>
                <h3 className="font-bold text-emerald-900 dark:text-emerald-400 text-lg">
                  Secure & Private
                </h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-500">
                  We use 256-bit encryption to keep your data safe. FlowMint never stores your login
                  credentials.
                </p>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">
              Select your institution
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {BANKS.map((bank) => (
                <button
                  key={bank.name}
                  onClick={() => setSelectedBank(bank.name)}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all group ${
                    selectedBank === bank.name
                      ? 'border-primary-500 bg-primary-50/30 dark:bg-primary-900/20 shadow-lg shadow-primary-100/50 dark:shadow-none'
                      : 'border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-900/50'
                  }`}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black mb-3 shadow-md group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: bank.color, color: bank.textColor || '#fff' }}
                  >
                    {bank.logo}
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {bank.name}
                  </span>
                </button>
              ))}
            </div>

            <button
              disabled={!selectedBank}
              onClick={startSync}
              className={`w-full mt-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                selectedBank
                  ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-xl shadow-primary-200/50 dark:shadow-none'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              Connect {selectedBank || 'Account'}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {(syncStatus === 'connecting' || syncStatus === 'syncing') && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-12 text-center shadow-lg shadow-slate-200/50 dark:shadow-none animate-in fade-in zoom-in duration-500">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Building2 size={48} className="text-primary-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {syncStatus === 'connecting'
              ? 'Establishing Secure Connection...'
              : 'Processing Transactions...'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
            Please sit tight. We are securely communicating with {selectedBank} using
            industry-standard protocols.
          </p>

          <div className="max-w-md mx-auto h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">
            {progress}% Completed
          </div>
        </div>
      )}

      {syncStatus === 'success' && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-12 text-center shadow-xl shadow-emerald-100 dark:shadow-none animate-in bounce-in duration-700">
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-200">
            <CheckCircle2 size={48} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Success! Accounts Synced
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
            Your recent transactions from {selectedBank} have been imported and categorized. Your
            dashboard has been updated.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setSyncStatus('idle');
                setSelectedBank(null);
              }}
              className="px-8 py-3 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-200 transition-colors"
            >
              Done
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              className="px-8 py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 shadow-lg shadow-primary-200 transition-all"
            >
              View Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
