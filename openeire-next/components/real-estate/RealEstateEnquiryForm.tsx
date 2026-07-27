"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { FaCalendarAlt, FaCheckCircle, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import { useToast } from "@/components/ui/ToastProvider";
import {
  getApiErrorMessage,
  getApiFieldErrors,
  submitRealEstateEnquiry,
} from "@/lib/api/publicForms";
import {
  registerIubendaConsentForm,
  submitIubendaConsentForm,
} from "@/lib/iubendaConsent";
import {
  REAL_ESTATE_ADDITIONAL_PHOTOGRAPH_COPY,
  REAL_ESTATE_ENQUIRY_PACKAGES,
  REAL_ESTATE_RUSH_DELIVERY_LABEL,
  REAL_ESTATE_RUSH_DELIVERY_NOTE,
  REAL_ESTATE_VAT_NOTE,
  getRealEstateTurnaround,
} from "@/lib/realEstate";
import type {
  AddOnKey,
  ClientType,
  HowHeard,
  PackageType,
  PropertyCategory,
  RealEstateEnquiryPayload,
  YesNoNotSure,
} from "@/types/publicForms";

const FORM_ID = "real-estate-enquiry-form";
const SUBMIT_ID = "real-estate-enquiry-submit";
const EIRCODE_RE = /^(?:[AC-FHKNPRTV-Y]\d{2}|D6W)\s?[0-9AC-FHKNPRTV-Y]{4}$/i;

type FormData = Omit<
  RealEstateEnquiryPayload,
  | "form_schema_version"
  | "client_type"
  | "preferred_package"
  | "property_type"
  | "bedroom_count"
  | "floor_count"
  | "secondary_accommodation"
  | "outbuildings"
  | "grounds_size"
  | "occupancy_status"
  | "access_provider"
  | "scheduling_preference"
  | "preferred_time_window"
  | "on_camera"
  | "how_heard"
  | "internal_floor_area"
  | "additional_stills_quantity"
> & {
  client_type: "" | ClientType;
  preferred_package: "" | PackageType;
  property_type: "" | PropertyCategory;
  bedroom_count: "" | RealEstateEnquiryPayload["bedroom_count"];
  floor_count: "" | RealEstateEnquiryPayload["floor_count"];
  secondary_accommodation: "" | YesNoNotSure;
  outbuildings: "" | YesNoNotSure;
  grounds_size: "" | RealEstateEnquiryPayload["grounds_size"];
  occupancy_status: "" | RealEstateEnquiryPayload["occupancy_status"];
  access_provider: "" | RealEstateEnquiryPayload["access_provider"];
  scheduling_preference: "" | RealEstateEnquiryPayload["scheduling_preference"];
  preferred_time_window: "" | RealEstateEnquiryPayload["preferred_time_window"];
  on_camera: "" | YesNoNotSure;
  internal_floor_area: string;
  additional_stills_quantity: string;
  eircode: string;
  location_details: string;
  property_type_details: string;
  secondary_accommodation_details: string;
  outbuildings_details: string;
  property_features: string;
  access_contact_name: string;
  access_contact_phone: string;
  access_notes: string;
  preferred_date: string;
  alternative_date: string;
  on_camera_people: string;
  audio_requirements: string;
  company_name: string;
  how_heard: "" | HowHeard;
  message: string;
  add_ons: AddOnKey[];
};

type FormErrors = Partial<Record<keyof FormData | "submit", string>>;

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  company_name: "",
  client_type: "",
  property_address: "",
  eircode: "",
  no_eircode: false,
  location_details: "",
  county: "",
  property_type: "",
  property_type_details: "",
  bedroom_count: "",
  floor_count: "",
  secondary_accommodation: "",
  secondary_accommodation_details: "",
  outbuildings: "",
  outbuildings_details: "",
  grounds_size: "",
  internal_floor_area: "",
  internal_floor_area_unit: undefined,
  property_features: "",
  occupancy_status: "",
  access_provider: "",
  access_contact_name: "",
  access_contact_phone: "",
  access_notes: "",
  readiness_acknowledged: false,
  preferred_package: "",
  add_ons: [],
  additional_stills_quantity: "",
  scheduling_preference: "",
  preferred_date: "",
  alternative_date: "",
  preferred_time_window: "",
  on_camera: "",
  on_camera_people: "",
  audio_requirements: "",
  how_heard: "",
  message: "",
  consent_to_contact: false,
};

