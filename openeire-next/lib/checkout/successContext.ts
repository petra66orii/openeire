import type { CheckoutSuccessContext } from "@/types/checkout";

const CHECKOUT_SUCCESS_CONTEXT_KEY = "checkoutSuccessContext";

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

    return {
      paymentIntentId:
        typeof parsed.paymentIntentId === "string"
          ? parsed.paymentIntentId.trim()
          : "",
      hasDigitalItems: Boolean(parsed.hasDigitalItems),
      hasPhysicalItems: Boolean(parsed.hasPhysicalItems),
      itemCount:
        Number.isInteger(itemCount) && itemCount > 0 ? itemCount : 0,
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
