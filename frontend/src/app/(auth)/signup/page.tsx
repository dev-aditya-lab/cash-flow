"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth.service";
import { staggerContainer, staggerItem } from "@/lib/animations";

const schema = z.object({
  name:            z.string().min(2, "Name must be at least 2 characters"),
  email:           z.string().email("Invalid email address"),
  password:        z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof schema>;

export default function SignupPage() {
  const [showPw, setShowPw]   = useState(false);
  const [showCp, setShowCp]   = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await authService.register({
        name:     values.name,
        email:    values.email,
        password: values.password,
      });
      if (res.success) {
        toast.success("Account created! Please verify your email.");
        router.push(`/verify-otp?email=${encodeURIComponent(values.email)}`);
      } else {
        toast.error(res.message ?? "Registration failed");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast.error(message);
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="enter"
      className="w-full max-w-sm space-y-6"
    >
      <motion.div variants={staggerItem} className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
        <p className="text-sm text-muted-foreground">Start tracking your finances today</p>
      </motion.div>

      <motion.form variants={staggerItem} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="Aditya Sharma"
          leftIcon={<User className="h-4 w-4" />}
          error={errors.name?.message}
          autoComplete="name"
          {...register("name")}
        />
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
            <button type="button" onClick={() => setShowPw(!showPw)} className="cursor-pointer">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          error={errors.password?.message}
          hint="Minimum 6 characters"
          autoComplete="new-password"
          {...register("password")}
        />
        <Input
          label="Confirm Password"
          type={showCp ? "text" : "password"}
          placeholder="••••••••"
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button type="button" onClick={() => setShowCp(!showCp)} className="cursor-pointer">
              {showCp ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          error={errors.confirmPassword?.message}
          autoComplete="new-password"
          {...register("confirmPassword")}
        />

        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
          Create account
        </Button>
      </motion.form>

      <motion.p variants={staggerItem} className="text-center text-xs text-muted-foreground">
        By signing up, you agree to our{" "}
        <Link href="#" className="underline hover:text-foreground">Terms</Link>
        {" "}and{" "}
        <Link href="#" className="underline hover:text-foreground">Privacy Policy</Link>
      </motion.p>

      <motion.p variants={staggerItem} className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Sign in
        </Link>
      </motion.p>
    </motion.div>
  );
}
