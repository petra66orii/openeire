import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { GalleryItem } from "../services/api";
import { isDigitalProductType, isValidDigitalLicense } from "../utils/purchaseFlow";

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

const getUnitPriceForItem = (item: CartItem): number => {
  if (typeof item.options?.unitPrice === "number") {
    return item.options.unitPrice;
  }

  if (typeof item.options?.unitPrice === "string") {
    return toNumber(item.options.unitPrice);
  }

  if (item.product.product_type === "physical") {
    return toNumber(item.product.price ?? item.product.starting_price);
  }

  const is4k = item.options?.license === "4k";
  if (is4k) {
    return toNumber((item.product as any).price_4k ?? item.product.price);
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
  if (!isDigitalProductType(productType)) return options;

  return {
    ...options,
    license: isValidDigitalLicense(options.license) ? options.license : "hd",
  };
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const localData = localStorage.getItem("cart");
      const parsed = localData ? (JSON.parse(localData) as CartItem[]) : [];
      return parsed.map((item) => ({
        ...item,
        product: sanitizeProductForCart(item.product),
        options: sanitizeOptionsForCart(item.product?.product_type, item.options),
      }));
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
    const unitPrice = getUnitPriceForItem(item);
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
