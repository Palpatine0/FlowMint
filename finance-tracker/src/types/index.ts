export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  type: TransactionType;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface DashboardStats {
  balance: number;
  income: number;
  expenses: number;
  balanceChange: number;
  incomeChange: number;
  expensesChange: number;
}
