import { getApiBaseUrlForRequest, isAbsoluteUrl } from "@/lib/api/config";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  updateAccessToken,
} from "@/lib/auth/tokenStorage";
import { getSiteUrl } from "@/lib/site";

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
  accessToken?: string | null;
  skipAuthRefresh?: boolean;
  retryOnAuthRefresh?: boolean;
  _retry?: boolean;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  publicFetchContext?: string;
}

export class ApiError extends Error {
  response?: ApiResponse;
  request: { method: string; url: string };
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

const buildUrl = (path: string, params?: Record<string, unknown>): string => {
  const apiBaseUrl = getApiBaseUrlForRequest();
  const baseUrl = isAbsoluteUrl(path)
    ? path
    : `${apiBaseUrl}${path.replace(/^\/+/, "")}`;
  const url = new URL(baseUrl, getSiteUrl());

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

  return isAbsoluteUrl(baseUrl) || typeof window === "undefined"
    ? url.toString()
    : `${url.pathname}${url.search}${url.hash}`;
};

const parseResponseBody = async (response: Response): Promise<unknown> => {
  if (response.status === 204 || response.status === 205) return undefined;

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
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return fallback;
};

const isBodyInit = (value: unknown): value is BodyInit =>
  (typeof Blob !== "undefined" && value instanceof Blob) ||
  (typeof FormData !== "undefined" && value instanceof FormData) ||
  (typeof URLSearchParams !== "undefined" && value instanceof URLSearchParams) ||
  (typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer) ||
  (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView(value)) ||
  (typeof ReadableStream !== "undefined" && value instanceof ReadableStream) ||
  typeof value === "string";

const SAFE_AUTH_REFRESH_RETRY_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const SERVER_PUBLIC_FETCH_USER_AGENT = "OpenEire-Next-SSR/1.0";

const canRetryAfterAuthRefresh = (
  method: string,
  config: ApiRequestConfig,
): boolean =>
  Boolean(
    config.retryOnAuthRefresh ||
      SAFE_AUTH_REFRESH_RETRY_METHODS.has(method.toUpperCase()),
  );

const isRefreshPayload = (
  value: unknown,
): value is { access: string; refresh?: string } => {
  if (!value || typeof value !== "object") return false;
  const payload = value as { access?: unknown; refresh?: unknown };
  return (
    typeof payload.access === "string" &&
    payload.access.length > 0 &&
    (payload.refresh === undefined || typeof payload.refresh === "string")
  );
};

const createRequestBody = (
  data: unknown,
  explicitBody: BodyInit | null | undefined,
): { body?: BodyInit | null; shouldSetJsonContentType: boolean } => {
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
  const isServerRequest = typeof window === "undefined";
  const internalSecret = isServerRequest
    ? process.env.OPENEIRE_INTERNAL_API_SECRET
    : undefined;

  if (isServerRequest) {
    headers.set("User-Agent", SERVER_PUBLIC_FETCH_USER_AGENT);
    if (internalSecret) headers.set("X-OpenEire-Internal", internalSecret);
  }

  const { body, shouldSetJsonContentType } = createRequestBody(
    config.data,
    config.body,
  );

  const browserAccessToken =
    typeof window !== "undefined" ? getAccessToken() : null;
  const accessToken =
    config.accessToken !== undefined ? config.accessToken : browserAccessToken;

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  if (shouldSetJsonContentType && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (isServerRequest && config.publicFetchContext) {
    console.info("[server-public-fetch-debug]", {
      context: config.publicFetchContext,
      finalUrl: url,
      isServer: true,
      hasInternalSecret: Boolean(internalSecret),
      hasInternalHeader: headers.has("X-OpenEire-Internal"),
      userAgentSet: headers.has("User-Agent"),
    });
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: method === "GET" || method === "HEAD" ? undefined : body,
      signal: config.signal,
      cache: config.cache,
      next: config.next,
    });
    const data = await parseResponseBody(response);
    const apiResponse: ApiResponse<T> = {
      data: data as T,
      status: response.status,
      headers: response.headers,
      url,
    };

    if (
      response.status === 401 &&
      !config.skipAuthRefresh &&
      !config._retry &&
      typeof window !== "undefined" &&
      accessToken &&
      canRetryAfterAuthRefresh(method, config)
    ) {
      const refreshedToken = await refreshBrowserAccessToken();
      if (refreshedToken) {
        return request<T>(method, path, {
          ...config,
          accessToken: refreshedToken,
          _retry: true,
        });
      }
    }

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

let refreshPromise: Promise<string | null> | null = null;

const refreshBrowserAccessToken = async (): Promise<string | null> => {
  const refresh = getRefreshToken();
  if (!refresh) {
    clearTokens();
    return null;
  }

  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = performRefreshRequest(refresh).finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
};

const performRefreshRequest = async (refresh: string): Promise<string | null> => {
  try {
    const url = buildUrl("auth/token/refresh/");
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    const data = await parseResponseBody(response);

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        clearTokens();
      }
      return null;
    }

    if (!isRefreshPayload(data)) {
      clearTokens();
      return null;
    }

    updateAccessToken(data.access, data.refresh);
    return data.access;
  } catch {
    return null;
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
