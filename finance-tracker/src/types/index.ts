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
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  changePercentage: number;
}
