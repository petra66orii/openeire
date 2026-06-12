import { API_BASE_URL } from "../config/backend";

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  headers: Headers;
  url: string;
}

export interface ApiRequestConfig {
  params?: Record<string, unknown>;
  headers?: HeadersInit;
  signal?: AbortSignal;
  data?: unknown;
  body?: BodyInit | null;
}

export class ApiError extends Error {
  response?: ApiResponse;
  request: {
    method: string;
    url: string;
  };
  code?: string;

  constructor({
    message,
    response,
    request,
    code,
  }: {
    message: string;
    response?: ApiResponse;
    request: ApiError["request"];
    code?: string;
  }) {
    super(message);
    this.name = "ApiError";
    this.response = response;
    this.request = request;
    this.code = code;
  }
}

export const isApiError = (error: unknown): error is ApiError =>
  error instanceof ApiError;

const isAbsoluteUrl = (value: string): boolean =>
  value.startsWith("http://") || value.startsWith("https://");

const isBodyInit = (value: unknown): value is BodyInit =>
  (typeof Blob !== "undefined" && value instanceof Blob) ||
  (typeof FormData !== "undefined" && value instanceof FormData) ||
  (typeof URLSearchParams !== "undefined" && value instanceof URLSearchParams) ||
  (typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer) ||
  (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView(value)) ||
  (typeof ReadableStream !== "undefined" && value instanceof ReadableStream) ||
  typeof value === "string";

const buildUrl = (
  path: string,
  params?: Record<string, unknown>,
): string => {
  const baseUrl = isAbsoluteUrl(path)
    ? path
    : `${API_BASE_URL}${path.replace(/^\/+/, "")}`;
  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "http://localhost";
  const url = new URL(baseUrl, origin);

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      for (const entry of value) {
        if (entry !== undefined && entry !== null && entry !== "") {
          url.searchParams.append(key, String(entry));
        }
      }
      continue;
    }
    url.searchParams.set(key, String(value));
  }

  return isAbsoluteUrl(baseUrl)
    ? url.toString()
    : `${url.pathname}${url.search}${url.hash}`;
};

const parseResponseBody = async (response: Response): Promise<unknown> => {
  if (response.status === 204 || response.status === 205) {
    return undefined;
  }

  const text = await response.text();
  if (!text) return undefined;

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  return text;
};

const getErrorMessage = (payload: unknown, fallback: string): string => {
  if (typeof payload === "string" && payload.trim()) return payload.trim();
  if (!payload || typeof payload !== "object") return fallback;

  const record = payload as Record<string, unknown>;
  for (const key of ["detail", "message", "error"]) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return fallback;
};

const createRequestBody = (
  data: unknown,
  explicitBody: BodyInit | null | undefined,
): {
  body?: BodyInit | null;
  shouldSetJsonContentType: boolean;
} => {
  if (explicitBody !== undefined) {
    return { body: explicitBody, shouldSetJsonContentType: false };
  }
  if (data === undefined || data === null) {
    return { body: undefined, shouldSetJsonContentType: false };
  }
  if (isBodyInit(data)) {
    return { body: data, shouldSetJsonContentType: false };
  }
  return { body: JSON.stringify(data), shouldSetJsonContentType: true };
};

const request = async <T>(
  method: string,
  path: string,
  config: ApiRequestConfig = {},
): Promise<ApiResponse<T>> => {
  const url = buildUrl(path, config.params);
  const requestInfo = { method, url };
  const headers = new Headers(config.headers);
  const token =
    typeof sessionStorage !== "undefined"
      ? sessionStorage.getItem("accessToken")
      : null;
  const { body, shouldSetJsonContentType } = createRequestBody(
    config.data,
    config.body,
  );

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (shouldSetJsonContentType && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: method === "GET" || method === "HEAD" ? undefined : body,
      signal: config.signal,
    });
    const data = await parseResponseBody(response);
    const apiResponse: ApiResponse<T> = {
      data: data as T,
      status: response.status,
      headers: response.headers,
      url,
    };

    if (!response.ok) {
      throw new ApiError({
        message: getErrorMessage(data, `Request failed with status ${response.status}.`),
        response: apiResponse,
        request: requestInfo,
      });
    }

    return apiResponse;
  } catch (error) {
    if (isApiError(error)) throw error;

    const isCancelled =
      error instanceof DOMException && error.name === "AbortError";
    throw new ApiError({
      message: isCancelled ? "Request cancelled." : "Network request failed.",
      request: requestInfo,
      code: isCancelled ? "ERR_CANCELED" : "ERR_NETWORK",
    });
  }
};

export const api = {
  get: <T>(path: string, config?: ApiRequestConfig) =>
    request<T>("GET", path, config),
  post: <T>(path: string, data?: unknown, config?: ApiRequestConfig) =>
    request<T>("POST", path, { ...config, data }),
  put: <T>(path: string, data?: unknown, config?: ApiRequestConfig) =>
    request<T>("PUT", path, { ...config, data }),
  patch: <T>(path: string, data?: unknown, config?: ApiRequestConfig) =>
    request<T>("PATCH", path, { ...config, data }),
  delete: <T>(path: string, config?: ApiRequestConfig) =>
    request<T>("DELETE", path, config),
};
