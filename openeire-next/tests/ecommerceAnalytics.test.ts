import { beforeEach, describe, expect, it, vi } from "vitest";

const trackEvent = vi.hoisted(() => vi.fn());
vi.mock("@/lib/analytics", () => ({ trackEvent }));

describe("ecommerce analytics", () => {
  beforeEach(() => trackEvent.mockClear());

  it("continues to forward GA4 ecommerce payloads with EUR currency", async () => {
    const { trackEcommerceEvent } = await import("@/lib/ecommerceAnalytics");
    const items = [
      { item_id: "photo-1", item_name: "Atlantic Light", quantity: 1 },
    ];

    trackEcommerceEvent("purchase", {
      transaction_id: "order-123",
      value: 49,
      items,
    });

    expect(trackEvent).toHaveBeenCalledWith("purchase", {
      currency: "EUR",
      transaction_id: "order-123",
      value: 49,
      items,
    });
  });
});
