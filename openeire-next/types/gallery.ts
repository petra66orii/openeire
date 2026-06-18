export type GalleryProductType = "physical" | "photo" | "video";
export type PublicGalleryType = "physical" | "all";
export type DigitalGalleryFilter = "all" | "photo" | "video";

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PublicGalleryItem {
  id: number;
  title: string;
  description?: string | null;
  collection?: string | null;
  preview_image?: string | null;
  thumbnail_image?: string | null;
  preview_video_url?: string | null;
  starting_price?: string | number | null;
  price?: string | number | null;
  product_type: GalleryProductType;
  purchase_flows?: string[];
  default_purchase_flow?: string | null;
}

export interface ProductVariant {
  id: number;
  material: string;
  material_display: string;
  size: string;
  size_display: string;
  price: string;
  sku: string | null;
  product_type?: "physical";
  purchase_flows?: string[];
  default_purchase_flow?: string | null;
}

export interface PublicPhysicalProductDetail extends PublicGalleryItem {
  product_type: "physical";
  description?: string | null;
  tags?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  variants: ProductVariant[];
  average_rating?: number | string | null;
  review_count?: number | null;
  related_products?: PublicGalleryItem[];
}

export interface ProtectedPhotoDetail extends PublicGalleryItem {
  product_type: "photo";
  description?: string | null;
  tags?: string | null;
  created_at?: string | null;
  variants?: ProductVariant[];
  average_rating?: number | string | null;
  review_count?: number | null;
  related_products?: PublicGalleryItem[];
}

export interface ProtectedVideoDetail extends PublicGalleryItem {
  product_type: "video";
  description?: string | null;
  tags?: string | null;
  created_at?: string | null;
  duration?: number | string | null;
  resolution?: string | null;
  frame_rate?: string | null;
  average_rating?: number | string | null;
  review_count?: number | null;
  related_products?: PublicGalleryItem[];
}

export type ProtectedDigitalDetail =
  | ProtectedPhotoDetail
  | ProtectedVideoDetail;
