import type { AnalyticsItem } from "../lib/ecommerceAnalytics";

export const CHECKOUT_SUCCESS_CONTEXT_KEY = "checkoutSuccessContext";

export type CheckoutPurchaseContext = {
  transaction_id: string;
  value: number;
  currency: "EUR";
  tax: number;
  shipping: number;
  items: AnalyticsItem[];
};

export type CheckoutSuccessContext = {
  hasDigitalItems: boolean;
  hasPhysicalItems: boolean;
  itemCount: number;
  purchase?: CheckoutPurchaseContext;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const parseFiniteNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const sanitizeAnalyticsItem = (
  value: unknown,
): AnalyticsItem | null => {
  if (!isRecord(value)) return null;

  const item_id =
    typeof value.item_id === "string" ? value.item_id.trim() : "";
  const item_name =
    typeof value.item_name === "string" ? value.item_name.trim() : "";
  const item_category =
    typeof value.item_category === "string" ? value.item_category.trim() : "";
  const quantity = parseFiniteNumber(value.quantity, 0);

  if (!item_id || !item_name || !item_category || quantity <= 0) {
    return null;
  }

  const sanitizedItem: AnalyticsItem = {
    item_id,
    item_name,
    item_category,
    quantity,
  };

  if (typeof value.item_category2 === "string" && value.item_category2.trim()) {
    sanitizedItem.item_category2 = value.item_category2.trim();
  }

  if (typeof value.item_variant === "string" && value.item_variant.trim()) {
    sanitizedItem.item_variant = value.item_variant.trim();
  }

  const price = parseFiniteNumber(value.price, Number.NaN);
  if (Number.isFinite(price)) {
    sanitizedItem.price = price;
  }

  return sanitizedItem;
};

export const readCheckoutSuccessContext = (): CheckoutSuccessContext | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(CHECKOUT_SUCCESS_CONTEXT_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<CheckoutSuccessContext>;
    const sanitizedItems = Array.isArray(parsed.purchase?.items)
      ? parsed.purchase.items
          .map((item) => sanitizeAnalyticsItem(item))
          .filter((item): item is AnalyticsItem => item !== null)
      : [];
    const purchase = isRecord(parsed.purchase)
      ? {
          transaction_id:
            typeof parsed.purchase.transaction_id === "string"
              ? parsed.purchase.transaction_id
              : "",
          value: parseFiniteNumber(parsed.purchase.value, 0),
          currency: "EUR" as const,
          tax: parseFiniteNumber(parsed.purchase.tax, 0),
          shipping: parseFiniteNumber(parsed.purchase.shipping, 0),
          items: sanitizedItems,
        }
      : undefined;

    return {
      hasDigitalItems: Boolean(parsed.hasDigitalItems),
      hasPhysicalItems: Boolean(parsed.hasPhysicalItems),
      itemCount: Number(parsed.itemCount || 0),
      ...(purchase?.transaction_id && purchase.items.length > 0
        ? { purchase }
        : {}),
    };
  } catch {
    return null;
  }
};

export const writeCheckoutSuccessContext = (
  context: CheckoutSuccessContext,
): void => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    CHECKOUT_SUCCESS_CONTEXT_KEY,
    JSON.stringify(context),
  );
};

export const clearCheckoutSuccessContext = (): void => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CHECKOUT_SUCCESS_CONTEXT_KEY);
};

