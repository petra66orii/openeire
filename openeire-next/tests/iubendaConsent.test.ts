import { afterEach, describe, expect, it, vi } from "vitest";

describe("Iubenda analytics consent", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.resetModules();
    delete window._iub;
  });

  it("does not treat the Consent Database API key as analytics consent", async () => {
    vi.stubEnv("NEXT_PUBLIC_IUBENDA_CONSENT_PUBLIC_API_KEY", "public-api-key");
    vi.resetModules();
    const { isAnalyticsConsentGranted } = await import("@/lib/iubendaConsent");

    expect(isAnalyticsConsentGranted()).toBe(false);
  });

  it("detects stored Measurement consent when Remote Configuration loaded first", async () => {
    window._iub = {
      googleConsentModeV2: true,
      csConfiguration: {
        siteId: 123,
        cookiePolicyId: 456,
        callback: {},
      },
      cs: {
        api: {
          getPreferences: () => ({ purposes: { "4": true } }),
        },
      },
    };
    const { registerIubendaAnalyticsConsentCallback } = await import(
      "@/lib/iubendaConsent"
    );
    const listener = vi.fn();
    const unsubscribe = registerIubendaAnalyticsConsentCallback(listener);

    expect(listener).toHaveBeenCalledWith(true);
    unsubscribe();
  });

  it("observes asynchronous Remote Configuration grants and withdrawals", async () => {
    vi.useFakeTimers();
    const {
      isAnalyticsConsentGranted,
      isIubendaManagingGoogleConsentMode,
      registerIubendaAnalyticsConsentCallback,
    } = await import("@/lib/iubendaConsent");
    const listener = vi.fn();
    const unsubscribe = registerIubendaAnalyticsConsentCallback(listener);
    let measurementConsent = false;

    window._iub = {
      googleConsentModeV2: true,
      csConfiguration: { callback: {} },
      cs: {
        api: {
          getPreferences: () => ({
            purposes: { "4": measurementConsent },
          }),
        },
      },
    };
    vi.advanceTimersByTime(250);

    measurementConsent = true;
    vi.advanceTimersByTime(250);
    measurementConsent = false;
    vi.advanceTimersByTime(250);

    expect(listener.mock.calls.map(([granted]) => granted)).toEqual([false, true, false]);
    expect(isAnalyticsConsentGranted()).toBe(false);
    expect(isIubendaManagingGoogleConsentMode()).toBe(true);
    unsubscribe();
  });
});
