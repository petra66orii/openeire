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
          "/gallery/digital",
          "/gallery/photo",
          "/gallery/video",
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
