import axios, { AxiosError } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,          // send cash_flow_token cookie automatically
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

// ── Request interceptor ───────────────────────────────────
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// ── Response interceptor ──────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; success?: boolean }>) => {
    const status  = error?.response?.status;

    // Extract the real backend message (e.g. "Email not verified")
    // so callers get a meaningful string instead of "Request failed…"
    const backendMsg = error?.response?.data?.message;
    if (backendMsg) {
      error.message = backendMsg;
    }

    // 401 outside auth pages → force back to login only if no session is cached.
    // auth-context.tsx handles 401 from /auth/me gracefully (falls back to localStorage).
    // This interceptor guards all OTHER protected routes, but must not boot the user
    // on a transient 401 caused by a missing cookie during a TWA cold-open.
    if (status === 401) {
      if (typeof window !== "undefined") {
        const current = window.location.pathname;
        const isAuthPage =
          current.startsWith("/login") ||
          current.startsWith("/signup") ||
          current.startsWith("/verify-otp") ||
          current.startsWith("/forgot-password");

        if (!isAuthPage) {
          // Only force-logout if there is genuinely no local session to recover.
          const hasLocalUser = !!localStorage.getItem("cf_user");
          if (!hasLocalUser) {
            document.cookie = "cf_logged_in=; path=/; max-age=0; SameSite=Lax";
            window.location.href = "/login";
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
