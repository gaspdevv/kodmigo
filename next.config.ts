import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseOrigin = supabaseUrl ? new URL(supabaseUrl).origin : null;
const supabaseWssOrigin = supabaseOrigin
  ? supabaseOrigin.replace(/^https:/, "wss:")
  : null;

const connectSrc = [
  "'self'",
  "https://*.supabase.co",
  "wss://*.supabase.co",
  "https://hcaptcha.com",
  "https://*.hcaptcha.com",
  supabaseOrigin,
  supabaseWssOrigin,
]
  .filter(Boolean)
  .join(" ");

const contentSecurityPolicy = [
  "default-src 'self'",
  `connect-src ${connectSrc}`,
  "img-src 'self' data: blob: https://hcaptcha.com https://*.hcaptcha.com",
  "style-src 'self' 'unsafe-inline' https://hcaptcha.com https://*.hcaptcha.com",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.hcaptcha.com",
  "font-src 'self' data:",
  "frame-src https://hcaptcha.com https://*.hcaptcha.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
];

if (isProduction) {
  securityHeaders.push({
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  });
}

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
