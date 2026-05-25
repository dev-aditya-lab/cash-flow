"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/store/auth-context";
import { authService } from "@/services/auth.service";
import { staggerContainer, staggerItem } from "@/lib/animations";

const schema = z.object({
  email:    z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

/** Pull the most useful message out of an unknown error */
function extractMessage(err: unknown, fallback = "Something went wrong"): string {
  if (!err) return fallback;
  // AxiosError with backend response body
  const axiosErr = err as AxiosError<{ message?: string }>;
  if (axiosErr.response?.data?.message) return axiosErr.response.data.message;
  // Standard Error (or AxiosError message already enriched by interceptor)
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

export default function LoginPage() {
  const [showPw, setShowPw]       = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [resending, setResending] = useState(false);
  const { login } = useAuth();
  const router    = useRouter();

  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await login(values.email, values.password);
      toast.success("Welcome back! 👋");
      router.replace("/dashboard");
    } catch (err: unknown) {
      const message = extractMessage(err, "Login failed. Please try again.");

      // If email is not verified, offer a one-click resend
      if (message.toLowerCase().includes("not verified") || message.toLowerCase().includes("verify")) {
        setUnverifiedEmail(values.email);
      }

      toast.error(message);
    }
  };

  const handleResendVerification = async () => {
    setResending(true);
    try {
      await authService.resendVerificationEmail(unverifiedEmail || getValues("email"));
      toast.success("Verification email sent! Check your inbox.");
      setUnverifiedEmail("");
    } catch (err: unknown) {
      toast.error(extractMessage(err, "Could not send email. Try again."));
    } finally {
      setResending(false);
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="enter"
      className="w-full max-w-sm space-y-6"
    >
      {/* Heading */}
      <motion.div variants={staggerItem} className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to your CashFlow account</p>
      </motion.div>

      {/* Email-not-verified banner */}
      {unverifiedEmail && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 rounded-lg border border-warning/40 bg-warning-bg px-4 py-3"
        >
          <AlertCircle className="h-4 w-4 text-warning-foreground shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium text-warning-foreground">Email not verified</p>
            <p className="text-xs text-warning-foreground/80">
              Check your inbox for{" "}
              <span className="font-medium">{unverifiedEmail}</span>{" "}
              or resend the code.
            </p>
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resending}
              className="text-xs font-semibold text-warning-foreground underline underline-offset-2 disabled:opacity-50"
            >
              {resending ? "Sending…" : "Resend verification email"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Form */}
      <motion.form variants={staggerItem} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          autoComplete="email"
          {...register("email")}
        />
        <Input
          label="Password"
          type={showPw ? "text" : "password"}
          placeholder="••••••••"
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPw((p) => !p)}
              className="cursor-pointer"
              tabIndex={-1}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          error={errors.password?.message}
          autoComplete="current-password"
          {...register("password")}
        />

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
          Sign in
        </Button>
      </motion.form>

      {/* Divider */}
      <motion.div variants={staggerItem} className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-3 text-muted-foreground">or continue with</span>
        </div>
      </motion.div>

      {/* Social auth (placeholder) */}
      <motion.div variants={staggerItem} className="grid grid-cols-2 gap-3">
        <Button variant="outline" type="button" className="gap-2" onClick={() => toast.info("Coming soon")}>
          <svg viewBox="0 0 24 24" className="h-4 w-4">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </Button>
        <Button variant="outline" type="button" className="gap-2" onClick={() => toast.info("Coming soon")}>
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </Button>
      </motion.div>

      {/* Footer */}
      <motion.p variants={staggerItem} className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-foreground hover:underline">
          Sign up
        </Link>
      </motion.p>
    </motion.div>
  );
}
