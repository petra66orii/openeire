import { beforeEach, describe, expect, it, vi } from "vitest";

import type { BlogPostDetail } from "@/types/blog";
import type { PublicPhysicalProductDetail } from "@/types/gallery";

const detailMocks = vi.hoisted(() => ({
  cacheStores: [] as Map<string, unknown>[],
  parseBlogBody: vi.fn(),
  parseGalleryBody: vi.fn(),
  getProductReviews: vi.fn(),
}));

vi.mock("react", async (importOriginal) => {
  const react = await importOriginal<typeof import("react")>();

  return {
    ...react,
    cache: <Result, Arguments extends unknown[]>(
      callback: (...args: Arguments) => Result,
    ) => {
      const store = new Map<string, Result>();
      detailMocks.cacheStores.push(store as Map<string, unknown>);

      return (...args: Arguments): Result => {
        const key = JSON.stringify(args);
        if (!store.has(key)) {
          store.set(key, callback(...args));
        }
        return store.get(key) as Result;
      };
    },
  };
});

vi.mock("@/lib/api/blog", () => ({
  getPublishedBlogPostBySlug: (slug: string) =>
    detailMocks.parseBlogBody(slug),
}));

vi.mock("@/lib/api/gallery", () => ({
  getPublicPhysicalProduct: (id: string | number) =>
    detailMocks.parseGalleryBody(id),
}));

vi.mock("@/lib/api/reviews", () => ({
  getProductReviews: detailMocks.getProductReviews,
}));

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("not found");
  },
}));

import BlogDetailPage, {
  generateMetadata as generateBlogMetadata,
} from "@/app/blog/[slug]/page";
import PhysicalProductPage, {
  generateMetadata as generateGalleryMetadata,
} from "@/app/gallery/physical/[id]/page";

const createBlogPost = (slug: string): BlogPostDetail => ({
  id: 1,
  title: `Post ${slug}`,
  slug,
  author: "OpenÉire",
  featured_image: null,
  excerpt: "Excerpt",
  meta_title: "",
  meta_description: "",
  canonical_url: "",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
  tags: [],
  likes_count: 0,
  has_liked: false,
  content: "<p>Body</p>",
  related_posts: [],
});

const createPhysicalProduct = (
  id: string | number,
): PublicPhysicalProductDetail => ({
  id: Number(id),
  title: `Print ${id}`,
  description: "Description",
  preview_image: null,
  product_type: "physical",
  variants: [],
  tags: "",
  average_rating: null,
  review_count: 0,
  related_products: [],
});

describe("detail route request memoization", () => {
  beforeEach(() => {
    for (const store of detailMocks.cacheStores) {
      store.clear();
    }
    detailMocks.parseBlogBody.mockReset();
    detailMocks.parseGalleryBody.mockReset();
    detailMocks.getProductReviews.mockReset();
    detailMocks.parseBlogBody.mockImplementation(async (slug: string) =>
      createBlogPost(slug),
    );
    detailMocks.parseGalleryBody.mockImplementation(
      async (id: string | number) => createPhysicalProduct(id),
    );
    detailMocks.getProductReviews.mockResolvedValue([]);
  });

  it("shares one blog detail accessor/body parse between metadata and page", async () => {
    const params = Promise.resolve({ slug: "shared-blog-post" });

    await generateBlogMetadata({ params });
    await BlogDetailPage({ params });

    expect(detailMocks.parseBlogBody).toHaveBeenCalledTimes(1);
    expect(detailMocks.parseBlogBody).toHaveBeenCalledWith("shared-blog-post");
  });

  it("keeps different blog slugs as separate accessor calls", async () => {
    await generateBlogMetadata({
      params: Promise.resolve({ slug: "first-post" }),
    });
    await generateBlogMetadata({
      params: Promise.resolve({ slug: "second-post" }),
    });

    expect(detailMocks.parseBlogBody).toHaveBeenCalledTimes(2);
    expect(detailMocks.parseBlogBody).toHaveBeenNthCalledWith(1, "first-post");
    expect(detailMocks.parseBlogBody).toHaveBeenNthCalledWith(2, "second-post");
  });

  it("shares one gallery detail accessor/body parse between metadata and page", async () => {
    const params = Promise.resolve({ id: "42" });

    await generateGalleryMetadata({ params });
    await PhysicalProductPage({ params });

    expect(detailMocks.parseGalleryBody).toHaveBeenCalledTimes(1);
    expect(detailMocks.parseGalleryBody).toHaveBeenCalledWith("42");
  });

  it("keeps different gallery IDs as separate accessor calls", async () => {
    await generateGalleryMetadata({
      params: Promise.resolve({ id: "42" }),
    });
    await generateGalleryMetadata({
      params: Promise.resolve({ id: "43" }),
    });

    expect(detailMocks.parseGalleryBody).toHaveBeenCalledTimes(2);
    expect(detailMocks.parseGalleryBody).toHaveBeenNthCalledWith(1, "42");
    expect(detailMocks.parseGalleryBody).toHaveBeenNthCalledWith(2, "43");
  });
});
