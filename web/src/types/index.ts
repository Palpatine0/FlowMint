export type TransactionType = 'income' | 'expense';

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  type: TransactionType;
  account?: string;
  currency?: string;
  originalAmount?: number;
}

export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurringTransaction extends Omit<Transaction, 'date'> {
  frequency: RecurringFrequency;
  startDate: string;
  lastProcessedDate: string | null;
  isActive: boolean;
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

export type FilterRange = 'week' | 'month' | 'year' | 'all' | 'custom';

export interface CustomDateRange {
  from: string;
  to: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  defaultCurrency: string;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  theme: 'light' | 'dark' | 'system';
}
