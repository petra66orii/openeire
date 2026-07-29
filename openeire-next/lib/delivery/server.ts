import "server-only";

import type { NextRequest } from "next/server";

export const DELIVERY_COOKIE = "openeire_delivery_access";

const backendBaseUrl = (): string => {
  const configured = process.env.OPENEIRE_API_BASE_URL?.trim();
  if (!configured) {
    throw new Error("Secure delivery server configuration is unavailable.");
  }
  let parsed: URL;
  try {
    parsed = new URL(configured);
  } catch {
    throw new Error("Secure delivery server configuration is unavailable.");
  }
  const protocolAllowed =
    parsed.protocol === "https:" ||
    (process.env.NODE_ENV !== "production" && parsed.protocol === "http:");
  if (
    !protocolAllowed ||
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash
  ) {
    throw new Error("Secure delivery server configuration is unavailable.");
  }
  return parsed.toString().endsWith("/") ? parsed.toString() : `${parsed.toString()}/`;
};

const internalSecret = (): string => {
  const value = process.env.REAL_ESTATE_DELIVERY_INTERNAL_SECRET ?? "";
  if (value.length < 32) {
    throw new Error("Secure delivery server configuration is unavailable.");
  }
  return value;
};

export const assertTrustedDeliveryPost = (request: NextRequest): string => {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) throw new Error("Untrusted delivery request.");
  const parsed = new URL(origin);
  if (parsed.host !== host || parsed.origin !== request.nextUrl.origin) {
    throw new Error("Untrusted delivery request.");
  }
  return parsed.origin;
};

export interface DeliveryBackendResponse {
  ok: boolean;
  status: number;
  payload: Record<string, unknown>;
}

export const deliveryBackendPost = async (
  endpoint: string,
  body: Record<string, unknown>,
  browserOrigin: string,
): Promise<DeliveryBackendResponse> => {
  const response = await fetch(
    `${backendBaseUrl()}real-estate/delivery/${endpoint}/`,
    {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Origin: browserOrigin,
        "X-OpenEire-Delivery-Internal": internalSecret(),
      },
      body: JSON.stringify(body),
    },
  );
  let payload: Record<string, unknown> = {};
  try {
    const parsed: unknown = await response.json();
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      payload = parsed as Record<string, unknown>;
    }
  } catch {
    // Deliberately discard backend response text; it may contain operational data.
  }
  return { ok: response.ok, status: response.status, payload };
};

export const noStoreHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  Pragma: "no-cache",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};
