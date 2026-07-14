import fs from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RealEstateEnquiryForm } from "@/components/real-estate/RealEstateEnquiryForm";
import {
  REAL_ESTATE_PACKAGES,
  REAL_ESTATE_VAT_NOTE,
} from "@/lib/realEstate";

vi.mock("@/components/ui/ToastProvider", () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

vi.mock("@/lib/api/publicForms", () => ({
  getApiErrorMessage: () => "Request failed",
  submitRealEstateEnquiry: vi.fn(),
}));

vi.mock("@/lib/iubendaConsent", () => ({
  registerIubendaConsentForm: () => vi.fn(),
  submitIubendaConsentForm: vi.fn(),
}));

describe("active real-estate pricing", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/real-estate");
  });

  it("publishes the Pro package as €399 total", () => {
    const proPackage = REAL_ESTATE_PACKAGES.find(({ id }) => id === "pro");

    expect(proPackage?.price).toBe("€399 total");
  });

  it("renders the VAT non-registration note and active package options", () => {
    render(<RealEstateEnquiryForm />);

    expect(screen.getByText(REAL_ESTATE_VAT_NOTE)).toBeTruthy();

    const packageSelect = screen.getByLabelText("Preferred package");
    const optionLabels = Array.from(packageSelect.querySelectorAll("option")).map(
      (option) => option.textContent,
    );
    expect(optionLabels).toEqual([
      "Not sure",
      "Essential",
      "Starter",
      "Pro",
      "Premium",
      "Custom",
    ]);
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
});
