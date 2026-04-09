import axios from "axios";
import toast, { ToastOptions } from "react-hot-toast";

export const toastInfo = (
  message: string,
  options?: Omit<ToastOptions, "icon">,
): string => {
  return toast(message, {
    ...options,
    icon: "i",
  });
};

interface ToastErrorOptions {
  fallback: string;
  fieldPriority?: string[];
  statusMessages?: Record<number, string>;
  detailMatchers?: Array<{
    match: string | RegExp;
    message: string;
  }>;
  networkMessage?: string;
}

type UnknownRecord = Record<string, unknown>;

const humanizeField = (field: string): string => {
  const normalized = field.replace(/_/g, " ").trim();
  if (!normalized) return "Field";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getStatusAndPayload = (
  error: unknown,
): { status?: number; payload?: unknown } => {
  if (axios.isAxiosError(error)) {
    return {
      status: error.response?.status,
      payload: error.response?.data,
    };
  }

  if (isRecord(error) && isRecord(error.response)) {
    return {
      status:
        typeof error.response.status === "number"
          ? error.response.status
          : undefined,
      payload: error.response.data,
    };
  }

  return {
    payload: error,
  };
};

const getStringValue = (value: unknown): string | null => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }
  return null;
};

const getArrayMessage = (value: unknown): string | null => {
  if (!Array.isArray(value)) return null;

  for (const entry of value) {
    const stringEntry = getStringValue(entry);
    if (stringEntry) return stringEntry;
  }

  return null;
};

const findFieldMessage = (
  payload: UnknownRecord,
  fieldPriority?: string[],
): string | null => {
  const orderedFields = fieldPriority ?? [];

  for (const field of orderedFields) {
    const message = getArrayMessage(payload[field]) ?? getStringValue(payload[field]);
    if (message) {
      return field === "non_field_errors"
        ? message
        : `${humanizeField(field)}: ${message}`;
    }
  }

  for (const [field, value] of Object.entries(payload)) {
    if (["detail", "message", "error", "status", "response"].includes(field)) {
      continue;
    }

    const message = getArrayMessage(value) ?? getStringValue(value);
    if (!message) continue;

    return field === "non_field_errors"
      ? message
      : `${humanizeField(field)}: ${message}`;
  }

  return null;
};

export const getToastErrorMessage = (
  error: unknown,
  options: ToastErrorOptions,
): string => {
  const { status, payload } = getStatusAndPayload(error);

  const directMessage = getStringValue(payload);
  if (directMessage) return directMessage;

  if (isRecord(payload)) {
    const detail = getStringValue(payload.detail);
    if (detail) {
      for (const matcher of options.detailMatchers ?? []) {
        const matches =
          typeof matcher.match === "string"
            ? detail.toLowerCase().includes(matcher.match.toLowerCase())
            : matcher.match.test(detail);
        if (matches) return matcher.message;
      }
      return detail;
    }

    const message =
      getStringValue(payload.message) ??
      getStringValue(payload.error) ??
      findFieldMessage(payload, options.fieldPriority);
    if (message) return message;
  }

  if (typeof status === "number" && options.statusMessages?.[status]) {
    return options.statusMessages[status];
  }

  if (error instanceof Error) {
    const message = getStringValue(error.message);
    if (message) return message;
  }

  return options.fallback;
};

export const getLoginToastErrorMessage = (error: unknown): string =>
  getToastErrorMessage(error, {
    fallback: "Unable to sign you in right now. Please try again.",
    fieldPriority: ["email", "username", "password", "non_field_errors"],
    detailMatchers: [
      {
        match: /no active account found with the given credentials/i,
        message:
          "Email or password is incorrect, or your account has not been verified yet.",
      },
    ],
    statusMessages: {
      401: "Email or password is incorrect, or your account has not been verified yet.",
      429: "Too many login attempts. Please wait a moment and try again.",
      503: "Login is temporarily unavailable. Please try again shortly.",
    },
  });

export const getResendVerificationToastErrorMessage = (error: unknown): string =>
  getToastErrorMessage(error, {
    fallback: "We couldn't resend the verification email. Please try again.",
    fieldPriority: ["email", "detail", "non_field_errors"],
    statusMessages: {
      429: "Too many resend attempts. Please wait a moment and try again.",
      503: "Verification email is temporarily unavailable. Please try again shortly.",
    },
  });

export const getRegistrationToastErrorMessage = (error: unknown): string =>
  getToastErrorMessage(error, {
    fallback: "Registration failed. Please review your details and try again.",
    fieldPriority: [
      "email",
      "username",
      "password",
      "first_name",
      "last_name",
      "non_field_errors",
    ],
    statusMessages: {
      429: "Too many registration attempts. Please wait a moment and try again.",
      503: "Registration is temporarily unavailable. Please try again shortly.",
    },
  });

export const getGoogleLoginToastErrorMessage = (error: unknown): string =>
  getToastErrorMessage(error, {
    fallback:
      "Google sign-in could not be completed right now. Please try again or use email and password.",
    fieldPriority: ["detail", "non_field_errors"],
    statusMessages: {
      503: "Google sign-in is temporarily unavailable. Please try again later.",
    },
  });

export const getLicenseRequestToastErrorMessage = (error: unknown): string =>
  getToastErrorMessage(error, {
    fallback:
      "Could not submit your license request. Please review the form and try again.",
    fieldPriority: [
      "email",
      "client_name",
      "project_type",
      "permitted_media",
      "territory",
      "duration",
      "message",
      "non_field_errors",
    ],
    statusMessages: {
      429: "You've reached the request limit for now. Please try again later.",
      503: "License requests are temporarily unavailable. Please try again shortly.",
    },
  });

