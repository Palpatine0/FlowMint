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

    if (range === "week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      return tDate >= startOfWeek;
    }
    if (range === "month")
      return (
        tDate.getMonth() === now.getMonth() &&
        tDate.getFullYear() === now.getFullYear()
      );
    if (range === "year") return tDate.getFullYear() === now.getFullYear();
    if (range === "custom" && customDates?.from && customDates?.to) {
      const from = new Date(customDates.from + "T00:00:00");
      const to = new Date(customDates.to + "T23:59:59.999");
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

export function calculateTotals(
  allTransactions: Transaction[],
  filteredTransactions: Transaction[],
  activeRange: FilterRange
): DashboardStats {
  const totalBalance = allTransactions.reduce((sum, t) => {
    return sum + (t.type === "income" ? t.amount : -t.amount);
  }, 0);

  const inc = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const exp = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  let prevInc = 0;
  let prevExp = 0;

  if (activeRange === "month" || activeRange === "week" || activeRange === "year") {
    const now = new Date();
    const prevTransactions = allTransactions.filter((t) => {
      const d = new Date(t.date);
      if (activeRange === "month") {
        const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        return d.getMonth() === lastMonth && d.getFullYear() === year;
      }
      if (activeRange === "year") {
        return d.getFullYear() === now.getFullYear() - 1;
      }
      if (activeRange === "week") {
        const startOfThisWeek = new Date(now);
        startOfThisWeek.setDate(now.getDate() - now.getDay());
        startOfThisWeek.setHours(0, 0, 0, 0);

        const startOfLastWeek = new Date(startOfThisWeek);
        startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

        return d >= startOfLastWeek && d < startOfThisWeek;
      }
      return false;
    });

    prevInc = prevTransactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    prevExp = prevTransactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  }

  const prevBal = prevInc - prevExp;
  const currentBal = inc - exp;

  const calcChange = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return ((curr - prev) / prev) * 100;
  };

  return {
    balance: totalBalance,
    income: inc,
    expenses: exp,
    balanceChange: calcChange(currentBal, prevBal),
    incomeChange: calcChange(inc, prevInc),
    expensesChange: calcChange(exp, prevExp),
  };
}
