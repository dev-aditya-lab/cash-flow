"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ArrowUpDown,
  Plus,
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

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const handleFABClick = () => {
    window.dispatchEvent(
      new CustomEvent("cashflow:open-form", { detail: { type: "expense" } })
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
          {/* Animated background pill for active item */}
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

          {/* Active dot below icon */}
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

  // Hide on non-authenticated pages
  if (!user) return null;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-safe pointer-events-none"
      aria-label="Main navigation"
    >
      <div className="pointer-events-auto mx-4 mb-3 flex items-center h-14 glass island-nav px-2 w-full max-w-sm">
        {/* Left nav items */}
        {LEFT_NAV.map(renderNavItem)}

        {/* Center FAB */}
        <div className="flex items-center justify-center px-2 shrink-0">
          <motion.button
            whileTap={{ scale: 0.88, transition: { duration: 0.1 } }}
            whileHover={{ scale: 1.06 }}
            onClick={handleFABClick}
            aria-label="Add transaction"
            className="flex h-12 w-12 items-center justify-center rounded-full card-gradient-hero text-white shadow-lg ring-2 ring-background"
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* Right nav items */}
        {RIGHT_NAV.map(renderNavItem)}
      </div>
    </nav>
  );
}
