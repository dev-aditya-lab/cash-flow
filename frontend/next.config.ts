import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Proxy /api/* requests to the backend during development so the
   * frontend and backend share the same origin — this avoids all
   * CORS + withCredentials issues with the cash_flow_token cookie.
   */
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },

  /**
   * Serve manifest.json with the correct content-type so PWABuilder
   * and browsers accept it as a valid web app manifest.
   */
  async headers() {
    return [
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Content-Type",
            value: "application/manifest+json",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
          // Prevent caching of the SW file itself so updates are picked up immediately
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
