import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency = "INR",
  locale = "en-IN"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "dd MMM yyyy");
}

export function formatDateShort(dateStr: string): string {
  return format(new Date(dateStr), "dd MMM");
}

export function formatDateFull(dateStr: string): string {
  return format(new Date(dateStr), "MMMM d, yyyy");
}

export function formatRelativeTime(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

export function formatMonthYear(dateStr: string): string {
  return format(new Date(dateStr), "MMM yyyy");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, maxLen: number): string {
  return str.length > maxLen ? `${str.slice(0, maxLen)}…` : str;
}

export const PAYMENT_MODE_LABELS: Record<string, string> = {
  cash: "Cash",
  card: "Card",
  UPI: "UPI",
  bank_transfer: "Bank Transfer",
  other: "Other",
};

export const CATEGORY_COLORS: Record<string, string> = {
  Food: "#18181b",
  Transport: "#3f3f46",
  Shopping: "#52525b",
  Entertainment: "#71717a",
  Healthcare: "#a1a1aa",
  Education: "#d4d4d8",
  Utilities: "#e4e4e7",
  Other: "#f4f4f5",
};
