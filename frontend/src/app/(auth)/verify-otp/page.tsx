"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2, Mail } from "lucide-react";
import { useState, Suspense } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth.service";
import { staggerContainer, staggerItem } from "@/lib/animations";

const schema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must be numeric"),
});

type FormValues = z.infer<typeof schema>;

function VerifyOtpInner() {
  const router = useRouter();
  const params = useSearchParams();
  const email  = params.get("email") ?? "";
  const [resending, setResending] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await authService.verifyOtp({ email, otp: values.otp });
      if (res.success) {
        toast.success("Email verified! Please sign in.");
        router.replace("/login");
      } else {
        toast.error(res.message ?? "Invalid OTP");
      }
    } catch {
      toast.error("Verification failed. Please try again.");
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authService.resendVerificationEmail(email);
      toast.success("OTP resent to your email");
    } catch {
      toast.error("Failed to resend OTP");
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
      {/* Header */}
      <motion.div variants={staggerItem} className="space-y-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground mx-auto mb-4">
          <Mail className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-center">Check your email</h1>
        <p className="text-sm text-muted-foreground text-center">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{email || "your email"}</span>
        </p>
      </motion.div>

      {/* Form */}
      <motion.form variants={staggerItem} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Verification Code"
          type="text"
          inputMode="numeric"
          placeholder="000000"
          maxLength={6}
          className="text-center text-2xl tracking-widest font-mono"
          error={errors.otp?.message}
          {...register("otp")}
        />
        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
          Verify email
        </Button>
      </motion.form>

      {/* Resend */}
      <motion.div variants={staggerItem} className="text-center">
        <p className="text-sm text-muted-foreground">
          Didn&apos;t receive it?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="font-medium text-foreground hover:underline disabled:opacity-50"
          >
            {resending ? "Sending…" : "Resend code"}
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense>
      <VerifyOtpInner />
    </Suspense>
  );
}
