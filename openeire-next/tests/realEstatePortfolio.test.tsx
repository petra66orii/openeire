import fs from "node:fs";
import path from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import RealEstatePortfolioPage, {
  metadata,
} from "@/app/real-estate/portfolio/page";
import { PortfolioProject } from "@/components/real-estate/PortfolioProject";
import {
  REAL_ESTATE_PORTFOLIO_PROJECTS,
  getPublishedPortfolioProjects,
  type RealEstatePortfolioProject,
} from "@/lib/realEstatePortfolio";
import { buildPortfolioJsonLd } from "@/lib/seo/realEstatePortfolioJsonLd";

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
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
  services: ["Property photography", "Aerial drone stills"],
  featured: true,
  published: true,
  portfolioPermissionConfirmed: true,
  permissionReference: "CONSENT-REDACTED-001",
  ...overrides,
});

describe("real-estate portfolio", () => {
  afterEach(cleanup);

  it("renders the correct page heading, CTAs and professional empty state", () => {
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
        name: /portfolio is being prepared for publication/i,
      }),
    ).toBeTruthy();
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

  it("omits optional film and floor-plan sections when assets are absent", () => {
    render(<PortfolioProject project={buildProject()} />);

    expect(
      screen.queryByRole("heading", { name: "Property film" }),
    ).toBeNull();
    expect(
      screen.queryByRole("heading", { name: "Measured 2D floor plan" }),
    ).toBeNull();
    expect(
      screen.getByRole("heading", { name: "Property photography" }),
    ).toBeTruthy();
  });

  it("uses production metadata and the canonical portfolio URL", () => {
    expect(metadata.title).toBe(
      "Real Estate Photography Portfolio | OpenÉire Studios",
    );
    expect(metadata.description).toMatch(/drone media, property films/i);
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
        "/real-estate/portfolio",
      );
    }
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
    expect(REAL_ESTATE_PORTFOLIO_PROJECTS).toEqual([]);
    expect(publicPortfolioSources).not.toMatch(
      /\b[A-Z]\d{2}\s?[A-Z0-9]{4}\b/,
    );
  });
});
