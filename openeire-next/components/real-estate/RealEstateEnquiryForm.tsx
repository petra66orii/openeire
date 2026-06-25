"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";
import { useToast } from "@/components/ui/ToastProvider";
import {
  getApiErrorMessage,
  submitRealEstateEnquiry,
} from "@/lib/api/publicForms";
import {
  registerIubendaConsentForm,
  submitIubendaConsentForm,
} from "@/lib/iubendaConsent";
import type {
  AddOnKey,
  ClientType,
  HowHeard,
  PackageType,
  RealEstateEnquiryPayload,
} from "@/types/publicForms";

const FORM_ID = "real-estate-enquiry-form";
const SUBMIT_ID = "real-estate-enquiry-submit";

type RealEstateFormData = {
  name: string;
  email: string;
  phone: string;
  company_name: string;
  client_type: "" | ClientType;
  property_address: string;
  eircode: string;
  county: string;
  property_type: string;
  preferred_package: PackageType;
  add_ons: AddOnKey[];
  preferred_date: string;
  how_heard: "" | HowHeard;
  message: string;
  consent_to_contact: boolean;
};

type FormErrors = Partial<Record<keyof RealEstateFormData | "submit", string>>;

const initialFormData: RealEstateFormData = {
  name: "",
  email: "",
  phone: "",
  company_name: "",
  client_type: "",
  property_address: "",
  eircode: "",
  county: "",
  property_type: "",
  preferred_package: "not_sure",
  add_ons: [],
  preferred_date: "",
  how_heard: "",
  message: "",
  consent_to_contact: false,
};

const clientTypeOptions = [
  "estate_agent",
  "developer",
  "private_seller",
  "landlord",
  "other",
] as const satisfies readonly ClientType[];

const packageOptions = [
  "essential",
  "starter",
  "pro",
  "premium",
  "custom",
  "not_sure",
] as const satisfies readonly PackageType[];

const howHeardOptions = [
  "google",
  "instagram",
  "facebook",
  "linkedin",
  "referral",
  "estate_agent_colleague",
  "openeire_website",
  "other",
  "not_sure",
] as const satisfies readonly HowHeard[];

const addOns: Array<{ key: AddOnKey; label: string; price: string }> = [
  {
    key: "additional_stills",
    label: "Additional edited stills",
    price: "€10 + VAT per image",
  },
  { key: "floor_plan", label: "Floor plan, 2D measured", price: "€75 + VAT" },
  {
    key: "rush_delivery",
    label: "Rush same-day delivery, stills only",
    price: "€75 + VAT",
  },
  {
    key: "extended_drone_video",
    label: "Extended drone video, up to 3 minutes, fully edited",
    price: "€150 + VAT",
  },
  {
    key: "additional_social_cuts",
    label: "Additional social media cuts, extra formats or edits",
    price: "€50 + VAT",
  },
  {
    key: "travel_supplement",
    label: "Travel supplement beyond 40 km from base",
    price: "€0.50 + VAT per km",
  },
];

const requiredFields: Array<keyof RealEstateFormData> = [
  "name",
  "email",
  "phone",
  "client_type",
  "property_address",
  "county",
  "property_type",
  "preferred_package",
];

const fieldLabels: Partial<Record<keyof RealEstateFormData, string>> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  client_type: "Client type",
  property_address: "Property address",
  county: "County",
  property_type: "Property type",
  preferred_package: "Preferred package",
  consent_to_contact: "Consent to contact",
};

const inputClass =
  "w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-white placeholder-gray-600 outline-none transition-all focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]";
const labelClass =
  "mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-gray-500";

