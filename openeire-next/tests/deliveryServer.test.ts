import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { POST as exchangeDelivery } from "@/app/api/delivery/exchange/route";
import {
  assertTrustedDeliveryPost,
  deliveryBackendPost,
} from "@/lib/delivery/server";

const INTERNAL_SECRET = "internal-secret-with-high-entropy-1234567890";
const PUBLIC_ID = "11111111-1111-4111-8111-111111111111";

const deliveryRequest = (
  body: Record<string, unknown>,
  origin = "https://openeire.test",
) =>
  new NextRequest("https://openeire.test/api/delivery/exchange", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Host: "openeire.test",
      Origin: origin,
    },
    body: JSON.stringify(body),
  });

describe("delivery server boundary", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("requires an explicit server-only backend URL", async () => {
    vi.stubEnv("OPENEIRE_API_BASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://public.example.test/api/");
    vi.stubEnv("REAL_ESTATE_DELIVERY_INTERNAL_SECRET", INTERNAL_SECRET);
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      deliveryBackendPost("session", { session: "fictional" }, "https://openeire.test"),
    ).rejects.toThrow("Secure delivery server configuration is unavailable.");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects unsafe backend URL configuration", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("OPENEIRE_API_BASE_URL", "http://api.example.test/api/");
    vi.stubEnv("REAL_ESTATE_DELIVERY_INTERNAL_SECRET", INTERNAL_SECRET);
    vi.stubGlobal("fetch", vi.fn());

    await expect(
      deliveryBackendPost("session", { session: "fictional" }, "https://openeire.test"),
    ).rejects.toThrow("Secure delivery server configuration is unavailable.");
  });

  it("sends control-plane requests only to the configured backend", async () => {
    vi.stubEnv("OPENEIRE_API_BASE_URL", "https://api.example.test/api/");
    vi.stubEnv("REAL_ESTATE_DELIVERY_INTERNAL_SECRET", INTERNAL_SECRET);
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify({ state: "valid" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    await deliveryBackendPost(
      "session",
      { session: "fictional" },
      "https://openeire.test",
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/api/real-estate/delivery/session/",
      expect.objectContaining({
        method: "POST",
        cache: "no-store",
        headers: expect.objectContaining({
          Origin: "https://openeire.test",
          "X-OpenEire-Delivery-Internal": INTERNAL_SECRET,
        }),
      }),
    );
  });

  it("rejects cross-origin browser requests before contacting Django", async () => {
    const request = deliveryRequest(
      { public_id: PUBLIC_ID, secret: "fragment-secret" },
      "https://attacker.example",
    );
    expect(() => assertTrustedDeliveryPost(request)).toThrow(
      "Untrusted delivery request.",
    );
  });

  it("sets a hardened production cookie after a valid fragment exchange", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("OPENEIRE_API_BASE_URL", "https://api.example.test/api/");
    vi.stubEnv("REAL_ESTATE_DELIVERY_INTERNAL_SECRET", INTERNAL_SECRET);
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              state: "valid",
              session: "signed-fictional-session",
              expires_in: 120,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          ),
        ),
      ),
    );

    const response = await exchangeDelivery(
      deliveryRequest({ public_id: PUBLIC_ID, secret: "fragment-secret" }),
    );
    const cookie = response.headers.get("set-cookie") ?? "";

    expect(response.status).toBe(200);
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Secure");
    expect(cookie.toLowerCase()).toContain("samesite=strict");
    expect(cookie).toContain("Max-Age=120");
  });

  it("keeps invalid exchange responses generic", async () => {
    vi.stubEnv("OPENEIRE_API_BASE_URL", "https://api.example.test/api/");
    vi.stubEnv("REAL_ESTATE_DELIVERY_INTERNAL_SECRET", INTERNAL_SECRET);
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              state: "unavailable",
              detail: "Internal detail must not cross the boundary.",
            }),
            {
              status: 404,
              headers: { "Content-Type": "application/json" },
            },
          ),
        ),
      ),
    );

    const response = await exchangeDelivery(
      deliveryRequest({ public_id: PUBLIC_ID, secret: "wrong" }),
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ state: "unavailable" });
  });
});
