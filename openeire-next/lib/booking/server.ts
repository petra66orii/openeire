import "server-only";

import type { NextRequest } from "next/server";

export const bookingCookieName = () =>
  process.env.NODE_ENV === "production"
    ? "__Host-openeire_booking_access"
    : "openeire_booking_access";

type BookingFailureCategory =
  | "missing_origin"
  | "invalid_origin"
  | "proxy_origin_mismatch"
  | "configuration_error"
  | "backend_connection_error"
  | "backend_response";

const FAILURE_CATEGORIES = new Set<BookingFailureCategory>([
  "missing_origin", "invalid_origin", "proxy_origin_mismatch",
  "configuration_error", "backend_connection_error", "backend_response",
]);

export class BookingFailure extends Error {
  constructor(readonly category: BookingFailureCategory) {
    super("Secure booking request is unavailable.");
    this.name = "BookingFailure";
  }
}

const configurationFailure = (): never => { throw new BookingFailure("configuration_error"); };

const canonicalFrontendOrigin = (): URL => {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return configurationFailure();
  let parsed: URL;
  try { parsed = new URL(configured); } catch { return configurationFailure(); }
  const protocolAllowed = parsed.protocol === "https:" || (process.env.NODE_ENV !== "production" && parsed.protocol === "http:");
  if (!protocolAllowed || parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash) return configurationFailure();
  return parsed;
};

const renderExternalHostname = (): string | null => {
  const configured = process.env.RENDER_EXTERNAL_HOSTNAME?.trim().toLowerCase();
  if (!configured) return null;
  try {
    const parsed = new URL(`https://${configured}`);
    if (parsed.host !== configured || parsed.pathname !== "/") return configurationFailure();
    return configured;
  } catch (error) {
    if (error instanceof BookingFailure) throw error;
    return configurationFailure();
  }
};

const backendBaseUrl = (): string => {
  const configured = process.env.OPENEIRE_API_BASE_URL?.trim();
  if (!configured) return configurationFailure();
  let parsed: URL;
  try { parsed = new URL(configured); } catch { return configurationFailure(); }
  const protocolAllowed = parsed.protocol === "https:" || (process.env.NODE_ENV !== "production" && parsed.protocol === "http:");
  if (!protocolAllowed || parsed.username || parsed.password || parsed.search || parsed.hash) return configurationFailure();
  parsed.pathname = `${parsed.pathname.replace(/\/+$/, "")}/`;
  if (process.env.NODE_ENV === "production" && parsed.pathname !== "/api/") return configurationFailure();
  return parsed.toString();
};

const internalSecret = (): string => {
  const value = process.env.REAL_ESTATE_BOOKING_INTERNAL_SECRET ?? "";
  if (value.length < 32) return configurationFailure();
  return value;
};

export const assertBookingFeatureEnabled = () => {
  if (process.env.REAL_ESTATE_BOOKING_PORTAL_ENABLED !== "true") configurationFailure();
};

export const assertTrustedBookingPost = (request: NextRequest): string => {
  assertBookingFeatureEnabled();
  const origin = request.headers.get("origin");
  if (!origin) throw new BookingFailure("missing_origin");
  let parsed: URL;
  try { parsed = new URL(origin); } catch { throw new BookingFailure("invalid_origin"); }
  const canonical = canonicalFrontendOrigin();
  if (origin !== parsed.origin || parsed.origin !== canonical.origin) throw new BookingFailure("invalid_origin");
  const host = request.headers.get("host")?.toLowerCase() ?? "";
  const renderHost = renderExternalHostname();
  const allowedHosts = new Set([canonical.host.toLowerCase(), renderHost].filter((value): value is string => Boolean(value)));
  const forwardedHost = request.headers.get("x-forwarded-host")?.toLowerCase();
  const forwardedProto = request.headers.get("x-forwarded-proto")?.toLowerCase();
  const hasForwarding = Boolean(forwardedHost || forwardedProto);
  const forwardingMatches = forwardedHost === canonical.host.toLowerCase() && forwardedProto === canonical.protocol.slice(0, -1);
  const usesRenderHost = Boolean(renderHost) && host === renderHost;
  if (!allowedHosts.has(host) || (hasForwarding && !forwardingMatches) || (usesRenderHost && !forwardingMatches)) throw new BookingFailure("proxy_origin_mismatch");
  return canonical.origin;
};

export const logBookingFailure = (failure: unknown) => {
  const category = typeof failure === "string" && FAILURE_CATEGORIES.has(failure as BookingFailureCategory)
    ? failure as BookingFailureCategory
    : failure instanceof BookingFailure ? failure.category : null;
  if (category) console.error("booking_failure", { category });
};

export const bookingBackendPost = async (endpoint: string, body: Record<string, unknown>, browserOrigin: string) => {
  if (!new Set(["exchange", "session", "enquiries"]).has(endpoint)) configurationFailure();
  let response: Response;
  try {
    const url = new URL(`real-estate/booking/${endpoint}/`, backendBaseUrl());
    response = await fetch(url.toString(), {
      method: "POST", cache: "no-store",
      headers: { "Content-Type": "application/json", Origin: browserOrigin, "X-OpenEire-Booking-Internal": internalSecret() },
      body: JSON.stringify(body),
    });
  } catch { throw new BookingFailure("backend_connection_error"); }
  let payload: Record<string, unknown> = {};
  try {
    const parsed: unknown = await response.json();
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) payload = parsed as Record<string, unknown>;
  } catch { /* Never surface backend text. */ }
  return { ok: response.ok, status: response.status, payload };
};

export const bookingNoStoreHeaders = {
  "Cache-Control": "private, no-store, max-age=0", Pragma: "no-cache",
  "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow, noarchive",
};
