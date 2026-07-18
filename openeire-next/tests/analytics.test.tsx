import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const consentMock = vi.hoisted(() => ({
  granted: false,
  managesGoogleConsentMode: false,
  callback: null as ((granted: boolean) => void) | null,
}));

vi.mock("@/lib/iubendaConsent", () => ({
  isAnalyticsConsentGranted: () => consentMock.granted,
  isIubendaManagingGoogleConsentMode: () =>
    consentMock.managesGoogleConsentMode,
  registerIubendaAnalyticsConsentCallback: (
    callback: (granted: boolean) => void,
  ) => {
    consentMock.callback = callback;
    callback(consentMock.granted);
    return () => {
      consentMock.callback = null;
    };
  },
}));

const navigationMock = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({
  usePathname: () => navigationMock.pathname,
}));

describe("analytics runtime", () => {
  beforeEach(() => {
    consentMock.granted = false;
    consentMock.managesGoogleConsentMode = false;
    consentMock.callback = null;
    navigationMock.pathname = "/";
    window.history.replaceState({}, "", "/");
    window.dataLayer = [];
    window.gtag = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not grant analytics or emit events before consent", async () => {
    const { registerAnalyticsConsentListener, trackEvent } = await import(
      "@/lib/analytics"
    );
    registerAnalyticsConsentListener();

    expect(trackEvent("purchase", { transaction_id: "order-1" })).toBe(false);
    expect(window.gtag).not.toHaveBeenCalledWith(
      "consent",
      "update",
      expect.anything(),
    );
    expect(window.gtag).not.toHaveBeenCalledWith(
      "event",
      expect.anything(),
      expect.anything(),
    );
  });

  it("updates consent before sending the initial page view", async () => {
    const { registerAnalyticsConsentListener, trackPageView } = await import(
      "@/lib/analytics"
    );
    registerAnalyticsConsentListener(() => {
      trackPageView("/gallery", "Gallery");
    });

    consentMock.granted = true;
    consentMock.callback?.(true);
    await Promise.resolve();

    const calls = vi.mocked(window.gtag!).mock.calls;
    const grantIndex = calls.findIndex(
      ([command, action, value]) =>
        command === "consent" &&
        action === "update" &&
        (value as { analytics_storage?: string }).analytics_storage === "granted",
    );
    const pageViewIndex = calls.findIndex(
      ([command, name]) => command === "event" && name === "page_view",
    );
    expect(grantIndex).toBeGreaterThanOrEqual(0);
    expect(pageViewIndex).toBeGreaterThan(grantIndex);
  });

  it("does not duplicate Consent Mode updates managed by Iubenda", async () => {
    consentMock.managesGoogleConsentMode = true;
    const { registerAnalyticsConsentListener, trackPageView } = await import(
      "@/lib/analytics"
    );
    registerAnalyticsConsentListener(() => {
      trackPageView("/gallery", "Gallery");
    });

    consentMock.granted = true;
    window.gtag?.("consent", "update", { analytics_storage: "granted" });
    consentMock.callback?.(true);
    await Promise.resolve();

    const consentUpdates = vi
      .mocked(window.gtag!)
      .mock.calls.filter(
        ([command, action]) => command === "consent" && action === "update",
      );
    expect(consentUpdates).toHaveLength(1);
  });

  it("never inserts another script or queues another config command", async () => {
    consentMock.granted = true;
    const appendSpy = vi.spyOn(document.head, "appendChild");
    const { initGA } = await import("@/lib/analytics");

    await initGA();
    await initGA();

    expect(appendSpy).not.toHaveBeenCalled();
    expect(window.gtag).not.toHaveBeenCalledWith(
      "config",
      expect.anything(),
      expect.anything(),
    );
  });

  it("emits each route page view exactly once across the consent race", async () => {
    vi.useFakeTimers();
    const { AnalyticsListener } = await import(
      "@/components/analytics/AnalyticsListener"
    );
    const view = render(<AnalyticsListener />);

    consentMock.granted = true;
    act(() => consentMock.callback?.(true));
    await act(async () => {
      vi.runAllTimers();
      await Promise.resolve();
    });

    navigationMock.pathname = "/gallery";
    window.history.replaceState({}, "", "/gallery");
    view.rerender(<AnalyticsListener />);
    await act(async () => {
      vi.runAllTimers();
      await Promise.resolve();
    });

    const pageViews = vi
      .mocked(window.gtag!)
      .mock.calls.filter(
        ([command, name]) => command === "event" && name === "page_view",
      );
    expect(pageViews).toHaveLength(2);
    expect(pageViews.map((call) => (call[2] as { page_path: string }).page_path)).toEqual([
      "/",
      "/gallery",
    ]);
  });
});
