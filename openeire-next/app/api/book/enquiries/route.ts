import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { assertTrustedBookingPost, bookingBackendPost, bookingCookieName, bookingNoStoreHeaders, logBookingFailure } from "@/lib/booking/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const origin = assertTrustedBookingPost(request);
    const session = request.cookies.get(bookingCookieName())?.value;
    if (!session) return NextResponse.json({ state: "unavailable" }, { status: 404, headers: bookingNoStoreHeaders });
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid request");
    const backend = await bookingBackendPost("enquiries", { ...(body as Record<string, unknown>), session }, origin);
    if (!backend.ok && backend.status === 404) {
      logBookingFailure("backend_response");
      return NextResponse.json({ state: "unavailable" }, { status: 404, headers: bookingNoStoreHeaders });
    }
    return NextResponse.json(backend.payload, { status: backend.status, headers: bookingNoStoreHeaders });
  } catch (error) {
    logBookingFailure(error);
    return NextResponse.json({ state: "unavailable" }, { status: 400, headers: bookingNoStoreHeaders });
  }
}
