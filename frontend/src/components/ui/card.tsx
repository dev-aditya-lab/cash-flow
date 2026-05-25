"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-[var(--radius-lg)] border border-border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1.5 p-5 pb-0", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("font-semibold leading-tight tracking-tight", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5 pt-3", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-5 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

// ── Animated hoverable stat card ─────────────────────────
interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; positive: boolean };
  className?: string;
  accentClass?: string;
}

const cardFloat: Variants = {
  rest:  { y: 0 },
  hover: { y: -2, transition: { duration: 0.25 } },
};

export function StatCard({ title, value, subtitle, icon, trend, className, accentClass }: StatCardProps) {
  return (
    <motion.div
      variants={cardFloat}
      initial="rest"
      whileHover="hover"
      className={cn(
        "rounded-lg border border-border bg-card p-5 shadow-sm cursor-default",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</span>
          <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
          {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-xs font-medium mt-1",
                trend.positive ? "text-success" : "text-danger"
              )}
            >
              {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
          )}
        </div>
        {icon && (
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", accentClass ?? "bg-secondary")}>
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
