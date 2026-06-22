import type { CartItem } from "@/lib/cart/types";

export type ShippingMethod = "budget" | "standard" | "express";

export interface CheckoutContactDetails {
  name: string;
  email: string;
  phone: string;
}

export interface CheckoutShippingDetails {
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

export interface CheckoutFormState {
  contact: CheckoutContactDetails;
  shipping: CheckoutShippingDetails;
  shippingMethod: ShippingMethod;
  saveInfo: boolean;
  acceptsTerms: boolean;
  acceptsPrivacy: boolean;
  acceptsPersonalUse: boolean;
}

export interface CheckoutPhysicalOptionsPayload {
  material?: string;
  size?: string;
  variantId: number;
}

export type CheckoutCartItemPayload =
  | {
      product_id: number;
      product_type: "photo" | "video";
      quantity: number;
    }
  | {
      product_id: number;
      product_type: "physical";
      quantity: number;
      options: CheckoutPhysicalOptionsPayload;
    };

export interface CheckoutShippingAddressPayload {
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

export interface CheckoutShippingDetailsPayload {
  name: string;
  email: string;
  phone: string;
  address: CheckoutShippingAddressPayload;
}

export interface CreatePaymentIntentPayload {
  cart: CheckoutCartItemPayload[];
  save_info: boolean;
  shipping_details?: CheckoutShippingDetailsPayload;
  shipping_method?: ShippingMethod;
  discount_code?: string;
}

export interface DiscountValidationPayload {
  cart: CheckoutCartItemPayload[];
  email?: string;
  discount_code: string;
}

export interface DiscountValidationResponse {
  code: string;
  discountAmount: number;
  discountPercent: number;
  discountLabel: string;
  eligibleSubtotal: number;
}

export interface AppliedDiscount {
  code: string;
  amount: number;
  label: string | null;
  eligibleSubtotal: number | null;
}

export interface CheckoutReadiness {
  isReady: boolean;
  errors: string[];
  payload: CreatePaymentIntentPayload | null;
}

export interface CheckoutCartSnapshot {
  items: CartItem[];
  hasPhysicalItems: boolean;
  hasDigitalItems: boolean;
}

