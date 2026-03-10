import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { GalleryItem } from "../services/api";
import {
  isDigitalProductType,
  isPhysicalProductType,
  isValidDigitalLicense,
} from "../utils/purchaseFlow";

// 1. Define what "Options" look like
export interface CartOptions {
  material?: string; // e.g. "canvas"
  size?: string; // e.g. "A4"
  license?: "hd" | "4k";
  unitPrice?: number;
  variantId?: number;
  sourceProductId?: number;
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
const toNumber = (value: string | number | undefined): number => {
  if (value === undefined) return 0;
  const parsed = parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const getCartItemUnitPrice = (item: CartItem): number => {
  if (item.product.product_type === "physical") {
    return toNumber(item.product.price ?? item.product.starting_price);
  }

  const is4k = item.options?.license === "4k";
  if (is4k) {
    return toNumber(item.product.price_4k ?? item.product.price);
  }

  return toNumber(item.product.price ?? item.product.starting_price);
};

const sanitizeProductForCart = (product: GalleryItem): GalleryItem => {
  if (product.product_type === "physical") return product;

  const safeProduct = {
    ...product,
  } as GalleryItem & Record<string, unknown>;
  delete safeProduct.file;
  delete safeProduct.high_res_file;
  delete safeProduct.video_file;

  return safeProduct as GalleryItem;
};

const sanitizeOptionsForCart = (
  productType: string | null | undefined,
  options?: CartOptions,
): CartOptions | undefined => {
  if (!options) return options;
  if (!isRecord(options)) return undefined;

  const safeOptions = { ...options };
  delete safeOptions.unitPrice;

  if (!isDigitalProductType(productType)) return safeOptions;

  return {
    ...safeOptions,
    license: isValidDigitalLicense(safeOptions.license)
      ? safeOptions.license
      : "hd",
  };
};

const sanitizeStoredCartEntry = (entry: unknown): CartItem | null => {
  if (!isRecord(entry)) return null;
  if (!isRecord(entry.product)) return null;

  const productType =
    typeof entry.product.product_type === "string"
      ? entry.product.product_type
      : undefined;

  if (!isDigitalProductType(productType) && !isPhysicalProductType(productType)) {
    return null;
  }

  const productIdCandidate = entry.product.id;
  if (
    typeof productIdCandidate !== "number" &&
    typeof productIdCandidate !== "string"
  ) {
    return null;
  }

  const safeProduct = sanitizeProductForCart(entry.product as unknown as GalleryItem);
  const safeOptions = sanitizeOptionsForCart(
    safeProduct.product_type,
    isRecord(entry.options) ? (entry.options as CartOptions) : undefined,
  );
  const optionsString = safeOptions ? JSON.stringify(safeOptions) : "";

  const quantityCandidate = Number(entry.quantity);
  const safeQuantity =
    Number.isFinite(quantityCandidate) && quantityCandidate > 0
      ? Math.floor(quantityCandidate)
      : 1;

  return {
    cartId:
      typeof entry.cartId === "string" && entry.cartId.length > 0
        ? entry.cartId
        : `${safeProduct.product_type}-${safeProduct.id}-${optionsString}`,
    productId:
      typeof entry.productId === "string" || typeof entry.productId === "number"
        ? entry.productId
        : safeProduct.id,
    product: safeProduct,
    quantity: safeQuantity,
    options: safeOptions,
  };
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const localData = localStorage.getItem("cart");
      const parsed = localData ? JSON.parse(localData) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((entry) => sanitizeStoredCartEntry(entry))
        .filter((entry): entry is CartItem => entry !== null);
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
      const safeProduct = sanitizeProductForCart(product);
      const safeOptions = sanitizeOptionsForCart(safeProduct.product_type, options);

      // Create a unique string based on options to differentiate variants
      const optionsString = safeOptions ? JSON.stringify(safeOptions) : "";
      const uniqueCartId = `${safeProduct.product_type}-${safeProduct.id}-${optionsString}`;

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
              productId: safeProduct.id,
              product: safeProduct,
              quantity,
              options: safeOptions,
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
    const unitPrice = getCartItemUnitPrice(item);
    return total + unitPrice * item.quantity;
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
