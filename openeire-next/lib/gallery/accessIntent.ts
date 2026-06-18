const REQUESTED_EMAIL_KEY = "galleryRequestedEmail";
const PENDING_CODE_KEY = "pendingGalleryAccessCode";
const REDIRECT_KEY = "pendingGalleryRedirect";

const isBrowser = () => typeof window !== "undefined";

const normalizeEmail = (value?: string | null): string =>
  (value ?? "").trim().toLowerCase();

export const getRequestedGalleryEmail = (): string => {
  if (!isBrowser()) return "";
  return normalizeEmail(sessionStorage.getItem(REQUESTED_EMAIL_KEY));
};

export const setRequestedGalleryEmail = (email: string): void => {
  if (!isBrowser()) return;
  const normalized = normalizeEmail(email);
  if (!normalized) return;
  sessionStorage.setItem(REQUESTED_EMAIL_KEY, normalized);
};

export const getPendingGalleryCode = (): string => {
  if (!isBrowser()) return "";
  return (sessionStorage.getItem(PENDING_CODE_KEY) ?? "").trim().toUpperCase();
};

export const setPendingGalleryCode = (code: string): void => {
  if (!isBrowser()) return;
  const normalized = code.trim().toUpperCase();
  if (!normalized) return;
  sessionStorage.setItem(PENDING_CODE_KEY, normalized);
};

export const getPendingGalleryRedirect = (): string => {
  if (!isBrowser()) return "";
  const value = sessionStorage.getItem(REDIRECT_KEY) ?? "";
  return value.startsWith("/") && !value.startsWith("//") ? value : "";
};

export const setPendingGalleryRedirect = (path: string): void => {
  if (!isBrowser()) return;
  if (!path.startsWith("/") || path.startsWith("//")) return;
  sessionStorage.setItem(REDIRECT_KEY, path);
};

export const clearGalleryAccessIntent = (): void => {
  if (!isBrowser()) return;
  sessionStorage.removeItem(REQUESTED_EMAIL_KEY);
  sessionStorage.removeItem(PENDING_CODE_KEY);
  sessionStorage.removeItem(REDIRECT_KEY);
};
