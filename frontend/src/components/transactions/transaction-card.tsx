"use client";

import { Pencil, Trash2, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { cn, formatCurrency, formatDate, PAYMENT_MODE_LABELS } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <div
      className={cn(
        "flex items-center gap-3 py-3",
        !compact && "px-1"
      )}
    >
      {/* Type icon */}
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
              <span className="text-xs text-muted-foreground truncate max-w-[80px]">{category}</span>
            </>
          )}
        </div>
      </div>

      {/* Amount + action buttons — always visible on mobile */}
      <div className="flex items-center gap-1 shrink-0">
        <span
          className={cn(
            "text-sm font-semibold tabular-nums",
            isIncome ? "text-success" : "text-foreground"
          )}
        >
          {isIncome ? "+" : "-"}{formatCurrency(amount)}
        </span>
        {(onEdit || onDelete) && (
          <div className="flex items-center">
            {onEdit && (
              <button
                onClick={onEdit}
                aria-label="Edit"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent active:bg-accent transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                aria-label="Delete"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-danger hover:bg-danger-bg active:bg-danger-bg transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
