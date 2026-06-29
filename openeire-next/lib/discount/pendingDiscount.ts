const PENDING_DISCOUNT_CODE_KEY = "openeire:pending-discount-code";
const SUPPORTED_DEEP_LINK_DISCOUNT_CODE = "WELCOME10";

const normalizeCode = (value: string | null | undefined): string =>
  (value ?? "").trim().toUpperCase();

export const savePendingDiscountCode = (value: string | null | undefined) => {
  if (typeof window === "undefined") return false;
  const code = normalizeCode(value);
  if (code !== SUPPORTED_DEEP_LINK_DISCOUNT_CODE) return false;

  try {
    window.localStorage.setItem(PENDING_DISCOUNT_CODE_KEY, code);
    return true;
  } catch {
    return false;
  }
};

export const readPendingDiscountCode = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const code = normalizeCode(
      window.localStorage.getItem(PENDING_DISCOUNT_CODE_KEY),
    );
    return code === SUPPORTED_DEEP_LINK_DISCOUNT_CODE ? code : null;
  } catch {
    return null;
  }
};

export const clearPendingDiscountCode = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PENDING_DISCOUNT_CODE_KEY);
  } catch {
    // Promo persistence is optional; checkout validation remains backend-owned.
  }
};
