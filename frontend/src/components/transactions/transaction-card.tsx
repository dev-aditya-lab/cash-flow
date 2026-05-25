"use client";

import { motion } from "framer-motion";
import { Pencil, Trash2, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { cn, formatCurrency, formatDate, PAYMENT_MODE_LABELS } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { staggerItem } from "@/lib/animations";
import type { TransactionType } from "@/types";

interface TransactionCardProps {
  id: string;
  type: TransactionType;
  amount: number;
  party: string;
  category: string;
  mode: string;
  date: string;
  description?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  compact?: boolean;
}

export function TransactionCard({
  type, amount, party, category, mode, date, description, onEdit, onDelete, compact,
}: TransactionCardProps) {
  const isIncome = type === "income";

  return (
    <motion.div
      variants={staggerItem}
      className={cn(
        "flex items-center gap-3 py-3",
        !compact && "px-1"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          isIncome ? "bg-success-bg text-success" : "bg-danger-bg text-danger"
        )}
      >
        {isIncome
          ? <ArrowDownLeft className="h-4 w-4" />
          : <ArrowUpRight className="h-4 w-4" />
        }
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium text-foreground truncate">{party}</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-muted-foreground">{formatDate(date)}</span>
          <span className="text-muted-foreground/50 text-xs">·</span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
            {PAYMENT_MODE_LABELS[mode] ?? mode}
          </Badge>
          {category && (
            <>
              <span className="text-muted-foreground/50 text-xs">·</span>
              <span className="text-xs text-muted-foreground truncate max-w-[100px]">{category}</span>
            </>
          )}
        </div>
      </div>

      {/* Amount + actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span
          className={cn(
            "text-sm font-semibold tabular-nums",
            isIncome ? "text-success" : "text-foreground"
          )}
        >
          {isIncome ? "+" : "-"}{formatCurrency(amount)}
        </span>
        {(onEdit || onDelete) && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button variant="ghost" size="icon-sm" onClick={onEdit} className="h-7 w-7">
                <Pencil className="h-3 w-3" />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="icon-sm" onClick={onDelete} className="h-7 w-7 text-danger hover:text-danger hover:bg-danger-bg">
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
