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

export const readCheckoutSuccessContext = (): CheckoutSuccessContext | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(CHECKOUT_SUCCESS_CONTEXT_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<CheckoutSuccessContext>;
    const purchase = isRecord(parsed.purchase)
      ? {
          transaction_id:
            typeof parsed.purchase.transaction_id === "string"
              ? parsed.purchase.transaction_id
              : "",
          value: Number(parsed.purchase.value ?? 0),
          currency: "EUR" as const,
          tax: Number(parsed.purchase.tax ?? 0),
          shipping: Number(parsed.purchase.shipping ?? 0),
          items: Array.isArray(parsed.purchase.items)
            ? (parsed.purchase.items as AnalyticsItem[])
            : [],
        }
      : undefined;

    return {
      hasDigitalItems: Boolean(parsed.hasDigitalItems),
      hasPhysicalItems: Boolean(parsed.hasPhysicalItems),
      itemCount: Number(parsed.itemCount || 0),
      ...(purchase?.transaction_id ? { purchase } : {}),
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
