import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    // Next 16 requires every quality used by next/image to be declared here.
    // The portrait carries the whole hero, so it gets more bits than the default.
    qualities: [75, 86, 88],
    formats: ["image/avif", "image/webp"],
  },
  // The `skills/` directory ships design-system tooling, not app code.
  // Keep it out of the compile graph and out of the deployed bundle.
  outputFileTracingExcludes: {
    "*": ["./skills/**", "./design-system/**", "./assets/**", "./docs/**"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/img/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
