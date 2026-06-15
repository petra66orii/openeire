import type { MetadataRoute } from "next";
import { getAllPublishedBlogPostsForSitemap } from "@/lib/api/blog";
import { buildAbsoluteUrl } from "@/lib/site";

const staticPublicRoutes = [
  "/",
  "/licensing",
  "/art-prints",
  "/footage",
  "/real-estate",
  "/us",
  "/blog",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  let blogPosts: MetadataRoute.Sitemap = [];

  try {
    const posts = await getAllPublishedBlogPostsForSitemap();
    blogPosts = posts.map((post) => ({
      url: buildAbsoluteUrl(`/blog/${post.slug}`),
      lastModified: post.created_at ? new Date(post.created_at) : now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    blogPosts = [];
  }

  return [
    ...staticPublicRoutes.map((route) => ({
      url: buildAbsoluteUrl(route),
      lastModified: now,
      changeFrequency: route === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "/" ? 1 : 0.7,
    })),
    ...blogPosts,
  ];
}
