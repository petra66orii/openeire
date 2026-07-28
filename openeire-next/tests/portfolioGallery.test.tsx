import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PortfolioGallery } from "@/components/real-estate/PortfolioGallery";

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

const images = [
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
] as const;

describe("portfolio gallery", () => {
  afterEach(cleanup);

  it("supports opening, keyboard navigation, Escape and focus restoration", async () => {
    render(<PortfolioGallery images={images} projectSlug="test-project" />);
    const firstTrigger = screen.getByRole("button", {
      name: /Open image 1 of 2/i,
    });

    fireEvent.click(firstTrigger);
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Close image viewer" }),
    );

    fireEvent.keyDown(document, { key: "ArrowRight" });
    expect(
      screen.getByRole("dialog", {
        name: /image 2 of 2/i,
      }),
    ).toBeTruthy();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(firstTrigger));
  });

  it("renders an accessible fallback when an image fails", () => {
    render(<PortfolioGallery images={images} projectSlug="test-project" />);
    fireEvent.error(
      screen.getByAltText("Exterior view across a rural property setting"),
    );

    expect(screen.getByText("Image temporarily unavailable")).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: /Image unavailable: Exterior view/i,
      }),
    ).toBeTruthy();
  });
});
