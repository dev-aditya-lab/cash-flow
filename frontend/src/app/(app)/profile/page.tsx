"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User, Mail, Shield, Bell, Palette, LogOut,
  ChevronRight, Lock, CheckCircle2, Camera,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/store/auth-context";
import { authService } from "@/services/auth.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { getInitials } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/animations";

// ── Change Password Schema ───────────────────────────────
const cpSchema = z.object({
  oldPassword: z.string().min(1, "Required"),
  newPassword: z.string().min(6, "Min 6 characters"),
  confirm:     z.string(),
}).refine((d) => d.newPassword === d.confirm, { message: "Passwords don't match", path: ["confirm"] });

type CpValues = z.infer<typeof cpSchema>;

function SettingRow({ icon: Icon, label, description, onClick, badge }: {
  icon: React.ElementType;
  label: string;
  description?: string;
  onClick?: () => void;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-accent/50 transition-colors text-left rounded-[var(--radius)]"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {badge && (
        <span className="text-xs font-medium bg-success-bg text-success px-2 py-0.5 rounded-full">{badge}</span>
      )}
      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </button>
  );
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [cpOpen, setCpOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CpValues>({
    resolver: zodResolver(cpSchema),
  });

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

  return (
    <div className="max-w-xl mx-auto px-4 md:px-6 py-5 space-y-6">
      {/* ── Profile header ─────────────────────────── */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="enter"
        className="flex flex-col items-center gap-4 pt-4"
      >
        <motion.div variants={staggerItem} className="relative">
          <Avatar className="h-20 w-20 ring-4 ring-background shadow-md">
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
          <h1 className="text-xl font-bold">{user?.name}</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          {user?.isVerified && (
            <span className="inline-flex items-center gap-1 text-xs text-success mt-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Verified account
            </span>
          )}
        </motion.div>
      </motion.div>

      {/* ── Account section ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-[var(--radius-xl)] border border-border bg-card overflow-hidden"
      >
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Account</h2>
        </div>
        <SettingRow icon={User}   label="Edit Profile"      description="Update your name and photo"         onClick={() => toast.info("Coming soon")} />
        <Separator className="mx-4" />
        <SettingRow icon={Mail}   label="Email Address"     description={user?.email ?? ""}                  onClick={() => toast.info("Coming soon")} />
        <Separator className="mx-4" />
        <SettingRow icon={Lock}   label="Change Password"   description="Update your account password"       onClick={() => setCpOpen(true)} />
      </motion.div>

      {/* ── Security ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-[var(--radius-xl)] border border-border bg-card overflow-hidden"
      >
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Security</h2>
        </div>
        <SettingRow icon={Shield} label="Two-Factor Auth"   description="Add an extra layer of security"     onClick={() => toast.info("Coming soon")} badge="Soon" />
        <Separator className="mx-4" />
        <SettingRow icon={Bell}   label="Notifications"     description="Manage notification preferences"    onClick={() => toast.info("Coming soon")} />
      </motion.div>

      {/* ── Preferences ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-[var(--radius-xl)] border border-border bg-card overflow-hidden"
      >
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Preferences</h2>
        </div>
        <SettingRow icon={Palette} label="Theme"            description="Light, dark or system default"      onClick={() => router.push("/settings")} />
      </motion.div>

      {/* ── Danger zone ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Button
          variant="outline"
          className="w-full gap-2 text-danger border-danger/30 hover:bg-danger-bg hover:text-danger"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </motion.div>

      {/* ── Change password dialog ──────────────────── */}
      <Dialog open={cpOpen} onOpenChange={setCpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onChangePw)} className="space-y-4">
            <Input label="Current Password" type="password" error={errors.oldPassword?.message} {...register("oldPassword")} />
            <Input label="New Password"     type="password" error={errors.newPassword?.message} hint="Min 6 characters" {...register("newPassword")} />
            <Input label="Confirm Password" type="password" error={errors.confirm?.message}     {...register("confirm")} />
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setCpOpen(false)}>Cancel</Button>
              <Button type="submit" loading={isSubmitting}>Update password</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