const counties = [
  "Carlow", "Cavan", "Clare", "Cork", "Donegal", "Dublin", "Galway", "Kerry",
  "Kildare", "Kilkenny", "Laois", "Leitrim", "Limerick", "Longford", "Louth",
  "Mayo", "Meath", "Monaghan", "Offaly", "Roscommon", "Sligo", "Tipperary",
  "Waterford", "Westmeath", "Wexford", "Wicklow",
];
const addOns: Array<{ key: AddOnKey; label: string; price: string }> = [
  { key: "additional_stills", label: "Additional edited photographs", price: "€10 per photograph (maximum 50)" },
  { key: "floor_plan", label: "2D measured floor plan", price: "€75" },
  { key: "virtual_tour_3d", label: "Hosted 3D virtual tour", price: "€150" },
  { key: "rush_delivery", label: REAL_ESTATE_RUSH_DELIVERY_LABEL, price: "€75" },
  { key: "extended_drone_video", label: "Extended drone video, up to 3 minutes", price: "€150" },
  { key: "additional_social_cuts", label: "Additional social formats / cuts", price: "€50" },
];
const conflicts: Partial<Record<PackageType, AddOnKey[]>> = {
  pro: ["additional_social_cuts"],
  premium: ["floor_plan", "virtual_tour_3d", "additional_social_cuts"],
};

const inputClass =
  "w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-white outline-none transition focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]";
const labelClass = "mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-gray-400";

const localToday = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
};
const trim = (value: string) => value.trim();
const optional = (value: string) => trim(value) || undefined;

function Field({
  inputId,
  label,
  required = false,
  error,
  hint,
  children,
}: {
  inputId: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={inputId} className={labelClass}>
        {label} {required ? <span className="text-red-300">*</span> : <span className="normal-case tracking-normal text-gray-500">(Optional)</span>}
      </label>
      {children}
      {hint ? <p id={`${inputId}-hint`} className="mt-2 text-xs text-gray-500">{hint}</p> : null}
      {error ? <p id={`${inputId}-error`} className="mt-2 text-sm text-red-300">{error}</p> : null}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-5 rounded-2xl border border-white/10 p-5">
      <legend className="px-2 font-serif text-xl font-bold">{title}</legend>
      {children}
    </fieldset>
  );
}

