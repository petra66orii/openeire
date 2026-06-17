import type { LoginResponse } from "@/types/auth";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const GALLERY_ACCESS_KEY = "gallery_access";
const REQUESTED_GALLERY_EMAIL_KEY = "galleryRequestedEmail";
const PENDING_GALLERY_CODE_KEY = "pendingGalleryAccessCode";
const PENDING_GALLERY_REDIRECT_KEY = "pendingGalleryRedirect";

const isBrowser = () => typeof window !== "undefined";

export const getAccessToken = (): string | null => {
  if (!isBrowser()) return null;
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  if (!isBrowser()) return null;
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setTokens = ({ access, refresh }: LoginResponse) => {
  if (!isBrowser()) return;
  sessionStorage.setItem(ACCESS_TOKEN_KEY, access);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(GALLERY_ACCESS_KEY);
};

export const updateAccessToken = (access: string, refresh?: string) => {
  if (!isBrowser()) return;
  sessionStorage.setItem(ACCESS_TOKEN_KEY, access);
  if (refresh) {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }
};

export const clearTokens = () => {
  if (!isBrowser()) return;
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(REQUESTED_GALLERY_EMAIL_KEY);
  sessionStorage.removeItem(PENDING_GALLERY_CODE_KEY);
  sessionStorage.removeItem(PENDING_GALLERY_REDIRECT_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(GALLERY_ACCESS_KEY);
};

export const migrateLegacyLocalStorageTokens = () => {
  if (!isBrowser()) return;

  const legacyAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const legacyRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!getAccessToken() && legacyAccessToken) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, legacyAccessToken);
  }
  if (!getRefreshToken() && legacyRefreshToken) {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, legacyRefreshToken);
  }

  if (legacyAccessToken || legacyRefreshToken) {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  localStorage.removeItem(GALLERY_ACCESS_KEY);
};

export const getRequestedGalleryEmail = (): string => {
  if (!isBrowser()) return "";
  return (sessionStorage.getItem(REQUESTED_GALLERY_EMAIL_KEY) ?? "")
    .trim()
    .toLowerCase();
};
