import { describe, expect, it } from "vitest";
import {
  isGalleryAccessScopedPath,
  shouldAttachGalleryAccessToken,
} from "../src/services/api";

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

  it("attaches token only for same-origin scoped requests", () => {
    const baseUrl = "http://127.0.0.1:8000/api/";

    expect(shouldAttachGalleryAccessToken("gallery/", baseUrl)).toBe(true);
    expect(shouldAttachGalleryAccessToken("photos/123/", baseUrl)).toBe(true);
    expect(shouldAttachGalleryAccessToken("videos/456/", baseUrl)).toBe(true);

    expect(
      shouldAttachGalleryAccessToken(
        "http://127.0.0.1:8000/api/videos/456/",
        baseUrl,
      ),
    ).toBe(true);

    expect(
      shouldAttachGalleryAccessToken("https://example.com/api/videos/456/", baseUrl),
    ).toBe(false);
    expect(shouldAttachGalleryAccessToken("auth/profile/", baseUrl)).toBe(false);
  });
});
