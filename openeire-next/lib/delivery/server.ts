import "server-only";

import type { NextRequest } from "next/server";

export const DELIVERY_COOKIE = "openeire_delivery_access";

export type DeliveryFailureCategory =
  | "missing_origin"
  | "invalid_origin"
  | "proxy_origin_mismatch"
  | "configuration_error"
  | "backend_connection_error"
  | "backend_response";

const DELIVERY_FAILURE_CATEGORIES = new Set<DeliveryFailureCategory>([
  "missing_origin",
  "invalid_origin",
  "proxy_origin_mismatch",
  "configuration_error",
  "backend_connection_error",
  "backend_response",
]);

class DeliveryFailure extends Error {
  constructor(readonly category: DeliveryFailureCategory) {
    super("Secure delivery request is unavailable.");
    this.name = "DeliveryFailure";
  }
}

const configurationFailure = (): never => {
  throw new DeliveryFailure("configuration_error");
};

const canonicalFrontendOrigin = (): URL => {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return configurationFailure();

  let parsed: URL;
  try {
    parsed = new URL(configured);
  } catch {
    return configurationFailure();
  }

  const protocolAllowed =
    parsed.protocol === "https:" ||
    (process.env.NODE_ENV !== "production" && parsed.protocol === "http:");
  if (
    !protocolAllowed ||
    parsed.username ||
    parsed.password ||
    parsed.pathname !== "/" ||
    parsed.search ||
    parsed.hash
  ) {
    return configurationFailure();
  }
  return parsed;
};

const renderExternalHostname = (): string | null => {
  const configured = process.env.RENDER_EXTERNAL_HOSTNAME?.trim().toLowerCase();
  if (!configured) return null;

  try {
    const parsed = new URL(`https://${configured}`);
    if (parsed.host !== configured || parsed.pathname !== "/") {
      return configurationFailure();
    }
    return configured;
  } catch (error) {
    if (error instanceof DeliveryFailure) throw error;
    return configurationFailure();
  }
};

const backendBaseUrl = (): string => {
  const configured = process.env.OPENEIRE_API_BASE_URL?.trim();
  if (!configured) {
    return configurationFailure();
  }
  let parsed: URL;
  try {
    parsed = new URL(configured);
  } catch {
    return configurationFailure();
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
    return configurationFailure();
  }
  return parsed.toString().endsWith("/") ? parsed.toString() : `${parsed.toString()}/`;
};

const internalSecret = (): string => {
  const value = process.env.REAL_ESTATE_DELIVERY_INTERNAL_SECRET ?? "";
  if (value.length < 32) {
    configurationFailure();
  }
  return value;
};

export const assertTrustedDeliveryPost = (request: NextRequest): string => {
  const origin = request.headers.get("origin");
  if (!origin) throw new DeliveryFailure("missing_origin");

  let parsed: URL;
  try {
    parsed = new URL(origin);
  } catch {
    throw new DeliveryFailure("invalid_origin");
  }

  const canonical = canonicalFrontendOrigin();
  if (origin !== parsed.origin || parsed.origin !== canonical.origin) {
    throw new DeliveryFailure("invalid_origin");
  }

  const host = request.headers.get("host")?.toLowerCase() ?? "";
  const renderHost = renderExternalHostname();
  const allowedTransportHosts = new Set(
    [canonical.host.toLowerCase(), renderHost].filter(
      (value): value is string => Boolean(value),
    ),
  );
  const forwardedHost = request.headers.get("x-forwarded-host")?.toLowerCase();
  const forwardedProto = request.headers.get("x-forwarded-proto")?.toLowerCase();
  const hasForwardingHeaders = Boolean(forwardedHost || forwardedProto);
  const forwardedOriginMatches =
    forwardedHost === canonical.host.toLowerCase() &&
    forwardedProto === canonical.protocol.slice(0, -1);
  const usesInternalRenderHost = Boolean(renderHost) && host === renderHost;

  // nextUrl is built from Next.js's internal bind hostname and port on Render,
  // so it is routing metadata rather than an authority for the public origin.
  if (
    !allowedTransportHosts.has(host) ||
    (hasForwardingHeaders && !forwardedOriginMatches) ||
    (usesInternalRenderHost && !forwardedOriginMatches)
  ) {
    throw new DeliveryFailure("proxy_origin_mismatch");
  }
  return canonical.origin;
};

export const logDeliveryFailure = (
  failure: unknown,
): void => {
  const category =
    typeof failure === "string" &&
    DELIVERY_FAILURE_CATEGORIES.has(failure as DeliveryFailureCategory)
      ? (failure as DeliveryFailureCategory)
      : failure instanceof DeliveryFailure
        ? failure.category
        : null;
  if (category) console.error("delivery_failure", { category });
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
  const url = `${backendBaseUrl()}real-estate/delivery/${endpoint}/`;
  const secret = internalSecret();
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Origin: browserOrigin,
        "X-OpenEire-Delivery-Internal": secret,
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new DeliveryFailure("backend_connection_error");
  }
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
