import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/go/[source]/route";
import { PortfolioTrackedLink } from "@/components/real-estate/PortfolioTrackedLink";
import { trackEvent } from "@/lib/analytics";
import { getPrintSource, withPrintAttribution } from "@/lib/printAttribution";

vi.mock("@/lib/analytics", () => ({ trackEvent: vi.fn() }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  window.history.replaceState({}, "", "/");
});

describe("printed QR redirects", () => {
  it.each(["flyer", "portfolio-card", "office-drop", "qr-sticker"])(
    "redirects %s to the public portfolio with its own attribution",
    async (source) => {
      const response = await GET(new Request(`https://openeire.ie/go/${source}`), {
        params: Promise.resolve({ source }),
      });
      expect(response.status).toBe(307);
      expect(response.headers.get("cache-control")).toContain("no-store");
      expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
      const url = new URL(response.headers.get("location")!, "https://openeire.ie");
      expect(url.pathname).toBe("/real-estate/portfolio");
      expect(Object.fromEntries(url.searchParams)).toEqual({
        utm_source: source, utm_medium: "print", utm_campaign: "property_media",
      });
    },
  );

  it("ignores destination overrides, arbitrary parameters and forged source parameters", async () => {
    const response = await GET(new Request(
      "https://openeire.ie/go/flyer?url=https://example.com&email=private@example.com&utm_source=office-drop",
    ), { params: Promise.resolve({ source: "flyer" }) });
    const location = response.headers.get("location")!;
    expect(location).toBe("/real-estate/portfolio?utm_source=flyer&utm_medium=print&utm_campaign=property_media");
  });

  it.each(["unknown", "https://example.com", "Flyer"])("rejects unsupported source %s", async (source) => {
    const response = await GET(new Request("https://openeire.ie/go/unknown"), {
      params: Promise.resolve({ source }),
    });
    expect(response.status).toBe(404);
    expect(response.headers.get("location")).toBeNull();
  });
});

describe("portfolio to enquiry attribution", () => {
  const campaign = "?utm_source=office-drop&utm_medium=print&utm_campaign=property_media";

  it("preserves the package and enquiry anchor while copying only approved campaign fields", () => {
    expect(withPrintAttribution("/real-estate?package=pro#enquire", campaign + "&email=private"))
      .toBe("/real-estate?package=pro&utm_source=office-drop&utm_medium=print&utm_campaign=property_media#enquire");
    expect(withPrintAttribution("https://example.com", campaign)).toBe("https://example.com");
    expect(withPrintAttribution("//example.com", campaign)).toBe("//example.com");
  });

  it.each(["", "?utm_source=flyer", campaign + "&utm_source=flyer", campaign.replace("print", "email")])(
    "does not accept incomplete, duplicated or mismatched campaign fields: %s",
    (search) => {
      expect(getPrintSource(search)).toBeNull();
      expect(withPrintAttribution("/real-estate#enquire", search)).toBe("/real-estate#enquire");
    },
  );

  it("renders an attributed enquiry link and records its approved source on click", () => {
    window.history.replaceState({}, "", "/real-estate/portfolio" + campaign);
    render(<PortfolioTrackedLink href="/real-estate#enquire" eventName="portfolio_enquiry_cta"
      eventLocation="hero" className="">Discuss a Property</PortfolioTrackedLink>);
    const link = screen.getByRole("link", { name: "Discuss a Property" });
    expect(link.getAttribute("href")).toBe("/real-estate" + campaign + "#enquire");
    fireEvent.click(link);
    expect(trackEvent).toHaveBeenCalledWith("portfolio_enquiry_cta", expect.objectContaining({
      utm_source: "office-drop", utm_medium: "print", utm_campaign: "property_media",
    }));
  });
});
