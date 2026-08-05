import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import RealEstatePage from "@/app/real-estate/page";
import { HomeCertsSection } from "@/components/home/HomeSections";

vi.mock("@/components/real-estate/RealEstateEnquiryForm", () => ({
  RealEstateEnquiryForm: () => <section id="enquiry">Enquiry form</section>,
}));

describe("drone qualification trust signals", () => {
  afterEach(cleanup);

  it("shows the concise qualification cards and property-media CTA on the homepage", () => {
    render(<HomeCertsSection />);

    expect(screen.getByRole("heading", { name: "Qualified and Insured Drone Operations" })).toBeTruthy();
    expect(screen.getByAltText("Irish Aviation Authority")).toBeTruthy();
    expect(screen.getByAltText("European Union Aviation Safety Agency")).toBeTruthy();
    expect(screen.getByAltText("Safe Pass")).toBeTruthy();
    expect(screen.getByAltText("Coverdrone")).toBeTruthy();
    expect(screen.getByText(/EASA A1\/A3 and A2 remote-pilot competency/)).toBeTruthy();
    expect(screen.getByText(/public-liability cover of up to €6\.5 million per occurrence/)).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: "Explore Property Media Services" })
        .getAttribute("href"),
    ).toBe("/real-estate");
  });

  it("shows the full qualification section and accurate safety limitations", () => {
    render(<RealEstatePage />);

    expect(screen.getByRole("heading", { name: "Qualified, Insured and Safety-Conscious Drone Operations" })).toBeTruthy();
    expect(screen.getByText(/registered as a drone operator with the Irish Aviation Authority/)).toBeTruthy();
    expect(screen.getByText(/EASA Open Category A1\/A3 and A2 competency certificates/)).toBeTruthy();
    expect(screen.getAllByText(/subject to client permission, site-specific induction and the safety requirements of the principal contractor/)).toHaveLength(2);
    expect(screen.getByText(/specialist commercial drone insurance through Coverdrone/)).toBeTruthy();
    expect(
      screen.getByText("Can you work on active construction sites?"),
    ).toBeTruthy();
    expect(
      screen.getByText(
        "OpenÉire holds Safe Pass construction-safety training, supporting work on suitable active construction and development sites. Access remains subject to client permission, site-specific induction and the safety requirements of the principal contractor.",
      ),
    ).toBeTruthy();
    expect(
      screen.getByText(
        /Suitable for developments, active construction sites and multi-property projects, subject to site access and safety requirements\./,
      ),
    ).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/IAA certified|Specific Category/i);
    expect(document.querySelectorAll("h1")).toHaveLength(1);
  });
});
