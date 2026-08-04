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

const wantsJsonResponse = (request: NextRequest): boolean =>
  request.headers
    .get("accept")
    ?.split(",")
    .some((value) => value.trim().split(";", 1)[0] === "application/json") ??
  false;

const failedDownloadResponse = (
  request: NextRequest,
  returnPath: string,
  asJson: boolean,
  status = 400,
) =>
  asJson
    ? NextResponse.json(
        { state: "unavailable" },
        { status, headers: noStoreHeaders },
      )
    : NextResponse.redirect(
        new URL(`${returnPath}?download=failed`, request.url),
        { status: 303, headers: noStoreHeaders },
      );

export async function POST(request: NextRequest) {
  let returnPath = "/delivery/unavailable";
  const asJson = wantsJsonResponse(request);
  try {
    const origin = assertTrustedDeliveryPost(request);
    let deliverableId = "";
    let recipientPublicId = "";
    if (request.headers.get("content-type")?.includes("application/json")) {
      const body: unknown = await request.json();
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        throw new Error("Unavailable");
      }
      const input = body as Record<string, unknown>;
      deliverableId =
        typeof input.deliverable_id === "string" ? input.deliverable_id : "";
    } else {
      const form = await request.formData();
      deliverableId = String(form.get("deliverable_id") ?? "");
      recipientPublicId = String(form.get("recipient_public_id") ?? "");
    }
    if (PUBLIC_ID.test(recipientPublicId)) {
      returnPath = `/delivery/${recipientPublicId}`;
    }
    const session = request.cookies.get(DELIVERY_COOKIE)?.value;
    if (!session || !PUBLIC_ID.test(deliverableId)) throw new Error("Unavailable");
    const backend = await deliveryBackendPost(
      "download",
      { session, deliverable_id: deliverableId },
      origin,
      { redirect: "manual" },
    );
    const redirectUrl = backend.redirectUrl ?? backend.payload.redirect_url;
    const backendAllowsRedirect = backend.ok || backend.status === 303;
    if (!backendAllowsRedirect || typeof redirectUrl !== "string") {
      logDeliveryFailure("backend_response");
      return failedDownloadResponse(
        request,
        returnPath,
        asJson,
        backend.status >= 400 ? backend.status : 502,
      );
    }
    let parsed: URL;
    try {
      parsed = new URL(redirectUrl);
    } catch {
      logDeliveryFailure("backend_response");
      return failedDownloadResponse(request, returnPath, asJson, 502);
    }
    if (parsed.protocol !== "https:" && process.env.NODE_ENV === "production") {
      logDeliveryFailure("backend_response");
      return failedDownloadResponse(request, returnPath, asJson, 502);
    }
    if (asJson) {
      return NextResponse.json(
        { download_url: parsed.toString() },
        { headers: noStoreHeaders },
      );
    }
    return NextResponse.redirect(parsed, {
      status: 303,
      headers: noStoreHeaders,
    });
  } catch (error) {
    logDeliveryFailure(error);
    return failedDownloadResponse(request, returnPath, asJson);
  }
}
