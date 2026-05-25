"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  TrendingUp, TrendingDown, Wallet, PiggyBank,
  Plus, ArrowUpRight, Moon, Sun, Bell,
} from "lucide-react";
import { useTheme } from "next-themes";

import { useAuth } from "@/store/auth-context";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { StatCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SkeletonCard, SkeletonList } from "@/components/ui/skeleton";
import { TransactionCard } from "@/components/transactions/transaction-card";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { TransactionType } from "@/types";

export default function DashboardPage() {
  const { user }  = useAuth();
  const data      = useDashboardData();
  const { theme, setTheme } = useTheme();

  const [formOpen, setFormOpen]   = useState(false);
  const [formType, setFormType]   = useState<TransactionType>("expense");

  const openForm = (type: TransactionType) => {
    setFormType(type);
    setFormOpen(true);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-5 space-y-6">

      {/* ── Top bar (desktop) ────────────────────────── */}
      <div className="hidden md:flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{greeting} 👋</p>
          <h1 className="text-2xl font-bold mt-0.5">{user?.name ?? "User"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon"><Bell className="h-4 w-4" /></Button>
          <Button onClick={() => openForm("expense")} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" /> Add Expense
          </Button>
          <Button onClick={() => openForm("income")} variant="outline" size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" /> Add Income
          </Button>
        </div>
      </div>

      {/* ── Stat cards ───────────────────────────────── */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="enter"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {data.isLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </>
        ) : (
          <>
            <motion.div variants={staggerItem}>
              <StatCard
                title="Balance"
                value={formatCurrency(data.balance)}
                icon={<Wallet className="h-5 w-5" />}
                accentClass="bg-primary/10 text-primary"
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <StatCard
                title="Income"
                value={formatCurrency(data.totalIncome)}
                icon={<TrendingUp className="h-5 w-5" />}
                accentClass="bg-success-bg text-success"
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <StatCard
                title="Expenses"
                value={formatCurrency(data.totalExpense)}
                icon={<TrendingDown className="h-5 w-5" />}
                accentClass="bg-danger-bg text-danger"
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <StatCard
                title="Savings"
                value={formatCurrency(Math.max(0, data.savings))}
                icon={<PiggyBank className="h-5 w-5" />}
                accentClass="bg-info-bg text-info"
              />
            </motion.div>
          </>
        )}
      </motion.div>

      {/* ── Charts row ───────────────────────────────── */}
      <div className="grid md:grid-cols-5 gap-4">
        {/* Area chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="md:col-span-3 rounded-lg border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-sm">Income vs Expenses</h2>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </div>
            <Badge variant="outline" className="text-xs">Monthly</Badge>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data.chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)", fontSize: 12 }}
                formatter={(value) => [formatCurrency(Number(value)), ""]}
              />
              <Area type="monotone" dataKey="income"  stroke="hsl(var(--success))" strokeWidth={2} fill="url(#incomeGrad)"  name="Income"  dot={false} />
              <Area type="monotone" dataKey="expense" stroke="hsl(var(--foreground))" strokeWidth={2} fill="url(#expenseGrad)" name="Expenses" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="md:col-span-2 rounded-lg border border-border bg-card p-5"
        >
          <div className="mb-4">
            <h2 className="font-semibold text-sm">Spending by Category</h2>
            <p className="text-xs text-muted-foreground">All time</p>
          </div>
          {data.categoryBreakdown.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-50 text-muted-foreground text-xs gap-2">
              <PiggyBank className="h-8 w-8 opacity-30" />
              No expenses yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)", fontSize: 12 }}
                  formatter={(value) => [formatCurrency(Number(value)), ""]}
                />
                <Legend
                  formatter={(value) => <span style={{ fontSize: 11 }}>{value}</span>}
                  iconSize={8}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* ── Recent transactions ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="rounded-lg border border-border bg-card"
      >
        <div className="flex items-center justify-between p-5 pb-0">
          <div>
            <h2 className="font-semibold text-sm">Recent Transactions</h2>
            <p className="text-xs text-muted-foreground">Latest activity</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <a href="/transactions" className="gap-1 text-xs">
              View all <ArrowUpRight className="h-3 w-3" />
            </a>
          </Button>
        </div>

        <div className="px-5 pb-3 divide-y divide-border">
          {data.isLoading ? (
            <SkeletonList count={5} />
          ) : data.recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
              <Wallet className="h-10 w-10 opacity-20" />
              <p className="text-sm">No transactions yet</p>
              <p className="text-xs">Add your first income or expense</p>
            </div>
          ) : (
            <motion.div variants={staggerContainer} initial="initial" animate="enter">
              {data.recentTransactions.map((tx) => (
                <div key={tx.id} className="group">
                  <TransactionCard {...tx} compact />
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ── Mobile FAB ───────────────────────────────── */}
      <div className="md:hidden fixed bottom-20 right-4 flex flex-col gap-2 z-30">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => openForm("income")}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-success text-success-foreground shadow-lg"
        >
          <TrendingUp className="h-5 w-5" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => openForm("expense")}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl"
        >
          <Plus className="h-6 w-6" />
        </motion.button>
      </div>

      {/* ── Transaction form modal ────────────────────── */}
      <TransactionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        type={formType}
        onSuccess={data.refetch}
      />
    </div>
  );
}
