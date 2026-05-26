"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ArrowUpDown,
  Plus,
  X,
  TrendingUp,
  TrendingDown,
  BarChart3,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/auth-context";

const LEFT_NAV = [
  { href: "/dashboard",    label: "Home", icon: LayoutDashboard },
  { href: "/transactions", label: "Txns", icon: ArrowUpDown     },
];

const RIGHT_NAV = [
  { href: "/analytics", label: "Charts",  icon: BarChart3 },
  { href: "/profile",   label: "Profile", icon: User      },
];

const FAB_ACTIONS = [
  {
    type: "expense" as const,
    label: "Expense",
    icon: TrendingDown,
    className: "card-gradient-danger",
  },
  {
    type: "income" as const,
    label: "Income",
    icon: TrendingUp,
    className: "card-gradient-success",
  },
];

export function BottomNav() {
  const pathname    = usePathname();
  const { user }    = useAuth();
  const [fabOpen, setFabOpen] = useState(false);

  // Close FAB menu on route change
  useEffect(() => {
    setFabOpen(false);
  }, [pathname]);

  const handleAction = (type: "expense" | "income") => {
    setFabOpen(false);
    window.dispatchEvent(
      new CustomEvent("cashflow:open-form", { detail: { type } })
    );
  };

  const renderNavItem = ({
    href,
    label,
    icon: Icon,
  }: { href: string; label: string; icon: React.ElementType }) => {
    const active =
      pathname === href ||
      (href !== "/dashboard" && pathname.startsWith(href + "/"));

    return (
      <Link
        key={href}
        href={href}
        aria-label={label}
        className="relative flex flex-1 flex-col items-center justify-center py-3 min-w-0 select-none"
      >
        <motion.div
          whileTap={{ scale: 0.84, transition: { duration: 0.1 } }}
          className="relative flex flex-col items-center gap-1"
        >
          {active && (
            <motion.div
              layoutId="bnav-pill"
              className="absolute -inset-2 rounded-xl bg-foreground/8"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <Icon
            className={cn(
              "relative h-5 w-5 transition-all duration-200",
              active ? "text-foreground" : "text-muted-foreground"
            )}
            strokeWidth={active ? 2.2 : 1.8}
          />
          <AnimatePresence>
            {active && (
              <motion.div
                key={`dot-${href}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="relative h-1 w-1 rounded-full bg-foreground"
              />
            )}
          </AnimatePresence>
        </motion.div>
      </Link>
    );
  };

  if (!user) return null;

  return (
    <>
      {/* Backdrop — closes FAB menu when tapping outside */}
      <AnimatePresence>
        {fabOpen && (
          <motion.div
            key="fab-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setFabOpen(false)}
          />
        )}
      </AnimatePresence>

      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-safe pointer-events-none"
        aria-label="Main navigation"
      >
        {/* FAB speed-dial buttons — float above the island */}
        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 pointer-events-auto pb-2">
          <AnimatePresence>
            {fabOpen &&
              FAB_ACTIONS.map(({ type, label, icon: Icon, className }, i) => (
                <motion.button
                  key={type}
                  initial={{ opacity: 0, y: 16, scale: 0.7 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.8 }}
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 22,
                    delay: i * 0.06,
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleAction(type)}
                  aria-label={`Add ${label}`}
                  className={`flex items-center gap-2.5 rounded-full px-4 py-2.5 text-white shadow-lg ${className}`}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 shrink-0">
                    <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
                  </div>
                  <span className="text-sm font-semibold pr-1">{label}</span>
                </motion.button>
              ))}
          </AnimatePresence>
        </div>

        {/* Island nav bar */}
        <div className="pointer-events-auto mx-4 mb-3 flex items-center h-14 glass island-nav px-2 w-full max-w-sm">
          {LEFT_NAV.map(renderNavItem)}

          {/* Center FAB */}
          <div className="flex items-center justify-center px-2 shrink-0">
            <motion.button
              whileTap={{ scale: 0.88, transition: { duration: 0.1 } }}
              whileHover={{ scale: 1.06 }}
              onClick={() => setFabOpen((o) => !o)}
              aria-label={fabOpen ? "Close add menu" : "Add transaction"}
              aria-expanded={fabOpen}
              className="relative flex h-12 w-12 items-center justify-center rounded-full card-gradient-hero text-white shadow-lg ring-2 ring-background overflow-hidden"
            >
              {/* Plus / X icon cross-fade */}
              <AnimatePresence mode="wait" initial={false}>
                {fabOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -45, opacity: 0, scale: 0.6 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 45, opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute"
                  >
                    <X className="h-5 w-5" strokeWidth={2.5} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="plus"
                    initial={{ rotate: 45, opacity: 0, scale: 0.6 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -45, opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute"
                  >
                    <Plus className="h-5 w-5" strokeWidth={2.5} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {RIGHT_NAV.map(renderNavItem)}
        </div>
      </nav>
    </>
  );
}
