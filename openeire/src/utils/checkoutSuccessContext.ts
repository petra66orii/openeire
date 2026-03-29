export const CHECKOUT_SUCCESS_CONTEXT_KEY = "checkoutSuccessContext";

export type CheckoutSuccessContext = {
  hasDigitalItems: boolean;
  hasPhysicalItems: boolean;
  itemCount: number;
};

export const readCheckoutSuccessContext = (): CheckoutSuccessContext | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(CHECKOUT_SUCCESS_CONTEXT_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<CheckoutSuccessContext>;
    return {
      hasDigitalItems: Boolean(parsed.hasDigitalItems),
      hasPhysicalItems: Boolean(parsed.hasPhysicalItems),
      itemCount: Number(parsed.itemCount || 0),
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
