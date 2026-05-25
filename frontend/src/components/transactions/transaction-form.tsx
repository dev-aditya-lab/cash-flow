"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { expenseService } from "@/services/expense.service";
import { incomeService } from "@/services/income.service";
import type { Expense, Income, TransactionType } from "@/types";
import { scalePop } from "@/lib/animations";

// ── Schemas ───────────────────────────────────────────────
const expenseSchema = z.object({
  amount:      z.number({ error: "Amount is required" }).positive("Must be a positive number"),
  mode:        z.enum(["cash", "card", "UPI", "bank_transfer", "other"]),
  to:          z.string().min(1, "Recipient is required"),
  resion:      z.string().min(1, "Category / reason is required"),
  description: z.string().optional(),
  date:        z.string().optional(),
});

const incomeSchema = z.object({
  amount:      z.number({ error: "Amount is required" }).positive("Must be a positive number"),
  mode:        z.enum(["cash", "card", "UPI", "bank_transfer", "other"]),
  from:        z.string().min(1, "Source is required"),
  description: z.string().optional(),
  date:        z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;
type IncomeFormValues  = z.infer<typeof incomeSchema>;

// ── Props ──────────────────────────────────────────────────
interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: TransactionType;
  editData?: Expense | Income;
  onSuccess?: () => void;
}

export function TransactionForm({ open, onOpenChange, type, editData, onSuccess }: TransactionFormProps) {
  const isExpense = type === "expense";
  const isEdit    = !!editData;

  // ── Expense form ──────────────────────────────────────
  const expenseForm = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: isExpense && editData
      ? {
          amount:      (editData as Expense).amount,
          mode:        (editData as Expense).mode,
          to:          (editData as Expense).to,
          resion:      (editData as Expense).resion,
          description: (editData as Expense).description ?? "",
          date:        (editData as Expense).date?.split("T")[0],
        }
      : { amount: undefined, mode: "cash", to: "", resion: "", description: "", date: "" },
  });

  // ── Income form ───────────────────────────────────────
  const incomeForm = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeSchema),
    defaultValues: !isExpense && editData
      ? {
          amount:      (editData as Income).amount,
          mode:        (editData as Income).mode,
          from:        (editData as Income).from,
          description: (editData as Income).description ?? "",
          date:        (editData as Income).date?.split("T")[0],
        }
      : { amount: undefined, mode: "cash", from: "", description: "", date: "" },
  });

  const { handleSubmit: handleExpense, register: regExp, formState: { errors: errExp, isSubmitting: subExp }, setValue: setExpVal } = expenseForm;
  const { handleSubmit: handleIncome, register: regInc, formState: { errors: errInc, isSubmitting: subInc }, setValue: setIncVal } = incomeForm;

  // ── Submit handlers ───────────────────────────────────
  const onExpenseSubmit = async (values: ExpenseFormValues) => {
    try {
      if (isEdit && editData) {
        await expenseService.editExpense(editData._id, values);
        toast.success("Expense updated");
      } else {
        await expenseService.addExpense(values);
        toast.success("Expense added");
      }
      expenseForm.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onIncomeSubmit = async (values: IncomeFormValues) => {
    try {
      if (isEdit && editData) {
        await incomeService.editIncome(editData._id, values);
        toast.success("Income updated");
      } else {
        await incomeService.addIncome(values);
        toast.success("Income added");
      }
      incomeForm.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const modeOptions = [
    { value: "cash",          label: "Cash" },
    { value: "card",          label: "Card" },
    { value: "UPI",           label: "UPI" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "other",         label: "Other" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit" : "Add"} {isExpense ? "Expense" : "Income"}
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to {isEdit ? "update" : "record"} your {isExpense ? "expense" : "income"}.
          </DialogDescription>
        </DialogHeader>

        {isExpense ? (
          <form onSubmit={handleExpense(onExpenseSubmit)} className="space-y-4">
            <Input
              label="Amount (₹)"
              type="number"
              placeholder="0"
              error={errExp.amount?.message}
              {...regExp("amount", { valueAsNumber: true })}
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Payment Mode</label>
              <Select
                defaultValue={expenseForm.getValues("mode")}
                onValueChange={(v) => setExpVal("mode", v as ExpenseFormValues["mode"])}
              >
                <SelectTrigger error={errExp.mode?.message}>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  {modeOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              label="Paid to"
              placeholder="e.g. Swiggy, Uber"
              error={errExp.to?.message}
              {...regExp("to")}
            />
            <Input
              label="Category / Reason"
              placeholder="e.g. Food, Transport"
              error={errExp.resion?.message}
              {...regExp("resion")}
            />
            <Input
              label="Description (optional)"
              placeholder="Any notes"
              {...regExp("description")}
            />
            <Input label="Date (optional)" type="date" {...regExp("date")} />
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" loading={subExp}>
                {isEdit ? "Update" : "Add"} Expense
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <form onSubmit={handleIncome(onIncomeSubmit)} className="space-y-4">
            <Input
              label="Amount (₹)"
              type="number"
              placeholder="0"
              error={errInc.amount?.message}
              {...regInc("amount", { valueAsNumber: true })}
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Payment Mode</label>
              <Select
                defaultValue={incomeForm.getValues("mode")}
                onValueChange={(v) => setIncVal("mode", v as IncomeFormValues["mode"])}
              >
                <SelectTrigger error={errInc.mode?.message}>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  {modeOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              label="Received from"
              placeholder="e.g. Employer, Client"
              error={errInc.from?.message}
              {...regInc("from")}
            />
            <Input
              label="Description (optional)"
              placeholder="Any notes"
              {...regInc("description")}
            />
            <Input label="Date (optional)" type="date" {...regInc("date")} />
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" loading={subInc}>
                {isEdit ? "Update" : "Add"} Income
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
