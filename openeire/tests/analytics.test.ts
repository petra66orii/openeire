import { afterEach, describe, expect, it, vi } from "vitest";

const GA_SCRIPT_ID = "openeire-ga-script";
let restoreMeasurementId: (() => void) | null = null;

const loadAnalyticsModule = async (measurementId?: string) => {
  vi.resetModules();

  const env = import.meta.env as Record<string, string | undefined>;
  const previousMeasurementId = env.VITE_GA_MEASUREMENT_ID;
  env.VITE_GA_MEASUREMENT_ID = measurementId;

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

  it("loads gtag only once and sends the expected config payload", async () => {
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
    expect(gtagSpy).toHaveBeenCalledWith("js", expect.any(Date));
    expect(gtagSpy).toHaveBeenCalledWith("config", "G-TEST123", {
      send_page_view: false,
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
    expect(gtagSpy).toHaveBeenCalledWith("config", "G-RETRY1", {
      send_page_view: false,
    });
  });

  it("deduplicates repeated page_view events for the same path and title", async () => {
    const { module } = await loadAnalyticsModule("G-PAGEVIEW1");
    const { trackPageView } = module;
    const gtagSpy = vi.fn();
    window.gtag = gtagSpy;
    window.dataLayer = [];

    trackPageView("/gallery/video/12?ref=home#details", "Video Detail | OpenEire");
    trackPageView("/gallery/video/12?ref=home#details", "Video Detail | OpenEire");
    trackPageView("/gallery/video/13?ref=home#details", "Video Detail | OpenEire");

    expect(gtagSpy).toHaveBeenCalledTimes(2);
    expect(gtagSpy).toHaveBeenNthCalledWith(1, "event", "page_view", {
      page_path: "/gallery/video/12?ref=home#details",
      page_title: "Video Detail | OpenEire",
    });
    expect(gtagSpy).toHaveBeenNthCalledWith(2, "event", "page_view", {
      page_path: "/gallery/video/13?ref=home#details",
      page_title: "Video Detail | OpenEire",
    });
  });
});
