"use client";

import { useEffect, useState, type FormEvent } from "react";
import { newsletterSignup, getApiErrorMessage } from "@/lib/api/publicForms";
import {
  registerIubendaConsentForm,
  submitIubendaConsentForm,
} from "@/lib/iubendaConsent";
import { useToast } from "@/components/ui/ToastProvider";

const FORM_ID = "footer-newsletter-signup-form";
const SUBMIT_ID = "footer-newsletter-submit";

export function FooterNewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    return registerIubendaConsentForm({
      formId: FORM_ID,
      submitButtonId: SUBMIT_ID,
      subject: { email: "email" },
      preferences: { newsletter: "newsletter_consent" },
    });
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await newsletterSignup({ email, source: "footer" });
      submitIubendaConsentForm(FORM_ID);
      setEmail("");
      showToast("Thanks for joining the OpenEire list.", "success");
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "We could not subscribe that email. Please try again.",
      );
      setErrorMessage(message);
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id={FORM_ID} className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <input type="hidden" name="newsletter_consent" value="true" readOnly />
      <label htmlFor="footer-newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="footer-newsletter-email"
        name="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="email@example.com"
        required
        autoComplete="email"
        className="w-full rounded-lg border border-paper bg-brand-800 px-4 py-3 text-white placeholder-paper/50 transition-all focus:outline-none focus:ring-1 focus:ring-accent"
      />
      {errorMessage ? (
        <p className="text-xs leading-5 text-red-200">{errorMessage}</p>
      ) : null}
      <button
        id={SUBMIT_ID}
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-accent px-4 py-3 font-bold text-brand-900 shadow-lg shadow-black/20 transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Subscribing..." : "Subscribe"}
      </button>
    </form>
  );
}
