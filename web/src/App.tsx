import { useState, useEffect, useMemo } from "react";
import { Snackbar, Alert } from "@mui/material";
import { DateFilter } from "./components/ui/DateFilter";

import type {
  FilterRange,
  Transaction,
  DashboardStats,
  CustomDateRange,
} from "./types";
import {
  calculateTotals,
  getTransactions,
  saveTransactions,
  filterTransactions,
} from "./services/transactionService";

import { MainLayout } from "./components/layout/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { AddTransactionModal } from "./components/ui/AddTransactionModal";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | undefined>(undefined);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeRange, setActiveRange] = useState<FilterRange>("month");
  const [customDates, setCustomDates] = useState<CustomDateRange>({
    from: "",
    to: "",
  });
  const [toast, setToast] = useState<{ message: string; severity: "success" | "error" } | null>(null);

  const filteredTransactions = useMemo(() => {
    return filterTransactions(transactions, activeRange, customDates);
  }, [transactions, activeRange, customDates]);

  const stats = useMemo(() => {
    return calculateTotals(filteredTransactions);
  }, [filteredTransactions]);

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

  return (
    <MainLayout onAddClick={() => setIsModalOpen(true)}>
      <div className="mb-8">
        <DateFilter
          activeRange={activeRange}
          onRangeChange={setActiveRange}
          customDates={customDates}
          onCustomChange={handleCustomChange}
        />
      </div>

      <Dashboard
        stats={stats}
        transactions={filteredTransactions}
        onDeleteTransaction={handleDeleteTransaction}
        onEditTransaction={handleEditTransaction}
      />

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditTransaction(undefined); }}
        onAdd={handleTransaction}
        editTransaction={editTransaction}
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
