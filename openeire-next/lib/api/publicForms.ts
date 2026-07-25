import { api, isApiError } from "@/lib/api/client";
import type {
  ContactData,
  NewsletterSignupPayload,
  RealEstateEnquiryPayload,
} from "@/types/publicForms";

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string => {
  const payload = isApiError(error) ? error.response?.data : error;

  if (typeof payload === "string" && payload.trim()) {
    return payload.trim();
  }

  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const record = payload as Record<string, unknown>;
  for (const key of ["detail", "message", "error"]) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  const fieldMessage = Object.entries(record)
    .map(([field, value]) => {
      if (Array.isArray(value)) {
        const message = value.filter(Boolean).join(" ");
        return message ? `${field}: ${message}` : null;
      }
      if (typeof value === "string" && value.trim()) {
        return `${field}: ${value.trim()}`;
      }
      return null;
    })
    .find(Boolean);

  return fieldMessage ?? fallback;
};

export const getApiFieldErrors = (error: unknown): Record<string, string> => {
  const payload = isApiError(error) ? error.response?.data : error;
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(payload as Record<string, unknown>).flatMap(
      ([field, value]) => {
        const message = Array.isArray(value)
          ? value.filter(Boolean).join(" ")
          : typeof value === "string"
            ? value.trim()
            : "";
        return message ? [[field, message]] : [];
      },
    ),
  );
};

export const sendContactMessage = async (payload: ContactData) => {
  const response = await api.post("home/contact/", payload);
  return response.data;
};

export const newsletterSignup = async (payload: NewsletterSignupPayload) => {
  const response = await api.post<{ email: string }>(
    "home/newsletter-signup/",
    payload,
  );
  return response.data;
};

export const submitRealEstateEnquiry = async (
  payload: RealEstateEnquiryPayload,
) => {
  const response = await api.post("real-estate/enquiries/", payload);
  return response.data;
};
