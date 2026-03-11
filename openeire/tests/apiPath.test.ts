import { describe, expect, it } from "vitest";
import { normalizeApiPath } from "../src/utils/apiPath";

describe("normalizeApiPath", () => {
  it("strips one or more leading slashes", () => {
    expect(normalizeApiPath("/products/recommendations/")).toBe(
      "products/recommendations/",
    );
    expect(normalizeApiPath("//products/download/photo/1/")).toBe(
      "products/download/photo/1/",
    );
  });

  it("keeps already-relative paths unchanged", () => {
    expect(normalizeApiPath("checkout/create-payment-intent/")).toBe(
      "checkout/create-payment-intent/",
    );
  });
});
