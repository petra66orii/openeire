import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { assertTrustedBookingPost, bookingBackendPost, bookingCookieName, bookingNoStoreHeaders, logBookingFailure } from "@/lib/booking/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const origin = assertTrustedBookingPost(request);
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid request");
    const input = body as Record<string, unknown>;
    if (typeof input.public_id !== "string" || typeof input.secret !== "string" || input.secret.length > 2048) throw new Error("Invalid request");
    const backend = await bookingBackendPost("exchange", { public_id: input.public_id, secret: input.secret }, origin);
    if (!backend.ok || typeof backend.payload.session !== "string") {
      logBookingFailure("backend_response");
      return NextResponse.json({ state: "unavailable" }, { status: backend.status, headers: bookingNoStoreHeaders });
    }
    const maxAge = typeof backend.payload.expires_in === "number" ? Math.max(1, Math.min(43_200, backend.payload.expires_in)) : 43_200;
    const response = NextResponse.json({ state: "valid" }, { headers: bookingNoStoreHeaders });
    response.cookies.set(bookingCookieName(), backend.payload.session, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge,
    });
    return response;
  } catch (error) {
    logBookingFailure(error);
    return NextResponse.json({ state: "unavailable" }, { status: 400, headers: bookingNoStoreHeaders });
  }
}
