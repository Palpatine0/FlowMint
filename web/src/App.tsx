import { useState, useEffect, useMemo } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { DateFilter } from './components/ui/DateFilter';

import type {
  FilterRange,
  Transaction,
  CustomDateRange,
  UserProfile,
  RecurringTransaction,
} from './types';
import {
  calculateTotals,
  getTransactions,
  saveTransactions,
  filterTransactions,
  getRecurringTransactions,
  saveRecurringTransactions,
  processRecurringTransactions,
} from './services/transactionService';
import { getUserProfile, saveUserProfile } from './services/userService';

import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Accounts } from './pages/Accounts';
import { Budgets } from './pages/Budgets';
import { Settings } from './pages/Settings';
import { Recurring } from './pages/Recurring';
import { CalendarView } from './pages/CalendarView';
import { AddTransactionModal } from './components/ui/AddTransactionModal';
import { AddRecurringModal } from './components/ui/AddRecurringModal';
import { ImportModal } from './components/ui/ImportModal';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Overview');
  const [editTransaction, setEditTransaction] = useState<Transaction | undefined>(undefined);
  const [editRecurring, setEditRecurring] = useState<RecurringTransaction | undefined>(undefined);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [activeRange, setActiveRange] = useState<FilterRange>('month');
  const [customDates, setCustomDates] = useState<CustomDateRange>({
    from: '',
    to: '',
  });
  const [toast, setToast] = useState<{ message: string; severity: 'success' | 'error' } | null>(
    null,
  );
  const [profile, setProfile] = useState<UserProfile>(getUserProfile);

  const filteredTransactions = useMemo(() => {
    return filterTransactions(transactions, activeRange, customDates);
  }, [transactions, activeRange, customDates]);

  const stats = useMemo(() => {
    return calculateTotals(transactions, filteredTransactions, activeRange);
  }, [transactions, filteredTransactions, activeRange]);

  const resolvedDark =
    profile.theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : profile.theme === 'dark';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedDark);
  }, [resolvedDark]);

  useEffect(() => {
    const init = async () => {
      const txData = await getTransactions();
      const recData = await getRecurringTransactions();

      const { newTransactions, updatedRecurring } = processRecurringTransactions(recData);

      if (newTransactions.length > 0) {
        const finalTx = [...newTransactions, ...txData];
        saveTransactions(finalTx);
        saveRecurringTransactions(updatedRecurring);
        setTransactions(finalTx);
        setRecurringTransactions(updatedRecurring);
      } else {
        setTransactions(txData);
        setRecurringTransactions(recData);
      }
    };
    init();
  }, []);

  const handleTransaction = async (newTx: Transaction) => {
    const updatedTransactions = editTransaction
      ? transactions.map((tx) => (tx.id === newTx.id ? newTx : tx))
      : [newTx, ...transactions];
    saveTransactions(updatedTransactions);
    setTransactions(updatedTransactions);
    setIsModalOpen(false);
    setEditTransaction(undefined);
    setToast({
      message: editTransaction ? 'Transaction updated!' : 'Transaction added successfully!',
      severity: 'success',
    });
  };

  const handleImport = (importedTransactions: Transaction[]) => {
    const finalTx = [...importedTransactions, ...transactions];
    saveTransactions(finalTx);
    setTransactions(finalTx);
    setToast({
      message: `Successfully imported ${importedTransactions.length} transactions!`,
      severity: 'success',
    });
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditTransaction(tx);
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter((tx) => tx.id !== id);
    saveTransactions(updatedTransactions);
    setTransactions(updatedTransactions);
    setToast({ message: 'Transaction deleted.', severity: 'error' });
  };

  const handleCustomChange = (field: 'from' | 'to', value: string) => {
    setCustomDates((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = (updated: UserProfile) => {
    saveUserProfile(updated);
    setProfile(updated);
    setToast({ message: 'Profile saved!', severity: 'success' });
  };

  const handleRecurring = (newRec: RecurringTransaction) => {
    const updated = editRecurring
      ? recurringTransactions.map((tx) => (tx.id === newRec.id ? newRec : tx))
      : [newRec, ...recurringTransactions];
    saveRecurringTransactions(updated);
    setRecurringTransactions(updated);
    setIsRecurringModalOpen(false);
    setEditRecurring(undefined);
    setToast({
      message: editRecurring ? 'Recurring item updated!' : 'Recurring item added!',
      severity: 'success',
    });
  };

  const handleEditRecurringItem = (tx: RecurringTransaction) => {
    setEditRecurring(tx);
    setIsRecurringModalOpen(true);
  };

  const handleDeleteRecurringItem = (id: string) => {
    const updated = recurringTransactions.filter((tx) => tx.id !== id);
    saveRecurringTransactions(updated);
    setRecurringTransactions(updated);
    setToast({ message: 'Recurring item deleted.', severity: 'error' });
  };

  const handleToggleRecurringActive = (id: string, currentlyActive: boolean) => {
    const updated = recurringTransactions.map((tx) =>
      tx.id === id ? { ...tx, isActive: !currentlyActive } : tx,
    );
    saveRecurringTransactions(updated);
    setRecurringTransactions(updated);
    setToast({ message: currentlyActive ? 'Paused' : 'Activated', severity: 'success' });
  };

  const handleToggleDarkMode = () => {
    const next: UserProfile['theme'] = resolvedDark ? 'light' : 'dark';
    const updated = { ...profile, theme: next };
    saveUserProfile(updated);
    setProfile(updated);
  };

  return (
    <MainLayout
      onAddClick={() => {
        if (activeNav === 'Recurring') setIsRecurringModalOpen(true);
        else setIsModalOpen(true);
      }}
      onImportClick={() => setIsImportModalOpen(true)}
      activeNav={activeNav}
      onNavChange={setActiveNav}
      darkMode={resolvedDark}
      onToggleDarkMode={handleToggleDarkMode}
      userName={profile.name}
      avatarUrl={profile.avatarUrl}
    >
      {activeNav === 'Overview' && (
        <>
          <div className="mb-8">
            <DateFilter
              activeRange={activeRange}
              onRangeChange={setActiveRange}
              customDates={customDates}
              onCustomChange={handleCustomChange}
            />
          </div>
          <Dashboard
            activeRange={activeRange}
            stats={stats}
            transactions={filteredTransactions}
            onDeleteTransaction={handleDeleteTransaction}
            onEditTransaction={handleEditTransaction}
            dateFormat={profile.dateFormat}
          />
        </>
      )}
      {activeNav === 'Accounts' && <Accounts transactions={transactions} />}
      {activeNav === 'Budgets' && <Budgets transactions={transactions} />}
      {activeNav === 'Calendar' && <CalendarView transactions={transactions} />}
      {activeNav === 'Settings' && (
        <Settings
          profile={profile}
          onSave={handleSaveProfile}
          onThemeChange={(theme) => {
            const updated = { ...profile, theme };
            saveUserProfile(updated);
            setProfile(updated);
          }}
        />
      )}
      {activeNav === 'Recurring' && (
        <Recurring
          recurringTransactions={recurringTransactions}
          onDelete={handleDeleteRecurringItem}
          onEdit={handleEditRecurringItem}
          onToggleActive={handleToggleRecurringActive}
          dateFormat={profile.dateFormat}
        />
      )}

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditTransaction(undefined);
        }}
        onAdd={handleTransaction}
        editTransaction={editTransaction}
        defaultCurrency={profile.defaultCurrency}
      />

      <AddRecurringModal
        isOpen={isRecurringModalOpen}
        onClose={() => {
          setIsRecurringModalOpen(false);
          setEditRecurring(undefined);
        }}
        onAdd={handleRecurring}
        editTransaction={editRecurring}
        defaultCurrency={profile.defaultCurrency}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
        defaultCurrency={profile.defaultCurrency}
      />

      <Snackbar
        open={toast !== null}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setToast(null)} severity={toast?.severity} variant="filled">
          {toast?.message}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
}
