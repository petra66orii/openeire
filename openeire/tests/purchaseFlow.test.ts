import { describe, expect, it } from "vitest";
import {
  getPurchaseFlowConfig,
  isValidDigitalLicense,
  normalizeDigitalLicense,
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

describe("digital license normalization", () => {
  it("keeps 4k when selected and defaults unknown values to hd", () => {
    expect(normalizeDigitalLicense("4k")).toBe("4k");
    expect(normalizeDigitalLicense("hd")).toBe("hd");
    expect(normalizeDigitalLicense("unknown")).toBe("hd");
  });

  it("validates only hd and 4k as accepted digital license options", () => {
    expect(isValidDigitalLicense("hd")).toBe(true);
    expect(isValidDigitalLicense("4k")).toBe(true);
    expect(isValidDigitalLicense("invalid")).toBe(false);
    expect(isValidDigitalLicense(undefined)).toBe(false);
  });
});
