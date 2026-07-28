import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  isValidYouTubeVideoId,
  PortfolioVideo,
  VIDEO_LOAD_TIMEOUT_MS,
} from "@/components/real-estate/PortfolioVideo";
import type { PortfolioVideo as PortfolioVideoData } from "@/lib/realEstatePortfolio";

const trackEventMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/analytics", () => ({
  trackEvent: trackEventMock,
}));

const video: PortfolioVideoData = {
  youtubeVideoId: "AbCdEfGhI12",
  poster: {
    src: "/hero-poster.jpg",
    alt: "Exterior view of a rural property",
    width: 1920,
    height: 1080,
  },
  title: "County Galway property film",
  description: "A landscape film showing the property and its setting.",
  width: 16,
  height: 9,
};

describe("portfolio YouTube video", () => {
  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it("loads no YouTube iframe until play and keeps the poster while loading", () => {
    render(<PortfolioVideo video={video} projectSlug="galway-property" />);

    expect(screen.queryByTitle(video.title)).toBeNull();
    expect(
      screen.getByText("YouTube is loaded only after you press play."),
    ).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", {
        name: `Play ${video.title} on YouTube`,
      }),
    );

    const iframe = screen.getByTitle(video.title);
    expect(iframe.getAttribute("src")).toBe(
      `https://www.youtube-nocookie.com/embed/${video.youtubeVideoId}?autoplay=1&playsinline=1&rel=0`,
    );
    expect(iframe.hasAttribute("loading")).toBe(false);
    expect(iframe.getAttribute("referrerpolicy")).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(iframe.getAttribute("data-cmp-ab")).toBe("1");
    expect(iframe.hasAttribute("allowfullscreen")).toBe(true);
    expect(iframe.className).toMatch(/h-full/);
    expect(iframe.className).toMatch(/w-full/);
    expect(iframe.className).toMatch(/opacity-0/);
    expect(screen.getByRole("status").textContent).toContain("Loading film");
    expect(screen.getByAltText(video.poster.alt)).toBeTruthy();
    expect(
      screen.getByRole("link", {
        name: /Having trouble\? Watch on YouTube/i,
      }).getAttribute("href"),
    ).toBe(`https://www.youtube.com/watch?v=${video.youtubeVideoId}`);

    fireEvent.load(iframe);
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.queryByAltText(video.poster.alt)).toBeNull();
    expect(screen.getByTitle(video.title).className).toMatch(/opacity-100/);
    expect(trackEventMock).toHaveBeenCalledWith("portfolio_film_play", {
      project_slug: "galway-property",
      video_title: video.title,
      video_provider: "youtube",
    });
  });

  it("fails closed for malformed YouTube video IDs", () => {
    render(
      <PortfolioVideo
        video={{ ...video, youtubeVideoId: "https://example.com/video" }}
        projectSlug="galway-property"
      />,
    );

    expect(screen.getByRole("status").textContent).toContain(
      "Video temporarily unavailable",
    );
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByTitle(video.title)).toBeNull();
  });

  it("keeps the accessible play control when the poster fails to load", () => {
    render(<PortfolioVideo video={video} projectSlug="galway-property" />);

    fireEvent.error(screen.getByAltText(video.poster.alt));

    expect(
      screen.getByRole("img", {
        name: `${video.poster.alt}. Image temporarily unavailable.`,
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: `Play ${video.title} on YouTube`,
      }),
    ).toBeTruthy();
    expect(screen.queryByTitle(video.title)).toBeNull();
  });

  it("shows retry and direct-watch controls when the iframe fails", () => {
    vi.useFakeTimers();
    render(<PortfolioVideo video={video} projectSlug="galway-property" />);
    fireEvent.click(
      screen.getByRole("button", {
        name: `Play ${video.title} on YouTube`,
      }),
    );

    act(() => {
      vi.advanceTimersByTime(VIDEO_LOAD_TIMEOUT_MS);
    });

    expect(screen.getByRole("alert").textContent).toContain(
      "The embedded player could not be loaded.",
    );
    expect(screen.getByRole("button", { name: "Try again" })).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Watch on YouTube" }).getAttribute(
        "href",
      ),
    ).toBe(`https://www.youtube.com/watch?v=${video.youtubeVideoId}`);
    expect(screen.getByAltText(video.poster.alt)).toBeTruthy();
  });

  it("accepts only canonical 11-character YouTube video IDs", () => {
    expect(isValidYouTubeVideoId("AbCdEfGhI12")).toBe(true);
    expect(isValidYouTubeVideoId("abc_123-XYZ")).toBe(true);
    expect(isValidYouTubeVideoId("MTGASk31sGo")).toBe(true);
    expect(isValidYouTubeVideoId("short")).toBe(false);
    expect(isValidYouTubeVideoId("AbCdEfGhI12?autoplay=1")).toBe(false);
  });
});
