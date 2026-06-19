import type { GalleryProductType } from "@/types/gallery";

export type CartProductType = GalleryProductType;

export interface PhysicalCartOptions {
  type?: "physical";
  material?: string;
  size?: string;
  variantId: number;
  sourceProductId?: number;
}

export interface DigitalCartOptions {
  type?: "digital";
  sourceProductId?: number;
}

export type CartItemOptions = PhysicalCartOptions | DigitalCartOptions;

export interface CartProductSnapshot {
  id: number;
  title: string;
  product_type: CartProductType;
  preview_image?: string | null;
  thumbnail_image?: string | null;
  starting_price?: string | number | null;
  price?: string | number | null;
  collection?: string | null;
}

export interface CartItem {
  cartId: string;
  productId: number;
  product: CartProductSnapshot;
  quantity: number;
  options?: CartItemOptions;
}

export interface AddToCartInput {
  product: CartProductSnapshot;
  quantity?: number;
  options?: CartItemOptions;
}
