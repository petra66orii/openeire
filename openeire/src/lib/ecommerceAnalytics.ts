import { trackEvent } from "./analytics";
import {
  CartItem,
  getCartItemUnitPrice,
  isPhysicalCartOptions,
} from "../context/CartContext";
import { isPhysicalProductType } from "../utils/purchaseFlow";

type NullableString = string | undefined | null;

export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_category: string;
  item_category2?: string;
  item_variant?: string;
  price?: number;
  quantity: number;
};

export type AnalyticsEventPayload = {
  currency: "EUR";
  value?: number;
  items: AnalyticsItem[];
};

export const toAnalyticsMoney = (
  value: string | number | undefined | null,
): number | undefined => {
  if (value === undefined || value === null) return undefined;
  const parsed = Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const formatAnalyticsVariantLabel = (
  ...parts: NullableString[]
): string | undefined => {
  const label = parts
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter(Boolean)
    .join(" / ");

  return label.length > 0 ? label : undefined;
};

const compactRecord = <T extends Record<string, unknown>>(value: T): T =>
  Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T;

export const trackEcommerceEvent = (
  name: string,
  payload: AnalyticsEventPayload,
): void => {
  trackEvent(name, {
    currency: payload.currency,
    ...(typeof payload.value === "number" ? { value: payload.value } : {}),
    items: payload.items.map((item) => compactRecord(item)),
  });
};

export const buildAnalyticsItemFromCartItem = (
  item: CartItem,
): AnalyticsItem => {
  const unitPrice = getCartItemUnitPrice(item);
  const isPhysical = isPhysicalProductType(item.product?.product_type);
  const physicalOptions = isPhysicalCartOptions(item.options) ? item.options : undefined;

  return compactRecord({
    item_id: String(
      isPhysical ? physicalOptions?.variantId ?? item.product.id : item.product.id,
    ),
    item_name: item.product.title,
    item_category: item.product.product_type,
    item_category2: item.product.collection || undefined,
    item_variant: isPhysical
      ? formatAnalyticsVariantLabel(physicalOptions?.material, physicalOptions?.size)
      : undefined,
    price: unitPrice,
    quantity: item.quantity,
  });
};
