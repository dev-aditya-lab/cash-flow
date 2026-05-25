import { Wallet } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left panel – brand */}
      <div className="hidden lg:flex flex-col bg-primary text-primary-foreground p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/10 border border-primary-foreground/20">
            <Wallet className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">CashFlow</span>
        </div>

        {/* Copy */}
        <div className="flex flex-col gap-6 my-auto relative z-10">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold leading-tight">
              Your finances,<br />under control.
            </h2>
            <p className="text-primary-foreground/70 text-lg leading-relaxed max-w-sm">
              Track every rupee, visualise your spending, and build the savings habit — all in one clean dashboard.
            </p>
          </div>
          {/* Testimonial */}
          <div className="rounded-[var(--radius-xl)] bg-primary-foreground/10 border border-primary-foreground/20 p-5 max-w-sm">
            <p className="text-sm text-primary-foreground/80 italic leading-relaxed">
              "CashFlow completely changed how I think about money. The analytics are insanely good."
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="h-7 w-7 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xs font-bold">R</div>
              <div>
                <p className="text-xs font-semibold">Rohan M.</p>
                <p className="text-[11px] text-primary-foreground/60">Software Engineer</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-primary-foreground/40 relative z-10">© 2025 CashFlow. All rights reserved.</p>
      </div>

      {/* Right panel – form */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wallet className="h-4 w-4" />
          </div>
          <span className="font-bold text-lg">CashFlow</span>
        </div>
        {children}
      </div>
    </div>
  );
}
