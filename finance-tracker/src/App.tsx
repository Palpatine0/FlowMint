import { useState, useEffect, useMemo } from "react";
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeRange, setActiveRange] = useState<FilterRange>("month");
  const [customDates, setCustomDates] = useState<CustomDateRange>({
    from: "",
    to: "",
  });

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
    const updatedTransactions = [newTx, ...transactions];
    saveTransactions(updatedTransactions);
    setTransactions(updatedTransactions);
    setIsModalOpen(false);
  };

  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter((tx) => tx.id !== id);
    saveTransactions(updatedTransactions);
    setTransactions(updatedTransactions);
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
      />

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleTransaction}
      />
    </MainLayout>
  );
}
