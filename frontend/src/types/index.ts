// ── Auth ──────────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;   // backend field name
  isBanned: boolean;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
  avatar?: string;          // future-proof / client-added
}

export interface AuthResponse {
  success: boolean;
  status: number;
  message: string;
  // login wraps user inside data.data (sendRes convention)
  data?: { data?: User | null } | null;
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
  status: number;
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
  party: string;
  category: string;
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
