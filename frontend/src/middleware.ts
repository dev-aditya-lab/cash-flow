import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Auth pages — if the user is already logged in, redirect them to /dashboard
 * (no point showing login/signup to someone who is already in).
 */
const AUTH_PAGES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/verify-email",
  // /verify-otp is excluded below — it must remain reachable even when logged in
];

/**
 * Truly public pages — accessible by EVERYONE regardless of auth state.
 * These must never trigger the "logged-in → dashboard" redirect.
 * Required by Google Play Store: privacy policy, terms, and account deletion
 * must work without being logged in.
 */
const OPEN_PAGES = [
  "/privacy-policy",
  "/terms",
  "/delete-account",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /**
   * We check `cf_logged_in` — a plain (non-HttpOnly) cookie written by
   * JavaScript after a successful login.  We do NOT check the backend's
   * HttpOnly `cash_flow_token` because that cookie is set by the backend
   * and may not be reliably forwarded through the Next.js rewrite proxy
   * in all environments.
   *
   * Security note: `cf_logged_in` is only a routing hint.  All actual
   * data fetching is still gated by `cash_flow_token` on the backend.
   */
  const isLoggedIn = request.cookies.has("cf_logged_in");

  const isOpenPage  = OPEN_PAGES.some((p) => pathname.startsWith(p));
  const isAuthPage  = AUTH_PAGES.some((p) => pathname.startsWith(p));
  const isOtpPage   = pathname.startsWith("/verify-otp");

  // ── 1. Open pages (legal / Play Store) — let everyone through ───────────
  if (isOpenPage) return NextResponse.next();

  // ── 2. OTP verify — always reachable (mid-registration flow) ─────────────
  if (isOtpPage) return NextResponse.next();

  // ── 3. Auth pages (login, signup, forgot-password, verify-email) ──────────
  //       Logged-in  → bounce to dashboard (no point re-showing the form)
  //       Logged-out → let through (MUST return here to avoid falling into
  //                    the protected-route guard below and creating a loop)
  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // ── 4. Everything else is a protected app page ────────────────────────────
  if (!isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Exclude Next.js internals AND all public-folder static assets so they
  // are never intercepted by the auth redirect (bubblewrap, PWA, TWA, etc.)
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|manifest\\.json|sw\\.js|\\.well-known/|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|txt|xml)).*)",
  ],
};
