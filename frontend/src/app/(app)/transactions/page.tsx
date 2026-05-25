"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ArrowUpDown, Trash2, Pencil, X, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import { useDashboardData } from "@/hooks/use-dashboard-data";
import { expenseService } from "@/services/expense.service";
import { incomeService } from "@/services/income.service";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionCard } from "@/components/transactions/transaction-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SkeletonList } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { TransactionType, Expense, Income } from "@/types";

type TabType = "all" | "income" | "expense";
type SortType = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";

export default function TransactionsPage() {
  const data = useDashboardData();

  const [tab,     setTab]     = useState<TabType>("all");
  const [search,  setSearch]  = useState("");
  const [mode,    setMode]    = useState("all");
  const [sort,    setSort]    = useState<SortType>("date-desc");
  const [page,    setPage]    = useState(1);
  const PAGE_SIZE = 15;

  const [formOpen, setFormOpen]   = useState(false);
  const [formType, setFormType]   = useState<TransactionType>("expense");
  const [editItem, setEditItem]   = useState<Expense | Income | undefined>();

  // ── Merge + filter + sort ────────────────────────────
  const allTx = useMemo(() => [
    ...data.expenses.map((e) => ({
      id: e._id, type: "expense" as TransactionType,
      amount: e.amount, party: e.to, category: e.resion,
      mode: e.mode, date: e.date, raw: e,
    })),
    ...data.incomes.map((i) => ({
      id: i._id, type: "income" as TransactionType,
      amount: i.amount, party: i.from, category: i.description ?? "Income",
      mode: i.mode, date: i.date, raw: i,
    })),
  ], [data.expenses, data.incomes]);

  const filtered = useMemo(() => {
    let list = allTx;

    if (tab !== "all")    list = list.filter((t) => t.type === tab);
    if (mode !== "all")   list = list.filter((t) => t.mode === mode);
    if (search.trim())    list = list.filter((t) =>
      t.party.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    );

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "date-desc":   return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":    return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "amount-desc": return b.amount - a.amount;
        case "amount-asc":  return a.amount - b.amount;
      }
    });
    return list;
  }, [allTx, tab, mode, search, sort]);

  const paginated   = filtered.slice(0, page * PAGE_SIZE);
  const hasMore     = paginated.length < filtered.length;

  // ── Actions ──────────────────────────────────────────
  const handleEdit = (tx: typeof allTx[0]) => {
    setFormType(tx.type);
    setEditItem(tx.raw);
    setFormOpen(true);
  };

  const handleDelete = async (tx: typeof allTx[0]) => {
    const confirm = window.confirm(`Delete this ${tx.type}?`);
    if (!confirm) return;
    try {
      if (tx.type === "expense") {
        await expenseService.deleteExpense(tx.id);
      } else {
        await incomeService.deleteIncome(tx.id);
      }
      toast.success(`${tx.type === "expense" ? "Expense" : "Income"} deleted`);
      data.refetch();
    } catch {
      toast.error("Delete failed");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setMode("all");
    setTab("all");
    setSort("date-desc");
  };

  const hasActiveFilters = tab !== "all" || mode !== "all" || search || sort !== "date-desc";

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-5 space-y-5">
      {/* ── Header ──────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Transactions</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            {" · "}
            Total: {formatCurrency(filtered.reduce((s, t) => s + (t.type === "expense" ? -t.amount : t.amount), 0))}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { setFormType("income"); setEditItem(undefined); setFormOpen(true); }}>
            <TrendingUp className="h-3.5 w-3.5" /> Income
          </Button>
          <Button size="sm" className="gap-1.5" onClick={() => { setFormType("expense"); setEditItem(undefined); setFormOpen(true); }}>
            <TrendingDown className="h-3.5 w-3.5" /> Expense
          </Button>
        </div>
      </div>

      {/* ── Filters ─────────────────────────────────── */}
      <div className="space-y-3">
        {/* Search */}
        <Input
          placeholder="Search transactions…"
          leftIcon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />

        {/* Filter row */}
        <div className="flex flex-wrap gap-2">
          {/* Tabs */}
          <div className="flex rounded-[var(--radius)] border border-border overflow-hidden text-sm">
            {(["all","income","expense"] as TabType[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setPage(1); }}
                className={`px-3 py-1.5 capitalize transition-colors ${
                  tab === t ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Mode filter */}
          <Select value={mode} onValueChange={(v) => { setMode(v); setPage(1); }}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="UPI">UPI</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sort} onValueChange={(v) => setSort(v as SortType)}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest first</SelectItem>
              <SelectItem value="date-asc">Oldest first</SelectItem>
              <SelectItem value="amount-desc">Highest amount</SelectItem>
              <SelectItem value="amount-asc">Lowest amount</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={clearFilters}>
              <X className="h-3.5 w-3.5" /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* ── Transaction list ──────────────────────────── */}
      <div className="rounded-[var(--radius-lg)] border border-border bg-card divide-y divide-border">
        {data.isLoading ? (
          <div className="px-5 py-3"><SkeletonList count={8} /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
            <ArrowUpDown className="h-10 w-10 opacity-20" />
            <p className="text-sm font-medium">No transactions found</p>
            <p className="text-xs">Try adjusting your filters</p>
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="initial" animate="enter">
            {paginated.map((tx) => (
              <div key={tx.id} className="px-4 group hover:bg-accent/30 transition-colors">
                <TransactionCard
                  id={tx.id}
                  type={tx.type}
                  amount={tx.amount}
                  party={tx.party}
                  category={tx.category}
                  mode={tx.mode}
                  date={tx.date}
                  onEdit={() => handleEdit(tx)}
                  onDelete={() => handleDelete(tx)}
                />
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* ── Pagination ──────────────────────────────── */}
      {hasMore && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
            Load more
          </Button>
        </div>
      )}

      {/* ── Form modal ──────────────────────────────── */}
      <TransactionForm
        open={formOpen}
        onOpenChange={(o) => { setFormOpen(o); if (!o) setEditItem(undefined); }}
        type={formType}
        editData={editItem}
        onSuccess={data.refetch}
      />
    </div>
  );
}
