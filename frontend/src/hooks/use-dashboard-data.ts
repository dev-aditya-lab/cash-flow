"use client";

import { useState, useEffect, useCallback } from "react";
import { expenseService } from "@/services/expense.service";
import { incomeService } from "@/services/income.service";
import { balanceService } from "@/services/balance.service";
import type { Expense, Income, ChartDataPoint, CategoryBreakdown } from "@/types";
import { format } from "date-fns";

export interface DashboardData {
  balance:          number;
  totalIncome:      number;
  totalExpense:     number;
  savings:          number;
  expenses:         Expense[];
  incomes:          Income[];
  recentTransactions: Array<{ id: string; type: "income" | "expense"; amount: number; party: string; category: string; mode: string; date: string }>;
  chartData:        ChartDataPoint[];
  categoryBreakdown: CategoryBreakdown[];
  isLoading:        boolean;
  error:            string | null;
  refetch:          () => void;
}

const CHART_COLORS = ["#18181b","#3f3f46","#52525b","#71717a","#a1a1aa","#d4d4d8"];

export function useDashboardData(): DashboardData {
  const [expenses, setExpenses]   = useState<Expense[]>([]);
  const [incomes,  setIncomes]    = useState<Income[]>([]);
  const [balance,  setBalance]    = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [expRes, incRes, balRes] = await Promise.all([
        expenseService.getExpenses(),
        incomeService.getIncomes(),
        balanceService.getBalance(),
      ]);
      setExpenses(expRes.data ?? []);
      setIncomes(incRes.data ?? []);
      setBalance(balRes.data?.balance ?? 0);
    } catch {
      setError("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Derived values ────────────────────────────────────
  const totalIncome  = incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const savings      = totalIncome - totalExpense;

  // ── Recent transactions (last 10, merged + sorted) ───
  const recentTransactions = [
    ...expenses.map((e) => ({
      id: e._id, type: "expense" as const, amount: e.amount,
      party: e.to, category: e.resion, mode: e.mode, date: e.date,
    })),
    ...incomes.map((i) => ({
      id: i._id, type: "income" as const, amount: i.amount,
      party: i.from, category: i.description ?? "Income", mode: i.mode, date: i.date,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  // ── Monthly chart data (last 6 months) ──────────────
  const monthMap: Record<string, ChartDataPoint> = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d    = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key  = format(d, "MMM");
    monthMap[key] = { name: key, income: 0, expense: 0 };
  }
  incomes.forEach((i) => {
    const key = format(new Date(i.date), "MMM");
    if (monthMap[key]) monthMap[key].income += i.amount;
  });
  expenses.forEach((e) => {
    const key = format(new Date(e.date), "MMM");
    if (monthMap[key]) monthMap[key].expense += e.amount;
  });
  const chartData = Object.values(monthMap);

  // ── Category breakdown ────────────────────────────────
  const catMap: Record<string, number> = {};
  expenses.forEach((e) => {
    catMap[e.resion] = (catMap[e.resion] ?? 0) + e.amount;
  });
  const categoryBreakdown: CategoryBreakdown[] = Object.entries(catMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, value], i) => ({
      name,
      value,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }));

  return {
    balance, totalIncome, totalExpense, savings,
    expenses, incomes, recentTransactions,
    chartData, categoryBreakdown,
    isLoading, error, refetch: fetchAll,
  };
}
