import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Proxy /api/* requests to the backend during development so the
   * frontend and backend share the same origin — this avoids all
   * CORS + withCredentials issues with the cash_flow_token cookie.
   *
   * With this in place you can set:
   *   NEXT_PUBLIC_API_URL=http://localhost:3000/api   (same-origin)
   * or keep the direct URL — both work.
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
};

export default nextConfig;
