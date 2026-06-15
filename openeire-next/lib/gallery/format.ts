import type { ProductVariant, PublicGalleryItem } from "@/types/gallery";

export const formatEuro = (value?: string | number | null): string => {
  if (value === undefined || value === null || value === "") return "0.00";
  const parsed = Number.parseFloat(String(value));
  if (!Number.isFinite(parsed)) return String(value);
  return parsed.toFixed(2);
};

export const getStartingPrice = (
  item: PublicGalleryItem,
): string | number | null | undefined => item.starting_price ?? item.price;

export const getLowestVariant = (
  variants: ProductVariant[] = [],
): ProductVariant | undefined =>
  [...variants].sort(
    (a, b) => Number.parseFloat(a.price) - Number.parseFloat(b.price),
  )[0];

export const splitTags = (tags?: string | null): string[] =>
  (tags ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
