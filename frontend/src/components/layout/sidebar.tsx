"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, ArrowUpDown, BarChart3, User, Settings,
  Wallet, LogOut, TrendingUp, TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard",     label: "Dashboard",    icon: LayoutDashboard },
  { href: "/transactions",  label: "Transactions", icon: ArrowUpDown },
  { href: "/income",        label: "Income",       icon: TrendingUp },
  { href: "/expenses",      label: "Expenses",     icon: TrendingDown },
  { href: "/analytics",     label: "Analytics",    icon: BarChart3 },
  { href: "/profile",       label: "Profile",      icon: User },
  { href: "/settings",      label: "Settings",     icon: Settings },
];

export function Sidebar() {
  const pathname  = usePathname();
  const { user, logout } = useAuth();
  const router    = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 border-r border-border bg-card">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Wallet className="h-4 w-4" />
        </div>
        <span className="font-bold text-base tracking-tight">CashFlow</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto p-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative flex items-center gap-3 rounded-[var(--radius)] px-3 py-2.5 text-sm font-medium transition-colors duration-150 cursor-pointer",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-[var(--radius)] bg-primary -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User / logout */}
      <div className="p-3 border-t border-border shrink-0">
        <div className="flex items-center gap-3 p-2 rounded-[var(--radius)] hover:bg-accent transition-colors cursor-default group">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{getInitials(user?.name ?? "U")}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium truncate">{user?.name ?? "User"}</span>
            <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-md text-muted-foreground hover:text-danger hover:bg-danger-bg transition-colors opacity-0 group-hover:opacity-100"
            title="Logout"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
