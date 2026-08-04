"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { REAL_ESTATE_ENQUIRY_PACKAGES } from "@/lib/realEstate";

type ClientSummary = { display_name: string; company_name: string; masked_email: string; masked_phone: string; credential_expires_at: string };
type PageState = "loading" | "ready" | "unavailable" | "error" | "success";
type FormValues = Record<string, string | boolean | string[]>;

const counties = ["Carlow","Cavan","Clare","Cork","Donegal","Dublin","Galway","Kerry","Kildare","Kilkenny","Laois","Leitrim","Limerick","Longford","Louth","Mayo","Meath","Monaghan","Offaly","Roscommon","Sligo","Tipperary","Waterford","Westmeath","Wexford","Wicklow"];
const initialValues: FormValues = {
  property_address: "", county: "", eircode: "", no_eircode: false, location_details: "",
  property_type: "", property_type_details: "", bedroom_count: "", floor_count: "",
  preferred_package: "", scheduling_preference: "", preferred_date: "", alternative_date: "",
  preferred_time_window: "", access_provider: "", access_contact_name: "", access_contact_phone: "",
  message: "", readiness_acknowledged: false, saved_details_confirmed: false, privacy_acknowledged: false,
  contact_update_requested: false, contact_update_request: "", internal_floor_area: "", internal_floor_area_unit: "",
  secondary_accommodation: "", secondary_accommodation_details: "", outbuildings: "", outbuildings_details: "",
  grounds_size: "", property_features: "", occupancy_status: "", access_notes: "", add_ons: [],
  additional_stills_quantity: "", on_camera: "", on_camera_people: "", audio_requirements: "",
};
const inputClass = "w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500";
const labelClass = "mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-zinc-400";
const eircodeRe = /^(?:[AC-FHKNPRTV-Y]\d{2}|D6W)\s?[0-9AC-FHKNPRTV-Y]{4}$/i;

