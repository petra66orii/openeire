export type ProductType = "photo" | "video" | "physical";

export const isDigitalProductType = (
  productType: string | null | undefined,
): productType is "photo" | "video" =>
  productType === "photo" || productType === "video";

export const isPhysicalProductType = (
  productType: string | null | undefined,
): productType is "physical" => productType === "physical";

type CartLikeItem = {
  product?: {
    product_type?: string | null;
  } | null;
};

export const cartHasDigitalItems = (items: CartLikeItem[]): boolean =>
  items.some((item) => isDigitalProductType(item.product?.product_type));

export const cartHasPhysicalItems = (items: CartLikeItem[]): boolean =>
  items.some((item) => isPhysicalProductType(item.product?.product_type));

export interface PurchaseFlowConfig {
  showPrintPurchase: boolean;
  showPersonalDigitalPurchase: boolean;
  showCommercialLicenseRequest: boolean;
}

export const getPurchaseFlowConfig = (
  productType: string | null | undefined,
): PurchaseFlowConfig => {
  const isPhysical = isPhysicalProductType(productType);
  const isDigital = isDigitalProductType(productType);

  return {
    showPrintPurchase: isPhysical,
    showPersonalDigitalPurchase: isDigital,
    showCommercialLicenseRequest: isDigital,
  };
};

export const shouldShowGalleryAccessCodeUx = (
  productType: string | null | undefined,
  statusCode: number | undefined,
): boolean =>
  isDigitalProductType(productType) &&
  (statusCode === 401 || statusCode === 403);