const trimOrUndefined = (value: string): string | undefined => {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const isOneOf = <T extends string>(
  value: string,
  options: readonly T[],
): value is T => options.includes(value as T);

function Field({
  inputId,
  label,
  error,
  children,
}: {
  inputId: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={inputId} className={labelClass}>
        {label}
      </label>
      {children}
      {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
    </div>
  );
}

export function RealEstateEnquiryForm() {
  const [formData, setFormData] = useState<RealEstateFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const { showToast } = useToast();

  useEffect(() => {
    return registerIubendaConsentForm({
      formId: FORM_ID,
      submitButtonId: SUBMIT_ID,
      subject: {
        full_name: "name",
        email: "email",
      },
      preferences: {
        real_estate_enquiry: "consent_to_contact",
      },
    });
  }, []);

  useEffect(() => {
    const requestedPackage = new URLSearchParams(window.location.search)
      .get("package")
      ?.trim();

    if (requestedPackage && isOneOf(requestedPackage, packageOptions)) {
      setFormData((current) => ({
        ...current,
        preferred_package: requestedPackage,
      }));
    }
  }, []);

  const handleFieldChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({
      ...current,
      [name]: undefined,
      submit: undefined,
    }));
  };

  const handleConsentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((current) => ({
      ...current,
      consent_to_contact: event.target.checked,
    }));
    setErrors((current) => ({
      ...current,
      consent_to_contact: undefined,
      submit: undefined,
    }));
  };

  const toggleAddOn = (key: AddOnKey) => {
    setFormData((current) => {
      const exists = current.add_ons.includes(key);
      return {
        ...current,
        add_ons: exists
          ? current.add_ons.filter((item) => item !== key)
          : [...current.add_ons, key],
      };
    });
  };

  const validateForm = (): FormErrors => {
    const nextErrors: FormErrors = {};

    for (const field of requiredFields) {
      const value = formData[field];
      if (typeof value === "string" && !value.trim()) {
        nextErrors[field] =
          `${fieldLabels[field] ?? "This field"} is required.`;
      }
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!formData.consent_to_contact) {
      nextErrors.consent_to_contact =
        "Please confirm we can contact you about this enquiry.";
    }

    return nextErrors;
  };

  const buildPayload = (): RealEstateEnquiryPayload => {
    const clientType = formData.client_type.trim();
    const preferredPackage = formData.preferred_package.trim();
    const howHeard = formData.how_heard.trim();

    if (!isOneOf(clientType, clientTypeOptions)) {
      throw new Error("Please choose a valid client type.");
    }
    if (!isOneOf(preferredPackage, packageOptions)) {
      throw new Error("Please choose a valid package.");
    }
    if (howHeard && !isOneOf(howHeard, howHeardOptions)) {
      throw new Error("Please choose a valid referral source.");
    }

    const companyName = trimOrUndefined(formData.company_name);
    const eircode = trimOrUndefined(formData.eircode);
    const preferredDate = trimOrUndefined(formData.preferred_date);
    const message = trimOrUndefined(formData.message);
    const howHeardValue: HowHeard | undefined = howHeard
      ? (howHeard as HowHeard)
      : undefined;

    return {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      client_type: clientType,
      property_address: formData.property_address.trim(),
      county: formData.county.trim(),
      property_type: formData.property_type.trim(),
      preferred_package: preferredPackage,
      consent_to_contact: formData.consent_to_contact,
      ...(companyName ? { company_name: companyName } : {}),
      ...(eircode ? { eircode } : {}),
      ...(formData.add_ons.length ? { add_ons: formData.add_ons } : {}),
      ...(preferredDate ? { preferred_date: preferredDate } : {}),
      ...(howHeardValue ? { how_heard: howHeardValue } : {}),
      ...(message ? { message } : {}),
    };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setStatus("submitting");
    setErrors({});

    try {
      const payload = buildPayload();
      await submitRealEstateEnquiry(payload);
      submitIubendaConsentForm(FORM_ID);
      setStatus("success");
      setFormData(initialFormData);
      showToast("Property enquiry sent successfully.", "success");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : getApiErrorMessage(
              error,
              "We could not send the enquiry. Please try again or email studio@openeire.ie.",
            );
      setErrors({ submit: message });
      setStatus("idle");
      showToast(message, "error");
    }
  };

  return (
    <section id="enquiry" className="scroll-mt-32 bg-gray-950 py-20">
      <div className="container mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent">
            Enquiry
          </p>
          <h2 className="font-serif text-3xl font-bold md:text-5xl">
            Request a property shoot.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-gray-400">
            Tell us what you need and we will review the details before
            confirming the cleanest scope for your listing.
          </p>
          <div className="mt-8 space-y-4 text-sm text-gray-300">
            <p className="flex items-center gap-3">
              <FaCalendarAlt className="text-[#16a34a]" aria-hidden="true" />
              Preferred dates are treated as requests until confirmed.
            </p>
            <p className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-[#16a34a]" aria-hidden="true" />
              Serving Galway, Mayo, Roscommon, Sligo and Leitrim.
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-black p-6 shadow-2xl md:p-8">
          {status === "success" ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <FaCheckCircle className="mb-5 text-5xl text-accent" />
              <h3 className="font-serif text-3xl font-bold">
                Thanks — enquiry received.
              </h3>
              <p className="mt-4 max-w-xl text-gray-400">
                Thanks — we’ve received your property shoot request. We’ll
                review the details and come back to you within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-8 rounded-full border border-white/20 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] transition hover:border-[#16a34a] hover:text-[#16a34a]"
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-6">
              <input
                type="hidden"
                name="consent_to_contact"
                value={formData.consent_to_contact ? "true" : "false"}
                readOnly
              />

              {errors.submit ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
                  {errors.submit}
                </div>
              ) : null}

              <div className="grid gap-5 md:grid-cols-2">
                <Field inputId="real-estate-name" label="Name" error={errors.name}>
                  <input
                    id="real-estate-name"
                    name="name"
                    value={formData.name}
                    onChange={handleFieldChange}
                    className={inputClass}
                    autoComplete="name"
                    required
                  />
                </Field>
                <Field
                  inputId="real-estate-email"
                  label="Email"
                  error={errors.email}
                >
                  <input
                    id="real-estate-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFieldChange}
                    className={inputClass}
                    autoComplete="email"
                    required
                  />
                </Field>
                <Field
                  inputId="real-estate-phone"
                  label="Phone"
                  error={errors.phone}
                >
                  <input
                    id="real-estate-phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleFieldChange}
                    className={inputClass}
                    autoComplete="tel"
                    required
                  />
                </Field>
                <Field inputId="real-estate-company" label="Company name">
                  <input
                    id="real-estate-company"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleFieldChange}
                    className={inputClass}
                    autoComplete="organization"
                  />
                </Field>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  inputId="real-estate-client-type"
                  label="Client type"
                  error={errors.client_type}
                >
                  <select
                    id="real-estate-client-type"
                    name="client_type"
                    value={formData.client_type}
                    onChange={handleFieldChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select...</option>
                    <option value="estate_agent">Estate agent</option>
                    <option value="developer">Developer</option>
                    <option value="private_seller">Private seller</option>
                    <option value="landlord">Landlord</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
                <Field
                  inputId="real-estate-package"
                  label="Preferred package"
                  error={errors.preferred_package}
                >
                  <select
                    id="real-estate-package"
                    name="preferred_package"
                    value={formData.preferred_package}
                    onChange={handleFieldChange}
                    className={inputClass}
                    required
                  >
                    <option value="not_sure">Not sure</option>
                    <option value="essential">Essential</option>
                    <option value="starter">Starter</option>
                    <option value="pro">Pro</option>
                    <option value="premium">Premium</option>
                    <option value="custom">Custom</option>
                  </select>
                </Field>
              </div>

              <Field
                inputId="real-estate-address"
                label="Property address"
                error={errors.property_address}
              >
                <input
                  id="real-estate-address"
                  name="property_address"
                  value={formData.property_address}
                  onChange={handleFieldChange}
                  className={inputClass}
                  autoComplete="street-address"
                  required
                />
              </Field>

              <div className="grid gap-5 md:grid-cols-3">
                <Field inputId="real-estate-eircode" label="Eircode">
                  <input
                    id="real-estate-eircode"
                    name="eircode"
                    value={formData.eircode}
                    onChange={handleFieldChange}
                    className={inputClass}
                    autoComplete="postal-code"
                  />
                </Field>
                <Field
                  inputId="real-estate-county"
                  label="County"
                  error={errors.county}
                >
                  <input
                    id="real-estate-county"
                    name="county"
                    value={formData.county}
                    onChange={handleFieldChange}
                    className={inputClass}
                    required
                  />
                </Field>
                <Field
                  inputId="real-estate-property-type"
                  label="Property type"
                  error={errors.property_type}
                >
                  <input
                    id="real-estate-property-type"
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleFieldChange}
                    className={inputClass}
                    placeholder="House, apartment, site..."
                    required
                  />
                </Field>
              </div>

              <div>
                <span className={labelClass}>Add-ons</span>
                <div className="grid gap-3 md:grid-cols-2">
                  {addOns.map((item) => (
                    <label
                      key={item.key}
                      className="flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-gray-950 p-4 text-sm transition hover:border-[#16a34a]/50"
                    >
                      <input
                        type="checkbox"
                        checked={formData.add_ons.includes(item.key)}
                        onChange={() => toggleAddOn(item.key)}
                        className="mt-1 h-4 w-4 rounded border-white/30 bg-black text-[#16a34a] focus:ring-[#16a34a]"
                      />
                      <span>
                        <span className="block font-bold text-white">
                          {item.label}
                        </span>
                        <span className="mt-1 block text-gray-400">
                          {item.price}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field inputId="real-estate-date" label="Preferred date">
                  <input
                    id="real-estate-date"
                    name="preferred_date"
                    type="date"
                    value={formData.preferred_date}
                    onChange={handleFieldChange}
                    className={inputClass}
                  />
                </Field>
                <Field
                  inputId="real-estate-how-heard"
                  label="How did you hear about us?"
                >
                  <select
                    id="real-estate-how-heard"
                    name="how_heard"
                    value={formData.how_heard}
                    onChange={handleFieldChange}
                    className={inputClass}
                  >
                    <option value="">Select...</option>
                    <option value="google">Google</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="referral">Referral</option>
                    <option value="estate_agent_colleague">
                      Estate agent colleague
                    </option>
                    <option value="openeire_website">OpenÉire website</option>
                    <option value="other">Other</option>
                    <option value="not_sure">Not sure</option>
                  </select>
                </Field>
              </div>

              <Field
                inputId="real-estate-message"
                label="Message / access notes / special requirements"
              >
                <textarea
                  id="real-estate-message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleFieldChange}
                  className={`${inputClass} resize-none`}
                />
              </Field>

              <div>
                <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-gray-950 p-4 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.consent_to_contact}
                    onChange={handleConsentChange}
                    className="mt-1 h-4 w-4 rounded border-white/30 bg-black text-[#16a34a] focus:ring-[#16a34a]"
                    required
                  />
                  <span>
                    I consent to OpenÉire Studios contacting me about this
                    property media enquiry.
                  </span>
                </label>
                {errors.consent_to_contact ? (
                  <p className="mt-2 text-sm text-red-300">
                    {errors.consent_to_contact}
                  </p>
                ) : null}
              </div>

              <button
                id={SUBMIT_ID}
                name="submit-button"
                type="submit"
                disabled={status === "submitting"}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#16a34a] px-6 py-4 font-bold text-white shadow-lg shadow-[#16a34a]/20 transition hover:bg-[#15803d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-900 border-t-transparent" />
                ) : (
                  <>
                    Send property enquiry
                    <FaPaperPlane aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
