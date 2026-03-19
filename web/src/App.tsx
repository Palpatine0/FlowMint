import { useState, useEffect, useMemo } from "react";
import { Snackbar, Alert } from "@mui/material";
import { DateFilter } from "./components/ui/DateFilter";

import type {
  FilterRange,
  Transaction,
  CustomDateRange,
  UserProfile,
} from "./types";
import {
  calculateTotals,
  getTransactions,
  saveTransactions,
  filterTransactions,
} from "./services/transactionService";
import { getUserProfile, saveUserProfile } from "./services/userService";

import { MainLayout } from "./components/layout/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { Accounts } from "./pages/Accounts";
import { Budgets } from "./pages/Budgets";
import { Settings } from "./pages/Settings";
import { AddTransactionModal } from "./components/ui/AddTransactionModal";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Overview");
  const [editTransaction, setEditTransaction] = useState<Transaction | undefined>(undefined);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeRange, setActiveRange] = useState<FilterRange>("month");
  const [customDates, setCustomDates] = useState<CustomDateRange>({
    from: "",
    to: "",
  });
  const [toast, setToast] = useState<{ message: string; severity: "success" | "error" } | null>(null);
  const [profile, setProfile] = useState<UserProfile>(getUserProfile);

  const filteredTransactions = useMemo(() => {
    return filterTransactions(transactions, activeRange, customDates);
  }, [transactions, activeRange, customDates]);

  const stats = useMemo(() => {
    return calculateTotals(transactions, filteredTransactions, activeRange);
  }, [transactions, filteredTransactions, activeRange]);

  const resolvedDark = profile.theme === "system"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
    : profile.theme === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedDark);
  }, [resolvedDark]);

  useEffect(() => {
    const init = async () => {
      const data = await getTransactions();
      setTransactions(data);
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
    setToast({ message: editTransaction ? "Transaction updated!" : "Transaction added successfully!", severity: "success" });
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditTransaction(tx);
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter((tx) => tx.id !== id);
    saveTransactions(updatedTransactions);
    setTransactions(updatedTransactions);
    setToast({ message: "Transaction deleted.", severity: "error" });
  };

  const handleCustomChange = (field: "from" | "to", value: string) => {
    setCustomDates((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = (updated: UserProfile) => {
    saveUserProfile(updated);
    setProfile(updated);
    setToast({ message: "Profile saved!", severity: "success" });
  };

  const handleToggleDarkMode = () => {
    const next: UserProfile["theme"] = resolvedDark ? "light" : "dark";
    const updated = { ...profile, theme: next };
    saveUserProfile(updated);
    setProfile(updated);
  };

  return (
    <MainLayout onAddClick={() => setIsModalOpen(true)} activeNav={activeNav} onNavChange={setActiveNav} darkMode={resolvedDark} onToggleDarkMode={handleToggleDarkMode} userName={profile.name} avatarUrl={profile.avatarUrl}>
      {activeNav === "Overview" && (
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
          />
        </>
      )}
      {activeNav === "Accounts" && <Accounts transactions={transactions} />}
      {activeNav === "Budgets" && <Budgets transactions={transactions} />}
      {activeNav === "Settings" && <Settings profile={profile} onSave={handleSaveProfile} onThemeChange={(theme) => { const updated = { ...profile, theme }; saveUserProfile(updated); setProfile(updated); }} />}

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditTransaction(undefined); }}
        onAdd={handleTransaction}
        editTransaction={editTransaction}
        defaultCurrency={profile.defaultCurrency}
      />

      <Snackbar
        open={toast !== null}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToast(null)}
          severity={toast?.severity}
          variant="filled"
        >
          {toast?.message}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
}
