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
  cartHasDigitalItems,
  DigitalLicense,
  isDigitalProductType,
  isPhysicalProductType,
  isValidDigitalLicense,
} from "../utils/purchaseFlow";
import { useAuth } from "./AuthContext";

export interface PhysicalCartOptions {
  type?: "physical";
  material?: string;
  size?: string;
  variantId: number;
  sourceProductId?: number;
}

export interface DigitalCartOptions {
  type?: "digital";
  license: DigitalLicense;
  unitPrice?: number;
  sourceProductId?: number;
}

export type CartOptions = PhysicalCartOptions | DigitalCartOptions;
export type PhysicalCartProduct = GalleryItem & { product_type: "physical" };
export type DigitalCartProduct = GalleryItem & {
  product_type: "photo" | "video";
};

type AddToCartFn = {
  (
    product: PhysicalCartProduct,
    quantity: number,
    options: PhysicalCartOptions,
  ): void;
  (
    product: DigitalCartProduct,
    quantity: number,
    options: DigitalCartOptions,
  ): void;
};

export const isDigitalCartOptions = (
  options: CartOptions | undefined,
): options is DigitalCartOptions =>
  Boolean(
    options &&
      "license" in options &&
      typeof options.license === "string" &&
      isValidDigitalLicense(options.license),
  );

export const isPhysicalCartOptions = (
  options: CartOptions | undefined,
): options is PhysicalCartOptions =>
  Boolean(
    options &&
      "variantId" in options &&
      typeof options.variantId === "number" &&
      Number.isFinite(options.variantId) &&
      options.variantId > 0,
  );

export interface CartItem {
  cartId: string; // Unique Key (e.g. "physical-105-{}")
  productId: string | number; // The actual Database ID
  product: GalleryItem;
  quantity: number;
  options?: CartOptions;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: AddToCartFn;
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

const toPositiveInteger = (value: unknown): number | undefined => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined;
  return Math.floor(parsed);
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const getCartItemUnitPrice = (item: CartItem): number => {
  if (item.product.product_type === "physical") {
    return toNumber(item.product.price ?? item.product.starting_price);
  }

  const is4k = isDigitalCartOptions(item.options) && item.options.license === "4k";
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

const getPhysicalSourceProductId = (product: GalleryItem): number | undefined => {
  if (!isPhysicalProductType(product.product_type)) return undefined;
  const photoId = toPositiveInteger(product.photo_id);
  if (photoId) return photoId;
  const productRecord = product as unknown;
  if (!isRecord(productRecord)) return undefined;
  const photoCandidate = productRecord.photo;
  if (!isRecord(photoCandidate)) return undefined;
  return toPositiveInteger(photoCandidate.id);
};

const sanitizeOptionsForCart = (
  productType: string | null | undefined,
  options: unknown,
  fallbackIds?: { variantId?: number; sourceProductId?: number },
): CartOptions | undefined => {
  const optionRecord = isRecord(options) ? options : undefined;
  const sourceProductId =
    toPositiveInteger(optionRecord?.sourceProductId) ??
    fallbackIds?.sourceProductId;

  if (isDigitalProductType(productType)) {
    const rawLicense =
      optionRecord && typeof optionRecord.license === "string"
        ? optionRecord.license
        : undefined;
    const license: DigitalLicense = isValidDigitalLicense(rawLicense)
      ? rawLicense
      : "hd";

    return {
      type: "digital",
      license,
      sourceProductId,
    };
  }

  if (isPhysicalProductType(productType)) {
    const variantId =
      (optionRecord ? toPositiveInteger(optionRecord.variantId) : undefined) ??
      fallbackIds?.variantId;
    if (!variantId) return undefined;

    return {
      type: "physical",
      material:
        optionRecord && typeof optionRecord.material === "string"
          ? optionRecord.material
          : undefined,
      size:
        optionRecord && typeof optionRecord.size === "string"
          ? optionRecord.size
          : undefined,
      variantId,
      sourceProductId,
    };
  }

  return undefined;
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
    entry.options,
    {
      variantId: toPositiveInteger(safeProduct.id),
      sourceProductId:
        getPhysicalSourceProductId(safeProduct) ?? toPositiveInteger(safeProduct.id),
    },
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

const hasAuthenticatedSession = (): boolean =>
  // Include legacy localStorage token to avoid dropping digital cart items
  // before AuthProvider migrates persisted sessions.
  Boolean(
    sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken"),
  );

const removeDigitalItems = (items: CartItem[]): CartItem[] =>
  items.filter((item) => !isDigitalProductType(item.product?.product_type));

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const localData = localStorage.getItem("cart");
      const parsed = localData ? JSON.parse(localData) : [];
      if (!Array.isArray(parsed)) return [];
      const sanitizedItems = parsed
        .map((entry) => sanitizeStoredCartEntry(entry))
        .filter((entry): entry is CartItem => entry !== null);
      return hasAuthenticatedSession()
        ? sanitizedItems
        : removeDigitalItems(sanitizedItems);
    } catch (error) {
      console.error("Could not parse cart data from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (isAuthenticated) return;
    if (!cartHasDigitalItems(cartItems)) return;
    setCartItems((prevItems) => removeDigitalItems(prevItems));
  }, [isAuthenticated, cartItems]);

  const addToCart = useCallback(
    ((product: GalleryItem, quantity: number, options: CartOptions) => {
      const safeProduct = sanitizeProductForCart(product);
      const safeOptions = sanitizeOptionsForCart(
        safeProduct.product_type,
        options,
        {
          variantId: toPositiveInteger(safeProduct.id),
          sourceProductId:
            getPhysicalSourceProductId(safeProduct) ??
            toPositiveInteger(safeProduct.id),
        },
      );
      if (!safeOptions) {
        console.error("Invalid cart options for product", {
          productId: safeProduct.id,
          productType: safeProduct.product_type,
          options,
        });
        return;
      }

      // Create a unique string based on options to differentiate variants
      const optionsString = JSON.stringify(safeOptions);
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
    }) as AddToCartFn,
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
