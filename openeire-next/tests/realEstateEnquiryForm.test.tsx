import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RealEstateEnquiryForm } from "@/components/real-estate/RealEstateEnquiryForm";

const mocks = vi.hoisted(() => ({
  submit: vi.fn(),
  consent: vi.fn(),
}));

vi.mock("@/components/ui/ToastProvider", () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));
vi.mock("@/lib/api/publicForms", () => ({
  submitRealEstateEnquiry: mocks.submit,
  getApiErrorMessage: () => "Request failed",
  getApiFieldErrors: (error: { fieldErrors?: Record<string, string> }) =>
    error.fieldErrors ?? {},
}));
vi.mock("@/lib/iubendaConsent", () => ({
  registerIubendaConsentForm: () => vi.fn(),
  submitIubendaConsentForm: mocks.consent,
}));

const select = (name: string, value: string) =>
  fireEvent.change(document.querySelector(`[name="${name}"]`)!, {
    target: { value },
  });
const type = (name: string, value: string) =>
  fireEvent.change(document.querySelector(`[name="${name}"]`)!, {
    target: { value },
  });

function completeRequiredForm() {
  type("name", "Jane Agent");
  type("email", "jane@example.com");
  type("phone", "+353 87 123 4567");
  select("client_type", "estate_agent");
  type("company_name", "Example Agency");
  select("preferred_package", "starter");
  type("property_address", "Example House, Galway");
  select("county", "Galway");
  type("eircode", "H91 X4K8");
  select("property_type", "house");
  select("bedroom_count", "3");
  select("floor_count", "2");
  select("secondary_accommodation", "no");
  select("outbuildings", "no");
  select("grounds_size", "normal_garden");
  select("occupancy_status", "owner_occupied");
  select("access_provider", "enquirer");
  select("scheduling_preference", "flexible");
  select("preferred_time_window", "morning");
  select("on_camera", "no");
  fireEvent.click(document.querySelector('[name="readiness_acknowledged"]')!);
  fireEvent.click(screen.getByText(/I consent to Open/).closest("label")!.querySelector("input")!);
}

