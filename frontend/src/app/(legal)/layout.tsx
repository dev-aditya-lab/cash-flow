import Link from "next/link";
import Image from "next/image";
import cashFlowLogo from "@/../public/cashFlow-Logo-862x862.png";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src={cashFlowLogo}
              alt="CashFlow"
              width={28}
              height={28}
              className="rounded-lg shrink-0"
            />
            <span className="font-bold text-base tracking-tight">CashFlow</span>
          </Link>
          <nav className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms"          className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/delete-account" className="hover:text-foreground transition-colors">Delete Account</Link>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} CashFlow by Dev Aditya. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms"          className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/delete-account" className="hover:text-foreground transition-colors">Delete Account</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
