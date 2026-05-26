"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";
import { bottomSheetVariants } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import cashFlowLogo from "@/../public/cashFlow-Logo-862x862.png";
import Image from "next/image";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "cf_install_dismissed";
const DISMISS_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Suppress if dismissed in the last 30 days
    const ts = localStorage.getItem(DISMISS_KEY);
    if (ts && Date.now() - Number(ts) < DISMISS_TTL) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShow(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          variants={bottomSheetVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          className="md:hidden fixed bottom-24 left-4 right-4 z-[100] glass rounded-[var(--radius-xl)] p-4 flex items-center gap-3 border border-border"
        >
          {/* App icon */}
          <div className="shrink-0">
            <Image
              src={cashFlowLogo}
              alt="CashFlow"
              width={40}
              height={40}
              className="rounded-xl"
            />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Install CashFlow</p>
            <p className="text-xs text-muted-foreground leading-tight mt-0.5">
              Add to home screen for the best experience
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Button size="sm" onClick={handleInstall} className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Install
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
