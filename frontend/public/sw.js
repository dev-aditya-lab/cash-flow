// CashFlow Service Worker
const STATIC_CACHE = "cashflow-static-v1";
const API_CACHE    = "cashflow-api-v1";
const DYNAMIC_CACHE = "cashflow-dynamic-v1";

const APP_SHELL = [
  "/",
  "/dashboard",
  "/cashFlow-Logo-862x862.png",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png",
  "/apple-touch-icon.png",
  "/favicon.ico",
];

// ── Install: precache app shell ──────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// ── Activate: clean up stale caches ─────────────────────
self.addEventListener("activate", (event) => {
  const VALID = [STATIC_CACHE, API_CACHE, DYNAMIC_CACHE];
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !VALID.includes(k)).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch strategy ───────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests from our origin
  if (request.method !== "GET") return;
  if (url.protocol === "chrome-extension:") return;
  if (!url.origin.includes(self.location.origin)) return;

  // /api/* → network-first, fallback to cache (stale API data > nothing)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(API_CACHE).then((c) => c.put(request, clone));
          }
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // /_next/static/* → cache-first (immutable hashed assets)
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            caches.open(STATIC_CACHE).then((c) => c.put(request, res.clone()));
            return res;
          })
      )
    );
    return;
  }

  // Everything else → stale-while-revalidate
  event.respondWith(
    caches.open(DYNAMIC_CACHE).then((cache) =>
      cache.match(request).then((cached) => {
        const fresh = fetch(request)
          .then((res) => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          })
          .catch(() => cached); // return stale if network fails
        return cached || fresh;
      })
    )
  );
});
