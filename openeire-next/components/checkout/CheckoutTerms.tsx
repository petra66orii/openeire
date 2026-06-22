"use client";

import type { CheckoutFormState } from "@/types/checkout";

const LIVE_LEGAL_URLS = {
  terms: "https://openeire.ie/terms",
  privacy: "https://openeire.ie/privacy",
  licensing: "https://openeire.ie/licensing/terms",
} as const;

interface CheckoutTermsProps {
  value: Pick<
    CheckoutFormState,
    "acceptsTerms" | "acceptsPrivacy" | "acceptsPersonalUse"
  >;
  hasDigitalItems: boolean;
  onChange: (
    value: Pick<
      CheckoutFormState,
      "acceptsTerms" | "acceptsPrivacy" | "acceptsPersonalUse"
    >,
  ) => void;
}

export function CheckoutTerms({
  value,
  hasDigitalItems,
  onChange,
}: CheckoutTermsProps) {
  const updateField = (field: keyof CheckoutTermsProps["value"], checked: boolean) => {
    onChange({ ...value, [field]: checked });
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-gray-900 p-6 md:p-8">
      <div className="mb-6 border-b border-white/10 pb-4">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
          Review
        </p>
        <h2 className="mt-2 font-serif text-xl font-bold text-white">
          Terms & Acknowledgements
        </h2>
      </div>

      <div className="space-y-4 text-sm text-gray-300">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={value.acceptsTerms}
            onChange={(event) => updateField("acceptsTerms", event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-white/20 bg-black text-brand-500 focus:ring-brand-500"
          />
          <span>
            I agree to the{" "}
            <a
              href={LIVE_LEGAL_URLS.terms}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline-offset-4 hover:underline"
            >
              Terms & Conditions
            </a>
            .
          </span>
        </label>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={value.acceptsPrivacy}
            onChange={(event) => updateField("acceptsPrivacy", event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-white/20 bg-black text-brand-500 focus:ring-brand-500"
          />
          <span>
            I understand how my information is handled under the{" "}
            <a
              href={LIVE_LEGAL_URLS.privacy}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline-offset-4 hover:underline"
            >
              Privacy & Cookie Policy
            </a>
            .
          </span>
        </label>

        {hasDigitalItems ? (
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={value.acceptsPersonalUse}
              onChange={(event) =>
                updateField("acceptsPersonalUse", event.target.checked)
              }
              className="mt-1 h-4 w-4 rounded border-white/20 bg-black text-brand-500 focus:ring-brand-500"
            />
            <span>
              I understand digital purchases are for personal use only unless a
              separate commercial licence is agreed.{" "}
              <a
                href={LIVE_LEGAL_URLS.licensing}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline-offset-4 hover:underline"
              >
                View licence terms
              </a>
              .
            </span>
          </label>
        ) : null}
      </div>
    </section>
  );
}
