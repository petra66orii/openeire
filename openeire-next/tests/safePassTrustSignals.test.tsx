import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import RealEstatePage from "@/app/real-estate/page";
import { HomeCertsSection } from "@/components/home/HomeSections";

vi.mock("@/components/real-estate/RealEstateEnquiryForm", () => ({
  RealEstateEnquiryForm: () => <section id="enquiry">Enquiry form</section>,
}));

describe("Safe Pass trust signals", () => {
  afterEach(cleanup);

  it("shows the Safe Pass trust item on the homepage", () => {
    render(<HomeCertsSection />);

    expect(screen.getByText("Valid SOLAS Safe Pass")).toBeTruthy();
  });

  it("shows the site-access assurance, FAQ and Custom package wording", () => {
    render(<RealEstatePage />);

    expect(
      screen.getByText(
        "Valid SOLAS Safe Pass held for construction-site access",
      ),
    ).toBeTruthy();
    expect(
      screen.getByText("Can you work on active construction sites?"),
    ).toBeTruthy();
    expect(
      screen.getByText(
        "Yes. A valid SOLAS Safe Pass is held for construction-site access. All work remains subject to the site manager’s induction, access requirements and safety procedures.",
      ),
    ).toBeTruthy();
    expect(
      screen.getByText(
        /Suitable for developments, active construction sites and multi-property projects, subject to site access and safety requirements\./,
      ),
    ).toBeTruthy();
  });
});
