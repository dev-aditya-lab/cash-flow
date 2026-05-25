import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,          // send JWT cookie automatically
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
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Redirect to login if token expired / not authed
      if (typeof window !== "undefined") {
        const current = window.location.pathname;
        if (!current.startsWith("/login") && !current.startsWith("/signup")) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
