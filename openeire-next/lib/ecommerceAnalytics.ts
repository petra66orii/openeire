import { trackEvent } from "@/lib/analytics";
import type { CartItem } from "@/lib/cart/types";

export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_category2?: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
}

export interface AnalyticsEventPayload {
  currency?: string;
  value?: number;
  transaction_id?: string;
  shipping?: number;
  coupon?: string;
  items?: AnalyticsItem[];
  [key: string]: unknown;
}

export const toAnalyticsMoney = (value: unknown): number | undefined => {
  const parsed =
    typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));
  if (!Number.isFinite(parsed)) return undefined;
  return Number(parsed.toFixed(2));
};

export const formatAnalyticsVariantLabel = (
  ...parts: Array<string | null | undefined>
): string | undefined => {
  const label = parts.map((part) => part?.trim()).filter(Boolean).join(" / ");
  return label || undefined;
};

export const buildAnalyticsItemFromCartItem = (
  item: CartItem,
): AnalyticsItem => ({
  item_id: String(item.product.id),
  item_name: item.product.title,
  item_category: item.product.product_type,
  item_category2: item.product.collection ?? undefined,
  item_variant:
    item.options?.type === "physical"
      ? formatAnalyticsVariantLabel(item.options.material, item.options.size)
      : undefined,
  price: toAnalyticsMoney(item.product.price ?? item.product.starting_price),
  quantity: item.quantity,
});

export const trackEcommerceEvent = (
  name: string,
  payload: AnalyticsEventPayload,
) => {
  trackEvent(name, {
    currency: "EUR",
    ...payload,
  });
};
