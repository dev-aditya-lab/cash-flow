"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { TopBar } from "@/components/layout/top-bar";
import { SplashScreen } from "@/components/layout/splash-screen";
import { PWAInstallPrompt } from "@/components/pwa/pwa-install-prompt";
import { useAuth } from "@/store/auth-context";
import { pageVariants } from "@/lib/animations";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
          <span className="text-sm text-muted-foreground">Loading CashFlow…</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Splash screen — shows once per session on all devices */}
      <SplashScreen />

      <div className="flex h-screen bg-background-secondary overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Mobile TopBar */}
          <TopBar />

          {/* Scrollable page content — pb-nav on mobile clears floating island nav */}
          <main className="flex-1 overflow-y-auto pb-nav md:pb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                variants={pageVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                className="min-h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* Mobile Bottom Nav */}
        <BottomNav />

        {/* PWA install prompt (mobile only, shown once per 30 days) */}
        <PWAInstallPrompt />
      </div>
    </>
  );
}
