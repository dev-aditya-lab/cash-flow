"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldCheck, Users, MessageSquare, Flag, RefreshCw,
  Search, Star, Bug, Sparkles, Lightbulb, FileText,
  CircleCheck, CircleX, MoreHorizontal, Trash2, Eye,
  CheckCheck, RotateCcw, ChevronLeft, ChevronRight,
  ArrowUpDown, ArrowUp, ArrowDown, ShieldAlert, UserX,
  UserCheck, Crown, UserMinus, TrendingUp, Inbox,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth }      from "@/store/auth-context";
import { adminService } from "@/services/admin.service";
import type {
  AdminStats, AdminUser, AdminFeedback, AdminReport,
} from "@/services/admin.service";

import { StatCard }         from "@/components/ui/card";
import { Badge }            from "@/components/ui/badge";
import { Button }           from "@/components/ui/button";
import { Input }            from "@/components/ui/input";
import { Skeleton }         from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getInitials } from "@/lib/utils";

// ── Constants ─────────────────────────────────────────────
const PAGE_SIZE = 10;

const REPORT_META = {
  bug:        { icon: Bug,       label: "Bug",        variant: "danger"   },
  feature:    { icon: Sparkles,  label: "Feature",    variant: "info"     },
  suggestion: { icon: Lightbulb, label: "Suggestion", variant: "warning"  },
  other:      { icon: FileText,  label: "Other",      variant: "secondary"},
} as const;

// ── Shared types ──────────────────────────────────────────
type SortDir = "asc" | "desc";
interface SortState { col: string; dir: SortDir }

interface ConfirmState {
  title:     string;
  desc:      string;
  danger?:   boolean;
  onConfirm: () => Promise<void>;
}

// ── Helpers ───────────────────────────────────────────────
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function sortBy<T>(arr: T[], col: string, dir: SortDir): T[] {
  return [...arr].sort((a, b) => {
    const av = (a as Record<string, unknown>)[col];
    const bv = (b as Record<string, unknown>)[col];
    const cmp =
      typeof av === "string" && typeof bv === "string"
        ? av.localeCompare(bv)
        : (av as number) < (bv as number) ? -1 : (av as number) > (bv as number) ? 1 : 0;
    return dir === "asc" ? cmp : -cmp;
  });
}

function paginate<T>(arr: T[], page: number): T[] {
  return arr.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
}

function totalPages(count: number) { return Math.max(1, Math.ceil(count / PAGE_SIZE)); }

// ── Sub-components ────────────────────────────────────────

function SortTh({ label, col, sort, onSort, className = "" }: {
  label:    string;
  col:      string;
  sort:     SortState;
  onSort:   (col: string) => void;
  className?: string;
}) {
  const active = sort.col === col;
  const Icon   = active ? (sort.dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th
      onClick={() => onSort(col)}
      className={`text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide
        cursor-pointer select-none hover:text-foreground transition-colors ${className}`}
    >
      <span className="flex items-center gap-1.5">
        {label}
        <Icon className={`h-3 w-3 ${active ? "text-primary" : "opacity-40"}`} />
      </span>
    </th>
  );
}

