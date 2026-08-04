import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST as exchangeBooking } from "@/app/api/book/exchange/route";
import { POST as sessionBooking } from "@/app/api/book/session/route";
import { POST as submitBooking } from "@/app/api/book/enquiries/route";
import { assertTrustedBookingPost, bookingBackendPost } from "@/lib/booking/server";

const INTERNAL = "booking-internal-key-abcdefghijklmnopqrstuvwxyz-123456";
const PUBLIC_ID = "11111111-1111-4111-8111-111111111111";

const request = (origin = "https://openeire.test", headers: Record<string, string> = {}) => new NextRequest("https://openeire.test/api/book/exchange", {
  method: "POST",
  headers: { Origin: origin, Host: "openeire.test", "Content-Type": "application/json", ...headers },
  body: JSON.stringify({ public_id: PUBLIC_ID, secret: "fictional-fragment" }),
});

describe("private booking server boundary", () => {
  beforeEach(() => {
    vi.stubEnv("REAL_ESTATE_BOOKING_PORTAL_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://openeire.test");
    vi.stubEnv("OPENEIRE_API_BASE_URL", "https://api.example.test/api/");
    vi.stubEnv("REAL_ESTATE_BOOKING_INTERNAL_SECRET", INTERNAL);
  });
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

  it("rejects cross-origin and missing-origin browser posts", () => {
    expect(() => assertTrustedBookingPost(request("https://attacker.example"))).toThrow();
    const missing = new NextRequest("https://openeire.test/api/book/exchange", { method: "POST", headers: { Host: "openeire.test" }, body: "{}" });
    expect(() => assertTrustedBookingPost(missing)).toThrow();
  });

  it("accepts the canonical origin behind the trusted Render host", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://openeire.ie");
    vi.stubEnv("RENDER_EXTERNAL_HOSTNAME", "openeire-next.onrender.com");
    const production = new NextRequest("http://0.0.0.0:10000/api/book/exchange", {
      method: "POST",
      headers: { Origin: "https://openeire.ie", Host: "openeire-next.onrender.com", "X-Forwarded-Host": "openeire.ie", "X-Forwarded-Proto": "https" },
      body: "{}",
    });
    expect(assertTrustedBookingPost(production)).toBe("https://openeire.ie");
  });

  it("joins production API bases with and without a trailing slash exactly once", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const fetchMock = vi.fn(() => Promise.resolve(new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } })));
    vi.stubGlobal("fetch", fetchMock);
    for (const base of ["https://api.openeire.ie/api", "https://api.openeire.ie/api/"]) {
      vi.stubEnv("OPENEIRE_API_BASE_URL", base);
      await bookingBackendPost("session", { session: "fictional" }, "https://openeire.ie");
    }
    expect(fetchMock.mock.calls.map(call => String((call as unknown[])[0]))).toEqual([
      "https://api.openeire.ie/api/real-estate/booking/session/",
      "https://api.openeire.ie/api/real-estate/booking/session/",
    ]);
  });

  it("rejects production HTTP, missing-api and unsupported endpoints", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("OPENEIRE_API_BASE_URL", "http://api.openeire.ie/api");
    await expect(bookingBackendPost("session", {}, "https://openeire.ie")).rejects.toThrow();
    vi.stubEnv("OPENEIRE_API_BASE_URL", "https://api.openeire.ie");
    await expect(bookingBackendPost("session", {}, "https://openeire.ie")).rejects.toThrow();
    vi.stubEnv("OPENEIRE_API_BASE_URL", "https://api.openeire.ie/api");
    await expect(bookingBackendPost("other", {}, "https://openeire.ie")).rejects.toThrow();
  });

  it("fails closed when the frontend flag or required server configuration is absent", async () => {
    vi.stubEnv("REAL_ESTATE_BOOKING_PORTAL_ENABLED", "false");
    expect(() => assertTrustedBookingPost(request())).toThrow();
    vi.stubEnv("REAL_ESTATE_BOOKING_PORTAL_ENABLED", "true");
    vi.stubEnv("REAL_ESTATE_BOOKING_INTERNAL_SECRET", "");
    await expect(bookingBackendPost("session", {}, "https://openeire.test")).rejects.toThrow();
  });

  it("accepts session and enquiry posts only under realistic trusted Render headers", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://openeire.ie");
    vi.stubEnv("RENDER_EXTERNAL_HOSTNAME", "openeire-next.onrender.com");
    vi.stubEnv("OPENEIRE_API_BASE_URL", "https://api.openeire.ie/api");
    const fetchMock = vi.fn()
      .mockImplementationOnce(() => Promise.resolve(new Response(JSON.stringify({ state: "valid", client: { display_name: "Fictional" } }), { status: 200, headers: { "Content-Type": "application/json" } })))
      .mockImplementationOnce(() => Promise.resolve(new Response(JSON.stringify({ state: "submitted", duplicate: false }), { status: 201, headers: { "Content-Type": "application/json" } })));
    vi.stubGlobal("fetch", fetchMock);
    const trustedHeaders = {
      Origin: "https://openeire.ie", Host: "openeire-next.onrender.com",
      "X-Forwarded-Host": "openeire.ie", "X-Forwarded-Proto": "https",
      Cookie: "__Host-openeire_booking_access=fictional-session",
    };
    const sessionResponse = await sessionBooking(new NextRequest("http://0.0.0.0:10000/api/book/session", { method: "POST", headers: trustedHeaders }));
    const enquiryResponse = await submitBooking(new NextRequest("http://0.0.0.0:10000/api/book/enquiries", { method: "POST", headers: { ...trustedHeaders, "Content-Type": "application/json" }, body: JSON.stringify({ submission_id: "22222222-2222-4222-8222-222222222222" }) }));
    expect(sessionResponse.status).toBe(200);
    expect(enquiryResponse.status).toBe(201);
    expect(fetchMock.mock.calls.map(call => String((call as unknown[])[0]))).toEqual([
      "https://api.openeire.ie/api/real-estate/booking/session/",
      "https://api.openeire.ie/api/real-estate/booking/enquiries/",
    ]);
  });

  it("rejects www and spoofed forwarded values unless explicitly canonical", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://openeire.ie");
    vi.stubEnv("RENDER_EXTERNAL_HOSTNAME", "openeire-next.onrender.com");
    expect(() => assertTrustedBookingPost(new NextRequest("https://www.openeire.ie/api/book/exchange", { method: "POST", headers: { Origin: "https://www.openeire.ie", Host: "www.openeire.ie" }, body: "{}" }))).toThrow();
    expect(() => assertTrustedBookingPost(new NextRequest("http://0.0.0.0:10000/api/book/exchange", { method: "POST", headers: { Origin: "https://openeire.ie", Host: "openeire-next.onrender.com", "X-Forwarded-Host": "attacker.example", "X-Forwarded-Proto": "https" }, body: "{}" }))).toThrow();
  });

  it("sets a hardened production booking cookie and forwards only through the booking secret", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://openeire.ie");
    const fetchMock = vi.fn(() => Promise.resolve(new Response(JSON.stringify({ state: "valid", session: "signed-fictional-session", expires_in: 120 }), { status: 200, headers: { "Content-Type": "application/json" } })));
    vi.stubGlobal("fetch", fetchMock);
    const response = await exchangeBooking(new NextRequest("https://openeire.ie/api/book/exchange", {
      method: "POST", headers: { Origin: "https://openeire.ie", Host: "openeire.ie", "Content-Type": "application/json" },
      body: JSON.stringify({ public_id: PUBLIC_ID, secret: "fictional-fragment" }),
    }));
    const cookie = response.headers.get("set-cookie") ?? "";
    expect(cookie).toContain("__Host-openeire_booking_access");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Secure");
    expect(cookie.toLowerCase()).toContain("samesite=strict");
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/real-estate/booking/exchange/"), expect.objectContaining({ headers: expect.objectContaining({ "X-OpenEire-Booking-Internal": INTERNAL }) }));
  });

  it("logs only fixed failure categories", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    await exchangeBooking(request("https://attacker.example"));
    expect(consoleError).toHaveBeenCalledWith("booking_failure", { category: "invalid_origin" });
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(PUBLIC_ID);
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain("fictional-fragment");
  });
});
