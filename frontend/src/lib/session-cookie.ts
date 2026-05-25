/**
 * A plain (non-HttpOnly) marker cookie that lets the Next.js Edge
 * middleware check login state without needing to read the HttpOnly
 * `cash_flow_token` set by the backend.
 *
 * This cookie holds NO sensitive data — it is purely a routing hint.
 * The real auth is always validated server-side via `cash_flow_token`.
 */

const NAME    = "cf_logged_in";
const MAX_AGE = 7 * 24 * 60 * 60; // 7 days (matches backend JWT expiry)

export function setSessionMarker() {
  if (typeof document === "undefined") return;
  document.cookie = `${NAME}=1; path=/; max-age=${MAX_AGE}; SameSite=Strict`;
}

export function clearSessionMarker() {
  if (typeof document === "undefined") return;
  document.cookie = `${NAME}=; path=/; max-age=0; SameSite=Strict`;
}
