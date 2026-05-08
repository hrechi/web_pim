import { apiGet } from '@/lib/api/client';

export interface FinanceDashboard {
  period: 'month' | 'quarter' | 'year';
  currency: string;
  currencySymbol: string;
  totalRevenue: number;
  totalExpenses: number;
  netBalance: number;
  expensesByCategory: Record<string, { amount: number; percentage: number }>;
  revenueByType: {
    animalSales?: { count: number; totalAmount: number };
  };
  topCostlyAnimals: { animalId: string; name: string; totalCost: number }[];
  recentExpenses: {
    id: string;
    category: string;
    amount: number;
    date: string;
    animalName?: string | null;
  }[];
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  notes?: string | null;
  animalId?: string | null;
  fieldId?: string | null;
  createdAt: string;
}

export const financeService = {
  dashboard: (fieldId: string, period: 'month' | 'quarter' | 'year' = 'month') =>
    apiGet<FinanceDashboard>(`/finance/dashboard?fieldId=${fieldId}&period=${period}`),

  expenses: (fieldId: string) =>
    apiGet<Expense[]>(`/expenses?fieldId=${fieldId}&limit=50`),
};