describe("real-estate shoot scoping form", () => {
  afterEach(cleanup);
  beforeEach(() => {
    mocks.submit.mockReset().mockResolvedValue({ id: 1 });
    mocks.consent.mockReset();
    window.history.replaceState({}, "", "/real-estate");
  });

  it("shows required guidance and starts with no silently selected package", () => {
    render(<RealEstateEnquiryForm />);
    expect(screen.getByText(/Fields marked/)).toBeTruthy();
    expect((document.querySelector('[name="preferred_package"]') as HTMLSelectElement).value).toBe("");
    expect(screen.getByLabelText(/Approximate internal floor area/).closest("div")?.textContent).toContain("Optional");
  });

  it("preserves valid package query preselection", async () => {
    window.history.replaceState({}, "", "/real-estate?package=premium");
    render(<RealEstateEnquiryForm />);
    await waitFor(() =>
      expect((document.querySelector('[name="preferred_package"]') as HTMLSelectElement).value).toBe("premium"),
    );
  });

  it("reveals conditional company, location, scope, access and presenter fields", () => {
    render(<RealEstateEnquiryForm />);
    select("client_type", "estate_agent");
    fireEvent.click(document.querySelector('[name="no_eircode"]')!);
    select("secondary_accommodation", "yes");
    select("outbuildings", "yes");
    select("access_provider", "tenant");
    select("on_camera", "yes");

    expect(screen.getByLabelText(/Company \/ agency name/)).toBeTruthy();
    expect(screen.getByLabelText(/Precise location details/)).toBeTruthy();
    expect(screen.getByLabelText(/Secondary accommodation description/)).toBeTruthy();
    expect(screen.getByLabelText(/Outbuilding description/)).toBeTruthy();
    expect(screen.getByLabelText(/Access contact name/)).toBeTruthy();
    expect(screen.getByLabelText(/Spoken-audio/)).toBeTruthy();
  });

  it("validates conditional company, location, scope, access and presenter details", () => {
    render(<RealEstateEnquiryForm />);
    select("client_type", "estate_agent");
    fireEvent.click(document.querySelector('[name="no_eircode"]')!);
    select("property_type", "other");
    select("secondary_accommodation", "yes");
    select("outbuildings", "yes");
    select("access_provider", "tenant");
    select("on_camera", "yes");
    fireEvent.submit(document.getElementById("real-estate-enquiry-form")!);

    expect(screen.getByText(/Company or agency name is required/)).toBeTruthy();
    expect(screen.getByText(/precise directions or a Google Maps link/)).toBeTruthy();
    expect(screen.getByText(/Describe the property category/)).toBeTruthy();
    expect(screen.getByText(/Describe the secondary accommodation/)).toBeTruthy();
    expect(screen.getByText(/Describe the outbuildings/)).toBeTruthy();
    expect(screen.getByText(/access contact's name/)).toBeTruthy();
    expect(screen.getByText(/spoken-audio or microphone requirements/)).toBeTruthy();
  });

  it("requires a future date only when a date is requested", () => {
    render(<RealEstateEnquiryForm />);
    select("scheduling_preference", "request_date");
    expect(screen.getByLabelText(/Preferred date/)).toBeTruthy();
    expect((document.querySelector('[name="preferred_date"]') as HTMLInputElement).min).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    select("scheduling_preference", "flexible");
    expect(document.querySelector('[name="preferred_date"]')).toBeNull();
  });

  it("rejects a manually entered past preferred date", () => {
    render(<RealEstateEnquiryForm />);
    select("scheduling_preference", "request_date");
    type("preferred_date", "2000-01-01");
    fireEvent.submit(document.getElementById("real-estate-enquiry-form")!);
    expect(screen.getByText("Preferred date cannot be in the past.")).toBeTruthy();
  });

  it("offers 3D tours where compatible and clears them after switching to Premium", () => {
    render(<RealEstateEnquiryForm />);
    select("preferred_package", "starter");
    fireEvent.click(screen.getByLabelText(/Hosted 3D virtual tour/));
    expect((screen.getByLabelText(/Hosted 3D virtual tour/) as HTMLInputElement).checked).toBe(true);
    select("preferred_package", "premium");
    expect(screen.queryByLabelText(/Hosted 3D virtual tour/)).toBeNull();
    expect(screen.getByText(/already included in the new package/)).toBeTruthy();
    expect(screen.queryByLabelText(/2D measured floor plan/)).toBeNull();
    expect(screen.queryByLabelText(/Additional social formats/)).toBeNull();
  });

  it("requires a bounded additional-stills quantity", () => {
    render(<RealEstateEnquiryForm />);
    fireEvent.click(screen.getByLabelText(/Additional edited stills/));
    const quantity = screen.getByLabelText(/Number of additional edited stills/) as HTMLInputElement;
    expect(quantity.min).toBe("1");
    expect(quantity.max).toBe("50");
    expect(quantity.step).toBe("1");
  });

  it("submits the structured payload and preserves Iubenda consent handling", async () => {
    render(<RealEstateEnquiryForm />);
    completeRequiredForm();
    fireEvent.submit(document.getElementById("real-estate-enquiry-form")!);

    await waitFor(() => expect(mocks.submit).toHaveBeenCalledTimes(1));
    expect(mocks.submit.mock.calls[0][0]).toMatchObject({
      form_schema_version: 2,
      client_type: "estate_agent",
      company_name: "Example Agency",
      preferred_package: "starter",
      property_type: "house",
      bedroom_count: "3",
      access_provider: "enquirer",
      scheduling_preference: "flexible",
      on_camera: "no",
      readiness_acknowledged: true,
      consent_to_contact: true,
    });
    expect(mocks.consent).toHaveBeenCalledWith("real-estate-enquiry-form");
  });

  it("maps backend field errors to their individual controls", async () => {
    mocks.submit.mockRejectedValueOnce({ fieldErrors: { eircode: "Backend Eircode error." } });
    render(<RealEstateEnquiryForm />);
    completeRequiredForm();
    fireEvent.submit(document.getElementById("real-estate-enquiry-form")!);
    expect(await screen.findByText("Backend Eircode error.")).toBeTruthy();
    expect(document.querySelector('[name="eircode"]')?.getAttribute("aria-invalid")).toBe("true");
  });
});
