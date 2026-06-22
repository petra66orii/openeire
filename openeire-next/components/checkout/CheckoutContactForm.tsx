"use client";

import type { CheckoutContactDetails } from "@/types/checkout";

interface CheckoutContactFormProps {
  value: CheckoutContactDetails;
  onChange: (value: CheckoutContactDetails) => void;
  lockedEmail?: string | null;
}

const inputClass =
  "w-full rounded-lg border border-white/20 bg-black p-4 text-white outline-none transition-all placeholder:text-gray-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500";

const labelClass =
  "mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500";

export function CheckoutContactForm({
  value,
  onChange,
  lockedEmail,
}: CheckoutContactFormProps) {
  const updateField = (field: keyof CheckoutContactDetails, nextValue: string) => {
    onChange({ ...value, [field]: nextValue });
  };

  const isEmailLocked = Boolean(lockedEmail);

  return (
    <section className="rounded-2xl border border-white/10 bg-gray-900 p-6 md:p-8">
      <div className="mb-6 border-b border-white/10 pb-4">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
          Contact
        </p>
        <h2 className="mt-2 font-serif text-xl font-bold text-white">
          Contact Details
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="checkout-name" className={labelClass}>
            Full Name
          </label>
          <input
            id="checkout-name"
            name="name"
            value={value.name}
            onChange={(event) => updateField("name", event.target.value)}
            autoComplete="name"
            className={inputClass}
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label htmlFor="checkout-email" className={labelClass}>
            Email
          </label>
          <input
            id="checkout-email"
            name="email"
            type="email"
            value={value.email}
            onChange={(event) => updateField("email", event.target.value)}
            autoComplete="email"
            readOnly={isEmailLocked}
            aria-readonly={isEmailLocked}
            className={`${inputClass} ${isEmailLocked ? "cursor-not-allowed opacity-80" : ""}`}
            placeholder="john@example.com"
            required
          />
          {isEmailLocked && lockedEmail ? (
            <p className="mt-2 text-xs text-gray-500">
              Signed-in purchases use your account email: {lockedEmail}
            </p>
          ) : null}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="checkout-phone" className={labelClass}>
            Phone
          </label>
          <input
            id="checkout-phone"
            name="phone"
            value={value.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            autoComplete="tel"
            className={inputClass}
            placeholder="+353 1 234 5678"
            required
          />
        </div>
      </div>
    </section>
  );
}

