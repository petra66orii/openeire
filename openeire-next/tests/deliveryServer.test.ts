import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { POST as exchangeDelivery } from "@/app/api/delivery/exchange/route";
import { POST as downloadDelivery } from "@/app/api/delivery/download/route";
import {
  assertTrustedDeliveryPost,
  DELIVERY_COOKIE,
  deliveryBackendPost,
  logDeliveryFailure,
} from "@/lib/delivery/server";

const INTERNAL_SECRET = "internal-secret-with-high-entropy-1234567890";
const PUBLIC_ID = "11111111-1111-4111-8111-111111111111";
const FILE_ID = "22222222-2222-4222-8222-222222222222";
const SESSION = "signed-fictional-session-private-value";
const SIGNED_DOWNLOAD_URL =
  "https://downloads.example.test/private/object.zip?X-Amz-Signature=fictional-private-value";

const deliveryRequest = (
  body: Record<string, unknown>,
  origin = "https://openeire.test",
  requestUrl = "https://openeire.test/api/delivery/exchange",
  headers: Record<string, string> = {},
) =>
  new NextRequest(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Host: "openeire.test",
      Origin: origin,
      ...headers,
    },
    body: JSON.stringify(body),
  });

describe("delivery server boundary", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://openeire.test");
  });

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
    ).rejects.toThrow("Secure delivery request is unavailable.");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects unsafe backend URL configuration", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("OPENEIRE_API_BASE_URL", "http://api.example.test/api/");
    vi.stubEnv("REAL_ESTATE_DELIVERY_INTERNAL_SECRET", INTERNAL_SECRET);
    vi.stubGlobal("fetch", vi.fn());

    await expect(
      deliveryBackendPost("session", { session: "fictional" }, "https://openeire.test"),
    ).rejects.toThrow("Secure delivery request is unavailable.");
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
      "Secure delivery request is unavailable.",
    );
  });

  it("accepts the canonical HTTPS origin behind Render and Cloudflare", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://openeire.ie");
    vi.stubEnv("RENDER_EXTERNAL_HOSTNAME", "openeire-next.onrender.com");
    vi.stubEnv("OPENEIRE_API_BASE_URL", "https://api.example.test/api");
    vi.stubEnv("REAL_ESTATE_DELIVERY_INTERNAL_SECRET", INTERNAL_SECRET);
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            state: "valid",
            session: "signed-fictional-session",
            expires_in: 120,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    const request = deliveryRequest(
      { public_id: PUBLIC_ID, secret: "fragment-secret" },
      "https://openeire.ie",
      "http://0.0.0.0:10000/api/delivery/exchange",
      {
        Host: "openeire-next.onrender.com",
        "X-Forwarded-Host": "openeire.ie",
        "X-Forwarded-Proto": "https",
      },
    );

    const response = await exchangeDelivery(request);

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/api/real-estate/delivery/exchange/",
      expect.objectContaining({
        headers: expect.objectContaining({ Origin: "https://openeire.ie" }),
      }),
    );
  });

  it("applies the configured canonical policy to the www hostname", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://openeire.ie");
    expect(() =>
      assertTrustedDeliveryPost(
        deliveryRequest(
          { public_id: PUBLIC_ID, secret: "fragment-secret" },
          "https://www.openeire.ie",
          "https://www.openeire.ie/api/delivery/exchange",
          { Host: "www.openeire.ie" },
        ),
      ),
    ).toThrow("Secure delivery request is unavailable.");

    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.openeire.ie");
    expect(
      assertTrustedDeliveryPost(
        deliveryRequest(
          { public_id: PUBLIC_ID, secret: "fragment-secret" },
          "https://www.openeire.ie",
          "https://www.openeire.ie/api/delivery/exchange",
          { Host: "www.openeire.ie" },
        ),
      ),
    ).toBe("https://www.openeire.ie");
  });

  it("rejects a missing browser Origin", () => {
    const request = new NextRequest(
      "https://openeire.test/api/delivery/exchange",
      {
        method: "POST",
        headers: { Host: "openeire.test" },
        body: JSON.stringify({ public_id: PUBLIC_ID, secret: "fragment-secret" }),
      },
    );
    expect(() => assertTrustedDeliveryPost(request)).toThrow(
      "Secure delivery request is unavailable.",
    );
  });

  it("rejects spoofed forwarding headers and arbitrary proxy targets", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://openeire.ie");
    vi.stubEnv("RENDER_EXTERNAL_HOSTNAME", "openeire-next.onrender.com");

    const spoofedForwardedHost = deliveryRequest(
      { public_id: PUBLIC_ID, secret: "fragment-secret" },
      "https://openeire.ie",
      "http://0.0.0.0:10000/api/delivery/exchange",
      {
        Host: "openeire-next.onrender.com",
        "X-Forwarded-Host": "attacker.example",
        "X-Forwarded-Proto": "https",
      },
    );
    const arbitraryTarget = deliveryRequest(
      { public_id: PUBLIC_ID, secret: "fragment-secret" },
      "https://openeire.ie",
      "http://untrusted-proxy.example/api/delivery/exchange",
      {
        Host: "untrusted-proxy.example",
        "X-Forwarded-Host": "openeire.ie",
        "X-Forwarded-Proto": "https",
      },
    );

    expect(() => assertTrustedDeliveryPost(spoofedForwardedHost)).toThrow();
    expect(() => assertTrustedDeliveryPost(arbitraryTarget)).toThrow();
  });

  it("rejects HTTP browser origins in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://openeire.ie");
    expect(() =>
      assertTrustedDeliveryPost(
        deliveryRequest(
          { public_id: PUBLIC_ID, secret: "fragment-secret" },
          "http://openeire.ie",
          "http://openeire.ie/api/delivery/exchange",
          { Host: "openeire.ie" },
        ),
      ),
    ).toThrow("Secure delivery request is unavailable.");
  });

  it("logs only fixed origin failure categories", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const missingOrigin = new NextRequest(
      "https://openeire.test/api/delivery/exchange",
      {
        method: "POST",
        headers: { Host: "openeire.test" },
        body: JSON.stringify({ public_id: PUBLIC_ID, secret: "fragment-secret" }),
      },
    );
    await exchangeDelivery(missingOrigin);
    await exchangeDelivery(
      deliveryRequest(
        { public_id: PUBLIC_ID, secret: "fragment-secret" },
        "https://attacker.example",
      ),
    );
    logDeliveryFailure("fragment-secret");
    logDeliveryFailure(new Error("private exception detail"));
    await exchangeDelivery(
      deliveryRequest(
        { public_id: PUBLIC_ID, secret: "fragment-secret" },
        "https://openeire.test",
        "https://openeire.test/api/delivery/exchange",
        {
          "X-Forwarded-Host": "attacker.example",
          "X-Forwarded-Proto": "https",
        },
      ),
    );

    expect(consoleError.mock.calls).toEqual([
      ["delivery_failure", { category: "missing_origin" }],
      ["delivery_failure", { category: "invalid_origin" }],
      ["delivery_failure", { category: "proxy_origin_mismatch" }],
    ]);
    const logged = JSON.stringify(consoleError.mock.calls);
    expect(logged).not.toContain(PUBLIC_ID);
    expect(logged).not.toContain("fragment-secret");
    expect(logged).not.toContain("attacker.example");
    expect(logged).not.toContain("private exception detail");
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
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
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
    expect(consoleError).toHaveBeenCalledWith("delivery_failure", {
      category: "backend_response",
    });
  });

  it("keeps configuration and backend connection failures generic", async () => {
    vi.stubEnv("OPENEIRE_API_BASE_URL", "");
    vi.stubEnv("REAL_ESTATE_DELIVERY_INTERNAL_SECRET", INTERNAL_SECRET);
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    const configurationResponse = await exchangeDelivery(
      deliveryRequest({ public_id: PUBLIC_ID, secret: "fragment-secret" }),
    );
    expect(configurationResponse.status).toBe(400);
    await expect(configurationResponse.json()).resolves.toEqual({
      state: "unavailable",
    });
    expect(consoleError).toHaveBeenLastCalledWith("delivery_failure", {
      category: "configuration_error",
    });

    vi.stubEnv("OPENEIRE_API_BASE_URL", "https://api.example.test/api/");
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("private connection detail"))),
    );
    const connectionResponse = await exchangeDelivery(
      deliveryRequest({ public_id: PUBLIC_ID, secret: "fragment-secret" }),
    );
    expect(connectionResponse.status).toBe(400);
    await expect(connectionResponse.json()).resolves.toEqual({
      state: "unavailable",
    });
    expect(consoleError).toHaveBeenLastCalledWith("delivery_failure", {
      category: "backend_connection_error",
    });

    const logged = JSON.stringify(consoleError.mock.calls);
    expect(logged).not.toContain(PUBLIC_ID);
    expect(logged).not.toContain("fragment-secret");
    expect(logged).not.toContain(INTERNAL_SECRET);
    expect(logged).not.toContain("private connection detail");
    expect(logged).not.toContain("real-estate/delivery/exchange");
  });
});

