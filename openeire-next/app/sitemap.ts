import type { MetadataRoute } from "next";
import { getAllPublishedBlogPostsForSitemap } from "@/lib/api/blog";
import { getAllPublicPhysicalProductsForSitemap } from "@/lib/api/gallery";
import { buildAbsoluteUrl } from "@/lib/site";

const staticPublicRoutes = [
  "/",
  "/licensing",
  "/art-prints",
  "/footage",
  "/real-estate",
  "/us",
  "/blog",
  "/contact",
  "/gallery/physical",
  "/terms",
  "/shipping",
  "/refunds",
  "/privacy",
];

export const dynamic = "force-dynamic";
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  let blogPosts: MetadataRoute.Sitemap = [];
  let physicalProducts: MetadataRoute.Sitemap = [];

  try {
    const posts = await getAllPublishedBlogPostsForSitemap();
    blogPosts = posts.map((post) => ({
      url: buildAbsoluteUrl(`/blog/${post.slug}`),
      lastModified: post.created_at ? new Date(post.created_at) : now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch (error) {
    console.warn("Failed to load blog URLs for sitemap.", error);
    blogPosts = [];
  }

  try {
    const products = await getAllPublicPhysicalProductsForSitemap();
    physicalProducts = products.map((product) => ({
      url: buildAbsoluteUrl(`/gallery/physical/${product.id}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch (error) {
    console.warn("Failed to load gallery product URLs for sitemap.", error);
    physicalProducts = [];
  }

  return [
    ...staticPublicRoutes.map((route) => ({
      url: buildAbsoluteUrl(route),
      lastModified: now,
      changeFrequency: route === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "/" ? 1 : 0.7,
    })),
    ...blogPosts,
    ...physicalProducts,
  ];
}
