import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  REAL_ESTATE_SERVICES,
  RealEstateBenefits,
  RealEstateServicesShowcase,
} from "@/components/real-estate/RealEstateServicesShowcase";

describe("real-estate services showcase", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("presents all six services with concise initial copy", () => {
    render(<RealEstateServicesShowcase />);

    expect(REAL_ESTATE_SERVICES).toHaveLength(6);
    for (const service of REAL_ESTATE_SERVICES) {
      expect(screen.getByText(service.title, { selector: "span" })).toBeTruthy();
      expect(screen.getByText(service.summary)).toBeTruthy();
      expect(
        screen.getByText(`More details about ${service.title}`),
      ).toBeTruthy();
    }
  });

  it("uses genuine portfolio media where published and branded fallbacks otherwise", () => {
    const imageServices = REAL_ESTATE_SERVICES.filter(
      ({ media }) => media.kind === "image",
    );
    const brandedServices = REAL_ESTATE_SERVICES.filter(
      ({ media }) => media.kind === "branded",
    );

    expect(imageServices.map(({ id }) => id)).toEqual([
      "photography",
      "aerial",
      "film",
      "floor-plans",
    ]);
    for (const service of imageServices) {
      expect(service.media.kind).toBe("image");
      if (service.media.kind === "image") {
        expect(service.media.src).toMatch(/^https:\/\/media\.openeire\.ie\//);
      }
    }
    const aerialService = REAL_ESTATE_SERVICES.find(
      ({ id }) => id === "aerial",
    );
    expect(
      aerialService?.media.kind === "image" ? aerialService.media.src : null,
    ).toBe(
      "https://media.openeire.ie/portfolio/county-galway-20260806/front-drone.webp",
    );
    expect(brandedServices.map(({ id }) => id)).toEqual([
      "social",
      "virtual-tour",
    ]);
  });

  it("supports click, focus and expandable details without relying on hover", () => {
    render(<RealEstateServicesShowcase />);

    const virtualTourButton = screen.getByRole("button", {
      name: /Hosted 3D Virtual Tours/,
    });
    virtualTourButton.focus();
    fireEvent.click(virtualTourButton);

    expect(virtualTourButton.getAttribute("aria-pressed")).toBe("true");
    expect(
      document.querySelectorAll('[data-service-media="virtual-tour"]'),
    ).toHaveLength(2);

    const summary = screen.getByText(
      "More details about Hosted 3D Virtual Tours",
    );
    const details = summary.closest("details");
    expect(details?.hasAttribute("open")).toBe(false);
    fireEvent.click(summary);
    expect(details?.hasAttribute("open")).toBe(true);
    expect(
      screen.getByText(/starts from €150 for a suitable standard-sized property/),
    ).toBeTruthy();
  });

  it("uses a desktop sticky media panel and an associated mobile panel", () => {
    render(<RealEstateServicesShowcase />);

    const desktopPanel = document.querySelector(
      '[data-service-media-panel="desktop"]',
    );
    const mobilePanel = document.querySelector(
      '[data-service-media-panel="mobile"]',
    );

    expect(desktopPanel?.className).toContain("hidden");
    expect(desktopPanel?.className).toContain("lg:sticky");
    expect(desktopPanel?.className).toContain("lg:block");
    expect(mobilePanel?.className).toContain("lg:hidden");
    expect(
      screen.getByRole("link", { name: "Explore the residential portfolio" })
        .getAttribute("href"),
    ).toBe("/real-estate/portfolio");
  });

  it("keeps the fuller drone, social, floor-plan and 3D conditions accessible", () => {
    render(<RealEstateServicesShowcase />);

    expect(screen.getByText(/airspace restrictions and safe operating conditions/)).toBeTruthy();
    expect(screen.getByText(/additional social cut \/ format is €50/)).toBeTruthy();
    expect(screen.getByText(/Current €75 guidance applies/)).toBeTruthy();
    expect(screen.getByText(/included in Premium.*Larger, scan-heavy/)).toBeTruthy();
  });

  it("shows content without reveal animation for reduced-motion users", async () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({ matches: true }),
    );

    render(<RealEstateBenefits />);

    const section = screen
      .getByRole("heading", {
        name: "Give Every Property Listing a Stronger First Impression",
      })
      .closest("section");

    await waitFor(() => {
      expect(section?.getAttribute("data-visible")).toBe("true");
    });
    expect(section?.getAttribute("data-reveal-ready")).toBe("false");
  });
});
