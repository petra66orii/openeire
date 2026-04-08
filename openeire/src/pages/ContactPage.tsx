import React, { useState } from "react";
import SEOHead from "../components/SEOHead";
import { sendContactMessage } from "../services/api";
import toast from "react-hot-toast";
import { getContactToastErrorMessage } from "../utils/toast";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaCheckCircle,
} from "react-icons/fa";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("idle");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      await sendContactMessage(formData);
      setStatus("success");
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
      toast.error(getContactToastErrorMessage(err));
    }
  };

  const inputClass =
    "w-full rounded-lg border border-white/20 bg-black p-4 text-white placeholder-gray-600 outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent";
  const labelClass =
    "mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500";

  return (
    <div className="min-h-screen overflow-x-hidden bg-black pb-20 pt-24 text-white mobile-page-offset">
      <SEOHead
        title="Contact"
        description={
          "Get in touch with Open\u00C9ire Studios for licensing, fine art print enquiries, and bespoke visual requests."
        }
        canonicalPath="/contact"
      />

      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-16 px-2 text-center">
          <h1 className="mb-6 text-4xl font-serif font-bold md:text-6xl">
            Get in Touch
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-400 font-light">
            Have a question about a specific drone shot, a custom fine art
            print, or licensing rights? We are here to help bring your vision to
            life.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="min-w-0 space-y-6 lg:col-span-5">
            <div className="group flex w-full min-w-0 max-w-full items-start gap-4 overflow-hidden rounded-2xl border border-white/10 bg-gray-900 p-6 transition-colors hover:border-brand-500/30 sm:gap-6 sm:p-8">
              <div className="shrink-0 rounded-full border border-white/10 bg-black p-4 text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-black">
                <FaEnvelope className="text-xl" />
              </div>
              <div className="min-w-0">
                <h3 className="mb-1 text-lg font-bold text-white">Email Us</h3>
                <p className="mb-2 text-sm text-gray-400">
                  For general inquiries and licensing.
                </p>
                <a
                  href="mailto:openeirestudios@gmail.com"
                  className="block break-all font-mono text-sm text-brand-500 hover:underline sm:text-base"
                >
                  openeirestudios@gmail.com
                </a>
              </div>
            </div>

            <div className="group flex w-full min-w-0 max-w-full items-start gap-4 overflow-hidden rounded-2xl border border-white/10 bg-gray-900 p-6 transition-colors hover:border-brand-500/30 sm:gap-6 sm:p-8">
              <div className="shrink-0 rounded-full border border-white/10 bg-black p-4 text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-black">
                <FaMapMarkerAlt className="text-xl" />
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
              <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/5 blur-3xl"></div>

              {status === "success" ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center text-center animate-fade-in-up">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-500/10">
                    <FaCheckCircle className="text-4xl text-brand-500" />
                  </div>
                  <h3 className="mb-4 text-3xl font-serif font-bold text-white">
                    Message Sent
                  </h3>
                  <p className="mb-8 max-w-md text-gray-400">
                    Thank you for reaching out. A member of our team will get
                    back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="rounded-lg border border-white/20 px-8 py-3 font-bold text-white transition-all hover:bg-brand-500 hover:text-black"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="relative z-10 space-y-6"
                >
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="min-w-0">
                      <label htmlFor="name" className={labelClass}>
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={inputClass}
                      />
                    </div>
                    <div className="min-w-0">
                      <label htmlFor="email" className={labelClass}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className={labelClass}>
                      Topic
                    </label>
                    <div className="relative">
                      <select
                        name="subject"
                        id="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`${inputClass} appearance-none cursor-pointer`}
                      >
                        <option value="" disabled>
                          Select a topic...
                        </option>
                        <option value="Stock Footage">
                          Stock Footage Licensing
                        </option>
                        <option value="Prints">Fine Art Prints</option>
                        <option value="Commission">
                          Commission / Drone Work
                        </option>
                        <option value="Support">Technical Support</option>
                        <option value="Other">Other Inquiry</option>
                      </select>
                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className={labelClass}>
                      Message
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className={`${inputClass} resize-none`}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-brand-700 py-4 text-lg font-bold text-paper shadow-lg transition-all active:scale-[0.99] hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {status === "submitting" ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-900 border-t-transparent"></div>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <FaPaperPlane className="text-sm" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

