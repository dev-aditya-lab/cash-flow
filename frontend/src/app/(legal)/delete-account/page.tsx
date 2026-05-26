"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
	Trash2,
	ShieldAlert,
	CheckCircle2,
	Mail,
	AlertTriangle,
	Clock,
	Database,
	Lock,
	FileText,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/services/api";

// ── schema ────────────────────────────────────────────────────────────────────
const schema = z.object({
	email: z.string().email("Enter a valid email address"),
	confirm: z.string().refine((v) => v === "DELETE", {
		message: 'Type "DELETE" exactly to confirm',
	}),
	agree: z.boolean().refine((v) => v === true, {
		message: "You must acknowledge the above",
	}),
});
// Use the input shape (pre-refinement) so useForm types stay consistent
type FormValues = {
	email: string;
	confirm: string;
	agree: boolean;
};

// ── what gets deleted ─────────────────────────────────────────────────────────
const DATA_ITEMS = [
	{
		icon: Mail,
		label: "Account & profile",
		desc: "Email address, name, and avatar",
	},
	{
		icon: Database,
		label: "All transaction data",
		desc: "Income, expenses, categories, and notes",
	},
	{
		icon: FileText,
		label: "Reports & feedback",
		desc: "Any messages or reports you submitted",
	},
	{
		icon: Lock,
		label: "Authentication tokens",
		desc: "All active sessions are invalidated",
	},
];