export function RealEstateEnquiryForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [packageNotice, setPackageNotice] = useState("");
  const { showToast } = useToast();

  useEffect(() => registerIubendaConsentForm({
    formId: FORM_ID,
    submitButtonId: SUBMIT_ID,
    subject: { full_name: "name", email: "email" },
    preferences: { real_estate_enquiry: "consent_to_contact" },
  }), []);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("package")?.trim();
    if (
      requested &&
      REAL_ESTATE_ENQUIRY_PACKAGES.some(({ id }) => id === requested)
    ) {
      setFormData((current) => ({ ...current, preferred_package: requested as PackageType }));
    }
  }, []);

  const a11y = (field: keyof FormData, hint = false) => ({
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": [
      hint ? `real-estate-${String(field).replaceAll("_", "-")}-hint` : "",
      errors[field] ? `real-estate-${String(field).replaceAll("_", "-")}-error` : "",
    ].filter(Boolean).join(" ") || undefined,
  });

  const change = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (name === "preferred_package") {
      const nextPackage = value as PackageType;
      const blocked = conflicts[nextPackage] ?? [];
      const removed = formData.add_ons.filter((item) => blocked.includes(item));
      setFormData((current) => ({
        ...current,
        preferred_package: nextPackage,
        add_ons: current.add_ons.filter((item) => !blocked.includes(item)),
        additional_stills_quantity: blocked.includes("additional_stills")
          ? ""
          : current.additional_stills_quantity,
      }));
      setPackageNotice(removed.length
        ? "Add-ons already included in the new package were removed."
        : "");
    } else {
      setFormData((current) => ({ ...current, [name]: value }));
    }
    setErrors((current) => ({ ...current, [name]: undefined, submit: undefined }));
  };

  const checkbox = (field: "no_eircode" | "readiness_acknowledged" | "consent_to_contact") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      setFormData((current) => ({
        ...current,
        [field]: checked,
        ...(field === "no_eircode" && checked ? { eircode: "" } : {}),
      }));
      setErrors((current) => ({ ...current, [field]: undefined, eircode: undefined, submit: undefined }));
    };

  const toggleAddOn = (key: AddOnKey) => {
    setFormData((current) => {
      const selected = current.add_ons.includes(key);
      return {
        ...current,
        add_ons: selected ? current.add_ons.filter((item) => item !== key) : [...current.add_ons, key],
        additional_stills_quantity:
          key === "additional_stills" && selected ? "" : current.additional_stills_quantity,
      };
    });
    setErrors((current) => ({ ...current, add_ons: undefined, additional_stills_quantity: undefined }));
  };

  const validate = () => {
    const next: FormErrors = {};
    const required: Array<[keyof FormData, string]> = [
      ["name", "Name"], ["email", "Email"], ["phone", "Phone"],
      ["client_type", "Client type"], ["preferred_package", "Preferred package"],
      ["property_address", "Property address"], ["county", "County"],
      ["property_type", "Property category"], ["bedroom_count", "Bedroom count"],
      ["floor_count", "Number of floors"], ["secondary_accommodation", "Secondary accommodation"],
      ["outbuildings", "Outbuildings"], ["grounds_size", "Grounds / site size"],
      ["occupancy_status", "Occupancy status"], ["access_provider", "Access provider"],
      ["scheduling_preference", "Scheduling preference"],
      ["preferred_time_window", "Preferred time window"], ["on_camera", "On-camera choice"],
    ];
    for (const [field, label] of required) {
      if (!String(formData[field] ?? "").trim()) next[field] = `${label} is required.`;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) next.email = "Enter a valid email address.";
    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length < 7 || phoneDigits.length > 15) next.phone = "Enter a plausible phone number.";
    if (["estate_agent", "developer"].includes(formData.client_type) && !trim(formData.company_name)) {
      next.company_name = "Company or agency name is required for this client type.";
    }
    if (formData.no_eircode) {
      if (!trim(formData.location_details)) next.location_details = "Provide precise directions or a Google Maps link.";
    } else if (!EIRCODE_RE.test(trim(formData.eircode))) {
      next.eircode = "Enter a valid Eircode or confirm that the property has none.";
    }
    if (formData.property_type === "other" && !trim(formData.property_type_details)) {
      next.property_type_details = "Describe the property category.";
    }
    if (formData.secondary_accommodation === "yes" && !trim(formData.secondary_accommodation_details)) {
      next.secondary_accommodation_details = "Describe the secondary accommodation.";
    }
    if (formData.outbuildings === "yes" && !trim(formData.outbuildings_details)) {
      next.outbuildings_details = "Describe the outbuildings.";
    }
    if (formData.internal_floor_area && (!Number.isInteger(Number(formData.internal_floor_area)) || Number(formData.internal_floor_area) < 1)) {
      next.internal_floor_area = "Enter a positive whole number.";
    }
    if (formData.internal_floor_area && !formData.internal_floor_area_unit) {
      next.internal_floor_area_unit = "Choose a floor-area unit.";
    }
    if (formData.access_provider && formData.access_provider !== "enquirer") {
      if (!trim(formData.access_contact_name)) next.access_contact_name = "Provide the access contact's name.";
      const digits = formData.access_contact_phone.replace(/\D/g, "");
      if (digits.length < 7 || digits.length > 15) next.access_contact_phone = "Provide a plausible access contact number.";
    }
    const today = localToday();
    if (formData.scheduling_preference === "request_date" && !formData.preferred_date) {
      next.preferred_date = "Choose a preferred date.";
    }
    if (formData.preferred_date && formData.preferred_date < today) next.preferred_date = "Preferred date cannot be in the past.";
    if (formData.alternative_date && formData.alternative_date < today) next.alternative_date = "Alternative date cannot be in the past.";
    if (formData.on_camera === "yes") {
      if (!trim(formData.on_camera_people)) next.on_camera_people = "Tell us who will appear on camera.";
      if (!trim(formData.audio_requirements)) next.audio_requirements = "Describe spoken-audio or microphone requirements.";
    }
    if (formData.add_ons.includes("additional_stills")) {
      const quantity = Number(formData.additional_stills_quantity);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
        next.additional_stills_quantity = "Choose a whole number from 1 to 50.";
      }
    }
    if (!formData.readiness_acknowledged) next.readiness_acknowledged = "Please acknowledge the readiness requirement.";
    if (!formData.consent_to_contact) next.consent_to_contact = "Please confirm we may contact you about this enquiry.";
    return next;
  };

  const focusFirstError = (next: FormErrors) => {
    const field = Object.keys(next).find((key) => key !== "submit");
    if (!field) return;
    requestAnimationFrame(() => {
      const control = document.querySelector<HTMLElement>(
        `[data-error-field="${field}"], [name="${field}"]:not([type="hidden"])`,
      );
      control?.focus();
      control?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  };

  const buildPayload = (): RealEstateEnquiryPayload => ({
    form_schema_version: 2,
    name: trim(formData.name),
    email: trim(formData.email),
    phone: trim(formData.phone),
    client_type: formData.client_type as ClientType,
    company_name: optional(formData.company_name),
    property_address: trim(formData.property_address),
    county: formData.county,
    eircode: optional(formData.eircode),
    no_eircode: formData.no_eircode,
    location_details: optional(formData.location_details),
    property_type: formData.property_type as PropertyCategory,
    property_type_details: optional(formData.property_type_details),
    bedroom_count: formData.bedroom_count as RealEstateEnquiryPayload["bedroom_count"],
    floor_count: formData.floor_count as RealEstateEnquiryPayload["floor_count"],
    secondary_accommodation: formData.secondary_accommodation as YesNoNotSure,
    secondary_accommodation_details: optional(formData.secondary_accommodation_details),
    outbuildings: formData.outbuildings as YesNoNotSure,
    outbuildings_details: optional(formData.outbuildings_details),
    grounds_size: formData.grounds_size as RealEstateEnquiryPayload["grounds_size"],
    internal_floor_area: formData.internal_floor_area ? Number(formData.internal_floor_area) : undefined,
    internal_floor_area_unit: formData.internal_floor_area ? formData.internal_floor_area_unit : undefined,
    property_features: optional(formData.property_features),
    occupancy_status: formData.occupancy_status as RealEstateEnquiryPayload["occupancy_status"],
    access_provider: formData.access_provider as RealEstateEnquiryPayload["access_provider"],
    access_contact_name: formData.access_provider === "enquirer" ? undefined : optional(formData.access_contact_name),
    access_contact_phone: formData.access_provider === "enquirer" ? undefined : optional(formData.access_contact_phone),
    access_notes: optional(formData.access_notes),
    readiness_acknowledged: formData.readiness_acknowledged,
    preferred_package: formData.preferred_package as PackageType,
    add_ons: formData.add_ons,
    additional_stills_quantity: formData.add_ons.includes("additional_stills")
      ? Number(formData.additional_stills_quantity)
      : undefined,
    scheduling_preference: formData.scheduling_preference as RealEstateEnquiryPayload["scheduling_preference"],
    preferred_date: formData.scheduling_preference === "request_date" ? optional(formData.preferred_date) : undefined,
    alternative_date: optional(formData.alternative_date),
    preferred_time_window: formData.preferred_time_window as RealEstateEnquiryPayload["preferred_time_window"],
    on_camera: formData.on_camera as YesNoNotSure,
    on_camera_people: formData.on_camera === "yes" ? optional(formData.on_camera_people) : undefined,
    audio_requirements: formData.on_camera === "yes" ? optional(formData.audio_requirements) : undefined,
    how_heard: formData.how_heard || undefined,
    message: optional(formData.message),
    consent_to_contact: formData.consent_to_contact,
  });

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = validate();
    if (Object.keys(next).length) {
      setErrors(next);
      focusFirstError(next);
      return;
    }
    setStatus("submitting");
    setErrors({});
    try {
      await submitRealEstateEnquiry(buildPayload());
      submitIubendaConsentForm(FORM_ID);
      setStatus("success");
      setFormData(initialFormData);
      showToast("Property enquiry sent successfully.", "success");
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error) as FormErrors;
      const message = getApiErrorMessage(error, "We could not send the enquiry. Please try again or email studio@openeire.ie.");
      const nextErrors = Object.keys(fieldErrors).length ? fieldErrors : { submit: message };
      setErrors(nextErrors);
      focusFirstError(nextErrors);
      setStatus("idle");
      showToast(message, "error");
    }
  };

  const option = (value: string, label: string) => <option key={value} value={value}>{label}</option>;
  const shownAddOns = addOns.filter(({ key }) => !conflicts[formData.preferred_package as PackageType]?.includes(key));
  const selectedPackage = REAL_ESTATE_ENQUIRY_PACKAGES.find(
    ({ id }) => id === formData.preferred_package,
  );

  if (status === "success") {
    return (
      <section id="enquiry" className="scroll-mt-32 bg-gray-950 py-20">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <FaCheckCircle className="mx-auto mb-5 text-5xl text-accent" />
          <h2 className="font-serif text-3xl font-bold">Thanks — enquiry received.</h2>
          <p className="mt-4 text-gray-400">We’ll review the requested scope and contact you before confirming a quote or date.</p>
          <button type="button" onClick={() => setStatus("idle")} className="mt-8 rounded-full border border-white/20 px-6 py-3">Send another enquiry</button>
        </div>
      </section>
    );
  }

  return (
    <section id="enquiry" className="scroll-mt-32 bg-gray-950 py-20">
      <div className="container mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent">Enquiry</p>
          <h2 className="font-serif text-3xl font-bold md:text-5xl">Scope your property shoot.</h2>
          <p className="mt-5 text-gray-400">These details help us quote, schedule and arrive with the right equipment.</p>
          <p className="mt-6 flex gap-3 text-sm text-gray-300"><FaCalendarAlt className="mt-1 text-[#16a34a]" />Dates are requests until confirmed.</p>
          <p className="mt-3 flex gap-3 text-sm text-gray-300"><FaMapMarkerAlt className="mt-1 text-[#16a34a]" />Travel is reviewed internally from the exact location.</p>
        </div>

        <form id={FORM_ID} onSubmit={submit} noValidate className="space-y-6 rounded-[2rem] border border-white/10 bg-black p-6 md:p-8">
          <input type="hidden" name="consent_to_contact" value={String(formData.consent_to_contact)} readOnly />
          <p className="text-sm text-gray-400">Fields marked <span className="text-red-300">*</span> are required.</p>
          {errors.submit ? <div role="alert" className="rounded-xl bg-red-500/10 p-4 text-red-100">{errors.submit}</div> : null}

          <Section title="Your details">
            <div className="grid gap-5 md:grid-cols-2">
              <Field inputId="real-estate-name" label="Name" required error={errors.name}><input id="real-estate-name" name="name" value={formData.name} onChange={change} className={inputClass} autoComplete="name" {...a11y("name")} /></Field>
              <Field inputId="real-estate-email" label="Email" required error={errors.email}><input id="real-estate-email" name="email" type="email" value={formData.email} onChange={change} className={inputClass} autoComplete="email" {...a11y("email")} /></Field>
              <Field inputId="real-estate-phone" label="Phone" required error={errors.phone}><input id="real-estate-phone" name="phone" type="tel" value={formData.phone} onChange={change} className={inputClass} autoComplete="tel" {...a11y("phone")} /></Field>
              <Field inputId="real-estate-client-type" label="Client type" required error={errors.client_type}><select id="real-estate-client-type" name="client_type" value={formData.client_type} onChange={change} className={inputClass} {...a11y("client_type")}><option value="">Select…</option>{option("estate_agent", "Estate agent")}{option("developer", "Developer")}{option("private_seller", "Private seller")}{option("landlord", "Landlord")}{option("other", "Other")}</select></Field>
              <Field inputId="real-estate-company-name" label="Company / agency name" required={["estate_agent", "developer"].includes(formData.client_type)} error={errors.company_name}><input id="real-estate-company-name" name="company_name" value={formData.company_name} onChange={change} className={inputClass} autoComplete="organization" {...a11y("company_name")} /></Field>
              <Field inputId="real-estate-preferred-package" label="Preferred package" required error={errors.preferred_package}>
                <select id="real-estate-preferred-package" name="preferred_package" value={formData.preferred_package} onChange={change} className={inputClass} {...a11y("preferred_package")}>
                  <option value="">Choose deliberately…</option>
                  {REAL_ESTATE_ENQUIRY_PACKAGES.map((packageItem) =>
                    option(
                      packageItem.id,
                      packageItem.id === "not_sure"
                        ? packageItem.name
                        : `${packageItem.name} — ${packageItem.price.replace(" total", "")}`,
                    ),
                  )}
                </select>
                {formData.preferred_package ? (
                  <div className="mt-2 space-y-1 text-sm leading-relaxed text-gray-400">
                    <p>{selectedPackage?.includedPhotographsLabel}.</p>
                    <p>
                      <strong>{getRealEstateTurnaround(formData.preferred_package).label}.</strong>
                    </p>
                    <p>{getRealEstateTurnaround(formData.preferred_package).detail}</p>
                  </div>
                ) : null}
              </Field>
            </div>
          </Section>

          <Section title="Exact property location">
            <Field inputId="real-estate-property-address" label="Property address" required error={errors.property_address}><textarea id="real-estate-property-address" name="property_address" value={formData.property_address} onChange={change} className={inputClass} rows={2} {...a11y("property_address")} /></Field>
            <div className="grid gap-5 md:grid-cols-2">
              <Field inputId="real-estate-county" label="County" required error={errors.county}><select id="real-estate-county" name="county" value={formData.county} onChange={change} className={inputClass} {...a11y("county")}><option value="">Select county…</option>{counties.map((county) => option(county, county))}</select></Field>
              {!formData.no_eircode ? <Field inputId="real-estate-eircode" label="Eircode" required error={errors.eircode}><input id="real-estate-eircode" name="eircode" value={formData.eircode} onChange={change} className={inputClass} autoComplete="postal-code" {...a11y("eircode")} /></Field> : null}
            </div>
            <label className="flex items-center gap-3 text-sm"><input type="checkbox" name="no_eircode" checked={formData.no_eircode} onChange={checkbox("no_eircode")} />Property has no Eircode</label>
            {formData.no_eircode ? <Field inputId="real-estate-location-details" label="Precise location details or Google Maps link" required error={errors.location_details}><textarea id="real-estate-location-details" name="location_details" value={formData.location_details} onChange={change} className={inputClass} rows={2} {...a11y("location_details")} /></Field> : null}
          </Section>

          <Section title="Property scope">
            <div className="grid gap-5 md:grid-cols-2">
              <Field inputId="real-estate-property-type" label="Property category" required error={errors.property_type}><select id="real-estate-property-type" name="property_type" value={formData.property_type} onChange={change} className={inputClass} {...a11y("property_type")}><option value="">Select…</option>{option("house", "House")}{option("apartment", "Apartment")}{option("new_build", "New build / development")}{option("site_land", "Site / land")}{option("commercial", "Commercial property")}{option("agricultural", "Agricultural property")}{option("other", "Other")}</select></Field>
              {formData.property_type === "other" ? <Field inputId="real-estate-property-type-details" label="Property category details" required error={errors.property_type_details}><input id="real-estate-property-type-details" name="property_type_details" value={formData.property_type_details} onChange={change} className={inputClass} {...a11y("property_type_details")} /></Field> : null}
              <Field inputId="real-estate-bedroom-count" label="Bedroom count" required error={errors.bedroom_count}><select id="real-estate-bedroom-count" name="bedroom_count" value={formData.bedroom_count} onChange={change} className={inputClass} {...a11y("bedroom_count")}><option value="">Select…</option>{["studio", "1", "2", "3", "4", "5", "6_plus", "not_applicable"].map((v) => option(v, v === "6_plus" ? "6+" : v === "not_applicable" ? "Not applicable" : v[0].toUpperCase() + v.slice(1)))}</select></Field>
              <Field inputId="real-estate-floor-count" label="Number of floors" required error={errors.floor_count}><select id="real-estate-floor-count" name="floor_count" value={formData.floor_count} onChange={change} className={inputClass} {...a11y("floor_count")}><option value="">Select…</option>{option("1", "1")}{option("2", "2")}{option("3", "3")}{option("4_plus", "4+")}{option("not_applicable", "Not applicable")}</select></Field>
              <Field inputId="real-estate-secondary-accommodation" label="Secondary accommodation" required error={errors.secondary_accommodation}><select id="real-estate-secondary-accommodation" name="secondary_accommodation" value={formData.secondary_accommodation} onChange={change} className={inputClass} {...a11y("secondary_accommodation")}><option value="">Select…</option>{option("yes", "Yes")}{option("no", "No")}{option("not_sure", "Not sure")}</select></Field>
              <Field inputId="real-estate-outbuildings" label="Outbuildings" required error={errors.outbuildings}><select id="real-estate-outbuildings" name="outbuildings" value={formData.outbuildings} onChange={change} className={inputClass} {...a11y("outbuildings")}><option value="">Select…</option>{option("yes", "Yes")}{option("no", "No")}{option("not_sure", "Not sure")}</select></Field>
            </div>
            {formData.secondary_accommodation === "yes" ? <Field inputId="real-estate-secondary-accommodation-details" label="Secondary accommodation description" required error={errors.secondary_accommodation_details}><textarea id="real-estate-secondary-accommodation-details" name="secondary_accommodation_details" value={formData.secondary_accommodation_details} onChange={change} className={inputClass} rows={2} {...a11y("secondary_accommodation_details")} /></Field> : null}
            {formData.outbuildings === "yes" ? <Field inputId="real-estate-outbuildings-details" label="Outbuilding description" required error={errors.outbuildings_details}><textarea id="real-estate-outbuildings-details" name="outbuildings_details" value={formData.outbuildings_details} onChange={change} className={inputClass} rows={2} {...a11y("outbuildings_details")} /></Field> : null}
            <Field inputId="real-estate-grounds-size" label="Grounds / site size" required error={errors.grounds_size}><select id="real-estate-grounds-size" name="grounds_size" value={formData.grounds_size} onChange={change} className={inputClass} {...a11y("grounds_size")}><option value="">Select…</option>{option("no_grounds", "No grounds")}{option("normal_garden", "Normal garden")}{option("large_garden", "Large garden")}{option("under_1_acre", "Under 1 acre")}{option("1_to_5_acres", "1–5 acres")}{option("over_5_acres", "Over 5 acres")}{option("not_sure", "Not sure")}{option("not_applicable", "Not applicable")}</select></Field>
            <div className="grid gap-5 md:grid-cols-2">
              <Field inputId="real-estate-internal-floor-area" label="Approximate internal floor area" error={errors.internal_floor_area}><input id="real-estate-internal-floor-area" name="internal_floor_area" type="number" min="1" step="1" value={formData.internal_floor_area} onChange={change} className={inputClass} {...a11y("internal_floor_area")} /></Field>
              <Field inputId="real-estate-internal-floor-area-unit" label="Floor area unit" required={Boolean(formData.internal_floor_area)} error={errors.internal_floor_area_unit}><select id="real-estate-internal-floor-area-unit" name="internal_floor_area_unit" value={formData.internal_floor_area_unit ?? ""} onChange={change} className={inputClass} {...a11y("internal_floor_area_unit")}><option value="">Select…</option>{option("sqm", "m²")}{option("sqft", "sq ft")}</select></Field>
            </div>
            <Field inputId="real-estate-property-features" label="Other features affecting coverage" error={errors.property_features}><textarea id="real-estate-property-features" name="property_features" value={formData.property_features} onChange={change} className={inputClass} rows={2} {...a11y("property_features")} /></Field>
          </Section>

          <Section title="Access & shoot readiness">
            <div className="grid gap-5 md:grid-cols-2">
              <Field inputId="real-estate-occupancy-status" label="Occupancy status" required error={errors.occupancy_status}><select id="real-estate-occupancy-status" name="occupancy_status" value={formData.occupancy_status} onChange={change} className={inputClass} {...a11y("occupancy_status")}><option value="">Select…</option>{option("vacant", "Vacant")}{option("owner_occupied", "Owner occupied")}{option("tenant_occupied", "Tenant occupied")}{option("new_build_site", "New build / site")}{option("other", "Other")}</select></Field>
              <Field inputId="real-estate-access-provider" label="Who will provide access?" required error={errors.access_provider}><select id="real-estate-access-provider" name="access_provider" value={formData.access_provider} onChange={change} className={inputClass} {...a11y("access_provider")}><option value="">Select…</option>{option("enquirer", "I will — reuse my contact details")}{option("owner", "Property owner / vendor")}{option("tenant", "Tenant")}{option("agent_colleague", "Agent / colleague")}{option("other", "Other")}</select></Field>
            </div>
            {formData.access_provider && formData.access_provider !== "enquirer" ? <div className="grid gap-5 md:grid-cols-2"><Field inputId="real-estate-access-contact-name" label="Access contact name" required error={errors.access_contact_name}><input id="real-estate-access-contact-name" name="access_contact_name" value={formData.access_contact_name} onChange={change} className={inputClass} {...a11y("access_contact_name")} /></Field><Field inputId="real-estate-access-contact-phone" label="Access contact phone" required error={errors.access_contact_phone}><input id="real-estate-access-contact-phone" name="access_contact_phone" type="tel" value={formData.access_contact_phone} onChange={change} className={inputClass} {...a11y("access_contact_phone")} /></Field></div> : null}
            <Field inputId="real-estate-access-notes" label="Access restrictions or instructions" error={errors.access_notes}><textarea id="real-estate-access-notes" name="access_notes" value={formData.access_notes} onChange={change} className={inputClass} rows={2} {...a11y("access_notes")} /></Field>
            <div><label className="flex items-start gap-3 text-sm"><input type="checkbox" name="readiness_acknowledged" checked={formData.readiness_acknowledged} onChange={checkbox("readiness_acknowledged")} aria-invalid={errors.readiness_acknowledged ? true : undefined} aria-describedby={errors.readiness_acknowledged ? "real-estate-readiness-acknowledged-error" : "real-estate-readiness-note"} /><span><strong>I acknowledge *</strong> the property should be cleaned, staged and ready at the agreed arrival time.</span></label><p id="real-estate-readiness-note" className="mt-2 text-xs text-gray-500">Substantial preparation delays may reduce coverage, require rescheduling or incur agreed additional time charges.</p>{errors.readiness_acknowledged ? <p id="real-estate-readiness-acknowledged-error" className="mt-2 text-sm text-red-300">{errors.readiness_acknowledged}</p> : null}</div>
          </Section>

          <Section title="Preferred scheduling">
            <Field inputId="real-estate-scheduling-preference" label="Scheduling choice" required error={errors.scheduling_preference}><select id="real-estate-scheduling-preference" name="scheduling_preference" value={formData.scheduling_preference} onChange={change} className={inputClass} {...a11y("scheduling_preference")}><option value="">Select…</option>{option("request_date", "Request a preferred date")}{option("flexible", "Flexible / please contact me")}</select></Field>
            {formData.scheduling_preference === "request_date" ? <div className="grid gap-5 md:grid-cols-2"><Field inputId="real-estate-preferred-date" label="Preferred date" required error={errors.preferred_date}><input id="real-estate-preferred-date" name="preferred_date" type="date" min={localToday()} value={formData.preferred_date} onChange={change} className={inputClass} {...a11y("preferred_date")} /></Field><Field inputId="real-estate-alternative-date" label="Alternative date" error={errors.alternative_date}><input id="real-estate-alternative-date" name="alternative_date" type="date" min={localToday()} value={formData.alternative_date} onChange={change} className={inputClass} {...a11y("alternative_date")} /></Field></div> : null}
            <Field inputId="real-estate-preferred-time-window" label="Preferred time window" required error={errors.preferred_time_window}><select id="real-estate-preferred-time-window" name="preferred_time_window" value={formData.preferred_time_window} onChange={change} className={inputClass} {...a11y("preferred_time_window")}><option value="">Select…</option>{option("morning", "Morning")}{option("afternoon", "Afternoon")}{option("flexible", "Flexible")}</select></Field>
          </Section>

          <Section title="On-camera presentation & audio">
            <Field inputId="real-estate-on-camera" label="Will anyone present or speak on camera?" required error={errors.on_camera}><select id="real-estate-on-camera" name="on_camera" value={formData.on_camera} onChange={change} className={inputClass} {...a11y("on_camera")}><option value="">Select…</option>{option("yes", "Yes")}{option("no", "No")}{option("not_sure", "Not sure")}</select></Field>
            {formData.on_camera === "yes" ? <><Field inputId="real-estate-on-camera-people" label="Who will appear?" required error={errors.on_camera_people}><input id="real-estate-on-camera-people" name="on_camera_people" value={formData.on_camera_people} onChange={change} className={inputClass} {...a11y("on_camera_people")} /></Field><Field inputId="real-estate-audio-requirements" label="Spoken-audio / microphone requirements" required error={errors.audio_requirements} hint="Presenter and audio requirements must be agreed before the shoot; scripting, extra editing and retakes are not automatically included."><textarea id="real-estate-audio-requirements" name="audio_requirements" value={formData.audio_requirements} onChange={change} className={inputClass} rows={2} {...a11y("audio_requirements", true)} /></Field></> : null}
          </Section>

          <Section title="Optional add-ons">
            {packageNotice ? <p role="status" className="rounded-xl bg-amber-400/10 p-3 text-sm text-amber-100">{packageNotice}</p> : null}
            <div className="grid gap-3 md:grid-cols-2">{shownAddOns.map((item) => <label key={item.key} className="flex gap-3 rounded-xl border border-white/10 p-4"><input type="checkbox" name="add_ons" value={item.key} checked={formData.add_ons.includes(item.key)} onChange={() => toggleAddOn(item.key)} /><span><strong className="block">{item.label}</strong><span className="text-sm text-gray-500">{item.price}</span></span></label>)}</div>
            {formData.add_ons.includes("additional_stills") ? <Field inputId="real-estate-additional-stills-quantity" label="Number of additional edited photographs" required error={errors.additional_stills_quantity} hint={REAL_ESTATE_ADDITIONAL_PHOTOGRAPH_COPY}><input id="real-estate-additional-stills-quantity" name="additional_stills_quantity" type="number" min="1" max="50" step="1" value={formData.additional_stills_quantity} onChange={change} className={inputClass} {...a11y("additional_stills_quantity")} /></Field> : null}
            {formData.add_ons.includes("rush_delivery") ? <p className="text-sm text-amber-200">{REAL_ESTATE_RUSH_DELIVERY_NOTE}</p> : null}
            <p className="text-xs text-gray-500">{REAL_ESTATE_VAT_NOTE}</p>
          </Section>

          <Section title="Anything else">
            <Field inputId="real-estate-how-heard" label="How did you hear about us?" error={errors.how_heard}><select id="real-estate-how-heard" name="how_heard" value={formData.how_heard} onChange={change} className={inputClass} {...a11y("how_heard")}><option value="">Select…</option>{option("google", "Google")}{option("instagram", "Instagram")}{option("facebook", "Facebook")}{option("linkedin", "LinkedIn")}{option("referral", "Referral")}{option("estate_agent_colleague", "Estate agent colleague")}{option("openeire_website", "OpenÉire website")}{option("other", "Other")}{option("not_sure", "Not sure")}</select></Field>
            <Field inputId="real-estate-message" label="Client message" error={errors.message}><textarea id="real-estate-message" name="message" value={formData.message} onChange={change} className={inputClass} rows={3} {...a11y("message")} /></Field>
          </Section>

          <div><label className="flex items-start gap-3 text-sm"><input type="checkbox" data-error-field="consent_to_contact" checked={formData.consent_to_contact} onChange={checkbox("consent_to_contact")} aria-invalid={errors.consent_to_contact ? true : undefined} aria-describedby={errors.consent_to_contact ? "real-estate-consent-to-contact-error" : undefined} /><span>I consent to OpenÉire Studios contacting me about this operational enquiry. *</span></label>{errors.consent_to_contact ? <p id="real-estate-consent-to-contact-error" className="mt-2 text-sm text-red-300">{errors.consent_to_contact}</p> : null}</div>
          <button id={SUBMIT_ID} type="submit" disabled={status === "submitting"} className="flex w-full items-center justify-center gap-3 rounded-full bg-[#16a34a] px-6 py-4 font-bold text-white disabled:opacity-60"><FaPaperPlane />{status === "submitting" ? "Sending…" : "Send shoot enquiry"}</button>
        </form>
      </div>
    </section>
  );
}