export const getDownloadToastErrorMessage = (error: unknown): string =>
  getToastErrorMessage(error, {
    fallback: "Could not start the download. Please try again.",
    statusMessages: {
      403: "You do not have permission to download this file.",
      404: "This file could not be found. Please contact support if the issue persists.",
      410: "This download link has expired. Please contact support if you still need access.",
      429: "Too many download attempts. Please wait a moment and try again.",
    },
  });

export const getContactToastErrorMessage = (error: unknown): string =>
  getToastErrorMessage(error, {
    fallback: "Your message could not be sent right now. Please try again.",
    fieldPriority: ["email", "name", "subject", "message", "non_field_errors"],
    statusMessages: {
      429: "You've sent too many messages too quickly. Please wait a moment and try again.",
      503: "Contact is temporarily unavailable. Please try again shortly.",
    },
  });

export const getPasswordChangeToastErrorMessage = (error: unknown): string =>
  getToastErrorMessage(error, {
    fallback: "Could not change your password right now. Please try again.",
    fieldPriority: ["old_password", "new_password", "detail", "non_field_errors"],
    statusMessages: {
      401: "Your current password is incorrect.",
      429: "Too many password change attempts. Please wait a moment and try again.",
      503: "Password changes are temporarily unavailable. Please try again shortly.",
    },
  });

export const getEmailChangeToastErrorMessage = (error: unknown): string =>
  getToastErrorMessage(error, {
    fallback: "Could not update your email right now. Please try again.",
    fieldPriority: ["new_email", "password", "detail", "non_field_errors"],
    statusMessages: {
      401: "Please confirm your current password and try again.",
      429: "Too many email change attempts. Please wait a moment and try again.",
      503: "Email updates are temporarily unavailable. Please try again shortly.",
    },
  });

export const getProfileUpdateToastErrorMessage = (error: unknown): string =>
  getToastErrorMessage(error, {
    fallback: "Could not update your profile right now. Please try again.",
    fieldPriority: [
      "username",
      "first_name",
      "last_name",
      "default_phone_number",
      "default_street_address1",
      "default_town",
      "default_county",
      "default_postcode",
      "default_country",
      "detail",
      "non_field_errors",
    ],
    statusMessages: {
      429: "Too many profile update attempts. Please wait a moment and try again.",
      503: "Profile updates are temporarily unavailable. Please try again shortly.",
    },
  });

export const getAccountDetailsToastErrorMessage = (error: unknown): string =>
  getToastErrorMessage(error, {
    fallback: "Could not update your account details right now. Please try again.",
    fieldPriority: ["username", "email", "detail", "non_field_errors"],
    statusMessages: {
      429: "Too many account update attempts. Please wait a moment and try again.",
      503: "Account updates are temporarily unavailable. Please try again shortly.",
    },
  });

export const getDeleteAccountToastErrorMessage = (error: unknown): string =>
  getToastErrorMessage(error, {
    fallback: "Could not delete your account right now. Please try again.",
    fieldPriority: ["password", "detail", "non_field_errors"],
    statusMessages: {
      401: "Please confirm your password to delete your account.",
      429: "Too many delete attempts. Please wait a moment and try again.",
      503: "Account deletion is temporarily unavailable. Please try again shortly.",
    },
  });

export const getGalleryAccessRequestToastErrorMessage = (error: unknown): string =>
  getToastErrorMessage(error, {
    fallback: "We couldn't send an access code right now. Please try again.",
    fieldPriority: ["email", "error", "detail", "non_field_errors"],
    statusMessages: {
      429: "Too many access requests. Please wait a moment and try again.",
      503: "Gallery access is temporarily unavailable. Please try again shortly.",
    },
  });

export const getGalleryAccessVerifyToastErrorMessage = (error: unknown): string =>
  getToastErrorMessage(error, {
    fallback: "That access code is invalid or has expired.",
    fieldPriority: ["code", "error", "detail", "non_field_errors"],
    statusMessages: {
      403: "That access code is invalid or has expired.",
      429: "Too many verification attempts. Please wait a moment and try again.",
      503: "Gallery verification is temporarily unavailable. Please try again shortly.",
    },
  });

export const getBlogLikeToastErrorMessage = (error: unknown): string =>
  getToastErrorMessage(error, {
    fallback: "Could not update your like right now. Please try again.",
    fieldPriority: ["detail", "message", "non_field_errors"],
    statusMessages: {
      401: "Please log in to like posts.",
      429: "You're doing that too quickly. Please wait a moment and try again.",
      503: "Likes are temporarily unavailable. Please try again shortly.",
    },
  });

export const getCommentToastErrorMessage = (error: unknown): string =>
  getToastErrorMessage(error, {
    fallback: "Could not post your comment right now. Please try again.",
    fieldPriority: ["content", "detail", "message", "non_field_errors"],
    statusMessages: {
      401: "Please log in to comment.",
      429: "You're commenting too quickly. Please wait a moment and try again.",
      503: "Comments are temporarily unavailable. Please try again shortly.",
    },
  });

export const getNewsletterToastErrorMessage = (error: unknown): string =>
  getToastErrorMessage(error, {
    fallback: "Could not subscribe right now. Please try again.",
    fieldPriority: ["email", "detail", "message", "non_field_errors"],
    statusMessages: {
      429: "Too many subscription attempts. Please wait a moment and try again.",
      503: "Newsletter signup is temporarily unavailable. Please try again shortly.",
    },
  });
