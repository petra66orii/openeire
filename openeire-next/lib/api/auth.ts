import { api, isApiError } from "@/lib/api/client";
import type {
  ApiErrorResponse,
  LoginPayload,
  LoginResponse,
  MessageResponse,
  PasswordResetConfirmPayload,
  PasswordResetRequestPayload,
  RefreshResponse,
  RegisterPayload,
  RegisterResponse,
  UserProfile,
  VerifyEmailPayload,
} from "@/types/auth";

export const normalizeAuthErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string => {
  const payload = isApiError(error) ? error.response?.data : error;
  const status = isApiError(error) ? error.response?.status : undefined;

  if (typeof payload === "string" && payload.trim()) return payload.trim();

  if (payload && typeof payload === "object") {
    const record = payload as ApiErrorResponse;
    for (const key of ["detail", "message", "error"]) {
      const value = record[key];
      if (typeof value === "string" && value.trim()) {
        if (/no active account found with the given credentials/i.test(value)) {
          return "Email or password is incorrect, or your account has not been verified yet.";
        }
        return value.trim();
      }
    }

    for (const key of [
      "email",
      "username",
      "password",
      "confirm_password",
      "non_field_errors",
    ]) {
      const value = record[key];
      if (Array.isArray(value)) {
        const message = value.filter(Boolean).join(" ");
        if (message) return message;
      }
      if (typeof value === "string" && value.trim()) return value.trim();
    }
  }

  if (status === 401) {
    return "Email or password is incorrect, or your account has not been verified yet.";
  }
  if (status === 429) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  if (status === 503) {
    return "This service is temporarily unavailable. Please try again shortly.";
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

export { isApiError };

export const loginUser = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("auth/login/", payload, {
    skipAuthRefresh: true,
  });
  return response.data;
};

export const registerUser = async (
  payload: RegisterPayload,
): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>(
    "auth/register/",
    {
      username: payload.username,
      email: payload.email,
      password: payload.password,
    },
    { skipAuthRefresh: true },
  );
  return response.data;
};

export const refreshAccessToken = async (
  refresh: string,
): Promise<RefreshResponse> => {
  const response = await api.post<RefreshResponse>(
    "auth/token/refresh/",
    { refresh },
    { skipAuthRefresh: true },
  );
  return response.data;
};

export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>("auth/profile/");
  return response.data;
};

export const verifyEmail = async (
  payload: VerifyEmailPayload,
): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(
    "auth/verify-email/confirm/",
    payload,
    { skipAuthRefresh: true },
  );
  return response.data;
};

export const requestPasswordReset = async (
  payload: PasswordResetRequestPayload,
): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(
    "auth/password/reset/",
    payload,
    { skipAuthRefresh: true },
  );
  return response.data;
};

export const confirmPasswordReset = async (
  payload: PasswordResetConfirmPayload,
): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(
    "auth/password/reset/confirm/",
    payload,
    { skipAuthRefresh: true },
  );
  return response.data;
};

export const resendVerificationEmail = async (
  email: string,
): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(
    "auth/resend-verification/",
    { email },
    { skipAuthRefresh: true },
  );
  return response.data;
};
