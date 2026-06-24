import type {
  CartItem,
  CartItemOptions,
  CartProductSnapshot,
  CartProductType,
  DigitalCartOptions,
  PhysicalCartOptions,
} from "@/lib/cart/types";

const SUPPORTED_PRODUCT_TYPES = new Set<CartProductType>([
  "physical",
  "photo",
  "video",
]);

export const MAX_CART_ITEM_QUANTITY = 100;

const toPositiveInteger = (value: unknown): number | null => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return null;
  return parsed;
};

const toOptionalPositiveInteger = (value: unknown): number | undefined => {
  const parsed = toPositiveInteger(value);
  return parsed ?? undefined;
};

const toSafeString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

const sanitizePrice = (value: unknown): string | number | null | undefined => {
  if (value === undefined || value === null || value === "") {
    return value as null | undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0
    ? parsed
    : undefined;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const sanitizeOptions = (
  value: unknown,
  productType: CartProductType,
): CartItemOptions | undefined => {
  if (!isRecord(value)) return undefined;

  if (productType === "physical") {
    const variantId = toPositiveInteger(value.variantId);
    if (!variantId) return undefined;

    const options: PhysicalCartOptions = {
      type: "physical",
      variantId,
    };
    const material = toSafeString(value.material);
    const size = toSafeString(value.size);
    const sourceProductId = toOptionalPositiveInteger(value.sourceProductId);
    if (material) options.material = material;
    if (size) options.size = size;
    if (sourceProductId) options.sourceProductId = sourceProductId;
    return options;
  }

  const options: DigitalCartOptions = { type: "digital" };
  const sourceProductId = toOptionalPositiveInteger(value.sourceProductId);
  if (sourceProductId) options.sourceProductId = sourceProductId;
  return options;
};

export const sanitizeCartProduct = (
  value: unknown,
): CartProductSnapshot | null => {
  if (!isRecord(value)) return null;

  const id = toPositiveInteger(value.id);
  const title = toSafeString(value.title);
  const productType = value.product_type;
  if (
    !id ||
    !title ||
    typeof productType !== "string" ||
    !SUPPORTED_PRODUCT_TYPES.has(productType as CartProductType)
  ) {
    return null;
  }

  return {
    id,
    title,
    product_type: productType as CartProductType,
    preview_image: toSafeString(value.preview_image) ?? null,
    thumbnail_image: toSafeString(value.thumbnail_image) ?? null,
    starting_price: sanitizePrice(value.starting_price) ?? null,
    price: sanitizePrice(value.price) ?? null,
    collection: toSafeString(value.collection) ?? null,
  };
};

export const buildCartId = (
  product: CartProductSnapshot,
  options?: CartItemOptions,
): string =>
  `${product.product_type}-${product.id}-${JSON.stringify(options ?? {})}`;

export const sanitizeCartItem = (
  value: unknown,
  options: { isAuthenticated: boolean },
): CartItem | null => {
  if (!isRecord(value)) return null;

  const product = sanitizeCartProduct(value.product);
  if (!product) return null;
  if (product.product_type !== "physical" && !options.isAuthenticated) {
    return null;
  }

  const quantity = Math.min(
    toPositiveInteger(value.quantity) ?? 1,
    MAX_CART_ITEM_QUANTITY,
  );
  const sanitizedOptions = sanitizeOptions(value.options, product.product_type);
  if (product.product_type === "physical" && !sanitizedOptions) return null;

  const productId = toPositiveInteger(value.productId) ?? product.id;
  // Persisted cart IDs are untrusted and legacy clients used different JSON
  // property ordering. Always rebuild a canonical identity from safe fields.
  const cartId = buildCartId(product, sanitizedOptions);

  return {
    cartId,
    productId,
    product,
    quantity: product.product_type === "physical" ? quantity : 1,
    ...(sanitizedOptions ? { options: sanitizedOptions } : {}),
  };
};

export const sanitizeCartItems = (
  value: unknown,
  options: { isAuthenticated: boolean },
): CartItem[] => {
  if (!Array.isArray(value)) return [];
  const sanitizedItems = value
    .map((item) => sanitizeCartItem(item, options))
    .filter((item): item is CartItem => item !== null);

  return sanitizedItems.reduce<CartItem[]>((mergedItems, item) => {
    const existingIndex = mergedItems.findIndex(
      (candidate) => candidate.cartId === item.cartId,
    );
    if (existingIndex === -1) return [...mergedItems, item];

    if (item.product.product_type === "physical") {
      const existing = mergedItems[existingIndex];
      mergedItems[existingIndex] = {
        ...existing,
        quantity: Math.min(
          existing.quantity + item.quantity,
          MAX_CART_ITEM_QUANTITY,
        ),
      };
    }
    return mergedItems;
  }, []);
};
