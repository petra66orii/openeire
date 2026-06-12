import React, { useEffect, useMemo, useRef, useState } from "react";
import SEOHead from "../components/SEOHead";
import {
  RealEstateEnquiryPayload,
  submitRealEstateEnquiry,
} from "../services/api";
import { buildAbsoluteSiteUrl } from "../config/site";
import { buildBreadcrumbSchema, buildFAQPageSchema } from "../lib/seoSchema";
import { trackEvent } from "../lib/analytics";
import {
  registerIubendaConsentForm,
  submitIubendaConsentForm,
} from "../utils/iubendaConsent";
import {
  FaCalendarAlt,
  FaCamera,
  FaCheckCircle,
  FaChevronDown,
  FaCube,
  FaHome,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaVideo,
} from "react-icons/fa";

const FORM_ID = "real-estate-enquiry-form";
const SUBMIT_ID = "real-estate-enquiry-submit";

type ClientType = RealEstateEnquiryPayload["client_type"];
type PackageType = RealEstateEnquiryPayload["preferred_package"];
type HowHeard = NonNullable<RealEstateEnquiryPayload["how_heard"]>;
type AddOnKey =
  | "additional_stills"
  | "floor_plan"
  | "rush_delivery"
  | "extended_drone_video"
  | "additional_social_cuts"
  | "travel_supplement";

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

