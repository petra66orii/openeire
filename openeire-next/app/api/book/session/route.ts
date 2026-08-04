import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { assertTrustedBookingPost, bookingBackendPost, bookingCookieName, bookingNoStoreHeaders, logBookingFailure } from "@/lib/booking/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const origin = assertTrustedBookingPost(request);
    const session = request.cookies.get(bookingCookieName())?.value;
    if (!session) return NextResponse.json({ state: "unavailable" }, { status: 404, headers: bookingNoStoreHeaders });
    const backend = await bookingBackendPost("session", { session }, origin);
    if (!backend.ok) logBookingFailure("backend_response");
    return NextResponse.json(backend.ok ? backend.payload : { state: "unavailable" }, { status: backend.status, headers: bookingNoStoreHeaders });
  } catch (error) {
    logBookingFailure(error);
    return NextResponse.json({ state: "unavailable" }, { status: 400, headers: bookingNoStoreHeaders });
  }
}
