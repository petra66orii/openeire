import type { GalleryProductType } from "@/types/gallery";

export interface OrderHistoryProduct {
  id?: number;
  photo_id?: number;
  title?: string | null;
  product_type?: GalleryProductType | null;
  material_display?: string | null;
  size_display?: string | null;
}

export interface OrderHistoryItem {
  id: number;
  product: OrderHistoryProduct | null;
  quantity: number;
  item_total: string | number;
  details?: {
    material?: string;
    size?: string;
    variantId?: number;
    sourceProductId?: number;
  } | null;
  download_url?: string | null;
  personal_terms_version?: string | null;
  personal_terms_url?: string | null;
}

export interface OrderHistory {
  order_number: string;
  date: string;
  order_total: string | number;
  total_price: string | number;
  street_address1?: string | null;
  town?: string | null;
  country?: string | null;
  items: OrderHistoryItem[];
  shipping_method?: string | null;
  delivery_cost?: string | number | null;
  personal_terms_version?: string | null;
  discount_code?: string | null;
  discount_amount?: string | number | null;
  discount_percent?: string | number | null;
  discount_label?: string | null;
}
