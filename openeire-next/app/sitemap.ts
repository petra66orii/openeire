import type { MetadataRoute } from "next";
import { buildAbsoluteUrl } from "@/lib/site";

const staticPublicRoutes = [
  "/",
  "/licensing",
  "/art-prints",
  "/footage",
  "/real-estate",
  "/us",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return staticPublicRoutes.map((route) => ({
    url: buildAbsoluteUrl(route),
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
