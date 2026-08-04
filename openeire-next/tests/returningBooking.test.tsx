import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ReturningClientBookingForm } from "@/components/real-estate/ReturningClientBookingForm";

const PUBLIC_ID = "11111111-1111-4111-8111-111111111111";
const summary = { display_name: "Fiona Agent", company_name: "Fictional Homes", masked_email: "f***@example.test", masked_phone: "*** *** 4567", credential_expires_at: "2026-11-01T12:00:00Z" };
const response = (payload: unknown, ok = true, status = ok ? 200 : 400) => Promise.resolve({ ok, status, json: () => Promise.resolve(payload) } as Response);

const select = (id: string, value: string) => fireEvent.change(document.getElementById(`booking-${id}`)!, { target: { value } });
const type = (id: string, value: string) => fireEvent.change(document.getElementById(`booking-${id}`)!, { target: { value } });

async function openForm(fetchMock = vi.fn()
  .mockImplementationOnce(() => response({ state: "valid" }))
  .mockImplementationOnce(() => response({ state: "valid", client: summary }))) {
  vi.stubGlobal("fetch", fetchMock);
  window.history.replaceState({}, "", `/book/${PUBLIC_ID}#fictional-fragment-secret`);
  render(<ReturningClientBookingForm credentialPublicId={PUBLIC_ID} />);
  await screen.findByText("Saved client details");
  return fetchMock;
}

function completeVisibleFields() {
  type("property_address", "Fictional House, Galway");
  select("county", "Galway");
  type("eircode", "H91 X4K8");
  select("property_type", "house");
  select("bedroom_count", "3");
  select("floor_count", "2");
  select("preferred_package", "starter");
  select("scheduling_preference", "flexible");
  select("preferred_time_window", "morning");
  select("access_provider", "enquirer");
  for (const textValue of [
    /property will be cleaned/i,
    /saved contact details above/i,
    /may contact me about this operational/i,
  ]) fireEvent.click(screen.getByText(textValue).closest("label")!.querySelector("input")!);
}

describe("returning-client short booking form", () => {
  beforeEach(() => vi.stubGlobal("crypto", { randomUUID: vi.fn(() => "22222222-2222-4222-8222-222222222222") }));
  afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

  it("removes the fragment before exchange and displays only masked saved details", async () => {
    const fetchMock = await openForm();
    expect(window.location.hash).toBe("");
    expect(fetchMock.mock.calls[0][0]).toBe("/api/book/exchange");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ public_id: PUBLIC_ID, secret: "fictional-fragment-secret" });
    expect(screen.getByText("f***@example.test")).toBeTruthy();
    expect(screen.getByText("*** *** 4567")).toBeTruthy();
    expect(document.body.textContent).not.toContain("FIONA@EXAMPLE.TEST");
  });

  it("keeps secondary, land, add-on and presenter questions optional and conditional", async () => {
    await openForm();
    expect(screen.getByText(/Additional property details/)).toBeTruthy();
    expect(document.getElementById("booking-secondary_accommodation_details")).toBeNull();
    expect(document.getElementById("booking-on_camera_people")).toBeNull();
    select("secondary_accommodation", "yes");
    select("on_camera", "yes");
    expect(screen.getByLabelText(/Secondary accommodation details/)).toBeTruthy();
    expect(screen.getByLabelText(/Who will appear or speak/)).toBeTruthy();
  });

  it("focuses the first invalid visible field", async () => {
    await openForm();
    fireEvent.submit(screen.getByRole("button", { name: /Send property request/ }).closest("form")!);
    await waitFor(() => expect(document.activeElement).toBe(document.getElementById("booking-property_address")));
  });

  it("submits a stable UUID without authoritative identity fields", async () => {
    const fetchMock = vi.fn()
      .mockImplementationOnce(() => response({ state: "valid" }))
      .mockImplementationOnce(() => response({ state: "valid", client: summary }))
      .mockImplementationOnce(() => response({ state: "submitted", duplicate: false }, true, 201));
    await openForm(fetchMock);
    completeVisibleFields();
    fireEvent.submit(screen.getByRole("button", { name: /Send property request/ }).closest("form")!);
    await screen.findByText("Property request received");
    const body = JSON.parse(fetchMock.mock.calls[2][1].body);
    expect(body.submission_id).toBe("22222222-2222-4222-8222-222222222222");
    expect(body).not.toHaveProperty("name");
    expect(body).not.toHaveProperty("email");
    expect(body).not.toHaveProperty("phone");
    expect(body).not.toHaveProperty("client_id");
  });

  it("preserves entered values after backend validation errors", async () => {
    const fetchMock = vi.fn()
      .mockImplementationOnce(() => response({ state: "valid" }))
      .mockImplementationOnce(() => response({ state: "valid", client: summary }))
      .mockImplementationOnce(() => response({ property_address: ["Backend validation error."] }, false, 400));
    await openForm(fetchMock);
    completeVisibleFields();
    fireEvent.submit(screen.getByRole("button", { name: /Send property request/ }).closest("form")!);
    await screen.findByText("Backend validation error.");
    expect((document.getElementById("booking-property_address") as HTMLTextAreaElement).value).toBe("Fictional House, Galway");
    await waitFor(() => expect(document.activeElement).toBe(document.getElementById("booking-property_address")));
  });

  it("requires land scope only for relevant property categories", async () => {
    await openForm();
    completeVisibleFields();
    select("property_type", "agricultural");
    fireEvent.submit(screen.getByRole("button", { name: /Send property request/ }).closest("form")!);
    expect(await screen.findByText("Provide the approximate land or grounds size.")).toBeTruthy();
    select("grounds_size", "1_to_5_acres");
    fireEvent.submit(screen.getByRole("button", { name: /Send property request/ }).closest("form")!);
    expect(await screen.findByText("Confirm whether outbuildings are included.")).toBeTruthy();
  });

  it("shows package inclusion conflicts without losing form state", async () => {
    await openForm();
    completeVisibleFields();
    select("preferred_package", "premium");
    fireEvent.click(screen.getByText("Additional social cuts").closest("label")!.querySelector("input")!);
    fireEvent.submit(screen.getByRole("button", { name: /Send property request/ }).closest("form")!);
    expect(await screen.findByText(/already included in the package/i)).toBeTruthy();
    expect((document.getElementById("booking-property_address") as HTMLTextAreaElement).value).toBe("Fictional House, Galway");
  });

  it("guards against a synchronous double submit while retaining one submission UUID", async () => {
    const pending = new Promise<Response>(() => {});
    const fetchMock = vi.fn()
      .mockImplementationOnce(() => response({ state: "valid" }))
      .mockImplementationOnce(() => response({ state: "valid", client: summary }))
      .mockImplementationOnce(() => pending);
    await openForm(fetchMock);
    completeVisibleFields();
    const form = screen.getByRole("button", { name: /Send property request/ }).closest("form")!;
    fireEvent.submit(form);
    fireEvent.submit(form);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(JSON.parse(fetchMock.mock.calls[2][1].body).submission_id).toBe("22222222-2222-4222-8222-222222222222");
  });
});
