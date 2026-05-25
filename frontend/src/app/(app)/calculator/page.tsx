"use client";

import { motion } from "framer-motion";
import { Calculator as CalculatorIcon } from "lucide-react";
import { Calculator } from "@/components/calculator/calculator";
import { staggerContainer, staggerItem } from "@/lib/animations";

export default function CalculatorPage() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="enter"
      className="min-h-full px-4 py-6 md:px-8 md:py-8"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background shadow-md">
            <CalculatorIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Calculator</h1>
            <p className="text-sm text-muted-foreground">
              Crunch numbers fast — keyboard supported
            </p>
          </div>
        </div>
      </motion.div>

      {/* Calculator + history side-by-side */}
      <motion.div
        variants={staggerItem}
        className="flex justify-center"
      >
        <Calculator />
      </motion.div>

      {/* Keyboard shortcuts hint */}
      <motion.div
        variants={staggerItem}
        className="mt-8 flex justify-center"
      >
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          {[
            ["0-9", "Digits"],
            ["+  −  *  /", "Operators"],
            ["Enter", "Equals"],
            ["Backspace", "Delete"],
            ["Esc", "Clear"],
          ].map(([key, desc]) => (
            <span key={key} className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-secondary font-mono text-[10px]">
                {key}
              </kbd>
              <span>{desc}</span>
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
