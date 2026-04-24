import { describe, expect, it } from "vitest";
import { isGalleryAccessScopedPath } from "../src/services/api";

describe("isGalleryAccessScopedPath", () => {
  it("returns true for protected gallery content endpoints", () => {
    expect(isGalleryAccessScopedPath("gallery/")).toBe(true);
    expect(isGalleryAccessScopedPath("photos/123/")).toBe(true);
    expect(isGalleryAccessScopedPath("videos/456/")).toBe(true);
  });

  it("returns false for non-gallery endpoints", () => {
    expect(isGalleryAccessScopedPath("auth/profile/")).toBe(false);
    expect(isGalleryAccessScopedPath("checkout/order-history/")).toBe(false);
    expect(isGalleryAccessScopedPath("gallery-request/")).toBe(false);
    expect(isGalleryAccessScopedPath("gallery-verify/")).toBe(false);
  });
});
