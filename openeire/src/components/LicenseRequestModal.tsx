import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { FaTimes } from "react-icons/fa";
import { submitLicenseRequest, LicenseRequestPayload } from "../services/api";
import { toast } from "react-toastify";

interface LicenseRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetId: number;
  assetType: "photo" | "video";
  assetTitle: string;
}

const getInitialFormData = (): Omit<
  LicenseRequestPayload,
  "asset_id" | "asset_type"
> => ({
  client_name: "",
  company: "",
  email: "",
  project_type: "COMMERCIAL",
  duration: "1_YEAR",
  message: "",
});

const LicenseRequestModal: React.FC<LicenseRequestModalProps> = ({
  isOpen,
  onClose,
  assetId,
  assetType,
  assetTitle,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<
    Omit<LicenseRequestPayload, "asset_id" | "asset_type">
  >(getInitialFormData);

  useEffect(() => {
    if (!isOpen) return;
    setFormData(getInitialFormData());
    setIsSubmitting(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setFormData(getInitialFormData());
    setIsSubmitting(false);
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitLicenseRequest({
        ...formData,
        asset_id: assetId,
        asset_type: assetType,
      });
      toast.success(
        "License request submitted! We will be in touch shortly with a quote.",
      );
      handleClose();
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      ></div>
      <div
        className="relative bg-gray-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-serif font-bold text-white">
              Request Commercial License
            </h2>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
              For: {assetTitle}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                Full Name *
              </label>
              <input
                required
                type="text"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Email Address *
            </label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                Project Type *
              </label>
              <select
                name="project_type"
                value={formData.project_type}
                onChange={handleChange}
                className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none appearance-none"
              >
                <option value="REAL_ESTATE">Real Estate / Property</option>
                <option value="EDITORIAL">Editorial / Documentary</option>
                <option value="COMMERCIAL">Commercial / Advertising</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                Duration *
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none appearance-none"
              >
                <option value="1_YEAR">1 Year</option>
                <option value="2_YEARS">2 Years</option>
                <option value="PERPETUAL">Perpetual / Lifetime</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Project Details
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              maxLength={2000}
              placeholder="Tell us a bit about how and where this footage will be used..."
              className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none resize-none"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 font-bold text-lg rounded-xl transition-all shadow-lg ${isSubmitting ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-white text-black hover:bg-gray-200 active:scale-[0.98]"}`}
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default LicenseRequestModal;
