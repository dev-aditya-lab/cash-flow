"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, TrendingDown, Search } from "lucide-react";
import { toast } from "sonner";

import { useDashboardData } from "@/hooks/use-dashboard-data";
import { expenseService } from "@/services/expense.service";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionCard } from "@/components/transactions/transaction-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/ui/card";
import { SkeletonCard, SkeletonList } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { Expense } from "@/types";

export default function ExpensesPage() {
  const data = useDashboardData();
  const [formOpen, setFormOpen]   = useState(false);
  const [editItem, setEditItem]   = useState<Expense | undefined>();
  const [search, setSearch]       = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Categories from expenses
  const categories = useMemo(() => {
    const cats = Array.from(new Set(data.expenses.map((e) => e.resion)));
    return ["all", ...cats];
  }, [data.expenses]);

  const filtered = useMemo(() =>
    data.expenses
      .filter((e) => {
        const matchSearch = !search.trim() ||
          e.to.toLowerCase().includes(search.toLowerCase()) ||
          e.resion.toLowerCase().includes(search.toLowerCase());
        const matchCat = activeCategory === "all" || e.resion === activeCategory;
        return matchSearch && matchCat;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [data.expenses, search, activeCategory]
  );

  const topCategory = useMemo(() => {
    const map: Record<string, number> = {};
    data.expenses.forEach((e) => { map[e.resion] = (map[e.resion] ?? 0) + e.amount; });
    return Object.entries(map).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "—";
  }, [data.expenses]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await expenseService.deleteExpense(id);
      toast.success("Expense deleted");
      data.refetch();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Expenses</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{data.expenses.length} records</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => { setEditItem(undefined); setFormOpen(true); }}>
          <Plus className="h-4 w-4" /> Add Expense
        </Button>
      </div>

      {/* Stat cards */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="enter"
        className="grid grid-cols-2 md:grid-cols-3 gap-3"
      >
        {data.isLoading ? (
          <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
        ) : (
          <>
            <motion.div variants={staggerItem}>
              <StatCard
                title="Total Expenses"
                value={formatCurrency(data.totalExpense)}
                icon={<TrendingDown className="h-5 w-5" />}
                accentClass="bg-danger-bg text-danger"
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <StatCard
                title="Top Category"
                value={topCategory}
                icon={<TrendingDown className="h-5 w-5" />}
                accentClass="bg-warning-bg text-warning-foreground"
              />
            </motion.div>
            <motion.div variants={staggerItem} className="col-span-2 md:col-span-1">
              <StatCard
                title="Records"
                value={String(data.expenses.length)}
                icon={<TrendingDown className="h-5 w-5" />}
                accentClass="bg-secondary"
              />
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Search + Category pills */}
      <div className="space-y-3">
        <Input
          placeholder="Search expenses…"
          leftIcon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="rounded-[var(--radius-lg)] border border-border bg-card divide-y divide-border">
        {data.isLoading ? (
          <div className="px-5 py-3"><SkeletonList count={6} /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
            <TrendingDown className="h-10 w-10 opacity-20" />
            <p className="text-sm font-medium">No expenses found</p>
            <Button variant="outline" size="sm" onClick={() => { setEditItem(undefined); setFormOpen(true); }}>
              Add your first expense
            </Button>
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="initial" animate="enter">
            {filtered.map((exp) => (
              <div key={exp._id} className="px-4 group hover:bg-accent/30 transition-colors">
                <TransactionCard
                  id={exp._id}
                  type="expense"
                  amount={exp.amount}
                  party={exp.to}
                  category={exp.resion}
                  mode={exp.mode}
                  date={exp.date}
                  onEdit={() => { setEditItem(exp); setFormOpen(true); }}
                  onDelete={() => handleDelete(exp._id)}
                />
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <TransactionForm
        open={formOpen}
        onOpenChange={(o) => { setFormOpen(o); if (!o) setEditItem(undefined); }}
        type="expense"
        editData={editItem}
        onSuccess={data.refetch}
      />
    </div>
  );
}
