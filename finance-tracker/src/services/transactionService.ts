import type {
  Transaction,
  DashboardStats,
  FilterRange,
  CustomDateRange,
} from "../types";
const STORAGE_KEY = "finance_transactions";

export function filterTransactions(
  transactions: Transaction[],
  range: FilterRange,
  customDates?: CustomDateRange,
): Transaction[] {
  const now = new Date();

  return transactions.filter((t) => {
    const tDate = new Date(t.date);

    if (range === "month")
      return (
        tDate.getMonth() === now.getMonth() &&
        tDate.getFullYear() === now.getFullYear()
      );
    if (range === "year") return tDate.getFullYear() === now.getFullYear();
    if (range === "custom" && customDates?.from && customDates?.to) {
      const from = new Date(customDates.from);
      const to = new Date(customDates.to);
      to.setHours(23, 59, 59, 999);
      return tDate >= from && tDate <= to;
    }
    return true;
  });
}

export function saveTransactions(transactions: Transaction[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export async function getTransactions(): Promise<Transaction[]> {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function calculateTotals(transactions: Transaction[]): DashboardStats {
  const now = new Date();
  const thisMonth = now.getMonth();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;

  const getStatsForMonth = (m: number, y: number) => {
    const filtered = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === m && d.getFullYear() === y;
    });

    const inc = filtered
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);

    const exp = filtered
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);

    return { inc, exp, bal: inc - exp };
  };

  const currentYear = now.getFullYear();
  const previousYear = thisMonth === 0 ? currentYear - 1 : currentYear;

  const current = getStatsForMonth(thisMonth, currentYear);
  const previous = getStatsForMonth(lastMonth, previousYear);

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
