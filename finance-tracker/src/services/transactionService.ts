import type { Transaction } from "../types";

// using localstorage for data persistence lol
const STORAGE_KEY = "finance_transactions";

export async function saveTransaction(transaction: Transaction): Promise<void> {
  const transactions = await getTransactions();
  const updated = [...transactions, transaction];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export async function getTransactions(): Promise<Transaction[]> {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export async function calculateTotals(transactions: Transaction[]) {
  return transactions.reduce(
    (acc, t) => {
      if (t.type === "income") acc.income += t.amount;
      else acc.expenses += t.amount;
      acc.balance = acc.income - acc.expenses;
      return acc;
    },
    { income: 0, expenses: 0, balance: 0 },
  );
}
