"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, RadialBarChart, RadialBar,
} from "recharts";

import { useDashboardData } from "@/hooks/use-dashboard-data";
import { StatCard } from "@/components/ui/card";
import { SkeletonCard } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { TrendingUp, TrendingDown, BarChart3, PiggyBank } from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

export default function AnalyticsPage() {
  const data = useDashboardData();

  // ── Savings rate ──────────────────────────────────────
  const savingsRate = data.totalIncome > 0
    ? Math.round((data.savings / data.totalIncome) * 100)
    : 0;

  // ── Monthly breakdown bar chart ───────────────────────
  const monthlyData = data.chartData;

  // ── Payment mode breakdown ────────────────────────────
  const modeData = useMemo(() => {
    const map: Record<string, number> = {};
    data.expenses.forEach((e) => { map[e.mode] = (map[e.mode] ?? 0) + e.amount; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [data.expenses]);

  // ── Daily spending trend (last 14 days) ───────────────
  const dailyData = useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days[format(d, "dd MMM")] = 0;
    }
    data.expenses.forEach((e) => {
      const k = format(new Date(e.date), "dd MMM");
      if (k in days) days[k] += e.amount;
    });
    return Object.entries(days).map(([name, amount]) => ({ name, amount }));
  }, [data.expenses]);

  // ── Income vs expense current month ──────────────────
  const thisMonthData = useMemo(() => {
    const now   = new Date();
    const start = startOfMonth(now).getTime();
    const end   = endOfMonth(now).getTime();
    const inc   = data.incomes.filter((i) => {
      const t = new Date(i.date).getTime();
      return t >= start && t <= end;
    }).reduce((s, i) => s + i.amount, 0);
    const exp   = data.expenses.filter((e) => {
      const t = new Date(e.date).getTime();
      return t >= start && t <= end;
    }).reduce((s, e) => s + e.amount, 0);
    return { income: inc, expense: exp, savings: inc - exp };
  }, [data.incomes, data.expenses]);

  const COLORS = ["#18181b","#52525b","#a1a1aa","#d4d4d8","#e4e4e7","#f4f4f5"];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-5 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold">Analytics</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Deep dive into your financial patterns</p>
      </div>

      {/* Summary cards */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="enter"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {data.isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <motion.div variants={staggerItem}>
              <StatCard title="This Month Income"   value={formatCurrency(thisMonthData.income)}  icon={<TrendingUp className="h-5 w-5" />}   accentClass="bg-success-bg text-success" />
            </motion.div>
            <motion.div variants={staggerItem}>
              <StatCard title="This Month Expense"  value={formatCurrency(thisMonthData.expense)} icon={<TrendingDown className="h-5 w-5" />}  accentClass="bg-danger-bg text-danger" />
            </motion.div>
            <motion.div variants={staggerItem}>
              <StatCard title="This Month Savings"  value={formatCurrency(Math.max(0,thisMonthData.savings))} icon={<PiggyBank className="h-5 w-5" />} accentClass="bg-info-bg text-info" />
            </motion.div>
            <motion.div variants={staggerItem}>
              <StatCard title="Savings Rate"  value={`${savingsRate}%`} icon={<BarChart3 className="h-5 w-5" />} accentClass="bg-secondary" />
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Charts row 1 */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Monthly bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-lg border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm">Monthly Overview</h2>
            <Badge variant="outline" className="text-xs">6 months</Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barCategoryGap="30%" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)", fontSize: 12 }}
                formatter={(value) => [formatCurrency(Number(value)), ""]}
              />
              <Bar dataKey="income"  fill="hsl(var(--success))" radius={[4,4,0,0]} name="Income" />
              <Bar dataKey="expense" fill="hsl(var(--foreground))" opacity={0.7} radius={[4,4,0,0]} name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Daily spending line chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm">Daily Spending</h2>
            <Badge variant="outline" className="text-xs">14 days</Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dailyData} margin={{ left: -20, right: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)", fontSize: 12 }}
                formatter={(value) => [formatCurrency(Number(value)), "Spent"]}
              />
              <Line type="monotone" dataKey="amount" stroke="hsl(var(--foreground))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--foreground))" }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts row 2 */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Category pie */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-lg border border-border bg-card p-5"
        >
          <div className="mb-4">
            <h2 className="font-semibold text-sm">Expense by Category</h2>
            <p className="text-xs text-muted-foreground">All time</p>
          </div>
          {data.categoryBreakdown.length === 0 ? (
            <div className="flex items-center justify-center h-60 text-muted-foreground text-xs">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={data.categoryBreakdown} cx="50%" cy="45%" outerRadius={80} paddingAngle={3} dataKey="value">
                  {data.categoryBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)", fontSize: 12 }}
                  formatter={(value) => [formatCurrency(Number(value)), ""]}
                />
                <Legend formatter={(v) => <span style={{ fontSize: 11 }}>{v}</span>} iconSize={8} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Payment mode breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg border border-border bg-card p-5"
        >
          <div className="mb-4">
            <h2 className="font-semibold text-sm">Payment Methods</h2>
            <p className="text-xs text-muted-foreground">Expense distribution</p>
          </div>
          {modeData.length === 0 ? (
            <div className="flex items-center justify-center h-60 text-muted-foreground text-xs">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={modeData} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={80} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)", fontSize: 12 }}
                  formatter={(value) => [formatCurrency(Number(value)), "Amount"]}
                />
                <Bar dataKey="value" fill="hsl(var(--foreground))" radius={[0,4,4,0]} name="Amount" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>
    </div>
  );
}
