"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Check, Download, Trash2, Info, Globe } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { staggerContainer, staggerItem } from "@/lib/animations";

const CURRENCIES = [
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
];

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-border bg-card overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</h2>
      </div>
      <div className="pb-2">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: "light",  label: "Light",  icon: Sun },
    { value: "dark",   label: "Dark",   icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="max-w-xl mx-auto px-4 md:px-6 py-5 space-y-5">
      <div>
        <h1 className="text-xl font-bold">Settings</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Personalise your CashFlow experience</p>
      </div>

      <motion.div variants={staggerContainer} initial="initial" animate="enter" className="space-y-4">

        {/* ── Appearance ─────────────────────────────── */}
        <motion.div variants={staggerItem}>
          <SectionCard title="Appearance">
            <div className="px-4 pb-3 space-y-3">
              <p className="text-sm font-medium">Theme</p>
              <div className="grid grid-cols-3 gap-2">
                {themes.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={`relative flex flex-col items-center gap-2 p-3 rounded-[var(--radius-lg)] border transition-all ${
                      theme === value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{label}</span>
                    {theme === value && (
                      <div className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-2.5 w-2.5" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </SectionCard>
        </motion.div>

        {/* ── Currency ───────────────────────────────── */}
        <motion.div variants={staggerItem}>
          <SectionCard title="Currency">
            <div className="px-4 pb-3 space-y-2">
              <p className="text-sm font-medium">Display Currency</p>
              <div className="grid grid-cols-2 gap-2">
                {CURRENCIES.map(({ code, symbol, label }) => (
                  <button
                    key={code}
                    onClick={() => code !== "INR" ? toast.info("Coming soon") : null}
                    className={`flex items-center gap-2 p-3 rounded-[var(--radius-lg)] border text-left transition-all ${
                      code === "INR"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-accent opacity-60"
                    }`}
                  >
                    <span className="text-lg font-bold w-6">{symbol}</span>
                    <div>
                      <p className="text-xs font-semibold">{code}</p>
                      <p className="text-[10px] text-muted-foreground">{label}</p>
                    </div>
                    {code === "INR" && (
                      <Check className="h-3.5 w-3.5 text-primary ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </SectionCard>
        </motion.div>

        {/* ── Data ───────────────────────────────────── */}
        <motion.div variants={staggerItem}>
          <SectionCard title="Data & Privacy">
            <div className="px-4 pb-3 space-y-2">
              <button
                onClick={() => toast.info("Export feature coming soon")}
                className="flex items-center gap-3 w-full py-3 hover:bg-accent/50 rounded-[var(--radius)] transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary shrink-0">
                  <Download className="h-4 w-4" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">Export Data</p>
                  <p className="text-xs text-muted-foreground">Download all your transactions as CSV</p>
                </div>
              </button>
              <Separator />
              <button
                onClick={() => toast.info("Coming soon")}
                className="flex items-center gap-3 w-full py-3 hover:bg-accent/50 rounded-[var(--radius)] transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-danger-bg shrink-0">
                  <Trash2 className="h-4 w-4 text-danger" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-danger">Delete Account</p>
                  <p className="text-xs text-muted-foreground">Permanently remove all your data</p>
                </div>
              </button>
            </div>
          </SectionCard>
        </motion.div>

        {/* ── About ──────────────────────────────────── */}
        <motion.div variants={staggerItem}>
          <SectionCard title="About">
            <div className="px-4 pb-3">
              <div className="flex items-center gap-3 py-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">CashFlow v1.0.0</p>
                  <p className="text-xs text-muted-foreground">Premium personal finance tracker</p>
                </div>
              </div>
            </div>
          </SectionCard>
        </motion.div>

      </motion.div>
    </div>
  );
}
