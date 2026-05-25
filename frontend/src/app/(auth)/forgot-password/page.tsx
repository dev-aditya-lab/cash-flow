"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth.service";
import { staggerContainer, staggerItem } from "@/lib/animations";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await authService.resendVerificationEmail(values.email);
      setSent(true);
      toast.success("Reset email sent!");
    } catch {
      toast.error("Could not send reset email");
    }
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm text-center space-y-5"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-success-bg text-success mx-auto">
          <Mail className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Email sent!</h1>
          <p className="text-sm text-muted-foreground">
            We sent a reset link to <span className="font-medium text-foreground">{getValues("email")}</span>.
            Check your inbox and follow the instructions.
          </p>
        </div>
        <Link href="/login">
          <Button variant="outline" className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to sign in
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="enter"
      className="w-full max-w-sm space-y-6"
    >
      <motion.div variants={staggerItem}>
        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Reset password</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </motion.div>

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
        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
          Send reset link
        </Button>
      </motion.form>
    </motion.div>
  );
}
