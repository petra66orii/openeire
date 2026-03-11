import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { FaTimes } from "react-icons/fa";
import { submitLicenseRequest, LicenseRequestPayload } from "../services/api";
import toast from "react-hot-toast";

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
  territory: "IRELAND",
  permitted_media: "WEB_SOCIAL",
  reach_caps: "",
  exclusivity: "NON_EXCLUSIVE",
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
  >(getInitialFormData());

  // Mandatory Legal Checkboxes
  const [agreements, setAgreements] = useState({
    merch: false,
    ai: false,
  });

  useEffect(() => {
    if (!isOpen) return;
    setFormData(getInitialFormData());
    setAgreements({ merch: false, ai: false });
    setIsSubmitting(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setFormData(getInitialFormData());
    setAgreements({ merch: false, ai: false });
    setIsSubmitting(false);
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setAgreements((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreements.merch || !agreements.ai) {
      toast.error("You must agree to the licensing terms to proceed.");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitLicenseRequest({
        ...formData,
        asset_id: assetId,
        asset_type: assetType,
      });
      toast.success(
        "License request submitted! We will be in touch shortly with a custom quote.",
      );
      handleClose();
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto pt-20 pb-20">
      <div
        className="inset-0 bg-black/80 backdrop-blur-sm fixed"
        onClick={handleClose}
      ></div>
      <div
        className="relative bg-gray-900 border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-gray-900 sticky top-0 z-10">
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
          {/* Section 1: Client Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Company / Agency
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

          <div className="border-t border-white/10 pt-4 mt-2">
            <h3 className="text-sm font-bold text-white mb-4">
              License Schedule Details
            </h3>
          </div>

          {/* Section 2: Licence Scope */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <option value="CORPORATE">Corporate / B2B</option>
                <option value="EDITORIAL">Editorial / Documentary</option>
                <option value="COMMERCIAL">Commercial / Advertising</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                Permitted Media *
              </label>
              <select
                name="permitted_media"
                value={formData.permitted_media}
                onChange={handleChange}
                className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none appearance-none"
              >
                <option value="WEB_SOCIAL">Web & Organic Social Only</option>
                <option value="PAID_DIGITAL">Paid Digital Ads</option>
                <option value="PRINT_BROCHURE">Print & Brochure</option>
                <option value="BROADCAST">TV / Broadcast / Cinema</option>
                <option value="ALL_MEDIA">All Media</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                Territory *
              </label>
              <select
                name="territory"
                value={formData.territory}
                onChange={handleChange}
                className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none appearance-none"
              >
                <option value="IRELAND">Ireland Only</option>
                <option value="EU">EU / UK</option>
                <option value="US_NA">US / North America</option>
                <option value="SOUTH_AMERICA">South America</option>
                <option value="ASIA">Asia</option>
                <option value="AFRICA">Africa</option>
                <option value="OCEANIA">Oceania</option>
                <option value="WORLDWIDE">Worldwide</option>
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
                <option value="1_MONTH">1 Month</option>
                <option value="3_MONTHS">3 Months</option>
                <option value="6_MONTHS">6 Months</option>
                <option value="1_YEAR">1 Year</option>
                <option value="2_YEARS">2 Years</option>
                <option value="5_YEARS">5 Years</option>
                <option value="PERPETUAL">Perpetual</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                Exclusivity *
              </label>
              <select
                name="exclusivity"
                value={formData.exclusivity}
                onChange={handleChange}
                className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none appearance-none"
              >
                <option value="NON_EXCLUSIVE">Non-Exclusive</option>
                <option value="CATEGORY">Category Exclusive</option>
                <option value="FULL">Fully Exclusive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Additional Details
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={2}
              maxLength={2000}
              placeholder="Include reach caps if applicable (e.g., audience size, ad spend, print run limits)..."
              className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-accent outline-none resize-none"
            ></textarea>
          </div>

          {/* Section 3: Legal Agreements */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 mt-4">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-bold">
              Required Legal Affirmations
            </p>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="merch"
                checked={agreements.merch}
                onChange={handleCheckboxChange}
                className="mt-1 w-4 h-4 rounded border-gray-600 text-accent focus:ring-accent bg-black"
              />
              <span className="text-xs text-gray-300 leading-relaxed">
                I understand this is a digital license, not a transfer of
                ownership. This license strictly prohibits using the asset as
                the primary value component of physical merchandise or
                Print-on-Demand (POD) products for resale.
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="ai"
                checked={agreements.ai}
                onChange={handleCheckboxChange}
                className="mt-1 w-4 h-4 rounded border-gray-600 text-accent focus:ring-accent bg-black"
              />
              <span className="text-xs text-gray-300 leading-relaxed">
                I agree not to use, upload, or embed the asset for AI/ML
                training, dataset creation, generative model fine-tuning, or NFT
                minting.
              </span>
            </label>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={isSubmitting || !agreements.merch || !agreements.ai}
              className={`w-full py-4 font-bold text-lg rounded-xl transition-all shadow-lg ${
                isSubmitting || !agreements.merch || !agreements.ai
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-white text-black hover:bg-gray-200 active:scale-[0.98]"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit License Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default LicenseRequestModal;
