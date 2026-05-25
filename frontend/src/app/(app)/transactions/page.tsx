"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ArrowUpDown, Trash2, Pencil, X,
  TrendingDown, TrendingUp, Plus, Tag,
} from "lucide-react";
import { toast } from "sonner";

import { useDashboardData } from "@/hooks/use-dashboard-data";
import { expenseService }   from "@/services/expense.service";
import { incomeService }    from "@/services/income.service";
import { TransactionForm }  from "@/components/transactions/transaction-form";
import { TransactionCard }  from "@/components/transactions/transaction-card";
import { Button }           from "@/components/ui/button";
import { Input }            from "@/components/ui/input";
import { StatCard }         from "@/components/ui/card";
import { SkeletonCard, SkeletonList } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatCurrency }          from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { TransactionType, Expense, Income } from "@/types";

type TabType  = "all" | "income" | "expense";
type SortType = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";

const PAGE_SIZE = 15;

export default function TransactionsPage() {
  const data = useDashboardData();

  const [tab,            setTab]            = useState<TabType>("all");
  const [search,         setSearch]         = useState("");
  const [mode,           setMode]           = useState("all");
  const [sort,           setSort]           = useState<SortType>("date-desc");
  const [activeCategory, setActiveCategory] = useState("all");
  const [page,           setPage]           = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState<TransactionType>("expense");
  const [editItem, setEditItem] = useState<Expense | Income | undefined>();

  // ── Derived stats ────────────────────────────────────────
  const topCategory = useMemo(() => {
    const map: Record<string, number> = {};
    data.expenses.forEach((e) => { map[e.resion] = (map[e.resion] ?? 0) + e.amount; });
    return Object.entries(map).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "—";
  }, [data.expenses]);

  const monthlyAvgIncome = useMemo(() => {
    if (!data.incomes.length) return 0;
    const months = new Set(data.incomes.map((i) => i.date.slice(0, 7))).size;
    return data.totalIncome / Math.max(1, months);
  }, [data.incomes, data.totalIncome]);

  const monthlyAvgExpense = useMemo(() => {
    if (!data.expenses.length) return 0;
    const months = new Set(data.expenses.map((e) => e.date.slice(0, 7))).size;
    return data.totalExpense / Math.max(1, months);
  }, [data.expenses, data.totalExpense]);

  // ── Category pills (expense-only) ────────────────────────
  const expenseCategories = useMemo(() => {
    const cats = Array.from(new Set(data.expenses.map((e) => e.resion)));
    return ["all", ...cats];
  }, [data.expenses]);

  // ── Merge all transactions ───────────────────────────────
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

  // ── Filter + sort ────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = allTx;
    if (tab !== "all")  list = list.filter((t) => t.type === tab);
    if (mode !== "all") list = list.filter((t) => t.mode === mode);
    if (tab === "expense" && activeCategory !== "all")
      list = list.filter((t) => t.category === activeCategory);
    if (search.trim())  list = list.filter((t) =>
      t.party.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    );
    return [...list].sort((a, b) => {
      switch (sort) {
        case "date-desc":   return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":    return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "amount-desc": return b.amount - a.amount;
        case "amount-asc":  return a.amount - b.amount;
      }
    });
  }, [allTx, tab, mode, activeCategory, search, sort]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore   = paginated.length < filtered.length;

  const hasActiveFilters =
    tab !== "all" || mode !== "all" || search || sort !== "date-desc" || activeCategory !== "all";

  // ── Tab helper ───────────────────────────────────────────
  const switchTab = (t: TabType) => {
    setTab(t);
    setActiveCategory("all");
    setPage(1);
  };

  // ── Actions ──────────────────────────────────────────────
  const openAdd = (type: TransactionType) => {
    setFormType(type);
    setEditItem(undefined);
    setFormOpen(true);
  };

  const handleEdit = (tx: typeof allTx[0]) => {
    setFormType(tx.type);
    setEditItem(tx.raw);
    setFormOpen(true);
  };

  const handleDelete = async (tx: typeof allTx[0]) => {
    if (!window.confirm(`Delete this ${tx.type}?`)) return;
    try {
      tx.type === "expense"
        ? await expenseService.deleteExpense(tx.id)
        : await incomeService.deleteIncome(tx.id);
      toast.success(`${tx.type === "expense" ? "Expense" : "Income"} deleted`);
      data.refetch();
    } catch {
      toast.error("Delete failed");
    }
  };

  const clearFilters = () => {
    setSearch(""); setMode("all"); setTab("all");
    setSort("date-desc"); setActiveCategory("all"); setPage(1);
  };

  // ── Net value of visible list ────────────────────────────
  const netVisible = filtered.reduce(
    (s, t) => s + (t.type === "expense" ? -t.amount : t.amount), 0
  );

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-5 space-y-5">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Transactions</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            {" · "}
            Net{" "}
            <span className={netVisible >= 0 ? "text-success" : "text-danger"}>
              {netVisible >= 0 ? "+" : ""}{formatCurrency(netVisible)}
            </span>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            size="sm" variant="outline" className="gap-1.5"
            onClick={() => openAdd("income")}
          >
            <TrendingUp className="h-3.5 w-3.5 text-success" />
            <span className="hidden sm:inline">Income</span>
          </Button>
          <Button
            size="sm" className="gap-1.5"
            onClick={() => openAdd("expense")}
          >
            <TrendingDown className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Expense</span>
          </Button>
        </div>
      </div>

      {/* ── Stat cards (change per tab) ─────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-3 gap-3"
        >
          {data.isLoading ? (
            <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
          ) : tab === "income" ? (
            <>
              <StatCard
                title="Total Income"
                value={formatCurrency(data.totalIncome)}
                icon={<TrendingUp className="h-5 w-5" />}
                accentClass="bg-success-bg text-success"
              />
              <StatCard
                title="Monthly Avg"
                value={formatCurrency(monthlyAvgIncome)}
                icon={<TrendingUp className="h-5 w-5" />}
                accentClass="bg-success-bg text-success"
              />
              <StatCard
                title="Records"
                value={String(data.incomes.length)}
                icon={<Plus className="h-5 w-5" />}
                accentClass="bg-secondary"
              />
            </>
          ) : tab === "expense" ? (
            <>
              <StatCard
                title="Total Expenses"
                value={formatCurrency(data.totalExpense)}
                icon={<TrendingDown className="h-5 w-5" />}
                accentClass="bg-danger-bg text-danger"
              />
              <StatCard
                title="Top Category"
                value={topCategory}
                icon={<Tag className="h-5 w-5" />}
                accentClass="bg-warning-bg text-warning-foreground"
              />
              <StatCard
                title="Records"
                value={String(data.expenses.length)}
                icon={<Plus className="h-5 w-5" />}
                accentClass="bg-secondary"
              />
            </>
          ) : (
            <>
              <StatCard
                title="Income"
                value={formatCurrency(data.totalIncome)}
                icon={<TrendingUp className="h-5 w-5" />}
                accentClass="bg-success-bg text-success"
              />
              <StatCard
                title="Expenses"
                value={formatCurrency(data.totalExpense)}
                icon={<TrendingDown className="h-5 w-5" />}
                accentClass="bg-danger-bg text-danger"
              />
              <StatCard
                title="Net Balance"
                value={formatCurrency(data.balance)}
                icon={<ArrowUpDown className="h-5 w-5" />}
                accentClass={data.balance >= 0 ? "bg-success-bg text-success" : "bg-danger-bg text-danger"}
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Filters ─────────────────────────────────────────── */}
      <div className="space-y-3">
        {/* Search */}
        <Input
          placeholder="Search by name, category…"
          leftIcon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />

        {/* Tab + dropdowns row */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Type tabs */}
          <div className="flex rounded-[var(--radius)] border border-border overflow-hidden text-sm">
            {(["all", "income", "expense"] as TabType[]).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`px-3 py-1.5 capitalize transition-colors ${
                  tab === t
                    ? "bg-primary text-primary-foreground"
                    : "bg-card hover:bg-accent text-muted-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Mode */}
          <Select value={mode} onValueChange={(v) => { setMode(v); setPage(1); }}>
            <SelectTrigger className="w-[130px] h-9">
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
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest first</SelectItem>
              <SelectItem value="date-asc">Oldest first</SelectItem>
              <SelectItem value="amount-desc">Highest amount</SelectItem>
              <SelectItem value="amount-asc">Lowest amount</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost" size="sm"
              className="gap-1.5 text-muted-foreground"
              onClick={clearFilters}
            >
              <X className="h-3.5 w-3.5" /> Clear
            </Button>
          )}
        </div>

        {/* Category pills — only when viewing expenses */}
        <AnimatePresence>
          {tab === "expense" && expenseCategories.length > 1 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap gap-2 overflow-hidden"
            >
              {expenseCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setPage(1); }}
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Transaction list ─────────────────────────────────── */}
      <div className="rounded-[var(--radius-lg)] border border-border bg-card divide-y divide-border">
        {data.isLoading ? (
          <div className="px-5 py-3"><SkeletonList count={8} /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
            <ArrowUpDown className="h-10 w-10 opacity-20" />
            <p className="text-sm font-medium">No transactions found</p>
            {hasActiveFilters ? (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openAdd("income")}>
                  Add Income
                </Button>
                <Button size="sm" onClick={() => openAdd("expense")}>
                  Add Expense
                </Button>
              </div>
            )}
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="initial" animate="enter">
            {paginated.map((tx) => (
              <motion.div
                key={tx.id}
                variants={staggerItem}
                className="px-4 group hover:bg-accent/30 transition-colors"
              >
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
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* ── Load more ────────────────────────────────────────── */}
      {hasMore && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
            Load more ({filtered.length - paginated.length} remaining)
          </Button>
        </div>
      )}

      {/* ── Form modal ───────────────────────────────────────── */}
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
