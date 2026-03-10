export type ProductType = "photo" | "video" | "physical";
export type DigitalLicense = "hd" | "4k";
const DIGITAL_LICENSES: DigitalLicense[] = ["hd", "4k"];

export const isDigitalProductType = (
  productType: string | null | undefined,
): productType is "photo" | "video" =>
  productType === "photo" || productType === "video";

export const isPhysicalProductType = (
  productType: string | null | undefined,
): productType is "physical" => productType === "physical";

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

export const normalizeDigitalLicense = (
  value: string | null | undefined,
): DigitalLicense => (value === "4k" ? "4k" : "hd");

export const isValidDigitalLicense = (
  value: string | null | undefined,
): value is DigitalLicense =>
  typeof value === "string" &&
  DIGITAL_LICENSES.includes(value as DigitalLicense);
