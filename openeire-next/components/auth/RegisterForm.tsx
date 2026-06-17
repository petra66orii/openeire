"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useAuth, normalizeAuthErrorMessage } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/ToastProvider";
import { getSafeReturnPath } from "@/lib/auth/redirects";

interface RegisterFormData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const inputClass =
  "w-full rounded-lg border border-white/20 bg-black p-3 text-white outline-none transition-all placeholder-gray-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500";
const labelClass =
  "mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500";

const initialFormData: RegisterFormData = {
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: isAuthLoading, register } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const redirectPath = useMemo(
    () => getSafeReturnPath(searchParams.get("next")),
    [searchParams],
  );
  const isGalleryIntent = redirectPath === "/gallery-gate";

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (!emailParam) return;
    setFormData((current) => ({ ...current, email: current.email || emailParam }));
  }, [searchParams]);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace(redirectPath);
    }
  }, [isAuthenticated, isAuthLoading, redirectPath, router]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrorMessage(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      const message = "Passwords don't match!";
      setErrorMessage(message);
      showToast(message, "error");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await register({
        username: formData.username,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
      });
      showToast("Registration successful! Please check your email.", "success");
      router.replace(
        `/verify-pending?email=${encodeURIComponent(formData.email)}${
          isGalleryIntent ? "&fromGalleryGate=1" : ""
        }&next=${encodeURIComponent(redirectPath)}`,
      );
    } catch (error) {
      const message = normalizeAuthErrorMessage(
        error,
        "Registration failed. Please review your details and try again.",
      );
      setErrorMessage(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
      setFormData((current) => ({
        ...current,
        password: "",
        confirmPassword: "",
      }));
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in-up rounded-2xl border border-white/10 bg-gray-900 p-8 shadow-2xl">
      <div className="mb-8 text-center">
        <h1 className="mb-2 font-serif text-3xl font-bold text-white">
          Create Account
        </h1>
        <p className="text-sm text-gray-400">
          {isGalleryIntent
            ? "Create your account with the same email you used to request gallery access."
            : "Join OpenEire Studios to access exclusive content."}
        </p>
      </div>

      {isGalleryIntent ? (
        <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 p-4 text-sm leading-relaxed text-brand-100">
          <p className="font-semibold text-white">Private gallery access</p>
          <p className="mt-2">
            Use the same email where your access code was delivered. After you
            verify your account email, you can sign in and unlock the gallery.
          </p>
        </div>
      ) : null}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="w-full">
            <label htmlFor="first_name" className={labelClass}>
              First Name
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              required
              value={formData.first_name}
              onChange={handleChange}
              className={inputClass}
              placeholder="Jane"
            />
          </div>
          <div className="w-full">
            <label htmlFor="last_name" className={labelClass}>
              Last Name
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              required
              value={formData.last_name}
              onChange={handleChange}
              className={inputClass}
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label htmlFor="username" className={labelClass}>
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={formData.username}
            onChange={handleChange}
            className={inputClass}
            placeholder="janedoe"
          />
        </div>

        <div>
          <label htmlFor="register-email" className={labelClass}>
            Email Address
          </label>
          <input
            id="register-email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={inputClass}
            placeholder="jane@example.com"
          />
        </div>

        <div>
          <label htmlFor="register-password" className={labelClass}>
            Password
          </label>
          <input
            id="register-password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className={inputClass}
            placeholder="********"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className={labelClass}>
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className={inputClass}
            placeholder="********"
          />
        </div>

        {errorMessage ? (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
            {errorMessage}
          </div>
        ) : null}

        <button
          type="submit"
          className="w-full rounded-lg bg-brand-500 py-3 font-bold text-paper shadow-lg transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="mt-6 border-t border-white/10 pt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href={`/login?next=${encodeURIComponent(redirectPath)}${
            formData.email ? `&email=${encodeURIComponent(formData.email)}` : ""
          }`}
          className="font-bold text-white transition-colors hover:text-accent"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
