import type { CartItem } from "@/lib/cart/types";
import { sanitizeCartItems } from "@/lib/cart/sanitize";

export const CART_STORAGE_KEY = "cart";

export const readStoredCart = (options: {
  isAuthenticated: boolean;
}): CartItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    return sanitizeCartItems(JSON.parse(raw), options);
  } catch {
    return [];
  }
};

export const writeStoredCart = (items: CartItem[]): void => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

export const clearStoredCart = (): void => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CART_STORAGE_KEY);
};