// ── page ──────────────────────────────────────────────────────────────────────
export default function DeleteAccountPage() {
	const [submitted, setSubmitted] = useState(false);
	const [submittedEmail, setSubmittedEmail] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({ resolver: zodResolver(schema) });

	const onSubmit = async (values: FormValues) => {
		try {
			await api.post("/auth/request-account-deletion", {
				email: values.email,
			});
			setSubmittedEmail(values.email);
			setSubmitted(true);
		} catch (err: unknown) {
			const msg =
				err instanceof Error ?
					err.message
				:	"Something went wrong. Please try again.";
			toast.error(msg);
		}
	};

	return (
		<div className="max-w-xl mx-auto">
			<AnimatePresence mode="wait">
				{/* ── Success state ───────────────────────────────────────── */}
				{submitted ?
					<motion.div
						key="success"
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						className="flex flex-col items-center gap-6 py-12 text-center"
					>
						<div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
							<CheckCircle2 className="h-10 w-10 text-success" />
						</div>
						<div className="space-y-2">
							<h2 className="text-2xl font-bold">
								Request Received
							</h2>
							<p className="text-muted-foreground max-w-sm">
								We&apos;ve received your deletion request for{" "}
								<strong className="text-foreground">
									{submittedEmail}
								</strong>
								.
							</p>
						</div>
						<div className="w-full rounded-[var(--radius-xl)] border border-border bg-card p-5 text-left space-y-3">
							<div className="flex items-start gap-3">
								<Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
								<div>
									<p className="text-sm font-semibold">
										What happens next?
									</p>
									<ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
										<li>
											A confirmation email will be sent to
											your address.
										</li>
										<li>
											Your account will be{" "}
											<strong>
												permanently deleted within 30
												days
											</strong>
											.
										</li>
										<li>
											You can cancel by logging into the
											app before deletion completes.
										</li>
									</ul>
								</div>
							</div>
						</div>
						<p className="text-xs text-muted-foreground">
							Didn&apos;t mean to do this?{" "}
							<Link
								href="/login"
								className="text-foreground font-medium hover:underline"
							>
								Sign in to cancel
							</Link>
						</p>
					</motion.div>
				:	/* ── Form state ─────────────────────────────────────────── */
					<motion.div
						key="form"
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						className="space-y-8"
					>
						{/* Header */}
						<div>
							<p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
								Account
							</p>
							<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
								Delete Your Account
							</h1>
							<p className="mt-2 text-muted-foreground">
								Permanently remove your CashFlow account and all
								associated data. This action is irreversible.
							</p>
						</div>

						{/* Warning banner */}
						<div className="flex items-start gap-3 rounded-[var(--radius-xl)] border border-destructive/30 bg-destructive/5 p-4">
							<ShieldAlert className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
							<div className="space-y-1">
								<p className="text-sm font-semibold text-destructive">
									This action cannot be undone
								</p>
								<p className="text-xs text-muted-foreground">
									All your data will be permanently deleted
									within 30 days and cannot be recovered.
									Export your data from the app before
									proceeding.
								</p>
							</div>
						</div>

						{/* What gets deleted */}
						<div className="rounded-[var(--radius-xl)] border border-border bg-card overflow-hidden">
							<div className="px-4 pt-4 pb-2">
								<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
									Data that will be deleted
								</p>
							</div>
							<div className="divide-y divide-border">
								{DATA_ITEMS.map(
									({ icon: Icon, label, desc }) => (
										<div
											key={label}
											className="flex items-center gap-3 px-4 py-3"
										>
											<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/10 shrink-0">
												<Icon className="h-4 w-4 text-destructive" />
											</div>
											<div className="min-w-0">
												<p className="text-sm font-medium">
													{label}
												</p>
												<p className="text-xs text-muted-foreground">
													{desc}
												</p>
											</div>
										</div>
									),
								)}
							</div>
						</div>

						{/* Retention note */}
						<div className="flex items-start gap-3 rounded-[var(--radius-xl)] border border-border bg-secondary/50 p-4">
							<AlertTriangle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
							<p className="text-xs text-muted-foreground">
								Certain anonymised data may be retained for up
								to 90 days for fraud prevention and legal
								compliance, as described in our{" "}
								<Link
									href="/privacy-policy"
									className="text-foreground underline underline-offset-2"
								>
									Privacy Policy
								</Link>
								.
							</p>
						</div>

						{/* Form */}
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="space-y-5"
						>
							<Input
								label="Your email address"
								type="email"
								placeholder="you@example.com"
								leftIcon={<Mail className="h-4 w-4" />}
								hint="Enter the email associated with your CashFlow account."
								error={errors.email?.message}
								autoComplete="email"
								{...register("email")}
							/>

							<Input
								label='Type "DELETE" to confirm'
								type="text"
								placeholder="DELETE"
								leftIcon={<Trash2 className="h-4 w-4" />}
								hint="Enter the word DELETE in capital letters to proceed."
								error={errors.confirm?.message}
								autoComplete="off"
								autoCorrect="off"
								autoCapitalize="none"
								spellCheck={false}
								{...register("confirm")}
							/>

							{/* Checkbox */}
							<div className="flex items-start gap-3">
								<input
									id="agree"
									type="checkbox"
									className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
									{...register("agree")}
								/>
								<label
									htmlFor="agree"
									className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
								>
									I understand that my account and all data
									will be permanently deleted and this action
									cannot be reversed.
								</label>
							</div>
							{errors.agree && (
								<p className="text-xs text-destructive -mt-3">
									{errors.agree.message}
								</p>
							)}

							<Button
								type="submit"
								variant="destructive"
								className="w-full gap-2"
								size="lg"
								loading={isSubmitting}
							>
								<Trash2 className="h-4 w-4" />
								Submit Deletion Request
							</Button>
						</form>

						{/* Alternatives */}
						<div className="rounded-[var(--radius-xl)] border border-border bg-card p-5 space-y-3">
							<p className="text-sm font-semibold">
								Looking for something else?
							</p>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li>
									• To{" "}
									<strong className="text-foreground">
										pause
									</strong>{" "}
									the app, simply log out — your data is safe.
								</li>
								<li>
									• To{" "}
									<strong className="text-foreground">
										export your data
									</strong>
									, go to{" "}
									<Link
										href="/login"
										className="text-foreground underline underline-offset-2"
									>
										Profile → Export Data
									</Link>
									.
								</li>
								<li>
									• For support, email us at{" "}
									<a
										href="mailto:hello@devaditya.dev"
										className="text-foreground underline underline-offset-2"
									>
										hello@devaditya.dev
									</a>
									.
								</li>
							</ul>
						</div>
					</motion.div>
				}
			</AnimatePresence>
		</div>
	);
}
