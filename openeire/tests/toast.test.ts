import { describe, expect, it } from "vitest";
import { getLoginToastErrorMessage, getToastErrorMessage } from "../src/utils/toast";
describe("toast error helpers", () => {
  it("uses detail matchers before returning raw backend detail", () => {
    const message = getLoginToastErrorMessage({
      response: {
        status: 401,
        data: {
          detail: "No active account found with the given credentials",
        },
      },
    });
    expect(message).toBe(
      "Email or password is incorrect, or your account has not been verified yet.",
    );
  });
  it("prefers structured payload message values", () => {
    const message = getToastErrorMessage(
      {
        response: {
          status: 400,
          data: {
            message: "Please review the highlighted fields.",
          },
        },
      },
      {
        fallback: "Something went wrong.",
      },
    );
    expect(message).toBe("Please review the highlighted fields.");
  });
  it("uses prioritized field validation errors when present", () => {
    const message = getToastErrorMessage(
      {
        response: {
          status: 400,
          data: {
            password: ["This password is too short."],
            email: ["Enter a valid email address."],
          },
        },
      },
      {
        fallback: "Something went wrong.",
        fieldPriority: ["email", "password"],
      },
    );
    expect(message).toBe("Email: Enter a valid email address.");
  });
  it("falls back to status-based copy when the payload has no user-facing message", () => {
    const message = getToastErrorMessage(
      {
        response: {
          status: 429,
          data: {},
        },
      },
      {
        fallback: "Something went wrong.",
        statusMessages: {
          429: "Too many requests. Please wait a moment and try again.",
        },
      },
    );
    expect(message).toBe("Too many requests. Please wait a moment and try again.");
  });
  it("uses the configured fallback for axios network errors without a response", () => {
    const message = getToastErrorMessage(
      {
        isAxiosError: true,
        message: "Network Error",
      },
      {
        fallback: "We couldn't reach the server. Please try again.",
      },
    );
    expect(message).toBe("We couldn't reach the server. Please try again.");
  });
});