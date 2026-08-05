import fs from "node:fs";
import path from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RealEstateEnquiryForm } from "@/components/real-estate/RealEstateEnquiryForm";
import {
  REAL_ESTATE_ADDITIONAL_PHOTOGRAPH_COPY,
  REAL_ESTATE_PACKAGES,
  REAL_ESTATE_RUSH_DELIVERY_LABEL,
  REAL_ESTATE_RUSH_DELIVERY_NOTE,
  REAL_ESTATE_TURNAROUNDS,
  REAL_ESTATE_VAT_NOTE,
} from "@/lib/realEstate";

vi.mock("@/components/ui/ToastProvider", () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

vi.mock("@/lib/api/publicForms", () => ({
  getApiErrorMessage: () => "Request failed",
  getApiFieldErrors: () => ({}),
  submitRealEstateEnquiry: vi.fn(),
}));

vi.mock("@/lib/iubendaConsent", () => ({
  registerIubendaConsentForm: () => vi.fn(),
  submitIubendaConsentForm: vi.fn(),
}));

describe("active real-estate pricing", () => {
  afterEach(cleanup);
  beforeEach(() => {
    window.history.replaceState({}, "", "/real-estate");
  });

  it("publishes the authoritative package prices and photograph allowances", () => {
    expect(
      Object.fromEntries(
        REAL_ESTATE_PACKAGES.map(
          ({ id, priceAmount, includedPhotographs }) => [
            id,
            { priceAmount, includedPhotographs },
          ],
        ),
      ),
    ).toEqual({
      essential: { priceAmount: 175, includedPhotographs: 10 },
      starter: { priceAmount: 259, includedPhotographs: 25 },
      pro: { priceAmount: 419, includedPhotographs: 30 },
      premium: { priceAmount: 549, includedPhotographs: 35 },
      custom: { priceAmount: null, includedPhotographs: null },
    });

    const proPackage = REAL_ESTATE_PACKAGES.find(({ id }) => id === "pro");
    expect(proPackage?.text).toContain(
      "30 professionally edited interior and exterior ground photographs",
    );
    expect(proPackage?.text).toContain("60-90 second ground video");
    expect(proPackage?.text).toContain("60-90 second 4K aerial drone video");
    expect(proPackage?.text).toContain("measured 2D floor plan");
    expect(proPackage?.text).toContain("vertical 9:16 social-media video");
    expect(REAL_ESTATE_ADDITIONAL_PHOTOGRAPH_COPY).toContain(
      "€10 per photograph",
    );
  });

  it("drives package cards and JSON-LD from the shared catalogue", () => {
    const pageSource = fs.readFileSync(
      path.join(process.cwd(), "app", "real-estate", "page.tsx"),
      "utf8",
    );

    expect(pageSource).toContain(
      "{REAL_ESTATE_PACKAGES.slice(0, 4).map((item) => (",
    );
    expect(pageSource).toContain(
      "const realEstatePackageOffers = REAL_ESTATE_PACKAGES.map",
    );
    expect(pageSource).not.toMatch(
      /Includes (?:20|25|30) edited photos/,
    );
  });

  it("mirrors the package-aware API turnaround contract", () => {
    expect(REAL_ESTATE_TURNAROUNDS).toMatchObject({
      essential: {
        code: "next_business_day",
        label: "Next-business-day delivery",
      },
      starter: {
        code: "next_business_day",
        label: "Next-business-day delivery",
      },
      pro: {
        code: "two_business_days",
        label: "Delivery within 2 business days",
      },
      premium: {
        code: "two_business_days",
        label: "Delivery within 2 business days",
      },
      custom: {
        code: "specifically_agreed",
        label: "Turnaround as specifically agreed",
      },
      not_sure: {
        code: "specifically_agreed",
        label: "Turnaround as specifically agreed",
      },
    });
  });

  it("limits the rush add-on to still photography", () => {
    expect(REAL_ESTATE_RUSH_DELIVERY_LABEL).toContain("still photography only");
    expect(REAL_ESTATE_RUSH_DELIVERY_NOTE).toContain(
      "does not rush drone video, ground video, social-media video cuts",
    );
    expect(REAL_ESTATE_RUSH_DELIVERY_NOTE).toContain(
      "3D virtual tours, floor plans or other Premium outputs",
    );
  });

  it("renders the VAT non-registration note and active package options", () => {
    render(<RealEstateEnquiryForm />);

    expect(screen.getByText(REAL_ESTATE_VAT_NOTE)).toBeTruthy();

    const packageSelect = screen.getByLabelText(/Preferred package/);
    const optionLabels = Array.from(packageSelect.querySelectorAll("option")).map(
      (option) => option.textContent,
    );
    expect(optionLabels).toEqual([
      "Choose deliberately\u2026",
      "Essential \u2014 \u20ac175",
      "Starter \u2014 \u20ac259",
      "Pro \u2014 \u20ac419",
      "Premium \u2014 \u20ac549",
      "Custom \u2014 POA",
      "Not sure",
    ]);
  });

  it("publishes the approved SEO metadata and a single visible H1", () => {
    const pageSource = fs.readFileSync(
      path.join(process.cwd(), "app", "real-estate", "page.tsx"),
      "utf8",
    );

    expect(pageSource).toContain(
      "Property Photography Galway & Connacht | OpenÉire Studios",
    );
    expect(pageSource).toContain(
      "Property photography, drone stills, 4K video, floor plans and 3D tours for estate agents, developers and sellers in Galway and across Connacht.",
    );
    expect(pageSource.match(/<h1\b/g)).toHaveLength(1);
    expect(pageSource).not.toMatch(/square 1:1|portrait and square/i);
  });

  it("contains no legacy VAT-exclusive wording in active UI source", () => {
    const activeDirectories = ["app", "components", "lib"];
    const forbidden = [/\+\s*VAT/i, /ex-VAT/i, /VAT\s+(?:is\s+)?excluded/i];
    const violations: string[] = [];

    const inspect = (target: string) => {
      for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
        const entryPath = path.join(target, entry.name);
        if (entry.isDirectory()) {
          inspect(entryPath);
        } else if (/\.(?:ts|tsx)$/.test(entry.name)) {
          const source = fs.readFileSync(entryPath, "utf8");
          if (forbidden.some((pattern) => pattern.test(source))) {
            violations.push(path.relative(process.cwd(), entryPath));
          }
        }
      }
    };

    activeDirectories.forEach((directory) => inspect(path.join(process.cwd(), directory)));
    expect(violations).toEqual([]);
  });

  it("contains no blanket 24-hour delivery promise in active real-estate copy", () => {
    const targets = [
      path.join(process.cwd(), "app", "real-estate", "page.tsx"),
      path.join(process.cwd(), "lib", "realEstate.ts"),
    ];
    const forbidden = [
      /24-hour (?:delivery|turnaround)/i,
      /delivered within 24 hours after the shoot/i,
      /all packages are delivered within 24 hours/i,
    ];

    const violations = targets.filter((target) => {
      const source = fs.readFileSync(target, "utf8");
      return forbidden.some((pattern) => pattern.test(source));
    });

    expect(violations).toEqual([]);
  });
});
