export const PENDING_DISCOUNT_CODE_KEY = "openeire:pending-discount-code";
export const SUPPORTED_DEEP_LINK_DISCOUNT_CODE = "WELCOME10";

const normalizeDiscountCode = (value: string | null | undefined): string =>
  String(value || "").trim().toUpperCase();

export const savePendingDiscountCode = (value: string | null | undefined): boolean => {
  if (typeof window === "undefined") return false;

  const normalizedCode = normalizeDiscountCode(value);
  if (normalizedCode !== SUPPORTED_DEEP_LINK_DISCOUNT_CODE) {
    return false;
  }

  window.localStorage.setItem(PENDING_DISCOUNT_CODE_KEY, normalizedCode);
  return true;
};

export const readPendingDiscountCode = (): string | null => {
  if (typeof window === "undefined") return null;

  const normalizedCode = normalizeDiscountCode(
    window.localStorage.getItem(PENDING_DISCOUNT_CODE_KEY),
  );

  if (!normalizedCode) {
    return null;
  }

  if (normalizedCode !== SUPPORTED_DEEP_LINK_DISCOUNT_CODE) {
    window.localStorage.removeItem(PENDING_DISCOUNT_CODE_KEY);
    return null;
  }

  return normalizedCode;
};

export const clearPendingDiscountCode = (): void => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PENDING_DISCOUNT_CODE_KEY);
};
