"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, TrendingUp, Search } from "lucide-react";
import { toast } from "sonner";

import { useDashboardData } from "@/hooks/use-dashboard-data";
import { incomeService } from "@/services/income.service";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionCard } from "@/components/transactions/transaction-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/ui/card";
import { SkeletonCard, SkeletonList } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { Income } from "@/types";

export default function IncomePage() {
  const data = useDashboardData();
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<Income | undefined>();
  const [search, setSearch]     = useState("");

  const filtered = useMemo(() =>
    data.incomes
      .filter((i) =>
        !search.trim() ||
        i.from.toLowerCase().includes(search.toLowerCase()) ||
        (i.description ?? "").toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [data.incomes, search]
  );

  const monthlyAvg = data.incomes.length
    ? data.totalIncome / Math.max(1, new Set(data.incomes.map((i) => i.date.slice(0, 7))).size)
    : 0;

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this income record?")) return;
    try {
      await incomeService.deleteIncome(id);
      toast.success("Income deleted");
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
          <h1 className="text-xl font-bold">Income</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{data.incomes.length} records</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => { setEditItem(undefined); setFormOpen(true); }}>
          <Plus className="h-4 w-4" /> Add Income
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
                title="Total Income"
                value={formatCurrency(data.totalIncome)}
                icon={<TrendingUp className="h-5 w-5" />}
                accentClass="bg-success-bg text-success"
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <StatCard
                title="Monthly Avg"
                value={formatCurrency(monthlyAvg)}
                icon={<TrendingUp className="h-5 w-5" />}
                accentClass="bg-success-bg text-success"
              />
            </motion.div>
            <motion.div variants={staggerItem} className="col-span-2 md:col-span-1">
              <StatCard
                title="Records"
                value={String(data.incomes.length)}
                icon={<TrendingUp className="h-5 w-5" />}
                accentClass="bg-secondary"
              />
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Search */}
      <Input
        placeholder="Search income…"
        leftIcon={<Search className="h-4 w-4" />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* List */}
      <div className="rounded-[var(--radius-lg)] border border-border bg-card divide-y divide-border">
        {data.isLoading ? (
          <div className="px-5 py-3"><SkeletonList count={6} /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
            <TrendingUp className="h-10 w-10 opacity-20" />
            <p className="text-sm font-medium">No income records</p>
            <Button variant="outline" size="sm" onClick={() => { setEditItem(undefined); setFormOpen(true); }}>
              Add your first income
            </Button>
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="initial" animate="enter">
            {filtered.map((inc) => (
              <div key={inc._id} className="px-4 group hover:bg-accent/30 transition-colors">
                <TransactionCard
                  id={inc._id}
                  type="income"
                  amount={inc.amount}
                  party={inc.from}
                  category={inc.description ?? "Income"}
                  mode={inc.mode}
                  date={inc.date}
                  onEdit={() => { setEditItem(inc); setFormOpen(true); }}
                  onDelete={() => handleDelete(inc._id)}
                />
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <TransactionForm
        open={formOpen}
        onOpenChange={(o) => { setFormOpen(o); if (!o) setEditItem(undefined); }}
        type="income"
        editData={editItem}
        onSuccess={data.refetch}
      />
    </div>
  );
}
