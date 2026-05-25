"use client";

import { usePathname } from "next/navigation";
import { Moon, Sun, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/store/auth-context";
import { getInitials } from "@/lib/utils";

const ROUTE_TITLES: Record<string, string> = {
  "/dashboard":    "Dashboard",
  "/transactions": "Transactions",
  "/income":       "Income",
  "/expenses":     "Expenses",
  "/analytics":    "Analytics",
  "/profile":      "Profile",
  "/settings":     "Settings",
};

export function TopBar() {
  const pathname      = usePathname();
  const { theme, setTheme } = useTheme();
  const { user }      = useAuth();

  const title = ROUTE_TITLES[pathname] ?? "CashFlow";

  return (
    <header className="md:hidden sticky top-0 z-30 glass border-b border-border">
      <div className="flex h-14 items-center justify-between px-4">
        <h1 className="font-bold text-base tracking-tight">{title}</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>
          <Avatar className="h-7 w-7">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="text-xs">{getInitials(user?.name ?? "U")}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
