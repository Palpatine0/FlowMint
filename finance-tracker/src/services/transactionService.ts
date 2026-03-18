import type { Transaction, DashboardStats } from "../types";

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

export async function calculateTotals(
  transactions: Transaction[],
): Promise<DashboardStats> {
  const now = new Date();
  const thisMonth = now.getMonth();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;

  const getStatsForMonth = (m: number) => {
    const filtered = transactions.filter(
      (t) => new Date(t.date).getMonth() === m,
    );
    const inc = filtered
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const exp = filtered
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    return { inc, exp, bal: inc - exp };
  };

  const current = getStatsForMonth(thisMonth);
  const previous = getStatsForMonth(lastMonth);

  const calcChange = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return ((curr - prev) / prev) * 100;
  };

  return {
    balance: current.bal,
    income: current.inc,
    expenses: current.exp,
    balanceChange: calcChange(current.bal, previous.bal),
    incomeChange: calcChange(current.inc, previous.inc),
    expensesChange: calcChange(current.exp, previous.exp),
  };
}
