"use client";

import React, {
  createContext, useContext, useState, useEffect, useCallback, useRef,
} from "react";
import type { User } from "@/types";
import api from "@/services/api";
import { authService } from "@/services/auth.service";
import { setSessionMarker, clearSessionMarker } from "@/lib/session-cookie";

// ── localStorage helpers ──────────────────────────────────
const USER_KEY = "cf_user";

function saveUser(user: User) {
  try { localStorage.setItem(USER_KEY, JSON.stringify(user)); } catch {}
}
function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch { return null; }
}
function clearUser() {
  try { localStorage.removeItem(USER_KEY); } catch {}
}

// ── Context types ─────────────────────────────────────────
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  /**
   * loginVersionRef — bumped every time login() succeeds.
   * refreshUser reads the version BEFORE the async call and checks it
   * AFTER; if it changed (login() ran while we were waiting), we skip
   * the stale 401 result so it doesn't overwrite the fresh auth state.
   */
  const loginVersionRef = useRef(0);

  const refreshUser = useCallback(async () => {
    const versionAtStart = loginVersionRef.current;
    const stored = loadUser();

    try {
      await api.get("/balance/");

      // Guard: if login() ran while this request was in-flight, bail out
      if (loginVersionRef.current !== versionAtStart) return;

      if (stored) {
        setState({ user: stored, isLoading: false, isAuthenticated: true });
      } else {
        // Cookie valid but no profile in localStorage (edge case)
        setState({
          user: {
            _id: "", name: "User", email: "",
            emailVerified: true, isBanned: false, role: "user",
            createdAt: "", updatedAt: "",
          },
          isLoading: false,
          isAuthenticated: true,
        });
      }
    } catch (err: unknown) {
      // Guard: ignore stale error if login() already succeeded
      if (loginVersionRef.current !== versionAtStart) return;

      // Only clear session on 401 (unauthenticated).
      // Network errors, 500s, etc. should NOT log the user out —
      // they indicate a temporary backend problem, not an expired session.
      const status = (err as import("axios").AxiosError)?.response?.status;
      if (status === 401) {
        clearUser();
        clearSessionMarker();
        setState({ user: null, isLoading: false, isAuthenticated: false });
      } else {
        // Non-auth error: keep whatever state we already have.
        // If we have a stored user, stay authenticated.
        if (stored) {
          setState({ user: stored, isLoading: false, isAuthenticated: true });
        } else {
          setState({ user: null, isLoading: false, isAuthenticated: false });
        }
      }
    }
  }, []);

  // Run once on app mount to restore session
  useEffect(() => { refreshUser(); }, [refreshUser]);

  // ── login ───────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    const res = await authService.login({ email, password });

    // authService.login() throws AxiosError on 4xx/5xx, so if we
    // reach here the request was successful (2xx).
    if (!res.success) throw new Error(res.message);

    // Bump version so any in-flight refreshUser ignores its stale 401
    loginVersionRef.current += 1;

    // Set the JS-writable routing marker that middleware can read
    setSessionMarker();

    // Extract user from response (only present in dev mode)
    const userData: User | null = res.data?.data ?? null;

    if (userData) {
      saveUser(userData);
      setState({ user: userData, isLoading: false, isAuthenticated: true });
    } else {
      // Production: build a minimal user from what we know
      const minimal: User = {
        _id: "",
        name: email.split("@")[0],
        email,
        emailVerified: true,
        isBanned: false,
        role: "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveUser(minimal);
      setState({ user: minimal, isLoading: false, isAuthenticated: true });
    }
  };

  // ── logout ──────────────────────────────────────────────
  const logout = async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    clearUser();
    clearSessionMarker();
    setState({ user: null, isLoading: false, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
