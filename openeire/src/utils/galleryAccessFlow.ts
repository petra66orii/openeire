const REQUESTED_EMAIL_KEY = "galleryRequestedEmail";
const PENDING_CODE_KEY = "pendingGalleryAccessCode";
const REDIRECT_KEY = "pendingGalleryRedirect";

const normalizeEmail = (value?: string | null): string => {
  return (value ?? "").trim().toLowerCase();
};

export const getRequestedGalleryEmail = (): string => {
  return normalizeEmail(sessionStorage.getItem(REQUESTED_EMAIL_KEY));
};

export const setRequestedGalleryEmail = (email: string): void => {
  const normalized = normalizeEmail(email);
  if (!normalized) return;
  sessionStorage.setItem(REQUESTED_EMAIL_KEY, normalized);
};

export const clearRequestedGalleryEmail = (): void => {
  sessionStorage.removeItem(REQUESTED_EMAIL_KEY);
};

export const getPendingGalleryCode = (): string => {
  return (sessionStorage.getItem(PENDING_CODE_KEY) ?? "").trim().toUpperCase();
};

export const setPendingGalleryCode = (code: string): void => {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return;
  sessionStorage.setItem(PENDING_CODE_KEY, normalized);
};

export const clearPendingGalleryCode = (): void => {
  sessionStorage.removeItem(PENDING_CODE_KEY);
};

export const getPendingGalleryRedirect = (): string => {
  const value = sessionStorage.getItem(REDIRECT_KEY) ?? "";
  return value.startsWith("/") ? value : "";
};

export const setPendingGalleryRedirect = (path: string): void => {
  if (!path.startsWith("/")) return;
  sessionStorage.setItem(REDIRECT_KEY, path);
};

export const clearPendingGalleryRedirect = (): void => {
  sessionStorage.removeItem(REDIRECT_KEY);
};

export const clearGalleryAccessIntent = (): void => {
  clearRequestedGalleryEmail();
  clearPendingGalleryCode();
  clearPendingGalleryRedirect();
};

export const getGalleryAccessIntent = () => ({
  requestedEmail: getRequestedGalleryEmail(),
  pendingCode: getPendingGalleryCode(),
  redirectPath: getPendingGalleryRedirect(),
});
