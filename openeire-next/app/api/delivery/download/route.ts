import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  assertTrustedDeliveryPost,
  DELIVERY_COOKIE,
  deliveryBackendPost,
  logDeliveryFailure,
  noStoreHeaders,
} from "@/lib/delivery/server";

export const dynamic = "force-dynamic";
const PUBLIC_ID = /^[0-9a-f-]{36}$/i;

export async function POST(request: NextRequest) {
  let returnPath = "/delivery/unavailable";
  try {
    const origin = assertTrustedDeliveryPost(request);
    const form = await request.formData();
    const deliverableId = String(form.get("deliverable_id") ?? "");
    const recipientPublicId = String(form.get("recipient_public_id") ?? "");
    if (PUBLIC_ID.test(recipientPublicId)) {
      returnPath = `/delivery/${recipientPublicId}`;
    }
    const session = request.cookies.get(DELIVERY_COOKIE)?.value;
    if (!session || !PUBLIC_ID.test(deliverableId)) throw new Error("Unavailable");
    const backend = await deliveryBackendPost(
      "download",
      { session, deliverable_id: deliverableId },
      origin,
    );
    const redirectUrl = backend.payload.redirect_url;
    if (!backend.ok || typeof redirectUrl !== "string") {
      logDeliveryFailure("backend_response");
      return NextResponse.redirect(
        new URL(`${returnPath}?download=failed`, request.url),
        { status: 303, headers: noStoreHeaders },
      );
    }
    const parsed = new URL(redirectUrl);
    if (parsed.protocol !== "https:" && process.env.NODE_ENV === "production") {
      throw new Error("Unavailable");
    }
    return NextResponse.redirect(parsed, {
      status: 303,
      headers: noStoreHeaders,
    });
  } catch (error) {
    logDeliveryFailure(error);
    return NextResponse.redirect(
      new URL(`${returnPath}?download=failed`, request.url),
      { status: 303, headers: noStoreHeaders },
    );
  }
}
