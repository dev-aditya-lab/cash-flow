import type { Variants } from "framer-motion";

// ── Page transitions ──────────────────────────────────────
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  enter:   { opacity: 1, y: 0,  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
};

// ── Fade ──────────────────────────────────────────────────
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  enter:   { opacity: 1, transition: { duration: 0.25 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};

// ── Slide up ──────────────────────────────────────────────
export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  enter:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: 10, transition: { duration: 0.2 } },
};

// ── Stagger container ─────────────────────────────────────
export const staggerContainer: Variants = {
  initial: {},
  enter: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 16 },
  enter:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

// ── Scale pop ─────────────────────────────────────────────
export const scalePop: Variants = {
  initial: { opacity: 0, scale: 0.92 },
  enter:   { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.18 } },
};

// ── Modal / sheet ─────────────────────────────────────────
export const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 8 },
  enter:   { opacity: 1, scale: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, scale: 0.97, y: 4, transition: { duration: 0.18 } },
};

// ── Slide from right (sheet) ──────────────────────────────
export const sheetVariants: Variants = {
  initial: { x: "100%" },
  enter:   { x: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
  exit:    { x: "100%", transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] } },
};

// ── Slide from bottom ─────────────────────────────────────
export const bottomSheetVariants: Variants = {
  initial: { y: "100%", opacity: 0 },
  enter:   { y: 0, opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit:    { y: "100%", opacity: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
};

