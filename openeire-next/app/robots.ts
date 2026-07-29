import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/bag",
          "/checkout",
          "/checkout-success",
          "/profile",
          "/staff/",
          "/login",
          "/register",
          "/logout",
          "/verify-pending",
          "/verify-email",
          "/password-reset",
          "/request-password-reset",
          "/gallery-gate",
          "/gallery/digital",
          "/gallery/photo",
          "/gallery/video",
          "/delivery/",
          "/403",
          "/404",
          "/500",
          "/server-error",
          "/forbidden",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