const packages: Array<{
  key: PackageType;
  name: string;
  price: string;
  badge?: string;
  description: string;
  features: string[];
}> = [
  {
    key: "essential",
    name: "Essential",
    price: "\u20AC175 + VAT",
    description:
      "Recommended for smaller properties, rentals, starter listings.",
    features: [
      "10 professionally edited interior & exterior photographs",
      "Full resolution delivery, print & web ready",
      "24-hour delivery",
      "Full commercial marketing licence for the property listing, including Daft.ie, MyHome.ie, agency websites, social media, email campaigns and print brochures",
    ],
  },
  {
    key: "starter",
    name: "Starter",
    price: "\u20AC229 + VAT",
    description: "Recommended for standard 3-4 bed residential properties.",
    features: [
      "20 professionally edited interior & exterior photographs",
      "Full resolution delivery, print & web ready",
      "24-hour delivery",
      "Full commercial marketing licence",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    price: "\u20AC399 + VAT",
    badge: "Recommended",
    description:
      "Recommended for detached homes, larger properties, new builds, agents wanting standout listings.",
    features: [
      "20 professionally edited interior & exterior photographs",
      "Aerial drone video, 60-90 seconds, 4K, edited with music",
      "Social media cuts included, portrait 9:16 and square 1:1 formatted reels",
      "Full resolution delivery, print & web ready",
      "24-hour delivery",
      "Full commercial marketing licence",
    ],
  },
  {
    key: "premium",
    name: "Premium",
    price: "\u20AC579 + VAT",
    description:
      "Recommended for premium listings, larger homes, waterfront/rural properties, new developments, and properties where presentation is a major selling point.",
    features: [
      "20 professionally edited interior & exterior photographs",
      "Aerial drone video, 60-90 seconds, 4K, edited with music",
      "Social media cuts included, portrait 9:16 and square 1:1 formatted reels",
      "3D interactive virtual tour, hosted, shareable link",
      "Full resolution delivery, print & web ready",
      "24-hour delivery",
      "Full commercial marketing licence",
    ],
  },
  {
    key: "custom",
    name: "Custom",
    price: "POA",
    description:
      "For multi-property shoots, large developments, commercial properties, agricultural properties and bespoke bundles.",
    features: [
      "Multiple properties in a single booking",
      "Cinematic property films",
      "Commercial or agricultural properties",
      "Developer packages",
    ],
  },
];

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

const addOns: Array<{
  key: AddOnKey;
  label: string;
  price: string;
}> = [
  {
    key: "additional_stills",
    label: "Additional edited stills",
    price: "\u20AC10 + VAT per image",
  },
  {
    key: "floor_plan",
    label: "Floor plan, 2D measured",
    price: "\u20AC75 + VAT",
  },
  {
    key: "rush_delivery",
    label: "Rush same-day delivery, stills only",
    price: "\u20AC75 + VAT",
  },
  {
    key: "extended_drone_video",
    label: "Extended drone video, up to 3 minutes, fully edited",
    price: "\u20AC150 + VAT",
  },
  {
    key: "additional_social_cuts",
    label: "Additional social media cuts, extra formats or edits",
    price: "\u20AC50 + VAT",
  },
  {
    key: "travel_supplement",
    label: "Travel supplement beyond 40 km from base",
    price: "\u20AC0.50 + VAT per km",
  },
];

const faqs = [
  {
    question: "Do prices include VAT?",
    answer:
      "No. Prices are quoted exclusive of VAT. VAT at 23% is added at invoicing.",
  },
  {
    question: "How quickly will I receive the media?",
    answer:
      "All packages are delivered within 24 hours after the shoot, once access and brief details have been provided.",
  },
  {
    question: "Can you fly the drone at every property?",
    answer:
      "Aerial work depends on weather, site conditions, airspace restrictions and safe operating limits. We review this before confirming the shoot.",
  },
  {
    question: "What happens if the weather is unsuitable?",
    answer:
      "If weather conditions fall outside safe operational limits within 48 hours of the shoot, we reschedule at no additional cost.",
  },
  {
    question: "Can I use the photos and videos on Daft.ie and social media?",
    answer:
      "Yes. All packages include a commercial marketing licence for the property listing, including property portals, agency websites, social media, email campaigns and print brochures.",
  },
  {
    question: "Do you cover all of Connacht?",
    answer:
      "OpenEire Studios is based in Connacht. Standard pricing applies within 40 km of base, with a travel supplement beyond that.",
  },
  {
    question: "Can you photograph multiple properties on the same day?",
    answer:
      "Yes. Multi-property days are available on a Custom quotation basis. Send us the property list and locations, and we\u2019ll prepare a tailored quote.",
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

const inputClass =
  "w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-white placeholder-gray-600 outline-none transition-all focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]";
const labelClass =
  "mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-gray-500";

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

const getFriendlyApiError = (error: unknown): string => {
  if (!error || typeof error !== "object") {
    return "We could not send the enquiry. Please try again or email studio@openeire.ie.";
  }

  const record = error as Record<string, unknown>;
  const directMessage = record.detail ?? record.message ?? record.error;
  if (typeof directMessage === "string" && directMessage.trim()) {
    return directMessage;
  }

  const fieldMessage = Object.entries(record)
    .map(([field, value]) => {
      const label = fieldLabels[field as keyof RealEstateFormData] ?? field;
      if (Array.isArray(value)) {
        return `${label}: ${value.filter(Boolean).join(" ")}`;
      }
      if (typeof value === "string") {
        return `${label}: ${value}`;
      }
      return null;
    })
    .find(Boolean);

  return (
    fieldMessage ??
    "We could not send the enquiry. Please check the details and try again."
  );
};

const trimOrUndefined = (value: string): string | undefined => {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const isOneOf = <T extends string>(
  value: string,
  options: readonly T[],
): value is T => options.includes(value as T);

const RealEstatePage: React.FC = () => {
  const packagesRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState<RealEstateFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );

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

  const schema = useMemo(
    () => [
      buildBreadcrumbSchema([
        { name: "Home", url: buildAbsoluteSiteUrl("/") },
        {
          name: "Real Estate Media",
          url: buildAbsoluteSiteUrl("/real-estate"),
        },
      ]),
      buildFAQPageSchema(faqs),
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: "OpenEire Studios Real Estate Media",
        url: buildAbsoluteSiteUrl("/real-estate"),
        image: buildAbsoluteSiteUrl("/hero-poster.jpg"),
        description:
          "Professional real estate photography, aerial drone video and 3D virtual tours for estate agents, developers and private sellers across Connacht.",
        areaServed: ["Galway", "Mayo", "Roscommon", "Sligo", "Leitrim"],
        provider: {
          "@type": "Organization",
          name: "OpenEire Studios",
          url: buildAbsoluteSiteUrl("/"),
        },
      },
    ],
    [],
  );

  const scrollTo = (element: HTMLDivElement | null) => {
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectPackageAndEnquire = (packageKey: PackageType) => {
    setFormData((current) => ({
      ...current,
      preferred_package: packageKey,
    }));
    scrollTo(formRef.current);
  };

  const handleFieldChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
    setErrors((current) => ({
      ...current,
      [name]: undefined,
      submit: undefined,
    }));
  };

  const handleConsentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    const howHeardValue: HowHeard | undefined = howHeard
      ? (howHeard as HowHeard)
      : undefined;
    const companyName = trimOrUndefined(formData.company_name);
    const eircode = trimOrUndefined(formData.eircode);
    const preferredDate = trimOrUndefined(formData.preferred_date);
    const message = trimOrUndefined(formData.message);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
      trackEvent("real_estate_enquiry_submit", {
        preferred_package: payload.preferred_package,
        client_type: payload.client_type,
        county: payload.county,
      });
      setStatus("success");
      setFormData(initialFormData);
    } catch (error) {
      setErrors({ submit: getFriendlyApiError(error) });
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      <SEOHead
        title="Real Estate Photography & Drone Video in Connacht | OpenEire Studios"
        description="Professional real estate photography, aerial drone video and 3D virtual tours for estate agents, developers and private sellers across Connacht. Clear package pricing and 24-hour delivery."
        canonicalPath="/real-estate"
        image="/hero-poster.jpg"
        appendSiteTitle={false}
        schema={schema}
      />

      <section className="relative isolate overflow-hidden pt-[calc(var(--site-header-height,96px)+2rem)]">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center opacity-35"
          style={{ backgroundImage: "url('/hero-poster.jpg')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/80 via-black/80 to-black" />
        <div className="container mx-auto grid min-h-[78vh] max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
          <div className="max-w-4xl">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-accent">
              <FaMapMarkerAlt />
              Real estate media across Connacht
            </span>
            <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-6xl">
              Property media built for Connacht agents &mdash; photography,
              drone video and 3D tours with clear pricing.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-300 md:text-xl">
              One visit, listing-ready media and 24-hour delivery after the
              shoot &mdash; for estate agents, developers and private sellers
              across Connacht.
            </p>
            <p className="mt-4 max-w-2xl text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
              Interior & exterior photography &bull; Aerial drone video &bull;
              Social media cuts &bull; 3D virtual tours
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => scrollTo(formRef.current)}
                className="rounded-full bg-[#16a34a] px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-lg shadow-[#16a34a]/20 transition hover:bg-[#15803d]"
              >
                Request a Property Shoot
              </button>
              <button
                type="button"
                onClick={() => scrollTo(packagesRef.current)}
                className="rounded-full border border-white/20 px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:border-[#16a34a] hover:text-[#16a34a]"
              >
                View Packages
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur md:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-gray-400">
              Launch-ready listing media
            </p>
            <div className="mt-6 grid gap-4">
              {[
                "Photography packages from \u20AC175 + VAT",
                "Full commercial marketing licence included",
                "24-hour delivery after the shoot",
                "Drone capture planned around safe operating conditions",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <FaCheckCircle className="mt-1 shrink-0 text-accent" />
                  <span className="text-sm leading-relaxed text-gray-200">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-gray-950/80 py-14">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent">
              Built for property listings
            </p>
            <h2 className="font-serif text-3xl font-bold md:text-5xl">
              Give every listing a stronger first impression.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {[
              {
                icon: <FaCamera />,
                title: "Portal-ready images",
                text: "Edited images ready for Daft.ie, MyHome.ie and agency websites.",
              },
              {
                icon: <FaVideo />,
                title: "Aerial video",
                text: "Aerial video for standout listings and social media campaigns.",
              },
              {
                icon: <FaCalendarAlt />,
                title: "Fast delivery",
                text: "Fast 24-hour delivery after the shoot.",
              },
              {
                icon: <FaCheckCircle />,
                title: "Clear pricing",
                text: "Clear ex-VAT package pricing.",
              },
              {
                icon: <FaCube />,
                title: "Licence included",
                text: "Commercial marketing licence included.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-white/10 bg-black p-6"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#16a34a]/10 text-[#16a34a]">
                  {item.icon}
                </div>
                <h2 className="font-serif text-2xl font-bold">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section ref={packagesRef} className="scroll-mt-32 py-20">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent">
              Clear package pricing
            </p>
            <h2 className="font-serif text-3xl font-bold md:text-5xl">
              Choose the media package that fits the listing.
            </h2>
            <p className="mt-4 text-gray-400">
              All prices exclude VAT. VAT at 23% is added at invoicing. Travel
              supplement applies beyond 40 km from base.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-5">
            {packages.map((item) => (
              <article
                key={item.key}
                className={`relative flex flex-col rounded-3xl border p-6 ${
                  item.badge
                    ? "border-[#16a34a] bg-[#16a34a]/10 shadow-xl shadow-[#16a34a]/10"
                    : "border-white/10 bg-gray-950"
                }`}
              >
                {item.badge && (
                  <span className="absolute right-4 top-4 rounded-full bg-[#16a34a] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white">
                    {item.badge}
                  </span>
                )}
                <h3 className="pr-20 font-serif text-2xl font-bold">
                  {item.name}
                </h3>
                <p className="mt-3 text-3xl font-bold text-white">
                  {item.price}
                </p>
                <p className="mt-4 min-h-[4rem] text-sm leading-relaxed text-gray-400">
                  {item.description}
                </p>
                <ul className="mt-5 flex-1 space-y-3 text-sm text-gray-300">
                  {item.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <FaCheckCircle className="mt-1 shrink-0 text-accent" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => selectPackageAndEnquire(item.key)}
                  className="mt-6 rounded-full border border-white/20 px-4 py-3 text-sm font-bold uppercase tracking-[0.16em] transition hover:border-[#16a34a] hover:bg-[#16a34a] hover:text-white"
                >
                  Enquire
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-950 py-20">
        <div className="container mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent">
              Add-ons
            </p>
            <h2 className="font-serif text-3xl font-bold md:text-5xl">
              Add only what the listing needs.
            </h2>
            <p className="mt-4 text-gray-400">
              Build a clean scope around the property rather than paying for
              extras you do not need.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {addOns.map((item) => (
              <div
                key={item.key}
                className="rounded-2xl border border-white/10 bg-black p-5"
              >
                <p className="font-bold text-white">{item.label}</p>
                <p className="mt-2 text-sm text-[#16a34a]">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "1. Send us the property details",
                text: "Choose a package and share the address, property type, preferred date and any access notes.",
              },
              {
                title: "2. We review and confirm",
                text: "We check the brief, location and any airspace requirements, then confirm the shoot date and package with you within 24 hours.",
              },
              {
                title: "3. We capture and edit the media",
                text: "Photography, drone video and virtual tour capture are completed according to the selected package.",
              },
              {
                title: "4. You receive listing-ready files",
                text: "Final media is delivered by secure download link, ready for portals, websites, social media and brochures.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-gray-950 p-7"
              >
                <h2 className="font-serif text-2xl font-bold">{item.title}</h2>
                <p className="mt-3 leading-relaxed text-gray-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-accent/20 bg-accent/10 p-6 text-sm leading-relaxed text-gray-200">
            Aerial work is planned around weather, site conditions, airspace
            restrictions and safe operating limits. If conditions are unsuitable
            within 48 hours of a scheduled outdoor or aerial shoot, we will
            reschedule at no additional cost.
          </div>
        </div>
      </section>

      <section className="bg-gray-950 py-20">
        <div className="container mx-auto max-w-5xl px-4 text-center lg:px-8">
          <FaHome className="mx-auto mb-5 text-3xl text-[#16a34a]" />
          <h2 className="font-serif text-3xl font-bold md:text-5xl">
            Built for property teams who need clarity.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-gray-400">
            Built for estate agents, developers and private sellers who need
            listing-ready media without unclear pricing or slow turnaround.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent">
              Questions
            </p>
            <h2 className="font-serif text-3xl font-bold md:text-5xl">
              Real estate media FAQ
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-white/10 bg-gray-950 p-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                  {item.question}
                  <FaChevronDown className="shrink-0 text-[#16a34a] transition group-open:rotate-180" />
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-gray-400">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section ref={formRef} className="scroll-mt-32 bg-gray-950 py-20">
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
                <FaCalendarAlt className="text-[#16a34a]" />
                Preferred dates are treated as requests until confirmed.
              </p>
              <p className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-[#16a34a]" />
                Serving Galway, Mayo, Roscommon, Sligo and Leitrim.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-black p-6 shadow-2xl md:p-8">
            {status === "success" ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <FaCheckCircle className="mb-5 text-5xl text-accent" />
                <h3 className="font-serif text-3xl font-bold">
                  Thanks &mdash; enquiry received.
                </h3>
                <p className="mt-4 max-w-xl text-gray-400">
                  Thanks &mdash; we&rsquo;ve received your property shoot
                  request. We&rsquo;ll review the details and come back to you
                  within 24 hours.
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
                {errors.submit && (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
                    {errors.submit}
                  </div>
                )}

                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    inputId="real-estate-name"
                    label="Name"
                    error={errors.name}
                    input={
                      <input
                        id="real-estate-name"
                        name="name"
                        value={formData.name}
                        onChange={handleFieldChange}
                        className={inputClass}
                        autoComplete="name"
                        required
                      />
                    }
                  />
                  <Field
                    inputId="real-estate-email"
                    label="Email"
                    error={errors.email}
                    input={
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
                    }
                  />
                  <Field
                    inputId="real-estate-phone"
                    label="Phone"
                    error={errors.phone}
                    input={
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
                    }
                  />
                  <Field
                    inputId="real-estate-company"
                    label="Company name"
                    input={
                      <input
                        id="real-estate-company"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleFieldChange}
                        className={inputClass}
                        autoComplete="organization"
                      />
                    }
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    inputId="real-estate-client-type"
                    label="Client type"
                    error={errors.client_type}
                    input={
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
                    }
                  />
                  <Field
                    inputId="real-estate-package"
                    label="Preferred package"
                    error={errors.preferred_package}
                    input={
                      <select
                        id="real-estate-package"
                        name="preferred_package"
                        value={formData.preferred_package}
                        onChange={handleFieldChange}
                        className={inputClass}
                        required
                      >
                        <option value="not_sure">Not sure</option>
                        {packages.map((item) => (
                          <option key={item.key} value={item.key}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    }
                  />
                </div>

                <Field
                  inputId="real-estate-address"
                  label="Property address"
                  error={errors.property_address}
                  input={
                    <input
                      id="real-estate-address"
                      name="property_address"
                      value={formData.property_address}
                      onChange={handleFieldChange}
                      className={inputClass}
                      autoComplete="street-address"
                      required
                    />
                  }
                />

                <div className="grid gap-5 md:grid-cols-3">
                  <Field
                    inputId="real-estate-eircode"
                    label="Eircode"
                    input={
                      <input
                        id="real-estate-eircode"
                        name="eircode"
                        value={formData.eircode}
                        onChange={handleFieldChange}
                        className={inputClass}
                        autoComplete="postal-code"
                      />
                    }
                  />
                  <Field
                    inputId="real-estate-county"
                    label="County"
                    error={errors.county}
                    input={
                      <input
                        id="real-estate-county"
                        name="county"
                        value={formData.county}
                        onChange={handleFieldChange}
                        className={inputClass}
                        required
                      />
                    }
                  />
                  <Field
                    inputId="real-estate-property-type"
                    label="Property type"
                    error={errors.property_type}
                    input={
                      <input
                        id="real-estate-property-type"
                        name="property_type"
                        value={formData.property_type}
                        onChange={handleFieldChange}
                        className={inputClass}
                        placeholder="House, apartment, site..."
                        required
                      />
                    }
                  />
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
                  <Field
                    inputId="real-estate-date"
                    label="Preferred date"
                    input={
                      <input
                        id="real-estate-date"
                        name="preferred_date"
                        type="date"
                        value={formData.preferred_date}
                        onChange={handleFieldChange}
                        className={inputClass}
                      />
                    }
                  />
                  <Field
                    inputId="real-estate-how-heard"
                    label="How did you hear about us?"
                    input={
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
                        <option value="openeire_website">
                          OpenEire website
                        </option>
                        <option value="other">Other</option>
                        <option value="not_sure">Not sure</option>
                      </select>
                    }
                  />
                </div>

                <Field
                  inputId="real-estate-message"
                  label="Message / access notes / special requirements"
                  input={
                    <textarea
                      id="real-estate-message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleFieldChange}
                      className={`${inputClass} resize-none`}
                    />
                  }
                />

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
                      I consent to OpenEire Studios contacting me about this
                      property media enquiry.
                    </span>
                  </label>
                  {errors.consent_to_contact && (
                    <p className="mt-2 text-sm text-red-300">
                      {errors.consent_to_contact}
                    </p>
                  )}
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
                      <FaPaperPlane />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

const Field: React.FC<{
  inputId: string;
  label: string;
  error?: string;
  input: React.ReactNode;
}> = ({ inputId, label, error, input }) => (
  <div>
    <label htmlFor={inputId} className={labelClass}>
      {label}
    </label>
    {input}
    {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
  </div>
);

export default RealEstatePage;
