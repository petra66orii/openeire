import fs from "node:fs";
import path from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import RealEstatePage from "@/app/real-estate/page";
import RealEstatePortfolioPage, {
  metadata,
} from "@/app/real-estate/portfolio/page";
import { PortfolioProject } from "@/components/real-estate/PortfolioProject";
import {
  REAL_ESTATE_PORTFOLIO_PROJECTS,
  getDemonstratedPortfolioFormats,
  getPublishedPortfolioProjects,
  type RealEstatePortfolioProject,
} from "@/lib/realEstatePortfolio";
import { REAL_ESTATE_PACKAGES } from "@/lib/realEstate";
import {
  REAL_ESTATE_HERO_IMAGE,
  REAL_ESTATE_PORTFOLIO_HERO_IMAGE,
  REAL_ESTATE_PORTFOLIO_PATH,
} from "@/lib/realEstatePresentation";
import { buildPortfolioJsonLd } from "@/lib/seo/realEstatePortfolioJsonLd";

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));
vi.mock("@/components/real-estate/RealEstateEnquiryForm", () => ({
  RealEstateEnquiryForm: () => <section id="enquiry">Enquiry form</section>,
}));

const buildProject = (
  overrides: Partial<RealEstatePortfolioProject> = {},
): RealEstatePortfolioProject => ({
  slug: "county-galway-residence",
  title: "County Galway residential property",
  generalLocation: "County Galway",
  propertyType: "Detached residence",
  summary: "A balanced set of listing assets shaped around the property.",
  challenge: "Show the rooms, exterior and setting as one coherent listing.",
  approach: "Use natural compositions and a measured capture sequence.",
  deliverables: ["Interior and exterior photography", "Aerial drone stills"],
  packageName: "Pro plus floor-plan add-on",
  imageCount: 2,
  galleryImages: [
    {
      src: "/hero-poster.jpg",
      alt: "Wide landscape view used as a test portfolio image",
      width: 1920,
      height: 1080,
    },
  ],
  photographyFormats: ["photography", "aerialStills"],
  featured: true,
  published: true,
  portfolioPermissionConfirmed: true,
  permissionReference: "CONSENT-REDACTED-001",
  ...overrides,
});

