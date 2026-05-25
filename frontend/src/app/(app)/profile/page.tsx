"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTheme } from "next-themes";
import {
  User, Mail, Lock, Shield, Bell, LogOut, ChevronRight,
  CheckCircle2, Camera, Sun, Moon, Monitor, Check,
  Download, Trash2, Info, Palette,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth }      from "@/store/auth-context";
import { authService }  from "@/services/auth.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button }       from "@/components/ui/button";
import { Input }        from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Separator }    from "@/components/ui/separator";
import { getInitials }  from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/animations";

// ── Schemas ────────────────────────────────────────────────
const cpSchema = z.object({
  oldPassword: z.string().min(1, "Required"),
  newPassword: z.string().min(6, "Min 6 characters"),
  confirm:     z.string(),
}).refine((d) => d.newPassword === d.confirm, {
  message: "Passwords don't match",
  path:    ["confirm"],
});
type CpValues = z.infer<typeof cpSchema>;

// ── Reusable components ────────────────────────────────────
function SectionCard({ title, children, delay = 0 }: {
  title:    string;
  children: React.ReactNode;
  delay?:   number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-[var(--radius-xl)] border border-border bg-card overflow-hidden"
    >
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {title}
        </h2>
      </div>
      <div className="pb-2">{children}</div>
    </motion.div>
  );
}

function SettingRow({ icon: Icon, label, description, onClick, badge, danger }: {
  icon:         React.ElementType;
  label:        string;
  description?: string;
  onClick?:     () => void;
  badge?:       string;
  danger?:      boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-accent/50 transition-colors text-left"
    >
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${
        danger ? "bg-danger-bg text-danger" : "bg-secondary text-secondary-foreground"
      }`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${danger ? "text-danger" : ""}`}>{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{description}</p>
        )}
      </div>
      {badge && (
        <span className="text-xs font-medium bg-secondary text-muted-foreground px-2 py-0.5 rounded-full shrink-0">
          {badge}
        </span>
      )}
      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </button>
  );
}

const CURRENCIES = [
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "USD", symbol: "$", label: "US Dollar"    },
  { code: "EUR", symbol: "€", label: "Euro"         },
  { code: "GBP", symbol: "£", label: "British Pound"},
];

