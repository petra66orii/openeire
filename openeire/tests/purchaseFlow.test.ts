import { describe, expect, it } from "vitest";
import {
  cartHasDigitalItems,
  cartHasPhysicalItems,
  getPurchaseFlowConfig,
  shouldShowGalleryAccessCodeUx,
} from "../src/utils/purchaseFlow";

describe("purchase flow config", () => {
  it("enables personal + commercial digital flows for photos", () => {
    const result = getPurchaseFlowConfig("photo");
    expect(result.showPrintPurchase).toBe(false);
    expect(result.showPersonalDigitalPurchase).toBe(true);
    expect(result.showCommercialLicenseRequest).toBe(true);
  });

  it("enables print flow only for physical products", () => {
    const result = getPurchaseFlowConfig("physical");
    expect(result.showPrintPurchase).toBe(true);
    expect(result.showPersonalDigitalPurchase).toBe(false);
    expect(result.showCommercialLicenseRequest).toBe(false);
  });
});

describe("gallery access fallback behavior", () => {
  it("requires access-code UX for digital 401/403 responses", () => {
    expect(shouldShowGalleryAccessCodeUx("video", 401)).toBe(true);
    expect(shouldShowGalleryAccessCodeUx("photo", 403)).toBe(true);
  });

  it("does not trigger access-code UX for non-digital products", () => {
    expect(shouldShowGalleryAccessCodeUx("physical", 401)).toBe(false);
  });
});

describe("cart product-type helpers", () => {
  it("detects digital and physical presence from cart-like items", () => {
    const mixed = [
      { product: { product_type: "photo" } },
      { product: { product_type: "physical" } },
    ];
    const physicalOnly = [{ product: { product_type: "physical" } }];

    expect(cartHasDigitalItems(mixed)).toBe(true);
    expect(cartHasPhysicalItems(mixed)).toBe(true);
    expect(cartHasDigitalItems(physicalOnly)).toBe(false);
    expect(cartHasPhysicalItems(physicalOnly)).toBe(true);
  });
});
