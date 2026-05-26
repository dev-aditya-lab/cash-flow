"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import cashFlowLogo from "@/../public/cashFlow-Logo-862x862.png";
import { splashExit, slideUp } from "@/lib/animations";

export function SplashScreen() {
  // Default false — avoids SSR/hydration mismatch; only set true in useEffect
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("cf_splash_shown")) return;
    setVisible(true);
    document.body.classList.add("splash-active");

    const timer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("cf_splash_shown", "1");
      document.body.classList.remove("splash-active");
    }, 2400);

    return () => {
      clearTimeout(timer);
      document.body.classList.remove("splash-active");
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          variants={splashExit}
          initial="initial"
          animate="enter"
          exit="exit"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5"
          >
            <Image
              src={cashFlowLogo}
              alt="CashFlow"
              width={80}
              height={80}
              priority
              className="rounded-2xl shadow-xl"
            />
          </motion.div>

          {/* Wordmark */}
          <motion.h1
            variants={slideUp}
            initial="initial"
            animate="enter"
            transition={{ delay: 0.18 }}
            className="text-2xl font-bold tracking-tight text-foreground"
          >
            CashFlow
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={slideUp}
            initial="initial"
            animate="enter"
            transition={{ delay: 0.28 }}
            className="mt-1.5 text-sm text-muted-foreground"
          >
            Your finances, under control.
          </motion.p>

          {/* Animated progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 h-0.5 w-16 rounded-full bg-border overflow-hidden"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{
                repeat: Infinity,
                duration: 1.1,
                ease: "easeInOut",
                delay: 0.7,
              }}
              className="h-full w-1/2 rounded-full card-gradient-hero"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