// ── Page ───────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router  = useRouter();
  const { theme, setTheme } = useTheme();
  const [cpOpen, setCpOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<CpValues>({ resolver: zodResolver(cpSchema) });

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const onChangePw = async (values: CpValues) => {
    try {
      await authService.changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      toast.success("Password changed successfully");
      setCpOpen(false);
      reset();
    } catch {
      toast.error("Failed to change password. Check your current password.");
    }
  };

  const themes = [
    { value: "light",  label: "Light",  icon: Sun     },
    { value: "dark",   label: "Dark",   icon: Moon    },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  return (
    <div className="max-w-xl mx-auto px-4 md:px-6 py-5 space-y-5">

      {/* ── Avatar + name ────────────────────────────────── */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="enter"
        className="flex flex-col items-center gap-4 pt-4 pb-2"
      >
        <motion.div variants={staggerItem} className="relative">
          <Avatar className="h-24 w-24 ring-4 ring-background shadow-lg">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="text-2xl font-bold">
              {getInitials(user?.name ?? "U")}
            </AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-colors">
            <Camera className="h-3.5 w-3.5" />
          </button>
        </motion.div>

        <motion.div variants={staggerItem} className="text-center">
          <h1 className="text-xl font-bold">{user?.name ?? "User"}</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          {user?.emailVerified && (
            <span className="inline-flex items-center gap-1 text-xs text-success mt-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Verified account
            </span>
          )}
        </motion.div>
      </motion.div>

      {/* ── Account ──────────────────────────────────────── */}
      <SectionCard title="Account" delay={0.05}>
        <SettingRow
          icon={User} label="Edit Profile"
          description="Update your name and photo"
          onClick={() => toast.info("Coming soon")}
        />
        <Separator className="mx-4" />
        <SettingRow
          icon={Mail} label="Email Address"
          description={user?.email ?? ""}
          onClick={() => toast.info("Coming soon")}
        />
        <Separator className="mx-4" />
        <SettingRow
          icon={Lock} label="Change Password"
          description="Update your account password"
          onClick={() => setCpOpen(true)}
        />
      </SectionCard>

      {/* ── Security ─────────────────────────────────────── */}
      <SectionCard title="Security" delay={0.1}>
        <SettingRow
          icon={Shield} label="Two-Factor Auth"
          description="Add an extra layer of security"
          onClick={() => toast.info("Coming soon")}
          badge="Soon"
        />
        <Separator className="mx-4" />
        <SettingRow
          icon={Bell} label="Notifications"
          description="Manage notification preferences"
          onClick={() => toast.info("Coming soon")}
        />
      </SectionCard>

      {/* ── Appearance ───────────────────────────────────── */}
      <SectionCard title="Appearance" delay={0.15}>
        <div className="px-4 pb-3 pt-1 space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Theme</p>
          </div>
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

      {/* ── Currency ─────────────────────────────────────── */}
      <SectionCard title="Currency" delay={0.2}>
        <div className="px-4 pb-3 pt-1 space-y-2">
          <p className="text-sm font-medium">Display Currency</p>
          <div className="grid grid-cols-2 gap-2">
            {CURRENCIES.map(({ code, symbol, label }) => (
              <button
                key={code}
                onClick={() => code !== "INR" && toast.info("Coming soon")}
                className={`flex items-center gap-2 p-3 rounded-[var(--radius-lg)] border text-left transition-all ${
                  code === "INR"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-accent opacity-60"
                }`}
              >
                <span className="text-lg font-bold w-6">{symbol}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold">{code}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{label}</p>
                </div>
                {code === "INR" && (
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* ── Data & Privacy ───────────────────────────────── */}
      <SectionCard title="Data & Privacy" delay={0.25}>
        <button
          onClick={() => toast.info("Export feature coming soon")}
          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-accent/50 transition-colors text-left"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary shrink-0">
            <Download className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Export Data</p>
            <p className="text-xs text-muted-foreground">Download all transactions as CSV</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </button>
        <Separator className="mx-4" />
        <button
          onClick={() => toast.info("Coming soon")}
          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-danger-bg/50 transition-colors text-left"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-danger-bg shrink-0">
            <Trash2 className="h-4 w-4 text-danger" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-danger">Delete Account</p>
            <p className="text-xs text-muted-foreground">Permanently remove all your data</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </button>
      </SectionCard>

      {/* ── About ────────────────────────────────────────── */}
      <SectionCard title="About" delay={0.3}>
        <div className="px-4 py-3 flex items-center gap-3">
          <Info className="h-4 w-4 text-muted-foreground shrink-0" />
          <div>
            <p className="text-sm font-medium">CashFlow v1.0.0</p>
            <p className="text-xs text-muted-foreground">Premium personal finance tracker</p>
          </div>
        </div>
      </SectionCard>

      {/* ── Sign out ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="pb-4"
      >
        <Button
          variant="outline"
          className="w-full gap-2 text-danger border-danger/30 hover:bg-danger-bg hover:text-danger"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </motion.div>

      {/* ── Change password dialog ────────────────────────── */}
      <Dialog open={cpOpen} onOpenChange={setCpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onChangePw)} className="space-y-4">
            <Input
              label="Current Password" type="password"
              error={errors.oldPassword?.message}
              {...register("oldPassword")}
            />
            <Input
              label="New Password" type="password"
              hint="Min 6 characters"
              error={errors.newPassword?.message}
              {...register("newPassword")}
            />
            <Input
              label="Confirm New Password" type="password"
              error={errors.confirm?.message}
              {...register("confirm")}
            />
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => { setCpOpen(false); reset(); }}>
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting}>Update password</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
