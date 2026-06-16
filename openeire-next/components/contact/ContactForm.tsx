"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  FaCheckCircle,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";
import { sendContactMessage, getApiErrorMessage } from "@/lib/api/publicForms";
import {
  registerIubendaConsentForm,
  submitIubendaConsentForm,
} from "@/lib/iubendaConsent";
import { useToast } from "@/components/ui/ToastProvider";
import type { ContactData } from "@/types/publicForms";

const FORM_ID = "contact-form";
const SUBMIT_ID = "contact-submit";

const inputClass =
  "w-full rounded-lg border border-white/20 bg-black p-4 text-white placeholder-gray-600 outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent";
const labelClass =
  "mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500";

const initialFormData: ContactData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const [formData, setFormData] = useState<ContactData>(initialFormData);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
        contact_request: "contact_request",
      },
    });
  }, []);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrorMessage(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    try {
      await sendContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject,
        message: formData.message.trim(),
      });
      submitIubendaConsentForm(FORM_ID);
      setStatus("success");
      setFormData(initialFormData);
      showToast("Message sent successfully.", "success");
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "We could not send your message. Please try again.",
      );
      setErrorMessage(message);
      setStatus("idle");
      showToast(message, "error");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="min-w-0 space-y-6 lg:col-span-5">
        <div className="group flex w-full min-w-0 max-w-full items-start gap-4 overflow-hidden rounded-2xl border border-white/10 bg-gray-900 p-6 transition-colors hover:border-brand-500/30 sm:gap-6 sm:p-8">
          <div className="shrink-0 rounded-full border border-white/10 bg-black p-4 text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-black">
            <FaEnvelope className="text-xl" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="mb-1 text-lg font-bold text-white">Email Us</h3>
            <p className="mb-2 text-sm text-gray-400">
              For print enquiries, commercial licensing, and custom drone work.
            </p>
            <a
              href="mailto:contact@openeire.ie"
              className="block break-all font-mono text-sm text-brand-500 hover:underline sm:text-base"
            >
              contact@openeire.ie
            </a>
          </div>
        </div>

        <div className="group flex w-full min-w-0 max-w-full items-start gap-4 overflow-hidden rounded-2xl border border-white/10 bg-gray-900 p-6 transition-colors hover:border-brand-500/30 sm:gap-6 sm:p-8">
          <div className="shrink-0 rounded-full border border-white/10 bg-black p-4 text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-black">
            <FaMapMarkerAlt className="text-xl" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="mb-1 text-lg font-bold text-white">Studio</h3>
            <p className="text-sm text-gray-400">
              Loughrea, Co. Galway, Ireland
              <br />
              <span className="mt-1 block text-xs uppercase tracking-widest opacity-50">
                By Appointment Only
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="min-w-0 lg:col-span-7">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gray-900 p-8 shadow-2xl md:p-10">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/5 blur-3xl" />

          {status === "success" ? (
            <div className="animate-fade-in-up flex min-h-[400px] flex-col items-center justify-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-500/10">
                <FaCheckCircle className="text-4xl text-brand-500" />
              </div>
              <h2 className="mb-4 font-serif text-3xl font-bold text-white">
                Message Sent
              </h2>
              <p className="mb-8 max-w-md text-gray-400">
                Thank you for reaching out. A member of our team will get back
                to you within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="rounded-lg border border-white/20 px-8 py-3 font-bold text-white transition-all hover:bg-brand-500 hover:text-black"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form
              id={FORM_ID}
              onSubmit={handleSubmit}
              className="relative z-10 space-y-6"
            >
              <input
                type="hidden"
                name="contact_request"
                value="true"
                readOnly
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="min-w-0">
                  <label htmlFor="contact-name" className={labelClass}>
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={inputClass}
                  />
                </div>
                <div className="min-w-0">
                  <label htmlFor="contact-email" className={labelClass}>
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className={labelClass}>
                  Topic
                </label>
                <select
                  id="contact-subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className={`${inputClass} cursor-pointer appearance-none`}
                >
                  <option value="" disabled>
                    Select a topic...
                  </option>
                  <option value="Licensing">Commercial Licensing</option>
                  <option value="Prints">Fine Art Prints</option>
                  <option value="Commission">Commission / Drone Work</option>
                  <option value="Support">Technical Support</option>
                  <option value="Other">Other Inquiry</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className={labelClass}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className={`${inputClass} resize-none`}
                />
              </div>

              {errorMessage ? (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {errorMessage}
                </div>
              ) : null}

              <button
                id={SUBMIT_ID}
                name="submit-button"
                type="submit"
                disabled={status === "submitting"}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-brand-700 py-4 text-lg font-bold text-paper shadow-lg transition-all hover:bg-brand-900 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "submitting" ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-900 border-t-transparent" />
                ) : (
                  <>
                    <span>Send Message</span>
                    <FaPaperPlane className="text-sm" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
