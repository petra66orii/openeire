import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ContactForm } from "@/components/contact/ContactForm";

const mocks = vi.hoisted(() => ({
  send: vi.fn(),
  consent: vi.fn(),
}));

vi.mock("@/components/ui/ToastProvider", () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));
vi.mock("@/lib/api/publicForms", () => ({
  sendContactMessage: mocks.send,
  getApiErrorMessage: () => "Request failed",
}));
vi.mock("@/lib/iubendaConsent", () => ({
  registerIubendaConsentForm: () => vi.fn(),
  submitIubendaConsentForm: mocks.consent,
}));

describe("main contact form topics", () => {
  afterEach(cleanup);

  beforeEach(() => {
    mocks.send.mockReset().mockResolvedValue({ message: "Email sent successfully" });
    mocks.consent.mockReset();
  });

  it("keeps existing topics and offers a real-estate topic", () => {
    render(<ContactForm />);

    const topic = screen.getByLabelText("Topic") as HTMLSelectElement;
    const options = Array.from(topic.options).map(({ text, value }) => ({
      text,
      value,
    }));

    expect(options).toEqual(
      expect.arrayContaining([
        { text: "Real Estate / Property Media", value: "Real Estate" },
        { text: "Commercial Licensing", value: "Licensing" },
        { text: "Fine Art Prints", value: "Prints" },
        { text: "Commission / Drone Work", value: "Commission" },
        { text: "Technical Support", value: "Support" },
        { text: "Other Inquiry", value: "Other" },
      ]),
    );
  });

  it("shows a non-blocking link to the detailed real-estate form", () => {
    render(<ContactForm />);

    expect(screen.queryByText("Real Estate Enquiry Form")).toBeNull();
    fireEvent.change(screen.getByLabelText("Topic"), {
      target: { value: "Real Estate" },
    });

    const helperLink = screen.getByText("Real Estate Enquiry Form");
    expect(helperLink.getAttribute("href")).toBe("/real-estate");
    expect(screen.getByRole("button", { name: "Send Message" })).toBeTruthy();
  });

  it("submits the existing contact payload with the stable real-estate value", async () => {
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText("Your Name"), {
      target: { value: "Jane Owner" },
    });
    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Topic"), {
      target: { value: "Real Estate" },
    });
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "  I have a quick property-media question.  " },
    });
    fireEvent.submit(document.getElementById("contact-form")!);

    await waitFor(() => expect(mocks.send).toHaveBeenCalledTimes(1));
    expect(mocks.send).toHaveBeenCalledWith({
      name: "Jane Owner",
      email: "jane@example.com",
      subject: "Real Estate",
      message: "I have a quick property-media question.",
    });
    expect(mocks.consent).toHaveBeenCalledWith("contact-form");
  });
});