const downloadRequest = ({
  origin = "https://openeire.test",
  requestUrl = "https://openeire.test/api/delivery/download",
  headers = {},
  json = true,
}: {
  origin?: string | null;
  requestUrl?: string;
  headers?: Record<string, string>;
  json?: boolean;
} = {}) => {
  const requestHeaders: Record<string, string> = {
    Accept: json ? "application/json" : "text/html",
    "Content-Type": json
      ? "application/json"
      : "application/x-www-form-urlencoded",
    Cookie: `${DELIVERY_COOKIE}=${SESSION}`,
    Host: "openeire.test",
    ...headers,
  };
  if (origin !== null) requestHeaders.Origin = origin;
  const body = json
    ? JSON.stringify({ deliverable_id: FILE_ID })
    : new URLSearchParams({
        deliverable_id: FILE_ID,
        recipient_public_id: PUBLIC_ID,
      }).toString();
  return new NextRequest(requestUrl, {
    method: "POST",
    headers: requestHeaders,
    body,
  });
};

describe("delivery download boundary", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://openeire.test");
    vi.stubEnv("OPENEIRE_API_BASE_URL", "https://api.example.test/api");
    vi.stubEnv("REAL_ESTATE_DELIVERY_INTERNAL_SECRET", INTERNAL_SECRET);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("documents the native form Origin null failure at the invalid_origin branch", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://openeire.ie");
    vi.stubEnv("RENDER_EXTERNAL_HOSTNAME", "openeire-next.onrender.com");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await downloadDelivery(
      downloadRequest({
        origin: "null",
        requestUrl: "http://0.0.0.0:10000/api/delivery/download",
        json: false,
        headers: {
          Host: "openeire-next.onrender.com",
          "X-Forwarded-Host": "openeire.ie",
          "X-Forwarded-Proto": "https",
        },
      }),
    );

    expect(response.status).toBe(303);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledWith("delivery_failure", {
      category: "invalid_origin",
    });
  });

  it("accepts the production same-origin fetch behind Render and Cloudflare", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://openeire.ie");
    vi.stubEnv("RENDER_EXTERNAL_HOSTNAME", "openeire-next.onrender.com");
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify({ redirect_url: SIGNED_DOWNLOAD_URL }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await downloadDelivery(
      downloadRequest({
        origin: "https://openeire.ie",
        requestUrl: "http://0.0.0.0:10000/api/delivery/download",
        headers: {
          Host: "openeire-next.onrender.com",
          "X-Forwarded-Host": "openeire.ie",
          "X-Forwarded-Proto": "https",
        },
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      download_url: SIGNED_DOWNLOAD_URL,
    });
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/api/real-estate/delivery/download/",
      expect.objectContaining({
        method: "POST",
        cache: "no-store",
        redirect: "manual",
        headers: expect.objectContaining({
          Origin: "https://openeire.ie",
          "X-OpenEire-Delivery-Internal": INTERNAL_SECRET,
        }),
        body: JSON.stringify({
          session: SESSION,
          deliverable_id: FILE_ID,
        }),
      }),
    );
  });

  it("handles a Django 303 without following the signed URL server-side", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        new Response(null, {
          status: 303,
          headers: { Location: SIGNED_DOWNLOAD_URL },
        }),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await downloadDelivery(downloadRequest());

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      download_url: SIGNED_DOWNLOAD_URL,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/real-estate/delivery/download/"),
      expect.objectContaining({ redirect: "manual" }),
    );
  });

  it("preserves the controlled 303 for a valid legacy POST", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ redirect_url: SIGNED_DOWNLOAD_URL }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        ),
      ),
    );

    const response = await downloadDelivery(downloadRequest({ json: false }));

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(SIGNED_DOWNLOAD_URL);
  });

  it.each([
    ["foreign", "https://attacker.example", "invalid_origin"],
    ["missing", null, "missing_origin"],
  ])("rejects a %s Origin before contacting Django", async (_, origin, category) => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await downloadDelivery(downloadRequest({ origin }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ state: "unavailable" });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledWith("delivery_failure", { category });
  });

  it("rejects spoofed forwarded headers before contacting Django", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://openeire.ie");
    vi.stubEnv("RENDER_EXTERNAL_HOSTNAME", "openeire-next.onrender.com");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await downloadDelivery(
      downloadRequest({
        origin: "https://openeire.ie",
        requestUrl: "http://0.0.0.0:10000/api/delivery/download",
        headers: {
          Host: "openeire-next.onrender.com",
          "X-Forwarded-Host": "attacker.example",
          "X-Forwarded-Proto": "https",
        },
      }),
    );

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledWith("delivery_failure", {
      category: "proxy_origin_mismatch",
    });
  });

  it.each([
    ["expired", 410],
    ["revoked", 404],
    ["payment_locked", 423],
    ["preview", 403],
  ])("passes through the %s policy status with a generic body", async (state, status) => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              state,
              detail: `private-${state}-detail`,
              deliverable_id: FILE_ID,
            }),
            { status, headers: { "Content-Type": "application/json" } },
          ),
        ),
      ),
    );

    const response = await downloadDelivery(downloadRequest());

    expect(response.status).toBe(status);
    await expect(response.json()).resolves.toEqual({ state: "unavailable" });
    expect(consoleError).toHaveBeenCalledWith("delivery_failure", {
      category: "backend_response",
    });
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(FILE_ID);
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(
      `private-${state}-detail`,
    );
  });

  it("keeps configuration and backend connection failures generic and private", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubEnv("OPENEIRE_API_BASE_URL", "");

    const configurationResponse = await downloadDelivery(downloadRequest());
    expect(configurationResponse.status).toBe(400);
    await expect(configurationResponse.json()).resolves.toEqual({
      state: "unavailable",
    });
    expect(consoleError).toHaveBeenLastCalledWith("delivery_failure", {
      category: "configuration_error",
    });

    vi.stubEnv("OPENEIRE_API_BASE_URL", "https://api.example.test/api");
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("private connection detail"))),
    );
    const connectionResponse = await downloadDelivery(downloadRequest());
    expect(connectionResponse.status).toBe(400);
    await expect(connectionResponse.json()).resolves.toEqual({
      state: "unavailable",
    });
    expect(consoleError).toHaveBeenLastCalledWith("delivery_failure", {
      category: "backend_connection_error",
    });

    const logged = JSON.stringify(consoleError.mock.calls);
    expect(logged).not.toContain(FILE_ID);
    expect(logged).not.toContain(SESSION);
    expect(logged).not.toContain(SIGNED_DOWNLOAD_URL);
    expect(logged).not.toContain(INTERNAL_SECRET);
    expect(logged).not.toContain("private connection detail");
    expect(logged).not.toContain("Cookie");
  });
});
