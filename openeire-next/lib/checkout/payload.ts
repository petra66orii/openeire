import type { CartItem, PhysicalCartOptions } from "@/lib/cart/types";
import { sanitizeCartItems } from "@/lib/cart/sanitize";
import type {
  CheckoutCartItemPayload,
  CheckoutFormState,
  CreatePaymentIntentPayload,
  ShippingMethod,
} from "@/types/checkout";

const trim = (value: string): string => value.trim();
const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trim(value));

const isPhysicalOptions = (
  value: CartItem["options"],
): value is PhysicalCartOptions =>
  Boolean(
    value &&
      "variantId" in value &&
      Number.isFinite(Number(value.variantId)) &&
      Number(value.variantId) > 0,
  );

export const hasPhysicalCartItems = (items: CartItem[]): boolean =>
  items.some((item) => item.product.product_type === "physical");

export const hasDigitalCartItems = (items: CartItem[]): boolean =>
  items.some((item) => item.product.product_type !== "physical");

export const buildCheckoutCartPayload = (
  cartItems: CartItem[],
): CheckoutCartItemPayload[] =>
  cartItems.map((item) => {
    if (item.product.product_type === "physical") {
      if (!isPhysicalOptions(item.options)) {
        throw new Error(
          "One or more print options are invalid. Remove and re-add the item.",
        );
      }

      const variantId = Number(item.options.variantId);
      return {
        product_id: variantId,
        product_type: "physical",
        quantity: item.quantity,
        options: {
          material: item.options.material,
          size: item.options.size,
          variantId,
        },
      };
    }

    return {
      product_id: item.product.id,
      product_type: item.product.product_type,
      quantity: 1,
    };
  });

export const getCheckoutCartSignature = (items: CartItem[]): string =>
  items.map((item) => `${item.cartId}:${item.quantity}`).join("|");

export const hasCompleteContactDetails = (state: CheckoutFormState): boolean =>
  Boolean(
    trim(state.contact.name) &&
      isValidEmail(state.contact.email) &&
      trim(state.contact.phone),
  );

export const hasCompleteShippingDetails = (
  state: CheckoutFormState,
): boolean => {
  const required = [
    state.shipping.line1,
    state.shipping.city,
    state.shipping.country,
    state.shipping.postal_code,
  ];

  if (!required.every((field) => trim(field).length > 0)) return false;
  if (state.shipping.country === "US") return trim(state.shipping.state).length > 0;
  return true;
};

export const buildCreatePaymentIntentPayload = ({
  cartItems,
  formState,
  discountCode,
  isAuthenticated,
}: {
  cartItems: CartItem[];
  formState: CheckoutFormState;
  discountCode?: string | null;
  isAuthenticated: boolean;
}): CreatePaymentIntentPayload => {
  const sanitizedItems = sanitizeCartItems(cartItems, { isAuthenticated });
  const hasPhysicalItems = hasPhysicalCartItems(sanitizedItems);
  const payload: CreatePaymentIntentPayload = {
    cart: buildCheckoutCartPayload(sanitizedItems),
    save_info: formState.saveInfo,
  };

  if (discountCode) {
    payload.discount_code = discountCode;
  }

  if (hasPhysicalItems) {
    payload.shipping_method = formState.shippingMethod as ShippingMethod;
    payload.shipping_details = {
      name: trim(formState.contact.name),
      email: trim(formState.contact.email),
      phone: trim(formState.contact.phone),
      address: {
        line1: trim(formState.shipping.line1),
        line2: trim(formState.shipping.line2),
        city: trim(formState.shipping.city),
        state: trim(formState.shipping.state),
        country: trim(formState.shipping.country),
        postal_code: trim(formState.shipping.postal_code),
      },
    };
  }

  return payload;
};
