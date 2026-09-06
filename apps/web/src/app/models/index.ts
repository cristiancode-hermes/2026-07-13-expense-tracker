export interface Organization {
  id: string;
  name: string;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationId: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Category {
  id: string;
  organizationId: string;
  name: string;
  icon: string;
  color: string;
  isActive: boolean;
}

export interface Expense {
  id: string;
  organizationId: string;
  userId: string;
  categoryId: string;
  categoryName: string;
  userName: string;
  amount: number;
  description: string;
  date: string;
  receiptPath: string;
  isReimbursable: boolean;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Budget {
  id: string;
  organizationId: string;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  name: string;
  amount: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface DashboardStats {
  totalSpent: number;
  byCategory: { id: string; name: string; color: string; total: number; count: number }[];
  recentExpenses: Expense[];
  monthlyTotal: { total: number; count: number };
}

export interface BudgetVsActual {
  id: string;
  name: string;
  budgetAmount: number;
  categoryName: string;
  spent: number;
  utilization: number;
}