function Pagination({ page, total, onChange }: {
  page:     number;
  total:    number;
  onChange: (p: number) => void;
}) {
  if (total <= 1) return null;
  const pages = Array.from({ length: Math.min(total, 5) }, (_, i) => {
    if (total <= 5) return i + 1;
    if (page <= 3)  return i + 1;
    if (page >= total - 2) return total - 4 + i;
    return page - 2 + i;
  });
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border">
      <p className="text-xs text-muted-foreground">
        Page {page} of {total}
      </p>
      <div className="flex items-center gap-1">
        <Button size="icon-sm" variant="ghost" disabled={page === 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>
        {pages.map((p) => (
          <Button
            key={p}
            size="icon-sm"
            variant={p === page ? "default" : "ghost"}
            onClick={() => onChange(p)}
            className="text-xs w-7 h-7"
          >
            {p}
          </Button>
        ))}
        <Button size="icon-sm" variant="ghost" disabled={page === total} onClick={() => onChange(page + 1)}>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

function EmptyRow({ cols, message }: { cols: number; message: string }) {
  return (
    <tr>
      <td colSpan={cols} className="px-4 py-16 text-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Inbox className="h-8 w-8 opacity-30" />
          <p className="text-sm">{message}</p>
        </div>
      </td>
    </tr>
  );
}

function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-border">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <Skeleton className="h-4 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ── Detail modal ──────────────────────────────────────────
function DetailModal({ item, type, onClose, onDelete, onStatusChange }: {
  item:           AdminFeedback | AdminReport | null;
  type:           "feedback" | "report" | null;
  onClose:        () => void;
  onDelete:       (id: string) => void;
  onStatusChange: (id: string, status: "open" | "resolved") => void;
}) {
  if (!item || !type) return null;
  const fb = type === "feedback" ? (item as AdminFeedback) : null;
  const rp = type === "report"   ? (item as AdminReport)   : null;

  return (
    <Dialog open={!!item} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "feedback"
              ? <><MessageSquare className="h-4 w-4 text-primary" /> Feedback Detail</>
              : <><Flag className="h-4 w-4 text-primary" /> Report Detail</>
            }
          </DialogTitle>
        </DialogHeader>

        {/* User info */}
        <div className="flex items-center gap-3 p-3 rounded-[var(--radius-lg)] bg-secondary/50">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-xs">
              {getInitials(item.user?.name ?? "?")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{item.user?.name ?? "Unknown"}</p>
            <p className="text-xs text-muted-foreground truncate">{item.user?.email ?? "—"}</p>
          </div>
          <p className="text-xs text-muted-foreground shrink-0">{fmtDate(item.createdAt)}</p>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-2">
          {fb && (
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < fb.rating ? "fill-yellow-400 text-yellow-400" : "fill-none text-muted-foreground/30"}`} />
              ))}
              <span className="text-sm font-medium ml-1 text-muted-foreground">{fb.rating} / 5</span>
            </div>
          )}
          {rp && (
            <>
              {(() => {
                const m = REPORT_META[rp.type];
                const Icon = m.icon;
                return (
                  <Badge variant={m.variant as "danger" | "info" | "warning" | "secondary"} className="gap-1.5">
                    <Icon className="h-3 w-3" />{m.label}
                  </Badge>
                );
              })()}
              <Badge variant={rp.status === "open" ? "warning" : "success"}>
                {rp.status === "open" ? "Open" : "Resolved"}
              </Badge>
            </>
          )}
        </div>

        {/* Full message */}
        <div className="rounded-[var(--radius-lg)] border border-border bg-background p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Message</p>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{item.message}</p>
        </div>

        <DialogFooter className="gap-2">
          {rp && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                onStatusChange(rp._id, rp.status === "open" ? "resolved" : "open");
                onClose();
              }}
            >
              {rp.status === "open"
                ? <><CheckCheck className="h-3.5 w-3.5 text-success" /> Mark Resolved</>
                : <><RotateCcw  className="h-3.5 w-3.5" /> Reopen</>
              }
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-danger border-danger/30 hover:bg-danger-bg"
            onClick={() => { onDelete(item._id); onClose(); }}
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Confirm dialog ────────────────────────────────────────
function ConfirmDialog({ state, onClose }: {
  state:   ConfirmState | null;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const handleConfirm = async () => {
    if (!state) return;
    setLoading(true);
    try   { await state.onConfirm(); onClose(); }
    catch { /* error toasted by caller */ }
    finally { setLoading(false); }
  };
  return (
    <Dialog open={!!state} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className={`h-4 w-4 ${state?.danger ? "text-danger" : "text-warning-foreground"}`} />
            {state?.title}
          </DialogTitle>
          <DialogDescription>{state?.desc}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button
            size="sm"
            variant={state?.danger ? "destructive" : "default"}
            loading={loading}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main page ─────────────────────────────────────────────
export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // ── data state ──
  const [stats,    setStats]    = useState<AdminStats | null>(null);
  const [users,    setUsers]    = useState<AdminUser[]>([]);
  const [feedback, setFeedback] = useState<AdminFeedback[]>([]);
  const [reports,  setReports]  = useState<AdminReport[]>([]);
  const [loading,  setLoading]  = useState(true);

  // ── users tab state ──
  const [uSearch,  setUSearch]  = useState("");
  const [uRole,    setURole]    = useState("all");
  const [uStatus,  setUStatus]  = useState("all");
  const [uSort,    setUSort]    = useState<SortState>({ col: "createdAt", dir: "desc" });
  const [uPage,    setUPage]    = useState(1);

  // ── feedback tab state ──
  const [fbSearch, setFbSearch] = useState("");
  const [fbRating, setFbRating] = useState("all");
  const [fbSort,   setFbSort]   = useState<SortState>({ col: "createdAt", dir: "desc" });
  const [fbPage,   setFbPage]   = useState(1);

  // ── reports tab state ──
  const [rpSearch, setRpSearch] = useState("");
  const [rpType,   setRpType]   = useState("all");
  const [rpStatus, setRpStatus] = useState("all");
  const [rpSort,   setRpSort]   = useState<SortState>({ col: "createdAt", dir: "desc" });
  const [rpPage,   setRpPage]   = useState(1);

  // ── modals ──
  const [detail,  setDetail]  = useState<{ item: AdminFeedback | AdminReport; type: "feedback" | "report" } | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  // ── guard ─────────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && user?.role !== "admin") router.replace("/dashboard");
  }, [authLoading, user, router]);

  // ── fetch all ─────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [s, u, f, r] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
        adminService.getFeedback(),
        adminService.getReports(),
      ]);
      setStats(s); setUsers(u); setFeedback(f); setReports(r);
    } catch { toast.error("Failed to load admin data"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!authLoading && user?.role === "admin") fetchAll();
  }, [authLoading, user, fetchAll]);

  // ── derived stats ──────────────────────────────────────
  const derivedStats = useMemo(() => ({
    totalUsers:    stats?.users    ?? 0,
    verified:      users.filter(u => u.emailVerified).length,
    banned:        users.filter(u => u.isBanned).length,
    totalFeedback: stats?.feedback ?? 0,
    avgRating:     feedback.length
      ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1)
      : "—",
    openReports:   reports.filter(r => r.status === "open").length,
  }), [stats, users, feedback, reports]);

  // ── filtered + sorted + paginated data ────────────────
  const filteredUsers = useMemo(() => {
    let d = users.filter(u => {
      const q = uSearch.toLowerCase();
      return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    });
    if (uRole !== "all")   d = d.filter(u => u.role === uRole);
    if (uStatus === "verified")   d = d.filter(u =>  u.emailVerified && !u.isBanned);
    if (uStatus === "unverified") d = d.filter(u => !u.emailVerified);
    if (uStatus === "banned")     d = d.filter(u =>  u.isBanned);
    return sortBy(d, uSort.col, uSort.dir);
  }, [users, uSearch, uRole, uStatus, uSort]);

  const filteredFeedback = useMemo(() => {
    let d = feedback.filter(f => {
      const q = fbSearch.toLowerCase();
      return !q || f.message.toLowerCase().includes(q)
               || (f.user?.name ?? "").toLowerCase().includes(q)
               || (f.user?.email ?? "").toLowerCase().includes(q);
    });
    if (fbRating !== "all") d = d.filter(f => f.rating === Number(fbRating));
    return sortBy(d, fbSort.col, fbSort.dir);
  }, [feedback, fbSearch, fbRating, fbSort]);

  const filteredReports = useMemo(() => {
    let d = reports.filter(r => {
      const q = rpSearch.toLowerCase();
      return !q || r.message.toLowerCase().includes(q)
               || (r.user?.name ?? "").toLowerCase().includes(q)
               || (r.user?.email ?? "").toLowerCase().includes(q);
    });
    if (rpType   !== "all") d = d.filter(r => r.type   === rpType);
    if (rpStatus !== "all") d = d.filter(r => r.status === rpStatus);
    return sortBy(d, rpSort.col, rpSort.dir);
  }, [reports, rpSearch, rpType, rpStatus, rpSort]);

  // ── sort togglers ──────────────────────────────────────
  const toggleSort = (setState: (s: SortState) => void, current: SortState) =>
    (col: string) => setState({ col, dir: current.col === col && current.dir === "asc" ? "desc" : "asc" });

  // ── action handlers ────────────────────────────────────
  const handleUpdateUser = (id: string, payload: { role?: "user" | "admin"; isBanned?: boolean }, label: string) => {
    setConfirm({
      title: label,
      desc:  `This will immediately change the user's ${payload.role !== undefined ? "role" : "access status"}.`,
      danger: payload.isBanned === true,
      onConfirm: async () => {
        const updated = await adminService.updateUser(id, payload);
        setUsers(prev => prev.map(u => u._id === id ? { ...u, ...updated } : u));
        toast.success(`${label} successful`);
      },
    });
  };

  const handleDeleteFeedback = (id: string) => {
    setConfirm({
      title:  "Delete Feedback",
      desc:   "This feedback will be permanently removed.",
      danger: true,
      onConfirm: async () => {
        await adminService.deleteFeedback(id);
        setFeedback(prev => prev.filter(f => f._id !== id));
        toast.success("Feedback deleted");
      },
    });
  };

  const handleDeleteReport = (id: string) => {
    setConfirm({
      title:  "Delete Report",
      desc:   "This report will be permanently removed.",
      danger: true,
      onConfirm: async () => {
        await adminService.deleteReport(id);
        setReports(prev => prev.filter(r => r._id !== id));
        toast.success("Report deleted");
      },
    });
  };

  const handleStatusChange = async (id: string, status: "open" | "resolved") => {
    try {
      const updated = await adminService.updateReport(id, status);
      setReports(prev => prev.map(r => r._id === id ? { ...r, ...updated } : r));
      toast.success(`Report marked as ${status}`);
    } catch { toast.error("Failed to update report"); }
  };

  if (authLoading || user?.role !== "admin") return null;

  // ── render ────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-6">

      {/* ── Header ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">CashFlow management console</p>
          </div>
        </div>
        <Button
          variant="outline" size="sm"
          onClick={fetchAll} disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </motion.div>

      {/* ── Stats grid ──────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-[var(--radius-lg)]" />)
        ) : (
          <>
            <StatCard title="Total Users"    value={String(derivedStats.totalUsers)}    icon={<Users         className="h-5 w-5" />} accentClass="bg-info-bg text-info" />
            <StatCard title="Verified"        value={String(derivedStats.verified)}      icon={<CircleCheck   className="h-5 w-5" />} accentClass="bg-success-bg text-success" />
            <StatCard title="Banned"          value={String(derivedStats.banned)}        icon={<UserX         className="h-5 w-5" />} accentClass="bg-danger-bg text-danger" />
            <StatCard title="Feedback"        value={String(derivedStats.totalFeedback)} icon={<MessageSquare className="h-5 w-5" />} accentClass="bg-secondary text-muted-foreground" />
            <StatCard title="Avg Rating"      value={String(derivedStats.avgRating)}     icon={<Star          className="h-5 w-5" />} accentClass="bg-warning-bg text-warning-foreground" />
            <StatCard title="Open Reports"    value={String(derivedStats.openReports)}   icon={<TrendingUp    className="h-5 w-5" />} accentClass="bg-warning-bg text-warning-foreground" />
          </>
        )}
      </div>

      {/* ── Tabs ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-[var(--radius-xl)] border border-border bg-card overflow-hidden"
      >
        <Tabs defaultValue="users">
          {/* Tab bar */}
          <div className="flex items-center justify-between px-4 pt-4 pb-0 border-b border-border">
            <TabsList className="h-9 rounded-lg">
              <TabsTrigger value="users"    className="h-7 text-xs gap-1.5">
                <Users className="h-3.5 w-3.5" />
                Users
                <span className="bg-secondary text-muted-foreground px-1.5 py-0.5 rounded-full text-[10px]">{users.length}</span>
              </TabsTrigger>
              <TabsTrigger value="feedback" className="h-7 text-xs gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" />
                Feedback
                <span className="bg-secondary text-muted-foreground px-1.5 py-0.5 rounded-full text-[10px]">{feedback.length}</span>
              </TabsTrigger>
              <TabsTrigger value="reports"  className="h-7 text-xs gap-1.5">
                <Flag className="h-3.5 w-3.5" />
                Reports
                {derivedStats.openReports > 0 && (
                  <span className="bg-warning-bg text-warning-foreground px-1.5 py-0.5 rounded-full text-[10px]">{derivedStats.openReports}</span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ── USERS TAB ───────────────────────────── */}
          <TabsContent value="users">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-border bg-secondary/20">
              <div className="flex-1 min-w-[180px] max-w-xs">
                <Input
                  placeholder="Search by name or email…"
                  value={uSearch}
                  onChange={e => { setUSearch(e.target.value); setUPage(1); }}
                  leftIcon={<Search className="h-3.5 w-3.5" />}
                  className="h-8 text-xs"
                />
              </div>
              <Select value={uRole} onValueChange={v => { setURole(v); setUPage(1); }}>
                <SelectTrigger className="h-8 w-32 text-xs"><SelectValue placeholder="Role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={uStatus} onValueChange={v => { setUStatus(v); setUPage(1); }}>
                <SelectTrigger className="h-8 w-36 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground ml-auto">
                {filteredUsers.length} result{filteredUsers.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/10">
                    <SortTh label="User"      col="name"          sort={uSort} onSort={toggleSort(setUSort, uSort)} className="min-w-[180px]" />
                    <SortTh label="Role"      col="role"          sort={uSort} onSort={toggleSort(setUSort, uSort)} />
                    <SortTh label="Status"    col="emailVerified" sort={uSort} onSort={toggleSort(setUSort, uSort)} />
                    <SortTh label="Joined"    col="createdAt"     sort={uSort} onSort={toggleSort(setUSort, uSort)} />
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? <TableSkeleton rows={5} cols={5} /> : (
                    <>
                      {paginate(filteredUsers, uPage).map((u) => (
                        <tr key={u._id} className="border-b border-border last:border-0 hover:bg-accent/20 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <Avatar className="h-7 w-7 shrink-0">
                                <AvatarFallback className="text-[10px]">{getInitials(u.name)}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{u.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={u.role === "admin" ? "default" : "secondary"} className="gap-1">
                              {u.role === "admin" ? <Crown className="h-3 w-3" /> : null}
                              {u.role}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              {u.isBanned ? (
                                <Badge variant="danger" className="gap-1"><UserX className="h-3 w-3" />Banned</Badge>
                              ) : u.emailVerified ? (
                                <Badge variant="success" className="gap-1"><CircleCheck className="h-3 w-3" />Verified</Badge>
                              ) : (
                                <Badge variant="outline" className="gap-1"><CircleX className="h-3 w-3" />Unverified</Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{fmtDate(u.createdAt)}</td>
                          <td className="px-4 py-3 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon-sm" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                                {u.role === "user" ? (
                                  <DropdownMenuItem onClick={() => handleUpdateUser(u._id, { role: "admin" }, "Promote to Admin")}>
                                    <Crown className="h-3.5 w-3.5 text-primary" /> Promote to Admin
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleUpdateUser(u._id, { role: "user" }, "Demote to User")}>
                                    <UserMinus className="h-3.5 w-3.5" /> Demote to User
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                {u.isBanned ? (
                                  <DropdownMenuItem onClick={() => handleUpdateUser(u._id, { isBanned: false }, "Unban User")}>
                                    <UserCheck className="h-3.5 w-3.5 text-success" /> Unban User
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem danger onClick={() => handleUpdateUser(u._id, { isBanned: true }, "Ban User")}>
                                    <UserX className="h-3.5 w-3.5" /> Ban User
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && <EmptyRow cols={5} message="No users match the current filter" />}
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination page={uPage} total={totalPages(filteredUsers.length)} onChange={setUPage} />
          </TabsContent>

          {/* ── FEEDBACK TAB ──────────────────────────── */}
          <TabsContent value="feedback">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-border bg-secondary/20">
              <div className="flex-1 min-w-[180px] max-w-xs">
                <Input
                  placeholder="Search by user or message…"
                  value={fbSearch}
                  onChange={e => { setFbSearch(e.target.value); setFbPage(1); }}
                  leftIcon={<Search className="h-3.5 w-3.5" />}
                  className="h-8 text-xs"
                />
              </div>
              <Select value={fbRating} onValueChange={v => { setFbRating(v); setFbPage(1); }}>
                <SelectTrigger className="h-8 w-36 text-xs"><SelectValue placeholder="Rating" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  {[5, 4, 3, 2, 1].map(n => (
                    <SelectItem key={n} value={String(n)}>
                      <span className="flex items-center gap-1">
                        {Array.from({ length: n }).map((_, i) => <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}
                        {Array.from({ length: 5 - n }).map((_, i) => <Star key={i} className="h-3 w-3 text-muted-foreground/30" />)}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground ml-auto">
                {filteredFeedback.length} result{filteredFeedback.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/10">
                    <SortTh label="User"    col="user"      sort={fbSort} onSort={toggleSort(setFbSort, fbSort)} className="min-w-[160px]" />
                    <SortTh label="Rating"  col="rating"    sort={fbSort} onSort={toggleSort(setFbSort, fbSort)} className="w-32" />
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Message</th>
                    <SortTh label="Date"    col="createdAt" sort={fbSort} onSort={toggleSort(setFbSort, fbSort)} className="w-32" />
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? <TableSkeleton rows={5} cols={5} /> : (
                    <>
                      {paginate(filteredFeedback, fbPage).map((f) => (
                        <tr key={f._id} className="border-b border-border last:border-0 hover:bg-accent/20 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-medium text-sm">{f.user?.name ?? <span className="text-muted-foreground">Deleted user</span>}</p>
                            <p className="text-xs text-muted-foreground">{f.user?.email ?? "—"}</p>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`h-3.5 w-3.5 ${i < f.rating ? "fill-yellow-400 text-yellow-400" : "fill-none text-muted-foreground/20"}`} />
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 max-w-xs">
                            <p className="text-sm text-muted-foreground line-clamp-2">{f.message}</p>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{fmtDate(f.createdAt)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="icon-sm" variant="ghost"
                                title="View full message"
                                onClick={() => setDetail({ item: f, type: "feedback" })}
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="icon-sm" variant="ghost"
                                title="Delete"
                                className="text-muted-foreground hover:text-danger hover:bg-danger-bg"
                                onClick={() => handleDeleteFeedback(f._id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredFeedback.length === 0 && <EmptyRow cols={5} message="No feedback matches the current filter" />}
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination page={fbPage} total={totalPages(filteredFeedback.length)} onChange={setFbPage} />
          </TabsContent>

          {/* ── REPORTS TAB ─────────────────────────── */}
          <TabsContent value="reports">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-border bg-secondary/20">
              <div className="flex-1 min-w-[180px] max-w-xs">
                <Input
                  placeholder="Search by user or message…"
                  value={rpSearch}
                  onChange={e => { setRpSearch(e.target.value); setRpPage(1); }}
                  leftIcon={<Search className="h-3.5 w-3.5" />}
                  className="h-8 text-xs"
                />
              </div>
              <Select value={rpType} onValueChange={v => { setRpType(v); setRpPage(1); }}>
                <SelectTrigger className="h-8 w-36 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="bug"><span className="flex items-center gap-1.5"><Bug className="h-3.5 w-3.5" />Bug</span></SelectItem>
                  <SelectItem value="feature"><span className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" />Feature</span></SelectItem>
                  <SelectItem value="suggestion"><span className="flex items-center gap-1.5"><Lightbulb className="h-3.5 w-3.5" />Suggestion</span></SelectItem>
                  <SelectItem value="other"><span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" />Other</span></SelectItem>
                </SelectContent>
              </Select>
              <Select value={rpStatus} onValueChange={v => { setRpStatus(v); setRpPage(1); }}>
                <SelectTrigger className="h-8 w-32 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground ml-auto">
                {filteredReports.length} result{filteredReports.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/10">
                    <SortTh label="User"    col="user"      sort={rpSort} onSort={toggleSort(setRpSort, rpSort)} className="min-w-[160px]" />
                    <SortTh label="Type"    col="type"      sort={rpSort} onSort={toggleSort(setRpSort, rpSort)} className="w-36" />
                    <SortTh label="Status"  col="status"    sort={rpSort} onSort={toggleSort(setRpSort, rpSort)} className="w-28" />
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Message</th>
                    <SortTh label="Date"    col="createdAt" sort={rpSort} onSort={toggleSort(setRpSort, rpSort)} className="w-32" />
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide w-28">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? <TableSkeleton rows={5} cols={6} /> : (
                    <>
                      {paginate(filteredReports, rpPage).map((r) => {
                        const meta = REPORT_META[r.type];
                        const MetaIcon = meta.icon;
                        return (
                          <tr key={r._id} className="border-b border-border last:border-0 hover:bg-accent/20 transition-colors">
                            <td className="px-4 py-3">
                              <p className="font-medium text-sm">{r.user?.name ?? <span className="text-muted-foreground">Deleted user</span>}</p>
                              <p className="text-xs text-muted-foreground">{r.user?.email ?? "—"}</p>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={meta.variant as "danger" | "info" | "warning" | "secondary"} className="gap-1.5">
                                <MetaIcon className="h-3 w-3" />{meta.label}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={r.status === "open" ? "warning" : "success"}>
                                {r.status === "open" ? "Open" : "Resolved"}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 max-w-xs">
                              <p className="text-sm text-muted-foreground line-clamp-2">{r.message}</p>
                            </td>
                            <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{fmtDate(r.createdAt)}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  size="icon-sm" variant="ghost"
                                  title="View full message"
                                  onClick={() => setDetail({ item: r, type: "report" })}
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="icon-sm" variant="ghost"
                                  title={r.status === "open" ? "Mark resolved" : "Reopen"}
                                  className={r.status === "open" ? "hover:text-success hover:bg-success-bg" : ""}
                                  onClick={() => handleStatusChange(r._id, r.status === "open" ? "resolved" : "open")}
                                >
                                  {r.status === "open"
                                    ? <CheckCheck className="h-3.5 w-3.5" />
                                    : <RotateCcw  className="h-3.5 w-3.5" />
                                  }
                                </Button>
                                <Button
                                  size="icon-sm" variant="ghost"
                                  title="Delete"
                                  className="text-muted-foreground hover:text-danger hover:bg-danger-bg"
                                  onClick={() => handleDeleteReport(r._id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredReports.length === 0 && <EmptyRow cols={6} message="No reports match the current filter" />}
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination page={rpPage} total={totalPages(filteredReports.length)} onChange={setRpPage} />
          </TabsContent>

        </Tabs>
      </motion.div>

      {/* ── Modals ───────────────────────────────── */}
      <DetailModal
        item={detail?.item ?? null}
        type={detail?.type ?? null}
        onClose={() => setDetail(null)}
        onDelete={(id) => {
          if (detail?.type === "feedback") handleDeleteFeedback(id);
          else handleDeleteReport(id);
        }}
        onStatusChange={handleStatusChange}
      />
      <ConfirmDialog state={confirm} onClose={() => setConfirm(null)} />

    </div>
  );
}
