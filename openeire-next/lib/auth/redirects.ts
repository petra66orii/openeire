const DEFAULT_AUTH_REDIRECT = "/profile";
const FORBIDDEN_RETURN_PATHS = new Set([
  "/login",
  "/register",
  "/logout",
  "/request-password-reset",
  "/verify-pending",
]);

export const getSafeReturnPath = (
  value: string | null | undefined,
  fallback = DEFAULT_AUTH_REDIRECT,
): string => {
  if (!value) return fallback;

  try {
    const parsed = new URL(value, "https://openeire.ie");
    if (parsed.origin !== "https://openeire.ie") return fallback;
    if (!parsed.pathname.startsWith("/")) return fallback;
    if (parsed.pathname.startsWith("//")) return fallback;
    if (FORBIDDEN_RETURN_PATHS.has(parsed.pathname)) return fallback;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    if (!value.startsWith("/") || value.startsWith("//")) return fallback;
    const [pathname] = value.split(/[?#]/);
    if (FORBIDDEN_RETURN_PATHS.has(pathname)) return fallback;
    return value;
  }
};
