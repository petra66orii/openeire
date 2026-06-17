"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { getCountries, updateProfile } from "@/lib/api/account";
import { normalizeAuthErrorMessage } from "@/lib/api/auth";
import type { Country, ProfileUpdatePayload, UserProfile } from "@/types/auth";

interface ProfileEditFormProps {
  profile: UserProfile;
  onSaved: () => Promise<void>;
  onSuccess: (message: string) => void;
}

type ProfileFormState = {
  username: string;
  first_name: string;
  last_name: string;
  default_phone_number: string;
  default_street_address1: string;
  default_street_address2: string;
  default_town: string;
  default_county: string;
  default_postcode: string;
  country: string;
};

const toFormState = (profile: UserProfile): ProfileFormState => ({
  username: profile.username ?? "",
  first_name: profile.first_name ?? "",
  last_name: profile.last_name ?? "",
  default_phone_number: profile.default_phone_number ?? "",
  default_street_address1: profile.default_street_address1 ?? "",
  default_street_address2: profile.default_street_address2 ?? "",
  default_town: profile.default_town ?? "",
  default_county: profile.default_county ?? "",
  default_postcode: profile.default_postcode ?? "",
  country: profile.country ?? "",
});

const cleanOptional = (value: string): string | null => {
  const trimmed = value.trim();
  return trimmed || null;
};

const inputClass =
  "w-full rounded-lg border border-white/20 bg-black p-3 text-white outline-none transition-all focus:border-brand-500 focus:ring-1 focus:ring-brand-500";
const labelClass =
  "mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500";

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function ProfileEditForm({
  profile,
  onSaved,
  onSuccess,
}: ProfileEditFormProps) {
  const [formData, setFormData] = useState<ProfileFormState>(() =>
    toFormState(profile),
  );
  const [countries, setCountries] = useState<Country[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(toFormState(profile));
  }, [profile]);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingCountries(true);
    getCountries()
      .then((results) => {
        if (isMounted) setCountries(results);
      })
      .catch(() => {
        if (isMounted) {
          setError("Could not load country options. You can still save the rest of your profile.");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingCountries(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;

    const username = formData.username.trim();
    if (!username) {
      setError("Username is required.");
      return;
    }

    const payload: ProfileUpdatePayload = {
      username,
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      default_phone_number: cleanOptional(formData.default_phone_number),
      default_street_address1: cleanOptional(formData.default_street_address1),
      default_street_address2: cleanOptional(formData.default_street_address2),
      default_town: cleanOptional(formData.default_town),
      default_county: cleanOptional(formData.default_county),
      default_postcode: cleanOptional(formData.default_postcode),
      country: cleanOptional(formData.country),
    };

    setIsSaving(true);
    setError(null);
    try {
      await updateProfile(payload);
      await onSaved();
      onSuccess("Profile updated successfully.");
    } catch (caughtError) {
      setError(
        normalizeAuthErrorMessage(caughtError, "Could not update your profile."),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section aria-labelledby="profile-edit-heading">
      <div className="mb-8 border-b border-white/10 pb-4">
        <h3
          id="profile-edit-heading"
          className="font-serif text-3xl font-bold text-white"
        >
          Profile & Shipping
        </h3>
        <p className="mt-2 max-w-2xl text-sm text-gray-400">
          Keep your account details and default delivery information ready for
          future print orders.
        </p>
      </div>

      {error ? (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field id="profile-username" label="Username">
            <input
              id="profile-username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </Field>

          <Field id="profile-email" label="Email">
            <input
              id="profile-email"
              type="email"
              value={profile.email}
              disabled
              className={`${inputClass} cursor-not-allowed opacity-50`}
            />
            <p className="mt-1 text-[11px] text-gray-500">
              Change your email from the Security section.
            </p>
          </Field>

          <Field id="profile-first-name" label="First name">
            <input
              id="profile-first-name"
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>

          <Field id="profile-last-name" label="Last name">
            <input
              id="profile-last-name"
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="border-t border-white/10 pt-8">
          <h4 className="mb-6 text-xl font-bold text-white">
            Default Contact & Shipping
          </h4>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <Field id="profile-phone" label="Phone number">
                <input
                  id="profile-phone"
                  name="default_phone_number"
                  type="tel"
                  value={formData.default_phone_number}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field id="profile-address-1" label="Address line 1">
                <input
                  id="profile-address-1"
                  name="default_street_address1"
                  type="text"
                  value={formData.default_street_address1}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field id="profile-address-2" label="Address line 2">
                <input
                  id="profile-address-2"
                  name="default_street_address2"
                  type="text"
                  value={formData.default_street_address2}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field id="profile-town" label="Town / City">
              <input
                id="profile-town"
                name="default_town"
                type="text"
                value={formData.default_town}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            <Field id="profile-county" label="County / State">
              <input
                id="profile-county"
                name="default_county"
                type="text"
                value={formData.default_county}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            <Field id="profile-postcode" label="Postcode">
              <input
                id="profile-postcode"
                name="default_postcode"
                type="text"
                value={formData.default_postcode}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            <Field id="profile-country" label="Country">
              <select
                id="profile-country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={isLoadingCountries}
                className={`${inputClass} cursor-pointer appearance-none disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <option value="">
                  {isLoadingCountries ? "Loading countries..." : "Select country..."}
                </option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <div className="flex justify-end border-t border-white/10 pt-6">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-brand-500 px-8 py-3 font-bold text-paper shadow-lg transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
}
