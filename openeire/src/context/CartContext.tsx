import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { GalleryItem } from "../services/api";

// 1. Define what "Options" look like
export interface CartOptions {
  material?: string; // e.g. "canvas"
  size?: string; // e.g. "A4"
  [key: string]: any; // Allow flexibility
}

export interface CartItem {
  cartId: string; // Unique Key (e.g. "physical-105-{}")
  productId: string | number; // The actual Database ID
  product: GalleryItem;
  quantity: number;
  options?: CartOptions;
}

interface CartContextType {
  cartItems: CartItem[];
  // Updated addToCart to accept options
  addToCart: (
    product: GalleryItem,
    quantity: number,
    options?: CartOptions,
  ) => void;
  updateQuantity: (cartId: string, newQuantity: number) => void;
  removeFromCart: (cartId: string) => void;
  itemCount: number;
  cartTotal: number;
  clearCart: () => void;
  hasPhysicalItems?: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const filterPhysicalItems = (items: CartItem[]) =>
  items.filter((item) => item?.product?.product_type === "physical");

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const localData = localStorage.getItem("cart");
      const parsed = localData ? (JSON.parse(localData) as CartItem[]) : [];
      return filterPhysicalItems(parsed);
    } catch (error) {
      console.error("Could not parse cart data from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback(
    (product: GalleryItem, quantity: number, options?: CartOptions) => {
      if (product.product_type !== "physical") {
        console.warn("Digital products cannot be added to the cart.");
        return;
      }

      // Create a unique string based on options to differentiate variants
      const optionsString = options ? JSON.stringify(options) : "";
      const uniqueCartId = `${product.product_type}-${product.id}-${optionsString}`;

      setCartItems((prevItems) => {
        // Check if this EXACT variation is already in the cart
        const existingItem = prevItems.find(
          (item) => item.cartId === uniqueCartId,
        );

        if (existingItem) {
          return prevItems.map((item) =>
            item.cartId === uniqueCartId
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        } else {
          return [
            ...prevItems,
            {
              cartId: uniqueCartId,
              productId: product.id,
              product,
              quantity,
              options,
            },
          ];
        }
      });
    },
    [],
  );

  // Updated to use cartId instead of simple id
  const updateQuantity = useCallback((cartId: string, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: Math.max(0, newQuantity) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeFromCart = useCallback((cartId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.cartId !== cartId),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cartItems.reduce((total, item) => {
    if (item.product.product_type !== "physical") return total;
    const rawPrice =
      item.product.price ??
      (item.product.starting_price as string | number | undefined) ??
      "0";
    const price = parseFloat(String(rawPrice));
    return total + price * item.quantity;
  }, 0);

  const hasPhysicalItems = cartItems.some(
    (item) => item.product.product_type === "physical",
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        itemCount,
        cartTotal,
        clearCart,
        hasPhysicalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
