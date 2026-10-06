import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import RealEstatePage from "@/app/real-estate/page";
import {
  REAL_ESTATE_SECTION_LINKS,
  RealEstateSectionNav,
} from "@/components/real-estate/RealEstateSectionNav";

vi.mock("@/components/real-estate/RealEstateEnquiryForm", () => ({
  RealEstateEnquiryForm: () => (
    <section
      id="enquire"
      className="scroll-mt-[calc(var(--site-header-height,96px)+var(--real-estate-section-nav-height,64px)+1rem)]"
    >
      Enquiry form
    </section>
  ),
}));

type ObserverCallback = IntersectionObserverCallback;

let observerCallback: ObserverCallback | undefined;
let observedIds: string[] = [];
let observerRootMargins: string[] = [];

class IntersectionObserverMock {
  readonly root = null;
  readonly rootMargin: string;
  readonly thresholds: readonly number[];

  constructor(callback: ObserverCallback, options?: IntersectionObserverInit) {
    observerCallback = callback;
    this.rootMargin = options?.rootMargin ?? "0px";
    observerRootMargins.push(this.rootMargin);
    this.thresholds = Array.isArray(options?.threshold)
      ? options.threshold
      : [options?.threshold ?? 0];
  }

  observe(target: Element) {
    observedIds.push(target.id);
  }

  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

const renderNavigationFixture = () =>
  render(
    <>
      <RealEstateSectionNav />
      {REAL_ESTATE_SECTION_LINKS.map(({ id }) => (
        <section id={id} key={id}>
          {id}
        </section>
      ))}
    </>,
  );

const stickyBlockingClassPattern =
  /(^|\s)(overflow(?:-[xy])?-(?:hidden|auto|scroll)|transform|filter|perspective|contain(?:-[^\s]+)?)(\s|$)/;

describe("real-estate section navigation", () => {
  beforeEach(() => {
    observerCallback = undefined;
    observedIds = [];
    observerRootMargins = [];
    window.history.replaceState({}, "", "/real-estate");
    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
    Object.defineProperty(Element.prototype, "scrollIntoView", {
      configurable: true,
      value: vi.fn(),
    });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    document.documentElement.style.removeProperty("--site-header-height");
    document.documentElement.style.removeProperty(
      "--real-estate-section-nav-height",
    );
  });

  it("uses one page-level sticky scope for the navigator and every target", () => {
    render(<RealEstatePage />);

    const nav = screen.getByRole("navigation", {
      name: "Property media page sections",
    });
    const scope = nav.closest("[data-real-estate-section-navigation-scope]");
    const credentials = screen.getByLabelText(
      "Professional property-media credentials",
    );

    expect(scope).toBe(nav.parentElement);
    expect(scope?.firstElementChild).toBe(nav);
    expect(credentials.nextElementSibling).toBe(scope);
    expect(nav.nextElementSibling?.tagName).toBe("MAIN");
    expect(nav.closest("section")).toBeNull();
    expect(nav.className).toContain("sticky");
    expect(nav.className).toContain("top-[var(--site-header-height,96px)]");

    for (const { id, label } of REAL_ESTATE_SECTION_LINKS) {
      const link = screen.getByRole("link", { name: label });
      const target = document.getElementById(id);
      expect(link.getAttribute("href")).toBe(`#${id}`);
      expect(target).toBeTruthy();
      expect(scope?.contains(target)).toBe(true);
      expect(target?.className).toContain("scroll-mt-[calc(");
    }
  });

  it("has no sticky-blocking overflow or containing-block classes on its ancestors", () => {
    render(<RealEstatePage />);

    const nav = screen.getByRole("navigation", {
      name: "Property media page sections",
    });
    const ancestorClasses: string[] = [];
    let ancestor = nav.parentElement;

    while (ancestor && ancestor !== document.documentElement) {
      ancestorClasses.push(ancestor.className);
      ancestor = ancestor.parentElement;
    }

    expect(ancestorClasses).toContain(
      "min-h-screen overflow-x-clip bg-black text-white",
    );
    expect(ancestorClasses).not.toEqual(
      expect.arrayContaining([
        expect.stringMatching(stickyBlockingClassPattern),
      ]),
    );
  });

  it("uses the dynamic header variable for sticky and anchor offsets", () => {
    document.documentElement.style.setProperty("--site-header-height", "128px");
    render(<RealEstatePage />);

    const nav = screen.getByRole("navigation", {
      name: "Property media page sections",
    });

    expect(nav.className).toContain("top-[var(--site-header-height,96px)]");
    for (const { id } of REAL_ESTATE_SECTION_LINKS) {
      expect(document.getElementById(id)?.className).toContain(
        "var(--site-header-height,96px)",
      );
      expect(document.getElementById(id)?.className).toContain(
        "var(--real-estate-section-nav-height,64px)",
      );
    }
    expect(observerRootMargins).toContain("-136px 0px -55% 0px");
  });

  it("keeps the mobile navigation on one horizontally scrollable row", () => {
    renderNavigationFixture();

    const nav = screen.getByRole("navigation", {
      name: "Property media page sections",
    });
    const scroller = nav.firstElementChild;
    const list = screen.getByRole("list");

    expect(scroller?.className).toContain("overflow-x-auto");
    expect(list.className).toContain("min-w-max");
    expect(list.className).toContain("flex-nowrap");
    expect(screen.getByRole("link", { name: "Packages" }).className).toContain(
      "min-h-11",
    );
  });

  it("updates the active state when an observed section enters the viewport", () => {
    renderNavigationFixture();

    expect(observedIds).toEqual(
      REAL_ESTATE_SECTION_LINKS.map(({ id }) => id),
    );

    const addons = document.getElementById("addons");
    expect(addons).toBeTruthy();
    act(() => {
      observerCallback?.(
        [
          {
            target: addons,
            isIntersecting: true,
            boundingClientRect: { top: 180 },
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });

    expect(
      screen.getByRole("link", { name: "Add-ons" }).getAttribute("aria-current"),
    ).toBe("location");
  });

  it("honours direct hashes and leaves anchor links keyboard focusable", async () => {
    window.history.replaceState({}, "", "/real-estate#process");
    renderNavigationFixture();

    const processLink = screen.getByRole("link", { name: "How It Works" });
    processLink.focus();

    expect(document.activeElement).toBe(processLink);
    expect(processLink.getAttribute("aria-current")).toBe("location");
    await waitFor(() => {
      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
        block: "start",
        behavior: "auto",
      });
    });
  });

  it("uses instant scrolling when reduced motion is preferred", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({ matches: true }),
    );
    renderNavigationFixture();

    fireEvent.click(screen.getByRole("link", { name: "FAQs" }));

    expect(document.getElementById("faqs")?.scrollIntoView).toHaveBeenCalledWith(
      { block: "start", behavior: "auto" },
    );
    expect(window.location.hash).toBe("#faqs");
  });

  it("smoothly scrolls anchor links when motion is allowed", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({ matches: false }),
    );
    renderNavigationFixture();

    fireEvent.click(screen.getByRole("link", { name: "Add-ons" }));

    expect(
      document.getElementById("addons")?.scrollIntoView,
    ).toHaveBeenCalledWith({ block: "start", behavior: "smooth" });
    expect(window.location.hash).toBe("#addons");
  });
});