describe("real-estate portfolio", () => {
  afterEach(cleanup);

  it("renders the approved project, gallery, heading and CTAs", () => {
    render(<RealEstatePortfolioPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Present every property with clarity/i,
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Discuss a Property" }).getAttribute("href"),
    ).toBe("/real-estate#enquiry");
    expect(
      screen
        .getByRole("link", { name: "View Services & Packages" })
        .getAttribute("href"),
    ).toBe("/real-estate");
    expect(
      screen.getByRole("heading", {
        name: "Detached residence in County Galway",
      }),
    ).toBeTruthy();
    expect(
      screen.queryByRole("heading", {
        name: /approved property work is being prepared for publication/i,
      }),
    ).toBeNull();
    expect(document.body.textContent).not.toMatch(
      /permission is still|seeking permission|written permissions/i,
    );
    expect(
      screen.getByRole("heading", {
        name: "Media demonstrated in published work.",
      }),
    ).toBeTruthy();
    expect(
      document.querySelector('[data-gallery-mode="responsive-marquee"]'),
    ).toBeTruthy();
  });

  it("places a secondary portfolio link in the main real-estate hero", () => {
    render(<RealEstatePage />);

    const portfolioLink = screen.getByRole("link", {
      name: "View Our Property Portfolio",
    });
    expect(portfolioLink.getAttribute("href")).toBe(
      REAL_ESTATE_PORTFOLIO_PATH,
    );
    expect(
      portfolioLink.closest("section")?.querySelector("h1")?.textContent,
    ).toBe("Property Photography and Drone Media in Galway and Across Connacht");
  });

  it("renders concise balanced package cards with Pro recommended", () => {
    render(<RealEstatePage />);

    const proCard = screen
      .getByRole("heading", { name: "Pro — €419 Total" })
      .closest("article");
    const essentialCard = screen
      .getByRole("heading", { name: "Essential — €175 Total" })
      .closest("article");
    const customCard = screen
      .getByRole("heading", { name: "Custom — Price on Application" })
      .closest("article");

    expect(proCard?.textContent).toContain("Recommended");
    expect(proCard?.textContent).toContain("Vertical 9:16 social video");
    expect(essentialCard?.textContent).not.toContain("duration of the active listing");
    expect(customCard?.className).toContain("lg:grid-cols-[0.75fr_1.5fr_auto]");
  });

  it("uses centrally configured approved property heroes", () => {
    expect(REAL_ESTATE_HERO_IMAGE).toMatchObject({
      src: "https://media.openeire.ie/portfolio/county-galway-20260724/drone-exterior-v1.webp",
      alt: "Aerial view of a residential property photographed by OpenÉire Studios",
      width: 2500,
      height: 1406,
    });
    expect(REAL_ESTATE_PORTFOLIO_HERO_IMAGE).toMatchObject({
      src: "https://media.openeire.ie/portfolio/county-galway-20260724/hero-v1.webp",
      alt: "Exterior view of a residential property photographed by OpenÉire Studios",
      width: 2500,
      height: 1406,
    });

    const pageSources = [
      path.join(process.cwd(), "app", "real-estate", "page.tsx"),
      path.join(process.cwd(), "app", "real-estate", "portfolio", "page.tsx"),
    ].map((target) => fs.readFileSync(target, "utf8"));

    for (const source of pageSources) {
      expect(source).toContain("<RealEstateHeroImage");
      expect(source).not.toContain('src="/hero-poster.jpg"');
      expect(source).not.toContain("url('/hero-poster.jpg')");
    }

    render(<RealEstatePage />);
    expect(
      screen.getByAltText(REAL_ESTATE_HERO_IMAGE.alt).getAttribute("src"),
    ).toContain(encodeURIComponent(REAL_ESTATE_HERO_IMAGE.src));

    cleanup();
    render(<RealEstatePortfolioPage />);
    expect(
      screen
        .getByAltText(REAL_ESTATE_PORTFOLIO_HERO_IMAGE.alt)
        .getAttribute("src"),
    ).toContain(encodeURIComponent(REAL_ESTATE_PORTFOLIO_HERO_IMAGE.src));
  });

  it("only returns projects with explicit publication and permission state", () => {
    const authorised = buildProject();
    const unpublished = buildProject({
      slug: "unpublished",
      title: "Unpublished project",
      published: false,
    });
    const unpermitted = buildProject({
      slug: "private",
      title: "Private Listing A65 F4E2",
      generalLocation: "Exact private location",
      galleryImages: [
        {
          src: "https://media.openeire.ie/private-property.webp",
          alt: "Private property asset",
          width: 1600,
          height: 1200,
        },
      ],
      portfolioPermissionConfirmed: false,
      permissionReference: undefined,
    });
    const missingReference = buildProject({
      slug: "missing-reference",
      title: "Missing permission reference",
      permissionReference: " ",
    });

    expect(
      getPublishedPortfolioProjects([
        authorised,
        unpublished,
        unpermitted,
        missingReference,
      ]),
    ).toEqual([authorised]);
  });

  it("renders no gallery for unpublished or unauthorised project collections", () => {
    const gatedProjects = getPublishedPortfolioProjects([
      buildProject({ published: false }),
      buildProject({
        slug: "unpermitted-gallery",
        portfolioPermissionConfirmed: false,
      }),
    ]);

    render(
      <>
        {gatedProjects.map((project) => (
          <PortfolioProject key={project.slug} project={project} />
        ))}
      </>,
    );

    expect(
      document.querySelector('[data-gallery-mode="responsive-marquee"]'),
    ).toBeNull();
  });

  it("publishes only the approved R2-backed project", () => {
    const project = REAL_ESTATE_PORTFOLIO_PROJECTS.find(
      ({ slug }) => slug === "detached-residence-county-galway",
    );

    expect(project).toBeTruthy();
    expect(project?.title).toBe("Detached residence in County Galway");
    expect(project?.title).not.toMatch(/Woodland residence/i);
    expect(project?.packageName).toBe(
      "Residential property media coverage",
    );
    expect(project?.published).toBe(true);
    expect(project?.portfolioPermissionConfirmed).toBe(true);
    expect(project?.permissionReference).toBe(
      "portfolio-approval-2026-07",
    );
    expect(project?.imageCount).toBe(8);
    expect(project?.galleryImages).toHaveLength(7);
    expect(project?.groundVideo).toMatchObject({
      youtubeVideoId: "MTGASk31sGo",
      poster: {
        src: "https://media.openeire.ie/portfolio/county-galway-20260724/drone-exterior-v1.webp",
        alt: "Aerial view of a residential property used as the video poster",
        width: 2500,
        height: 1406,
      },
      title: "Detached residence property film",
      width: 16,
      height: 9,
    });
    expect(project?.deliverables).toContain("Ground property video");
    expect(project?.aerialVideo).toBeUndefined();
    expect(project?.socialVideos).toBeUndefined();
    expect(project?.floorPlanImage).toBeUndefined();
    expect(getDemonstratedPortfolioFormats()).toEqual([
      "photography",
      "aerialStills",
      "groundVideo",
    ]);
    expect(
      getDemonstratedPortfolioFormats([
        { ...project!, published: true },
      ]),
    ).toEqual(["photography", "aerialStills", "groundVideo"]);

    const images = [project?.heroImage, ...(project?.galleryImages ?? [])];
    expect(images).toHaveLength(8);
    for (const image of images) {
      expect(image?.src).toMatch(
        /^https:\/\/media\.openeire\.ie\/portfolio\/county-galway-20260724\/[a-z0-9-]+\.webp$/,
      );
      expect(image?.width).toBeGreaterThan(0);
      expect(image?.height).toBeGreaterThan(0);
      expect(image?.alt.trim()).toBeTruthy();
    }
  });

  it("derives demonstrated formats only from authorised published media", () => {
    const photographyOnly = buildProject();
    expect(getDemonstratedPortfolioFormats([photographyOnly])).toEqual([
      "photography",
      "aerialStills",
    ]);

    const video = {
      youtubeVideoId: "AbCdEfGhI12",
      poster: {
        src: "/hero-poster.jpg",
        alt: "Video poster",
        width: 1920,
        height: 1080,
      },
      title: "Property film",
      description: "Approved test film.",
      width: 16,
      height: 9,
    };
    const allFormats = buildProject({
      groundVideo: video,
      aerialVideo: { ...video, youtubeVideoId: "JkLmNoPqR34" },
      socialVideos: [{ ...video, youtubeVideoId: "StUvWxYzA56" }],
      floorPlanImage: {
        src: "/hero-poster.jpg",
        alt: "Approved floor plan",
        width: 1600,
        height: 1200,
      },
    });
    expect(getDemonstratedPortfolioFormats([allFormats])).toEqual([
      "photography",
      "aerialStills",
      "groundVideo",
      "aerialVideo",
      "socialMediaCuts",
      "floorPlan",
    ]);

    expect(
      getDemonstratedPortfolioFormats([
        { ...allFormats, published: false },
        { ...allFormats, portfolioPermissionConfirmed: false },
        { ...allFormats, permissionReference: " " },
      ]),
    ).toEqual([]);
  });

  it("renders only evidence supported by the published project", () => {
    render(<RealEstatePortfolioPage />);

    expect(
      screen.queryByRole("heading", { name: "Vertical social-media video" }),
    ).toBeNull();
    expect(
      screen.queryByRole("heading", { name: "Measured 2D floor plans" }),
    ).toBeNull();
    expect(
      screen.getByRole("heading", {
        name: "Interior and exterior photography",
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Aerial drone stills" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Ground property video" }),
    ).toBeTruthy();
  });

  it("does not leak unauthorised project data into JSON-LD", () => {
    const authorised = buildProject();
    const unpermitted = buildProject({
      slug: "private",
      title: "Private Listing A65 F4E2",
      generalLocation: "Exact private location",
      portfolioPermissionConfirmed: false,
      permissionReference: undefined,
    });
    const publicProjects = getPublishedPortfolioProjects([
      authorised,
      unpermitted,
    ]);
    const serialized = JSON.stringify(buildPortfolioJsonLd(publicProjects));

    expect(serialized).toContain(authorised.title);
    expect(serialized).not.toContain(unpermitted.title);
    expect(serialized).not.toContain(unpermitted.generalLocation);
    expect(serialized).not.toContain("undefined");
    expect(serialized).not.toMatch(/\b[A-Z]\d{2}\s?[A-Z0-9]{4}\b/);
  });

  it("renders photography independently and omits all absent optional media", () => {
    render(<PortfolioProject project={buildProject()} />);

    expect(
      screen.queryByRole("heading", { name: "Property film" }),
    ).toBeNull();
    expect(
      screen.queryByRole("heading", { name: "Measured 2D floor plan" }),
    ).toBeNull();
    expect(
      screen.queryByRole("heading", { name: "Social-media films" }),
    ).toBeNull();
    expect(
      screen.getByRole("heading", { name: "Property photography" }),
    ).toBeTruthy();
  });

  it("features a single property film before deliverables and photography", () => {
    render(<PortfolioProject project={REAL_ESTATE_PORTFOLIO_PROJECTS[0]} />);

    const filmHeading = screen.getByRole("heading", {
      name: "Property film",
    });
    const deliverablesHeading = screen.getByRole("heading", {
      name: "Selected deliverables",
    });
    const photographyHeading = screen.getByRole("heading", {
      name: "Property photography",
    });
    const filmLayout = document.querySelector(
      '[data-property-video-layout="featured"]',
    );

    expect(filmLayout?.className).toContain("max-w-3xl");
    expect(
      filmHeading.compareDocumentPosition(deliverablesHeading) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      filmHeading.compareDocumentPosition(photographyHeading) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("uses production metadata and the canonical portfolio URL", () => {
    expect(metadata.title).toBe(
      "Real Estate Photography Portfolio | OpenÉire Studios",
    );
    expect(metadata.description).toMatch(
      /approved property photography, aerial media/i,
    );
    expect(metadata.alternates?.canonical).toBe(
      "https://openeire.ie/real-estate/portfolio",
    );
    expect(metadata.openGraph?.url).toBe(
      "https://openeire.ie/real-estate/portfolio",
    );
  });

  it("integrates the portfolio into service navigation, footer and service page", () => {
    const targets = [
      path.join(process.cwd(), "components", "layout", "Navbar.tsx"),
      path.join(process.cwd(), "components", "layout", "Footer.tsx"),
      path.join(process.cwd(), "app", "real-estate", "page.tsx"),
      path.join(process.cwd(), "app", "sitemap.ts"),
    ];

    for (const target of targets) {
      expect(fs.readFileSync(target, "utf8")).toContain(
        "REAL_ESTATE_PORTFOLIO_PATH",
      );
    }
  });

  it("keeps vertical social video and floor plans in the commercial catalogue", () => {
    const commercialCatalogue = JSON.stringify(REAL_ESTATE_PACKAGES);

    expect(commercialCatalogue).toMatch(/vertical 9:16 social-media video/i);
    expect(commercialCatalogue).toMatch(/Measured 2D floor plan/i);
    expect(commercialCatalogue).not.toMatch(/square 1:1|portrait and square/i);
  });

  it("does not import historical booking data into public portfolio code", () => {
    const publicPortfolioSources = [
      path.join(process.cwd(), "app", "real-estate", "portfolio", "page.tsx"),
      path.join(process.cwd(), "lib", "realEstatePortfolio.ts"),
      path.join(
        process.cwd(),
        "components",
        "real-estate",
        "PortfolioProject.tsx",
      ),
    ]
      .map((target) => fs.readFileSync(target, "utf8"))
      .join("\n");

    expect(publicPortfolioSources).not.toMatch(
      /(?:import|from|require\()[^\n]*(?:booking|agreement|client-record)/i,
    );
    expect(getPublishedPortfolioProjects()).toEqual([
      REAL_ESTATE_PORTFOLIO_PROJECTS[0],
    ]);
    expect(publicPortfolioSources).not.toMatch(
      /\b[A-Z]\d{2}\s?[A-Z0-9]{4}\b/,
    );
    expect(publicPortfolioSources).not.toMatch(
      /\b(?:Laura|Kathleen|KW Ireland)\b/i,
    );
  });
});
