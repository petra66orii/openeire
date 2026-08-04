import type { NextConfig } from "next";
import { createNextImageConfig } from "./lib/config/nextImages";

const isProduction = process.env.NODE_ENV === "production";

const buildContentSecurityPolicy = (): string => {
  const directives = [
    ["default-src", "'self'"],
    ["base-uri", "'self'"],
    ["object-src", "'none'"],
    ["frame-ancestors", "'none'"],
    ["form-action", "'self'"],
    [
      "script-src",
      "'self'",
      "'unsafe-inline'",
      ...(isProduction ? [] : ["'unsafe-eval'"]),
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://cdn.iubenda.com",
      "https://embeds.iubenda.com",
      "https://*.iubenda.com",
      "https://accounts.google.com",
      "https://js.stripe.com",
      "https://*.stripe.com",
    ],
    [
      "style-src",
      "'self'",
      "'unsafe-inline'",
      "https://cdn.iubenda.com",
      "https://embeds.iubenda.com",
      "https://*.iubenda.com",
    ],
    [
      "img-src",
      "'self'",
      "data:",
      "blob:",
      "https://api.openeire.ie",
      "https://media.openeire.ie",
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://accounts.google.com",
      "https://*.googleusercontent.com",
      "https://q.stripe.com",
      "https://*.stripe.com",
      "https://cdn.iubenda.com",
      "https://embeds.iubenda.com",
      "https://*.iubenda.com",
    ],
    ["font-src", "'self'", "data:"],
    [
      "connect-src",
      "'self'",
      ...(isProduction
        ? []
        : [
            "http://localhost:*",
            "http://127.0.0.1:*",
            "ws://localhost:*",
            "ws://127.0.0.1:*",
          ]),
      "https://api.openeire.ie",
      "https://www.google-analytics.com",
      "https://region1.google-analytics.com",
      "https://www.googletagmanager.com",
      "https://accounts.google.com",
      "https://oauth2.googleapis.com",
      "https://www.googleapis.com",
      "https://api.stripe.com",
      "https://r.stripe.com",
      "https://q.stripe.com",
      "https://m.stripe.network",
      "https://checkout.stripe.com",
      "https://*.stripe.com",
      "https://cdn.iubenda.com",
      "https://embeds.iubenda.com",
      "https://*.iubenda.com",
      "https://iubenda.mgr.consensu.org",
    ],
    [
      "frame-src",
      "'self'",
      "https://js.stripe.com",
      "https://hooks.stripe.com",
      "https://checkout.stripe.com",
      "https://m.stripe.network",
      "https://*.stripe.com",
      "https://accounts.google.com",
      "https://www.youtube-nocookie.com",
      "https://cdn.iubenda.com",
      "https://embeds.iubenda.com",
      "https://*.iubenda.com",
    ],
    ["worker-src", "'self'", "blob:"],
    ["media-src", "'self'", "blob:", "https://media.openeire.ie", "https://api.openeire.ie"],
    ...(isProduction ? [["upgrade-insecure-requests"]] : []),
  ];

  return directives.map((directive) => directive.join(" ")).join("; ");
};

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value:
      'camera=(), microphone=(), geolocation=(), payment=(self "https://js.stripe.com" "https://checkout.stripe.com" "https://*.stripe.com"), usb=(), interest-cohort=()',
  },
  {
    key: "Content-Security-Policy",
    value: buildContentSecurityPolicy(),
  },
];

const privateDeliveryHeaders = [
  {
    key: "Cache-Control",
    value: "private, no-store, max-age=0",
  },
  {
    key: "Pragma",
    value: "no-cache",
  },
  {
    key: "Referrer-Policy",
    value: "no-referrer",
  },
  {
    key: "X-Robots-Tag",
    value: "noindex, nofollow, noarchive",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'none'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "media-src 'none'",
      "worker-src 'none'",
    ].join("; "),
  },
];

const privateBookingHeaders = privateDeliveryHeaders;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  cacheMaxMemorySize: 8 * 1024 * 1024,
  outputFileTracingRoot: process.cwd(),
  images: createNextImageConfig(),
  async redirects() {
    return [
      {
        source: "/500",
        destination: "/server-error",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "openeire-next.onrender.com",
          },
        ],
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      {
        source: "/delivery/:path*",
        headers: privateDeliveryHeaders,
      },
      {
        source: "/api/delivery/:path*",
        headers: privateDeliveryHeaders,
      },
      {
        source: "/book/:path*",
        headers: privateBookingHeaders,
      },
      {
        source: "/api/book/:path*",
        headers: privateBookingHeaders,
      },
    ];
  },
};

export default nextConfig;
