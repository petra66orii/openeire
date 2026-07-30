import "server-only";

import { cache } from "react";

import { getPublishedBlogPostBySlug } from "@/lib/api/blog";
import { getPublicPhysicalProduct } from "@/lib/api/gallery";

export const getCachedPublishedBlogPostBySlug = cache(
  getPublishedBlogPostBySlug,
);

export const getCachedPublicPhysicalProduct = cache(getPublicPhysicalProduct);
