import type { CartItem, CartProductSnapshot } from "@/lib/cart/types";

const parsePrice = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

export const getCartProductDisplayPrice = (
  product: CartProductSnapshot,
): number => parsePrice(product.price ?? product.starting_price);

export const getCartItemUnitPrice = (item: CartItem): number =>
  getCartProductDisplayPrice(item.product);

export const getCartItemSubtotal = (item: CartItem): number =>
  getCartItemUnitPrice(item) * item.quantity;

export const getCartTotal = (items: CartItem[]): number =>
  items.reduce((total, item) => total + getCartItemSubtotal(item), 0);

export const formatCartCurrency = (value: number): string =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
