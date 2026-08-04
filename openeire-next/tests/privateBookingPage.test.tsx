import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import BookingPage from "@/app/book/[credentialPublicId]/page";

const PUBLIC_ID = "11111111-1111-4111-8111-111111111111";

describe("private booking page rollout flag", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("renders a static unavailable state and performs no exchange when disabled", async () => {
    vi.stubEnv("REAL_ESTATE_BOOKING_PORTAL_ENABLED", "false");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(await BookingPage({ params: Promise.resolve({ credentialPublicId: PUBLIC_ID }) }));
    expect(screen.getByText("Booking access unavailable")).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
