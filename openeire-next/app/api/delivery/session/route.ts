import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  assertTrustedDeliveryPost,
  DELIVERY_COOKIE,
  deliveryBackendPost,
  noStoreHeaders,
} from "@/lib/delivery/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const origin = assertTrustedDeliveryPost(request);
    const session = request.cookies.get(DELIVERY_COOKIE)?.value;
    if (!session) {
      return NextResponse.json(
        { state: "unavailable" },
        { status: 404, headers: noStoreHeaders },
      );
    }
    const backend = await deliveryBackendPost("session", { session }, origin);
    return NextResponse.json(
      backend.ok ? backend.payload : { state: backend.payload.state ?? "unavailable" },
      { status: backend.status, headers: noStoreHeaders },
    );
  } catch {
    return NextResponse.json(
      { state: "unavailable" },
      { status: 400, headers: noStoreHeaders },
    );
  }
}