function Field({ name, label, error, required, children }: { name: string; label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return <div data-field={name}><label htmlFor={`booking-${name}`} className={labelClass}>{label}{required ? " *" : ""}</label>{children}{error ? <p id={`${name}-error`} role="alert" className="mt-2 text-sm text-red-300">{error}</p> : null}</div>;
}

const option = (value: string, label: string) => <option key={value} value={value}>{label}</option>;

export function ReturningClientBookingForm({ credentialPublicId }: { credentialPublicId: string }) {
  const started = useRef(false);
  const submissionId = useRef("");
  const submittingRef = useRef(false);
  const [pageState, setPageState] = useState<PageState>("loading");
  const [client, setClient] = useState<ClientSummary | null>(null);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const newSubmissionId = () => {
    submissionId.current = crypto.randomUUID();
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    newSubmissionId();
    let cancelled = false;
    const bootstrap = async () => {
      try {
        const secret = window.location.hash.slice(1);
        if (secret) {
          window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
          const exchange = await fetch("/api/book/exchange", { method: "POST", credentials: "same-origin", cache: "no-store", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ public_id: credentialPublicId, secret }) });
          if (!exchange.ok) { if (!cancelled) setPageState("unavailable"); return; }
        }
        const response = await fetch("/api/book/session", { method: "POST", credentials: "same-origin", cache: "no-store" });
        const payload: unknown = await response.json();
        if (!response.ok || !payload || typeof payload !== "object" || !(payload as { client?: unknown }).client) { if (!cancelled) setPageState("unavailable"); return; }
        if (!cancelled) { setClient((payload as { client: ClientSummary }).client); setPageState("ready"); }
      } catch { if (!cancelled) setPageState("error"); }
    };
    void bootstrap();
    return () => { cancelled = true; };
  }, [credentialPublicId]);

  const set = (name: string, value: string | boolean | string[]) => {
    setValues(current => ({ ...current, [name]: value, ...(name === "no_eircode" && value === true ? { eircode: "" } : {}) }));
    setErrors(current => ({ ...current, [name]: "", submit: "" }));
  };
  const text = (name: string) => String(values[name] ?? "");
  const checked = (name: string) => values[name] === true;
  const addOns = values.add_ons as string[];
  const toggleAddOn = (key: string) => set("add_ons", addOns.includes(key) ? addOns.filter(item => item !== key) : [...addOns, key]);

  const focusFirstError = (fieldErrors: Record<string, string>) => {
    const first = Object.keys(fieldErrors)[0];
    if (!first) return;
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-field="${first}"] input, [data-field="${first}"] select, [data-field="${first}"] textarea`)?.focus());
  };

  const validate = () => {
    const next: Record<string, string> = {};
    for (const [name, label] of [["property_address","Property address"],["county","County"],["property_type","Property category"],["bedroom_count","Bedrooms"],["floor_count","Floors"],["preferred_package","Preferred package"],["scheduling_preference","Date choice"],["preferred_time_window","Preferred time"],["access_provider","Access provider"]]) {
      if (!text(name).trim()) next[name] = `${label} is required.`;
    }
    if (checked("no_eircode")) { if (!text("location_details").trim()) next.location_details = "Provide precise directions or a Google Maps link."; }
    else if (!eircodeRe.test(text("eircode").trim())) next.eircode = "Enter a valid Eircode or confirm there is none.";
    if (text("property_type") === "other" && !text("property_type_details").trim()) next.property_type_details = "Describe the property category.";
    if (text("scheduling_preference") === "request_date" && !text("preferred_date")) next.preferred_date = "Choose a preferred date.";
    if (text("access_provider") && text("access_provider") !== "enquirer") {
      if (!text("access_contact_name").trim()) next.access_contact_name = "Provide the access contact's name.";
      const digits = text("access_contact_phone").replace(/\D/g, "");
      if (digits.length < 7 || digits.length > 15) next.access_contact_phone = "Provide a plausible access contact number.";
    }
    if (text("internal_floor_area") && !text("internal_floor_area_unit")) next.internal_floor_area_unit = "Choose a floor-area unit.";
    if (text("secondary_accommodation") === "yes" && !text("secondary_accommodation_details").trim()) next.secondary_accommodation_details = "Describe the secondary accommodation.";
    if (text("outbuildings") === "yes" && !text("outbuildings_details").trim()) next.outbuildings_details = "Describe the outbuildings.";
    if (["site_land", "agricultural"].includes(text("property_type")) && !text("grounds_size")) next.grounds_size = "Provide the approximate land or grounds size.";
    if (text("property_type") === "agricultural" && !text("outbuildings")) next.outbuildings = "Confirm whether outbuildings are included.";
    if (addOns.includes("additional_stills")) { const quantity = Number(text("additional_stills_quantity")); if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) next.additional_stills_quantity = "Enter a whole number from 1 to 50."; }
    if (text("on_camera") === "yes") {
      if (!text("on_camera_people").trim()) next.on_camera_people = "Tell us who will appear or speak.";
      if (!text("audio_requirements").trim()) next.audio_requirements = "Describe the audio or microphone requirements.";
    }
    const packageConflicts: Record<string, string[]> = { pro: ["additional_social_cuts"], premium: ["floor_plan", "virtual_tour_3d", "additional_social_cuts"] };
    if (addOns.some(key => (packageConflicts[text("preferred_package")] ?? []).includes(key))) next.add_ons = "One or more selected add-ons are already included in the package.";
    if (checked("contact_update_requested") && !text("contact_update_request").trim()) next.contact_update_request = "Describe what staff should review.";
    if (!checked("readiness_acknowledged")) next.readiness_acknowledged = "Confirm the property will be ready.";
    if (!checked("saved_details_confirmed")) next.saved_details_confirmed = "Confirm that these saved details can be used.";
    if (!checked("privacy_acknowledged")) next.privacy_acknowledged = "Acknowledge that we may contact you about this request.";
    return next;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (submittingRef.current) return;
    const next = validate();
    if (Object.keys(next).length) {
      setErrors(next);
      focusFirstError(next);
      return;
    }
    submittingRef.current = true; setSubmitting(true); setErrors({});
    const payload: Record<string, unknown> = { submission_id: submissionId.current };
    for (const [key, value] of Object.entries(values)) {
      if (value === "") continue;
      payload[key] = key === "internal_floor_area" || key === "additional_stills_quantity" ? Number(value) : value;
    }
    try {
      const response = await fetch("/api/book/enquiries", { method: "POST", credentials: "same-origin", cache: "no-store", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const body: unknown = await response.json();
      if (!response.ok) {
        if (response.status === 404) { setPageState("unavailable"); return; }
        const fieldErrors = body && typeof body === "object" ? Object.fromEntries(Object.entries(body as Record<string, unknown>).map(([key, value]) => [key === "detail" ? "submit" : key, Array.isArray(value) ? value.join(" ") : String(value)])) : { submit: "We could not submit the request." };
        setErrors(fieldErrors); submittingRef.current = false; setSubmitting(false); focusFirstError(fieldErrors); return;
      }
      setPageState("success");
    } catch { submittingRef.current = false; setErrors({ submit: "We could not submit the request. Please try again." }); setSubmitting(false); }
  };

  const startAnother = () => { setValues(initialValues); setErrors({}); newSubmissionId(); submittingRef.current = false; setSubmitting(false); setPageState("ready"); };
  const landRelevant = ["site_land", "agricultural", "commercial", "new_build"].includes(text("property_type"));

  if (pageState === "loading") return <PrivateMessage title="Opening your private booking form" message="Securely checking access…" loading />;
  if (pageState === "unavailable") return <PrivateMessage title="Booking access unavailable" message="This private link is invalid or no longer available. Please contact OpenÉire Studios for assistance." />;
  if (pageState === "error") return <PrivateMessage title="Temporarily unavailable" message="We could not open the booking form just now. Please try again later." />;
  if (pageState === "success") return <PrivateMessage title="Property request received" message="We’ll review the property, requested scope and preferred date before confirming the quotation and booking."><button onClick={startAnother} className="mt-7 rounded-full bg-green-600 px-6 py-3 font-bold hover:bg-green-700">Book another property</button></PrivateMessage>;

  return <div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100 sm:px-6 sm:py-12">
    <div className="mx-auto max-w-4xl">
      <PrivateHeader />
      <div className="mb-8"><p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-400">Returning client</p><h1 className="mt-3 font-serif text-3xl font-bold sm:text-5xl">Book another property</h1><p className="mt-4 max-w-2xl text-zinc-400">Only tell us what changes for this property. Dates remain requests until confirmed.</p></div>
      <section className="mb-7 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-5" aria-labelledby="saved-details"><h2 id="saved-details" className="text-lg font-bold">Saved client details</h2><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-zinc-500">Client</dt><dd>{client?.display_name}</dd></div><div><dt className="text-zinc-500">Agency/company</dt><dd>{client?.company_name || "Not recorded"}</dd></div><div><dt className="text-zinc-500">Email</dt><dd>{client?.masked_email}</dd></div><div><dt className="text-zinc-500">Phone</dt><dd>{client?.masked_phone}</dd></div></dl></section>
      <form onSubmit={submit} noValidate className="space-y-6 rounded-3xl border border-white/10 bg-black p-5 sm:p-8">
        {errors.submit ? <div role="alert" className="rounded-xl bg-red-500/10 p-4 text-red-200">{errors.submit}</div> : null}
        <section className="space-y-5"><h2 className="font-serif text-2xl font-bold">Property and shoot</h2>
          <Field name="property_address" label="Property address" required error={errors.property_address}><textarea id="booking-property_address" className={inputClass} value={text("property_address")} onChange={e => set("property_address", e.target.value)} rows={2} /></Field>
          <div className="grid gap-5 sm:grid-cols-2"><Field name="county" label="County" required error={errors.county}><select id="booking-county" className={inputClass} value={text("county")} onChange={e => set("county", e.target.value)}><option value="">Select…</option>{counties.map(item => option(item, item))}</select></Field>{!checked("no_eircode") ? <Field name="eircode" label="Eircode" required error={errors.eircode}><input id="booking-eircode" className={inputClass} value={text("eircode")} onChange={e => set("eircode", e.target.value)} /></Field> : null}</div>
          <label className="flex gap-3 text-sm"><input type="checkbox" checked={checked("no_eircode")} onChange={e => set("no_eircode", e.target.checked)} />This property has no Eircode</label>
          {checked("no_eircode") ? <Field name="location_details" label="Directions or Google Maps link" required error={errors.location_details}><textarea id="booking-location_details" className={inputClass} value={text("location_details")} onChange={e => set("location_details", e.target.value)} rows={2} /></Field> : null}
          <div className="grid gap-5 sm:grid-cols-3"><Field name="property_type" label="Property category" required error={errors.property_type}><select id="booking-property_type" className={inputClass} value={text("property_type")} onChange={e => set("property_type", e.target.value)}><option value="">Select…</option>{[["house","House"],["apartment","Apartment"],["new_build","New build / development"],["site_land","Site / land"],["commercial","Commercial"],["agricultural","Agricultural"],["other","Other"]].map(([v,l]) => option(v,l))}</select></Field><Field name="bedroom_count" label="Bedrooms" required error={errors.bedroom_count}><select id="booking-bedroom_count" className={inputClass} value={text("bedroom_count")} onChange={e => set("bedroom_count", e.target.value)}><option value="">Select…</option>{["studio","1","2","3","4","5","6_plus","not_applicable"].map(v => option(v, v === "6_plus" ? "6+" : v === "not_applicable" ? "Not applicable" : v))}</select></Field><Field name="floor_count" label="Floors" required error={errors.floor_count}><select id="booking-floor_count" className={inputClass} value={text("floor_count")} onChange={e => set("floor_count", e.target.value)}><option value="">Select…</option>{[["1","1"],["2","2"],["3","3"],["4_plus","4+"],["not_applicable","Not applicable"]].map(([v,l]) => option(v,l))}</select></Field></div>
          {text("property_type") === "other" ? <Field name="property_type_details" label="Property category details" required error={errors.property_type_details}><input id="booking-property_type_details" className={inputClass} value={text("property_type_details")} onChange={e => set("property_type_details", e.target.value)} /></Field> : null}
          <Field name="preferred_package" label="Preferred package" required error={errors.preferred_package}><select id="booking-preferred_package" className={inputClass} value={text("preferred_package")} onChange={e => set("preferred_package", e.target.value)}><option value="">Select…</option>{REAL_ESTATE_ENQUIRY_PACKAGES.map(item => option(item.id, item.id === "not_sure" ? "Recommend one" : `${item.name} — ${item.price}`))}</select></Field>
          <div className="grid gap-5 sm:grid-cols-3"><Field name="scheduling_preference" label="Preferred date" required error={errors.scheduling_preference}><select id="booking-scheduling_preference" className={inputClass} value={text("scheduling_preference")} onChange={e => set("scheduling_preference", e.target.value)}><option value="">Select…</option>{option("request_date","Request a date")}{option("flexible","Flexible — contact me")}</select></Field>{text("scheduling_preference") === "request_date" ? <Field name="preferred_date" label="Requested date" required error={errors.preferred_date}><input id="booking-preferred_date" type="date" className={inputClass} value={text("preferred_date")} onChange={e => set("preferred_date", e.target.value)} /></Field> : null}<Field name="preferred_time_window" label="Preferred time" required error={errors.preferred_time_window}><select id="booking-preferred_time_window" className={inputClass} value={text("preferred_time_window")} onChange={e => set("preferred_time_window", e.target.value)}><option value="">Select…</option>{option("morning","Morning")}{option("afternoon","Afternoon")}{option("flexible","Flexible")}</select></Field></div>
          <Field name="access_provider" label="Who will provide access?" required error={errors.access_provider}><select id="booking-access_provider" className={inputClass} value={text("access_provider")} onChange={e => set("access_provider", e.target.value)}><option value="">Select…</option>{option("enquirer","I will — use my saved details")}{option("owner","Owner / vendor")}{option("tenant","Tenant")}{option("agent_colleague","Agent / colleague")}{option("other","Other")}</select></Field>
          {text("access_provider") && text("access_provider") !== "enquirer" ? <div className="grid gap-5 sm:grid-cols-2"><Field name="access_contact_name" label="Access contact name" required error={errors.access_contact_name}><input id="booking-access_contact_name" className={inputClass} value={text("access_contact_name")} onChange={e => set("access_contact_name", e.target.value)} /></Field><Field name="access_contact_phone" label="Access contact phone" required error={errors.access_contact_phone}><input id="booking-access_contact_phone" type="tel" className={inputClass} value={text("access_contact_phone")} onChange={e => set("access_contact_phone", e.target.value)} /></Field></div> : null}
          <Field name="message" label="Additional/property notes" error={errors.message}><textarea id="booking-message" className={inputClass} value={text("message")} onChange={e => set("message", e.target.value)} rows={3} /></Field>
        </section>
        <details open={landRelevant || undefined} className="rounded-2xl border border-white/10 p-5"><summary className="cursor-pointer font-bold text-amber-300">Additional property details <span className="font-normal text-zinc-500">(optional unless a shown answer requires details)</span></summary><div className="mt-5 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2"><Field name="internal_floor_area" label="Approximate floor area" error={errors.internal_floor_area}><input id="booking-internal_floor_area" type="number" min="1" className={inputClass} value={text("internal_floor_area")} onChange={e => set("internal_floor_area", e.target.value)} /></Field><Field name="internal_floor_area_unit" label="Area unit" error={errors.internal_floor_area_unit}><select id="booking-internal_floor_area_unit" className={inputClass} value={text("internal_floor_area_unit")} onChange={e => set("internal_floor_area_unit", e.target.value)}><option value="">Select…</option>{option("sqm","m²")}{option("sqft","sq ft")}</select></Field></div>
          <div className="grid gap-5 sm:grid-cols-3"><OptionalChoice name="secondary_accommodation" label="Secondary accommodation" values={values} set={set} error={errors.secondary_accommodation} /><OptionalChoice name="outbuildings" label="Outbuildings" values={values} set={set} error={errors.outbuildings} /><Field name="grounds_size" label="Land / grounds size" error={errors.grounds_size}><select id="booking-grounds_size" className={inputClass} value={text("grounds_size")} onChange={e => set("grounds_size", e.target.value)}><option value="">Not specified</option>{[["no_grounds","No grounds"],["normal_garden","Normal garden"],["large_garden","Large garden"],["under_1_acre","Under 1 acre"],["1_to_5_acres","1–5 acres"],["over_5_acres","Over 5 acres"],["not_sure","Not sure"],["not_applicable","Not applicable"]].map(([v,l]) => option(v,l))}</select></Field></div>
          {text("secondary_accommodation") === "yes" ? <Field name="secondary_accommodation_details" label="Secondary accommodation details" required error={errors.secondary_accommodation_details}><textarea id="booking-secondary_accommodation_details" className={inputClass} value={text("secondary_accommodation_details")} onChange={e => set("secondary_accommodation_details", e.target.value)} /></Field> : null}
          {text("outbuildings") === "yes" ? <Field name="outbuildings_details" label="Outbuilding details" required error={errors.outbuildings_details}><textarea id="booking-outbuildings_details" className={inputClass} value={text("outbuildings_details")} onChange={e => set("outbuildings_details", e.target.value)} /></Field> : null}
          <Field name="property_features" label="Notable features affecting coverage" error={errors.property_features}><textarea id="booking-property_features" className={inputClass} value={text("property_features")} onChange={e => set("property_features", e.target.value)} /></Field>
          <div className="grid gap-5 sm:grid-cols-2"><Field name="occupancy_status" label="Occupancy" error={errors.occupancy_status}><select id="booking-occupancy_status" className={inputClass} value={text("occupancy_status")} onChange={e => set("occupancy_status", e.target.value)}><option value="">Not specified</option>{[["vacant","Vacant"],["owner_occupied","Owner occupied"],["tenant_occupied","Tenant occupied"],["new_build_site","New build / site"],["other","Other"]].map(([v,l]) => option(v,l))}</select></Field><Field name="alternative_date" label="Alternative date" error={errors.alternative_date}><input id="booking-alternative_date" type="date" className={inputClass} value={text("alternative_date")} onChange={e => set("alternative_date", e.target.value)} /></Field></div>
          <Field name="access_notes" label="Detailed access notes" error={errors.access_notes}><textarea id="booking-access_notes" className={inputClass} value={text("access_notes")} onChange={e => set("access_notes", e.target.value)} /></Field>
          <fieldset data-field="add_ons"><legend className={labelClass}>Optional add-ons</legend><div className="grid gap-3 sm:grid-cols-2">{[["additional_stills","Additional edited photographs"],["floor_plan","2D measured floor plan"],["virtual_tour_3d","Hosted 3D virtual tour"],["rush_delivery","Rush same-day still photography"],["extended_drone_video","Extended drone video"],["additional_social_cuts","Additional social cuts"]].map(([key,label]) => <label key={key} className="flex gap-3 rounded-xl border border-white/10 p-3"><input type="checkbox" checked={addOns.includes(key)} onChange={() => toggleAddOn(key)} />{label}</label>)}</div>{errors.add_ons ? <p role="alert" className="mt-2 text-sm text-red-300">{errors.add_ons}</p> : null}</fieldset>
          {addOns.includes("additional_stills") ? <Field name="additional_stills_quantity" label="Additional photograph quantity" required error={errors.additional_stills_quantity}><input id="booking-additional_stills_quantity" type="number" min="1" max="50" className={inputClass} value={text("additional_stills_quantity")} onChange={e => set("additional_stills_quantity", e.target.value)} /></Field> : null}
          <Field name="on_camera" label="Will anyone appear or speak on camera?" error={errors.on_camera}><select id="booking-on_camera" className={inputClass} value={text("on_camera")} onChange={e => set("on_camera", e.target.value)}><option value="">Not specified</option>{option("yes","Yes")}{option("no","No")}{option("not_sure","Not sure")}</select></Field>
          {text("on_camera") === "yes" ? <div className="grid gap-5 sm:grid-cols-2"><Field name="on_camera_people" label="Who will appear or speak?" required error={errors.on_camera_people}><input id="booking-on_camera_people" className={inputClass} value={text("on_camera_people")} onChange={e => set("on_camera_people", e.target.value)} /></Field><Field name="audio_requirements" label="Audio / microphone requirements" required error={errors.audio_requirements}><textarea id="booking-audio_requirements" className={inputClass} value={text("audio_requirements")} onChange={e => set("audio_requirements", e.target.value)} /></Field></div> : null}
        </div></details>
        <section className="space-y-4 border-t border-white/10 pt-6">
          <Check name="readiness_acknowledged" checked={checked("readiness_acknowledged")} set={set} error={errors.readiness_acknowledged}>The property will be cleaned, staged and ready at the agreed arrival time.</Check>
          <Check name="saved_details_confirmed" checked={checked("saved_details_confirmed")} set={set} error={errors.saved_details_confirmed}>The saved contact details above can be used for this request.</Check>
          <Check name="contact_update_requested" checked={checked("contact_update_requested")} set={set}>Request an update to my saved details.</Check>
          {checked("contact_update_requested") ? <Field name="contact_update_request" label="What should staff review?" required error={errors.contact_update_request}><textarea id="booking-contact_update_request" className={inputClass} value={text("contact_update_request")} onChange={e => set("contact_update_request", e.target.value)} /></Field> : null}
          <Check name="privacy_acknowledged" checked={checked("privacy_acknowledged")} set={set} error={errors.privacy_acknowledged}>I acknowledge that OpenÉire Studios may contact me about this operational booking request.</Check>
        </section>
        <button disabled={submitting} className="w-full rounded-full bg-green-600 px-6 py-4 font-bold text-white hover:bg-green-700 disabled:opacity-60">{submitting ? "Sending…" : "Send property request"}</button>
      </form>
    </div>
  </div>;
}

function OptionalChoice({ name, label, values, set, error }: { name: string; label: string; values: FormValues; set: (name: string, value: string) => void; error?: string }) {
  return <Field name={name} label={label} error={error}><select id={`booking-${name}`} className={inputClass} value={String(values[name] ?? "")} onChange={e => set(name, e.target.value)}><option value="">Not specified</option>{option("yes","Yes")}{option("no","No")}{option("not_sure","Not sure")}</select></Field>;
}

function Check({ name, checked, set, error, children }: { name: string; checked: boolean; set: (name: string, value: boolean) => void; error?: string; children: React.ReactNode }) {
  return <div data-field={name}><label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={checked} onChange={e => set(name, e.target.checked)} /><span>{children}</span></label>{error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}</div>;
}

function PrivateHeader() { return <header className="mb-10 flex items-center justify-between border-b border-white/10 pb-6"><span className="text-xl font-extrabold">OpenÉire <span className="text-amber-400">Studios</span></span><span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Private booking</span></header>; }
function PrivateMessage({ title, message, loading, children }: { title: string; message: string; loading?: boolean; children?: React.ReactNode }) { return <div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100"><div className="mx-auto max-w-4xl"><PrivateHeader /><section aria-live="polite" aria-busy={loading} className="mx-auto max-w-xl py-20 text-center">{loading ? <div className="mx-auto mb-5 h-9 w-9 animate-spin rounded-full border-2 border-zinc-700 border-t-green-500" /> : null}<h1 className="text-3xl font-bold">{title}</h1><p className="mt-4 leading-7 text-zinc-300">{message}</p>{children}</section></div></div>; }
