"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/ToastProvider";
import { normalizeAuthErrorMessage } from "@/lib/api/auth";
import { submitLicenseRequest } from "@/lib/api/licenseRequests";
import type {
  LicenceAssetType,
  LicenseRequestPayload,
} from "@/types/licenseRequests";

type LicenseRequestFormData = Omit<
  LicenseRequestPayload,
  "asset_id" | "asset_type"
>;

interface CommercialLicenceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetId: number;
  assetType: LicenceAssetType;
  assetTitle: string;
}

const getInitialFormData = (): LicenseRequestFormData => ({
  client_name: "",
  company: "",
  email: "",
  project_type: "COMMERCIAL",
  duration: "1_YEAR",
  territory: "IRELAND",
  permitted_media: "WEB_SOCIAL",
  reach_caps: "",
  exclusivity: "NON_EXCLUSIVE",
  message: "",
});

const getUserDisplayName = (
  user: ReturnType<typeof useAuth>["user"],
): string => {
  const fullName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  return fullName || user?.username || "";
};

export function CommercialLicenceRequestModal({
  isOpen,
  onClose,
  assetId,
  assetType,
  assetTitle,
}: CommercialLicenceRequestModalProps) {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<LicenseRequestFormData>(
    getInitialFormData,
  );
  const [agreements, setAgreements] = useState({ merch: false, ai: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const shouldLockEmail = Boolean(isAuthenticated && user?.email);
  const canSubmit = agreements.merch && agreements.ai && !isSubmitting;

  const accountEmailMessage = useMemo(() => {
    if (!shouldLockEmail || !user?.email) return null;
    return `Signed-in licence requests use your account email: ${user.email}`;
  }, [shouldLockEmail, user?.email]);

  useEffect(() => {
    if (!isOpen) return;

    setFormData({
      ...getInitialFormData(),
      client_name: getUserDisplayName(user),
      email: user?.email ?? "",
    });
    setAgreements({ merch: false, ai: false });
    setIsSubmitting(false);
    setErrorMessage(null);
  }, [isOpen, user]);

  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.width = originalBodyWidth;
      window.scrollTo({ top: scrollY, behavior: "auto" });
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleAgreementChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setAgreements((current) => ({ ...current, [name]: checked }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!agreements.merch || !agreements.ai) {
      setErrorMessage("Please confirm the licence terms before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitLicenseRequest({
        ...formData,
        client_name: formData.client_name.trim(),
        company: formData.company?.trim(),
        email: formData.email.trim(),
        reach_caps: formData.reach_caps?.trim(),
        message: formData.message?.trim(),
        asset_id: assetId,
        asset_type: assetType,
      });
      showToast(
        "Licence request submitted. We will be in touch shortly with a custom quote.",
        "success",
      );
      onClose();
    } catch (error) {
      setErrorMessage(
        normalizeAuthErrorMessage(
          error,
          "Could not submit your licence request. Please review the form and try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="commercial-licence-modal-title"
      aria-describedby="commercial-licence-modal-description"
    >
      <button
        type="button"
        className="fixed inset-0 cursor-default bg-black/80 backdrop-blur-sm"
        aria-label="Close commercial licence request"
        onClick={() => {
          if (!isSubmitting) onClose();
        }}
      />

      <div className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-gray-900 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-gray-900 p-6">
          <div>
            <h2
              id="commercial-licence-modal-title"
              className="font-serif text-xl font-bold text-white"
            >
              Request Commercial Licence
            </h2>
            <p
              id="commercial-licence-modal-description"
              className="mt-1 text-xs uppercase tracking-widest text-gray-400"
            >
              For: {assetTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="shrink-0 rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close commercial licence request"
          >
            <FaTimes aria-hidden="true" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 overflow-y-auto overscroll-contain p-6"
        >
          {errorMessage ? (
            <div className="rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-100">
              {errorMessage}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Full Name" inputId="licence-client-name" required>
              <input
                id="licence-client-name"
                required
                type="text"
                name="client_name"
                value={formData.client_name}
                onChange={handleFieldChange}
                className="w-full rounded-lg border border-white/20 bg-black p-3 text-white outline-none focus:border-accent"
              />
            </Field>
            <Field label="Company / Agency" inputId="licence-company">
              <input
                id="licence-company"
                type="text"
                name="company"
                value={formData.company}
                onChange={handleFieldChange}
                className="w-full rounded-lg border border-white/20 bg-black p-3 text-white outline-none focus:border-accent"
              />
            </Field>
          </div>

          <Field label="Email Address" inputId="licence-email" required>
            <input
              id="licence-email"
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFieldChange}
              readOnly={shouldLockEmail}
              aria-readonly={shouldLockEmail}
              className={[
                "w-full rounded-lg border border-white/20 bg-black p-3 text-white outline-none focus:border-accent",
                shouldLockEmail ? "cursor-not-allowed opacity-80" : "",
              ].join(" ")}
            />
            {accountEmailMessage ? (
              <p className="mt-2 text-xs text-gray-500">
                {accountEmailMessage}
              </p>
            ) : null}
          </Field>

          <div className="border-t border-white/10 pt-4">
            <h3 className="text-sm font-bold text-white">
              Licence Schedule Details
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Project Type" inputId="licence-project-type" required>
              <select
                id="licence-project-type"
                name="project_type"
                value={formData.project_type}
                onChange={handleFieldChange}
                className="w-full appearance-none rounded-lg border border-white/20 bg-black p-3 text-white outline-none focus:border-accent"
              >
                <option value="REAL_ESTATE">Real Estate / Property</option>
                <option value="CORPORATE">Corporate / B2B</option>
                <option value="EDITORIAL">Editorial / Documentary</option>
                <option value="COMMERCIAL">Commercial / Advertising</option>
                <option value="OTHER">Other</option>
              </select>
            </Field>
            <Field label="Permitted Media" inputId="licence-permitted-media" required>
              <select
                id="licence-permitted-media"
                name="permitted_media"
                value={formData.permitted_media}
                onChange={handleFieldChange}
                className="w-full appearance-none rounded-lg border border-white/20 bg-black p-3 text-white outline-none focus:border-accent"
              >
                <option value="WEB_SOCIAL">Web & Organic Social Only</option>
                <option value="PAID_DIGITAL">Paid Digital Ads</option>
                <option value="PRINT_BROCHURE">Print & Brochure</option>
                <option value="BROADCAST">TV / Broadcast / Cinema</option>
                <option value="ALL_MEDIA">All Media</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="Territory" inputId="licence-territory" required>
              <select
                id="licence-territory"
                name="territory"
                value={formData.territory}
                onChange={handleFieldChange}
                className="w-full appearance-none rounded-lg border border-white/20 bg-black p-3 text-white outline-none focus:border-accent"
              >
                <option value="IRELAND">Ireland Only</option>
                <option value="EU">EU / UK</option>
                <option value="US_NA">US / North America</option>
                <option value="SOUTH_AMERICA">South America</option>
                <option value="ASIA">Asia</option>
                <option value="AFRICA">Africa</option>
                <option value="OCEANIA">Oceania</option>
                <option value="WORLDWIDE">Worldwide</option>
              </select>
            </Field>
            <Field label="Duration" inputId="licence-duration" required>
              <select
                id="licence-duration"
                name="duration"
                value={formData.duration}
                onChange={handleFieldChange}
                className="w-full appearance-none rounded-lg border border-white/20 bg-black p-3 text-white outline-none focus:border-accent"
              >
                <option value="1_MONTH">1 Month</option>
                <option value="3_MONTHS">3 Months</option>
                <option value="6_MONTHS">6 Months</option>
                <option value="1_YEAR">1 Year</option>
                <option value="2_YEARS">2 Years</option>
                <option value="5_YEARS">5 Years</option>
                <option value="PERPETUAL">Perpetual</option>
                <option value="OTHER">Other</option>
              </select>
            </Field>
            <Field label="Exclusivity" inputId="licence-exclusivity" required>
              <select
                id="licence-exclusivity"
                name="exclusivity"
                value={formData.exclusivity}
                onChange={handleFieldChange}
                className="w-full appearance-none rounded-lg border border-white/20 bg-black p-3 text-white outline-none focus:border-accent"
              >
                <option value="NON_EXCLUSIVE">Non-Exclusive</option>
                <option value="CATEGORY">Category Exclusive</option>
                <option value="FULL">Fully Exclusive</option>
              </select>
            </Field>
          </div>

          <Field label="Additional Details" inputId="licence-message">
            <textarea
              id="licence-message"
              name="message"
              value={formData.message}
              onChange={handleFieldChange}
              rows={3}
              maxLength={2000}
              placeholder="Include reach caps if applicable, such as audience size, ad spend, or print run limits..."
              className="w-full resize-none rounded-lg border border-white/20 bg-black p-3 text-white outline-none focus:border-accent"
            />
          </Field>

          <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Required Legal Affirmations
            </p>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="merch"
                checked={agreements.merch}
                onChange={handleAgreementChange}
                className="mt-1 h-4 w-4 rounded border-gray-600 bg-black text-accent focus:ring-accent"
              />
              <span className="text-xs leading-relaxed text-gray-300">
                I understand this is a digital licence, not a transfer of
                ownership. This licence prohibits using the asset as the primary
                value component of merchandise or Print-on-Demand products for
                resale.
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="ai"
                checked={agreements.ai}
                onChange={handleAgreementChange}
                className="mt-1 h-4 w-4 rounded border-gray-600 bg-black text-accent focus:ring-accent"
              />
              <span className="text-xs leading-relaxed text-gray-300">
                I agree not to use, upload, or embed the asset for AI/ML
                training, dataset creation, generative model fine-tuning, or NFT
                minting.
              </span>
            </label>
          </div>

          <div className="border-t border-white/10 pt-4">
            <button
              type="submit"
              disabled={!canSubmit}
              className={[
                "w-full rounded-xl py-4 text-lg font-bold transition-all shadow-lg",
                canSubmit
                  ? "bg-white text-black hover:bg-gray-200 active:scale-[0.98]"
                  : "cursor-not-allowed bg-gray-700 text-gray-400",
              ].join(" ")}
            >
              {isSubmitting ? "Submitting..." : "Submit Licence Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  children,
  inputId,
  label,
  required = false,
}: {
  children: ReactNode;
  inputId: string;
  label: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
      >
        {label}
        {required ? " *" : ""}
      </label>
      {children}
    </div>
  );
}
