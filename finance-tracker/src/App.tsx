import { useState, useEffect } from "react";
import type { Transaction } from "./types";
import {
  calculateTotals,
  getTransactions,
  saveTransaction,
} from "./services/transactionService";
import { MainLayout } from "./components/layout/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { AddTransactionModal } from "./components/ui/AddTransactionModal";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({ income: 0, expenses: 0, balance: 0 });
  const handleDeleteTransaction = async (id: string) => {
    const updatedTransactions = transactions.filter((tx) => tx.id !== id);
    setTransactions(updatedTransactions);
    // await deleteTransaction(id); we will need this in our service
    const newStats = await calculateTotals(updatedTransactions);
    setStats(newStats);
  };

  useEffect(() => {
    const init = async () => {
      const data = await getTransactions();
      setTransactions(data);
      const initialStatus = await calculateTotals(data);
      setStats(initialStatus);
    };
    init();
  }, []);

  const handleTransaction = async (newTx: Transaction) => {
    const updatedTransactions = [newTx, ...transactions];
    await saveTransaction(newTx);
    setTransactions(updatedTransactions);
    const newStats = await calculateTotals(updatedTransactions);
    setStats(newStats);
  };

  return (
    <MainLayout onAddClick={() => setIsModalOpen(true)}>
      <Dashboard
        stats={stats}
        transactions={transactions}
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
