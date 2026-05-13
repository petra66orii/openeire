// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";

const GA_SCRIPT_ID = "openeire-ga-script";
let restoreMeasurementId: (() => void) | null = null;

const loadAnalyticsModule = async (measurementId?: string) => {
  vi.resetModules();
  vi.doMock("../src/utils/iubendaConsent", () => ({
    isAnalyticsConsentGranted: () => true,
  }));

  const env = import.meta.env as Record<string, string | undefined>;
  const previousMeasurementId = env.VITE_GA_MEASUREMENT_ID;
  env.VITE_GA_MEASUREMENT_ID = measurementId ?? "";

  const module = await import("../src/lib/analytics");
  const restore = () => {
    env.VITE_GA_MEASUREMENT_ID = previousMeasurementId;
  };
  restoreMeasurementId = restore;

  return {
    module,
    restore,
  };
};

const resetDomState = () => {
  document.getElementById(GA_SCRIPT_ID)?.remove();
  Reflect.deleteProperty(window, "gtag");
  Reflect.deleteProperty(window, "dataLayer");
};

afterEach(() => {
  restoreMeasurementId?.();
  restoreMeasurementId = null;
  resetDomState();
  vi.restoreAllMocks();
});

describe("analytics helper", () => {
  it("does nothing when the measurement id is missing", async () => {
    const { module } = await loadAnalyticsModule(undefined);
    const { initGA, trackPageView } = module;
    const appendSpy = vi.spyOn(document.head, "appendChild");

    await initGA();
    trackPageView("/gallery", "Gallery | OpenEire Studios");

    expect(appendSpy).not.toHaveBeenCalled();
    expect(document.getElementById(GA_SCRIPT_ID)).toBeNull();
  });

  it("loads gtag only once when no bootstrap tag exists", async () => {
    const { module } = await loadAnalyticsModule("G-TEST123");
    const { initGA } = module;
    const appendSpy = vi
      .spyOn(document.head, "appendChild")
      .mockImplementation((node: Node) => {
        const script = node as HTMLScriptElement;
        script.onload?.(new Event("load"));
        return node;
      });
    const gtagSpy = vi.fn();
    window.gtag = gtagSpy;
    window.dataLayer = [];

    await initGA();
    await initGA();

    expect(appendSpy).toHaveBeenCalledTimes(1);
    expect(gtagSpy).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  });

  it("clears failed initialization so a later call can retry", async () => {
    const { module } = await loadAnalyticsModule("G-RETRY1");
    const { initGA } = module;
    let shouldFailFirstLoad = true;
    const appendSpy = vi
      .spyOn(document.head, "appendChild")
      .mockImplementation((node: Node) => {
        const script = node as HTMLScriptElement;
        if (shouldFailFirstLoad) {
          shouldFailFirstLoad = false;
          script.onerror?.(new Event("error"));
        } else {
          script.onload?.(new Event("load"));
        }
        return node;
      });
    const gtagSpy = vi.fn();
    window.gtag = gtagSpy;
    window.dataLayer = [];

    await initGA();
    await initGA();

    expect(appendSpy).toHaveBeenCalledTimes(2);
    expect(gtagSpy).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  });

  it("reuses the bootstrap tag from index.html without appending a duplicate", async () => {
    const bootstrapScript = document.createElement("script");
    bootstrapScript.id = GA_SCRIPT_ID;
    bootstrapScript.src = "https://www.googletagmanager.com/gtag/js?id=G-BOOTSTRAP1";
    bootstrapScript.dataset.loaded = "true";
    document.head.appendChild(bootstrapScript);

    const { module } = await loadAnalyticsModule("G-BOOTSTRAP1");
    const { initGA } = module;
    const appendSpy = vi.spyOn(document.head, "appendChild");
    const gtagSpy = vi.fn();
    window.gtag = gtagSpy;
    window.dataLayer = [];

    await initGA();

    expect(appendSpy).not.toHaveBeenCalled();
    expect(gtagSpy).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  });

  it("forwards page_view events with the current path and title", async () => {
    const { module } = await loadAnalyticsModule("G-PAGEVIEW1");
    const { trackPageView } = module;
    const gtagSpy = vi.fn();
    window.gtag = gtagSpy;
    window.dataLayer = [];

    trackPageView("/gallery/video/12?ref=home#details", "Video Detail | OpenEire");
    trackPageView("/gallery/video/12?ref=home#details", "Video Detail | OpenEire");
    trackPageView("/gallery/video/13?ref=home#details", "Video Detail | OpenEire");

    const pageViewCalls = gtagSpy.mock.calls.filter(
      (call) => call[0] === "event" && call[1] === "page_view",
    );

    expect(pageViewCalls).toHaveLength(3);
    expect(pageViewCalls[0]).toEqual(["event", "page_view", {
      page_path: "/gallery/video/12?ref=home#details",
      page_title: "Video Detail | OpenEire",
    }]);
    expect(pageViewCalls[1]).toEqual(["event", "page_view", {
      page_path: "/gallery/video/12?ref=home#details",
      page_title: "Video Detail | OpenEire",
    }]);
    expect(pageViewCalls[2]).toEqual(["event", "page_view", {
      page_path: "/gallery/video/13?ref=home#details",
      page_title: "Video Detail | OpenEire",
    }]);
  });
});
