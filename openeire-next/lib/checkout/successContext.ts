import type { CheckoutSuccessContext } from "@/types/checkout";

const CHECKOUT_SUCCESS_CONTEXT_KEY = "checkoutSuccessContext";
const CHECKOUT_SUCCESS_HISTORY_KEY = "openeireCheckoutSuccessPaymentIntent";
const CHECKOUT_RETURN_MAX_AGE_MS = 24 * 60 * 60 * 1000;

const getHistoryState = (): Record<string, unknown> => {
  const state = window.history.state;
  return state && typeof state === "object"
    ? (state as Record<string, unknown>)
    : {};
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

export const stripCheckoutReturnParameters = (): void => {
  if (typeof window === "undefined") return;
  window.history.replaceState(getHistoryState(), "", "/checkout-success");
};
