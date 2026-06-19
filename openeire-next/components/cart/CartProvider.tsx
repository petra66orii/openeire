"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { buildCartId, sanitizeCartItems } from "@/lib/cart/sanitize";
import { readStoredCart, writeStoredCart } from "@/lib/cart/storage";
import type { AddToCartInput, CartItem } from "@/lib/cart/types";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  isLoaded: boolean;
  addToCart: (input: AddToCartInput) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  removeItem: (cartId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isAuthLoading) return;
    const storedItems = readStoredCart({ isAuthenticated });
    setItems(storedItems);
    writeStoredCart(storedItems);
    setIsLoaded(true);
  }, [isAuthenticated, isAuthLoading]);

  useEffect(() => {
    if (!isLoaded) return;
    writeStoredCart(items);
  }, [isLoaded, items]);

  const addToCart = useCallback(
    (input: AddToCartInput) => {
      if (input.product.product_type !== "physical" && !isAuthenticated) return;

      const quantity = Number.isFinite(input.quantity)
        ? Math.max(1, Math.floor(input.quantity ?? 1))
        : 1;
      const cartId = buildCartId(input.product, input.options);
      const nextItem: CartItem = {
        cartId,
        productId: input.product.id,
        product: input.product,
        quantity: input.product.product_type === "physical" ? quantity : 1,
        ...(input.options ? { options: input.options } : {}),
      };

      setItems((currentItems) => {
        const nextItems = [...currentItems];
        const existingIndex = nextItems.findIndex(
          (item) => item.cartId === cartId,
        );
        if (existingIndex === -1) {
          return sanitizeCartItems([...nextItems, nextItem], {
            isAuthenticated,
          });
        }

        const existing = nextItems[existingIndex];
        nextItems[existingIndex] = {
          ...existing,
          quantity:
            existing.product.product_type === "physical"
              ? existing.quantity + nextItem.quantity
              : 1,
        };
        return sanitizeCartItems(nextItems, { isAuthenticated });
      });
    },
    [isAuthenticated],
  );

  const updateQuantity = useCallback((cartId: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems
        .map((item) => {
          if (item.cartId !== cartId) return item;
          if (item.product.product_type !== "physical") {
            return { ...item, quantity: 1 };
          }
          return { ...item, quantity: Math.max(0, Math.floor(quantity)) };
        })
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((cartId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.cartId !== cartId),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount,
      isLoaded,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [addToCart, clearCart, isLoaded, itemCount, items, removeItem, updateQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider.");
  }
  return context;
};
