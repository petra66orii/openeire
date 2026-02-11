import React, { useState } from "react";
import { sendContactMessage } from "../services/api";
import toast from "react-hot-toast";
import {
  FaEnvelope,
  FaPhone,
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

  const [status, setStatus] = useState("idle"); // 'idle', 'submitting', 'success', 'error'

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
      toast.error("Failed to send message. Please try again.");
    }
  };

  // Reusable Input Styles
  const inputClass =
    "w-full bg-black border border-white/20 rounded-lg p-4 text-white placeholder-gray-600 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all";
  const labelClass =
    "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2";

  return (
    <div className="bg-black min-h-screen text-white pt-24 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
            Get in Touch
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Have a question about a specific drone shot, a custom fine art
            print, or licensing rights? We are here to help bring your vision to
            life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* LEFT: INFO CARDS */}
          <div className="lg:col-span-5 space-y-6">
            {/* Info Card 1 */}
            <div className="bg-gray-900 border border-white/10 p-8 rounded-2xl flex items-start gap-6 hover:border-brand-500/30 transition-colors group">
              <div className="p-4 bg-black rounded-full border border-white/10 text-brand-500 group-hover:bg-brand-500 group-hover:text-black transition-colors">
                <FaEnvelope className="text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Email Us</h3>
                <p className="text-gray-400 text-sm mb-2">
                  For general inquiries and licensing.
                </p>
                <a
                  href="mailto:openeirestudios@gmail.com"
                  className="text-brand-500 hover:underline font-mono"
                >
                  openeirestudios@gmail.com
                </a>
              </div>
            </div>

            {/* Info Card 2 */}
            <div className="bg-gray-900 border border-white/10 p-8 rounded-2xl flex items-start gap-6 hover:border-brand-500/30 transition-colors group">
              <div className="p-4 bg-black rounded-full border border-white/10 text-brand-500 group-hover:bg-brand-500 group-hover:text-black transition-colors">
                <FaPhone className="text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Call Us</h3>
                <p className="text-gray-400 text-sm mb-2">
                  Mon-Fri from 9am to 6pm GMT.
                </p>
                <a
                  href="tel:+353123456789"
                  className="text-brand-500 hover:underline font-mono"
                >
                  +353 (0) 12 345 6789
                </a>
              </div>
            </div>

            {/* Info Card 3 */}
            <div className="bg-gray-900 border border-white/10 p-8 rounded-2xl flex items-start gap-6 hover:border-brand-500/30 transition-colors group">
              <div className="p-4 bg-black rounded-full border border-white/10 text-brand-500 group-hover:bg-brand-500 group-hover:text-black transition-colors">
                <FaMapMarkerAlt className="text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Studio</h3>
                <p className="text-gray-400 text-sm">
                  Galway, Ireland
                  <br />
                  <span className="text-xs opacity-50 uppercase tracking-widest mt-1 block">
                    By Appointment Only
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTACT FORM */}
          <div className="lg:col-span-7">
            <div className="bg-gray-900 border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
              {/* Decorative Blur */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              {status === "success" ? (
                <div className="min-h-[400px] flex flex-col items-center justify-center text-center animate-fade-in-up">
                  <div className="w-20 h-20 bg-brand-500/10 rounded-full flex items-center justify-center mb-6">
                    <FaCheckCircle className="text-4xl text-brand-500" />
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-white mb-4">
                    Message Sent
                  </h3>
                  <p className="text-gray-400 max-w-md mb-8">
                    Thank you for reaching out. A member of our team will get
                    back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-8 py-3 border border-white/20 rounded-lg text-white hover:bg-brand-500 hover:text-black transition-all font-bold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 relative z-10"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
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
                    <div>
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
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg
                          className="w-4 h-4"
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
                    className="w-full py-4 bg-brand-700 text-paper font-bold text-lg rounded-xl hover:bg-brand-900 transition-all transform active:scale-[0.99] shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "submitting" ? (
                      <div className="w-5 h-5 border-2 border-brand-900 border-t-transparent rounded-full animate-spin"></div>
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
