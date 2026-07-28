import fs from "node:fs";
import path from "node:path";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  PortfolioGallery,
  splitPortfolioGalleryRows,
} from "@/components/real-estate/PortfolioGallery";
import type { PortfolioImage } from "@/lib/realEstatePortfolio";

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

const images: readonly PortfolioImage[] = [
  {
    src: "/hero-poster.jpg",
    alt: "Exterior view across a rural property setting",
    width: 1920,
    height: 1080,
  },
  {
    src: "/hero-poster-mobile.jpg",
    alt: "Portrait detail of the property setting",
    width: 1080,
    height: 1350,
  },
  {
    src: "/gallery/photo/property-room.jpg",
    alt: "Interior room with natural light",
    width: 1600,
    height: 1067,
  },
  {
    src: "/gallery/photo/property-detail.jpg",
    alt: "Architectural detail inside the residence",
    width: 1200,
    height: 1600,
  },
  {
    src: "/gallery/photo/property-aerial.jpg",
    alt: "Aerial view of the residence and grounds",
    width: 2000,
    height: 1125,
  },
];

describe("portfolio gallery", () => {
  afterEach(() => {
    cleanup();
    document.body.style.overflow = "";
  });

  it("balances odd and even image sets across two rows", () => {
    const [oddFirst, oddSecond] = splitPortfolioGalleryRows(images);
    expect(oddFirst.map(({ originalIndex }) => originalIndex)).toEqual([
      0, 2, 4,
    ]);
    expect(oddSecond.map(({ originalIndex }) => originalIndex)).toEqual([1, 3]);

    const [evenFirst, evenSecond] = splitPortfolioGalleryRows(
      images.slice(0, 4),
    );
    expect(evenFirst).toHaveLength(2);
    expect(evenSecond).toHaveLength(2);
  });

  it("renders two oppositely directed rows with inaccessible clones", () => {
    const { container } = render(
      <PortfolioGallery images={images} projectSlug="test-project" />,
    );

    const rows = container.querySelectorAll("[data-gallery-row]");
    expect(rows).toHaveLength(2);
    expect(rows[0].getAttribute("data-direction")).toBe("forward");
    expect(rows[1].getAttribute("data-direction")).toBe("reverse");

    const originals = container.querySelectorAll(
      '[data-gallery-sequence="original"] [data-gallery-original="true"]',
    );
    const clones = container.querySelectorAll(
      '[data-gallery-sequence="clone"]',
    );
    expect(originals).toHaveLength(images.length);
    expect(clones).toHaveLength(4);

    for (const clone of clones) {
      expect(clone.getAttribute("aria-hidden")).toBe("true");
      expect(clone.querySelectorAll("button, a, [tabindex]")).toHaveLength(0);
      for (const image of clone.querySelectorAll("img")) {
        expect(image.getAttribute("alt")).toBe("");
      }
    }

    expect(screen.getAllByRole("button", { name: /Open image/i })).toHaveLength(
      images.length,
    );
  });

  it("keeps original cards keyboard operable and preserves natural dimensions", () => {
    render(<PortfolioGallery images={images} projectSlug="test-project" />);

    const firstTrigger = screen.getByRole("button", {
      name: /Open image 1 of 5/i,
    });
    firstTrigger.focus();
    expect(document.activeElement).toBe(firstTrigger);
    expect(firstTrigger.getAttribute("tabindex")).not.toBe("-1");

    const firstImage = screen.getByAltText(images[0].alt);
    expect(firstImage.getAttribute("width")).toBe(String(images[0].width));
    expect(firstImage.getAttribute("height")).toBe(String(images[0].height));

    fireEvent.click(firstTrigger);
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("uses only the unique image sequence for lightbox navigation", async () => {
    render(<PortfolioGallery images={images} projectSlug="test-project" />);
    const firstTrigger = screen.getByRole("button", {
      name: /Open image 1 of 5/i,
    });

    fireEvent.click(firstTrigger);
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Close image viewer" }),
    );

    fireEvent.keyDown(document, { key: "ArrowLeft" });
    expect(
      screen.getByRole("dialog", {
        name: /image 5 of 5/i,
      }),
    ).toBeTruthy();

    fireEvent.keyDown(document, { key: "ArrowRight" });
    expect(
      screen.getByRole("dialog", {
        name: /image 1 of 5/i,
      }),
    ).toBeTruthy();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(firstTrigger));
    expect(document.body.style.overflow).toBe("");
  });

  it("closes from the backdrop without treating image content as a backdrop click", async () => {
    render(<PortfolioGallery images={images} projectSlug="test-project" />);
    const firstTrigger = screen.getByRole("button", {
      name: /Open image 1 of 5/i,
    });
    fireEvent.click(firstTrigger);

    const dialog = screen.getByRole("dialog");
    fireEvent.click(within(dialog).getByAltText(images[0].alt));
    expect(screen.getByRole("dialog")).toBeTruthy();

    fireEvent.click(dialog);
    expect(screen.queryByRole("dialog")).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(firstTrigger));
  });

  it("renders an accessible original fallback when an image fails", () => {
    const { container } = render(
      <PortfolioGallery images={images} projectSlug="test-project" />,
    );
    fireEvent.error(screen.getByAltText(images[0].alt));

    const unavailableButton = screen.getByRole("button", {
      name: /Image unavailable: Exterior view/i,
    });
    expect(unavailableButton.hasAttribute("disabled")).toBe(true);
    expect(unavailableButton.textContent).toContain(
      "Image temporarily unavailable",
    );
    expect(
      container.querySelector(
        '[data-gallery-sequence="clone"] [aria-label]',
      ),
    ).toBeNull();
  });

  it("defines static mobile and reduced-motion fallbacks with desktop pause controls", () => {
    const stylesheet = fs.readFileSync(
      path.join(
        process.cwd(),
        "components",
        "real-estate",
        "PortfolioGallery.module.css",
      ),
      "utf8",
    );

    expect(stylesheet).toMatch(/\.cloneSequence\s*{[\s\S]*display:\s*none/);
    expect(stylesheet).toMatch(
      /min-width:\s*768px[\s\S]*prefers-reduced-motion:\s*no-preference/,
    );
    expect(stylesheet).toMatch(/\.forward[\s\S]*portfolio-marquee-forward/);
    expect(stylesheet).toMatch(/\.reverse[\s\S]*portfolio-marquee-reverse/);
    expect(stylesheet).toMatch(/\.row:hover \.track/);
    expect(stylesheet).toMatch(/\.row:focus-within \.track/);
    expect(stylesheet).toMatch(/prefers-reduced-motion:\s*reduce/);
    expect(stylesheet).toMatch(/min-width:\s*2\.75rem/);
    expect(stylesheet).toMatch(/min-height:\s*2\.75rem/);
  });
});
