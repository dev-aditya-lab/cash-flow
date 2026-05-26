"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, ArrowUpDown, BarChart3, User, Calculator, ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/auth-context";

const BASE_NAV = [
  { href: "/dashboard",    label: "Home",   icon: LayoutDashboard },
  { href: "/transactions", label: "Txns",   icon: ArrowUpDown     },
  { href: "/calculator",   label: "Calc",   icon: Calculator      },
  { href: "/analytics",    label: "Charts", icon: BarChart3       },
  { href: "/profile",      label: "Profile",icon: User            },
];

const ADMIN_NAV = { href: "/admin", label: "Admin", icon: ShieldCheck };

export function BottomNav() {
  const pathname    = usePathname();
  const { user }    = useAuth();

  const navItems = user?.role === "admin"
    ? [...BASE_NAV, ADMIN_NAV]
    : BASE_NAV;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-border">
      <div className="flex items-center justify-around h-16 px-2 pb-safe">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active   = pathname === href || pathname.startsWith(href + "/");
          const isAdmin  = href === "/admin";
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-0.5 flex-1">
              <motion.div
                whileTap={{ scale: 0.88 }}
                className="relative flex flex-col items-center justify-center w-full gap-0.5 py-1"
              >
                {active && (
                  <motion.div
                    layoutId="bottom-nav-pill"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 h-1 w-8 rounded-full bg-primary"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                  />
                )}
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    active
                      ? "text-foreground"
                      : isAdmin
                        ? "text-primary/60"
                        : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors",
                    active
                      ? "text-foreground"
                      : isAdmin
                        ? "text-primary/60"
                        : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
