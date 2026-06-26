import type { CheckoutSuccessContext } from "@/types/checkout";

const CHECKOUT_SUCCESS_CONTEXT_KEY = "checkoutSuccessContext";
const CHECKOUT_SUCCESS_HISTORY_KEY = "openeireCheckoutSuccessPaymentIntent";
const CHECKOUT_PURCHASE_ANALYTICS_KEY = "openeireCheckoutPurchaseAnalytics";
const CHECKOUT_RETURN_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const CHECKOUT_PURCHASE_ANALYTICS_MAX_ENTRIES = 20;

type StoredAnalyticsItem = NonNullable<
  NonNullable<CheckoutSuccessContext["analytics"]>["items"]
>[number];

const getHistoryState = (): Record<string, unknown> => {
  const state = window.history.state;
  return state && typeof state === "object"
    ? (state as Record<string, unknown>)
    : {};
};

const getSafeNumber = (value: unknown): number | undefined => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0
    ? Number(parsed.toFixed(2))
    : undefined;
};

const getSafeString = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim();
  return normalized && normalized.length <= 200 ? normalized : undefined;
};

const readAnalyticsItem = (value: unknown): StoredAnalyticsItem | null => {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const itemId = getSafeString(record.item_id);
  const itemName = getSafeString(record.item_name);
  if (!itemId || !itemName) return null;

  return {
    item_id: itemId,
    item_name: itemName,
    item_category: getSafeString(record.item_category),
    item_category2: getSafeString(record.item_category2),
    item_variant: getSafeString(record.item_variant),
    price: getSafeNumber(record.price),
    quantity: getSafeNumber(record.quantity),
  };
};

const readAnalyticsContext = (
  value: unknown,
): CheckoutSuccessContext["analytics"] | undefined => {
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  const items = Array.isArray(record.items)
    ? record.items.map(readAnalyticsItem).filter((item) => item !== null)
    : undefined;

  if (!items?.length) return undefined;

  return {
    value: getSafeNumber(record.value),
    shipping: getSafeNumber(record.shipping),
    coupon: getSafeString(record.coupon),
    items,
  };
};

export const writeCheckoutSuccessContext = (
  context: CheckoutSuccessContext,
): void => {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      CHECKOUT_SUCCESS_CONTEXT_KEY,
      JSON.stringify(context),
    );
  } catch {
    // This context is optional UI state and must never block payment.
  }
};

export const readCheckoutSuccessContext = (): CheckoutSuccessContext | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(CHECKOUT_SUCCESS_CONTEXT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CheckoutSuccessContext>;
    const itemCount = Number(parsed.itemCount);
    const returnRecordedAt = Number(parsed.returnRecordedAt);
    const hasFreshReturnStatus =
      parsed.returnStatus === "succeeded" &&
      Number.isFinite(returnRecordedAt) &&
      returnRecordedAt > 0 &&
      Date.now() - returnRecordedAt <= CHECKOUT_RETURN_MAX_AGE_MS;

    return {
      paymentIntentId:
        typeof parsed.paymentIntentId === "string"
          ? parsed.paymentIntentId.trim()
          : "",
      cartSignature:
        typeof parsed.cartSignature === "string"
          ? parsed.cartSignature.trim()
          : "",
      hasDigitalItems: Boolean(parsed.hasDigitalItems),
      hasPhysicalItems: Boolean(parsed.hasPhysicalItems),
      itemCount:
        Number.isInteger(itemCount) && itemCount > 0 ? itemCount : 0,
      analytics: readAnalyticsContext(parsed.analytics),
      ...(hasFreshReturnStatus
        ? {
            returnStatus: parsed.returnStatus,
            returnRecordedAt,
          }
        : {}),
    };
  } catch {
    return null;
  }
};

export const clearCheckoutSuccessContext = (): void => {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(CHECKOUT_SUCCESS_CONTEXT_KEY);
  } catch {
    // Ignore storage restrictions; payment and order state live elsewhere.
  }
};

export const markCheckoutSuccessHistoryEntry = (
  paymentIntentId: string,
): void => {
  if (typeof window === "undefined") return;
  window.history.replaceState(
    {
      ...getHistoryState(),
      [CHECKOUT_SUCCESS_HISTORY_KEY]: paymentIntentId,
    },
    "",
    "/checkout-success",
  );
};

export const isCheckoutSuccessHistoryEntry = (
  paymentIntentId: string,
): boolean => {
  if (typeof window === "undefined" || !paymentIntentId) return false;
  return getHistoryState()[CHECKOUT_SUCCESS_HISTORY_KEY] === paymentIntentId;
};

const readTrackedPurchaseEvents = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(
      window.sessionStorage.getItem(CHECKOUT_PURCHASE_ANALYTICS_KEY) ?? "[]",
    );
    return Array.isArray(parsed)
      ? parsed.filter((entry): entry is string => typeof entry === "string")
      : [];
  } catch {
    return [];
  }
};

export const hasTrackedPurchaseAnalytics = (paymentIntentId: string): boolean =>
  Boolean(paymentIntentId && readTrackedPurchaseEvents().includes(paymentIntentId));

export const markPurchaseAnalyticsTracked = (paymentIntentId: string): void => {
  if (typeof window === "undefined" || !paymentIntentId) return;
  try {
    const entries = readTrackedPurchaseEvents().filter(
      (entry) => entry !== paymentIntentId,
    );
    entries.push(paymentIntentId);
    window.sessionStorage.setItem(
      CHECKOUT_PURCHASE_ANALYTICS_KEY,
      JSON.stringify(entries.slice(-CHECKOUT_PURCHASE_ANALYTICS_MAX_ENTRIES)),
    );
  } catch {
    // Analytics dedupe is best-effort and must never affect checkout.
  }
};

export const stripCheckoutReturnParameters = (): void => {
  if (typeof window === "undefined") return;
  window.history.replaceState(getHistoryState(), "", "/checkout-success");
};
