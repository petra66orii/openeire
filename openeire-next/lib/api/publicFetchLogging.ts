import { isApiError } from "@/lib/api/client";

const RESPONSE_PREVIEW_LIMIT = 300;

const toSafePreview = (payload: unknown): string | undefined => {
  if (payload === undefined || payload === null) return undefined;

  let text: string;
  if (typeof payload === "string") {
    text = payload;
  } else {
    try {
      text =
        JSON.stringify(payload, (_key, value) =>
          typeof value === "string" && value.length > RESPONSE_PREVIEW_LIMIT
            ? `${value.slice(0, RESPONSE_PREVIEW_LIMIT)}...`
            : value,
        ) ?? String(payload);
    } catch {
      text = String(payload);
    }
  }

  return text.slice(0, RESPONSE_PREVIEW_LIMIT);
};

export const logPublicApiFetchFailure = (
  context: string,
  endpointPath: string,
  error: unknown,
): void => {
  if (typeof window !== "undefined") return;

  if (isApiError(error)) {
    console.error("[public-api-fetch-failed]", {
      context,
      endpointPath,
      finalUrl: error.request.url,
      method: error.request.method,
      status: error.response?.status,
      responsePreview: toSafePreview(error.response?.data),
      code: error.code,
      message: error.message,
    });
    return;
  }

  console.error("[public-api-fetch-failed]", {
    context,
    endpointPath,
    message: error instanceof Error ? error.message : "Unknown error",
  });
};
