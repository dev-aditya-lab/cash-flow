// ── Auth ──────────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: { user?: User };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface OtpPayload {
  email: string;
  otp: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

// ── Expense ───────────────────────────────────────────────
export type PaymentMode = "cash" | "card" | "UPI" | "bank_transfer" | "other";

export interface Expense {
  _id: string;
  amount: number;
  mode: PaymentMode;
  to: string;
  resion: string;          // API uses "resion" (reason)
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddExpensePayload {
  amount: number;
  mode: PaymentMode;
  to: string;
  resion: string;
  description?: string;
  date?: string;
}

export type EditExpensePayload = Partial<AddExpensePayload>;

// ── Income ────────────────────────────────────────────────
export interface Income {
  _id: string;
  amount: number;
  mode: PaymentMode;
  from: string;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddIncomePayload {
  amount: number;
  mode: PaymentMode;
  from: string;
  description?: string;
  date?: string;
}

export type EditIncomePayload = Partial<AddIncomePayload>;

// ── Balance ───────────────────────────────────────────────
export interface Balance {
  balance: number;
}

// ── API Generic ───────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

// ── UI ────────────────────────────────────────────────────
export type TransactionType = "income" | "expense";

export interface Transaction {
  _id: string;
  type: TransactionType;
  amount: number;
  mode: PaymentMode;
  party: string;          // "to" for expense, "from" for income
  category: string;       // maps to resion / description
  description?: string;
  date: string;
}

export type ThemeMode = "light" | "dark" | "system";

export interface ChartDataPoint {
  name: string;
  income: number;
  expense: number;
}

export interface CategoryBreakdown {
  name: string;
  value: number;
  color: string;
}
