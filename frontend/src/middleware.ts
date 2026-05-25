import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/verify-otp",
  "/verify-email",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

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

  // Unauthenticated user trying to access a protected page
  if (!isPublicPath && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Logged-in user trying to access auth pages (except OTP verify)
  if (isPublicPath && isLoggedIn && !pathname.startsWith("/verify-otp")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)" ],
};
