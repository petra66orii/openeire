import React from "react";

const IUBENDA_POLICY_URL = "https://www.iubenda.com/privacy-policy/77203310";
const IUBENDA_EMBED_URL =
  "https://www.iubenda.com/privacy-policy/77203310/legal";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="legal-content">
      <h1>Privacy & Cookie Policy</h1>
      <p>This policy is hosted by iubenda, our compliance provider.</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <iframe
          title="OpenEire Studios Privacy and Cookie Policy"
          src={IUBENDA_EMBED_URL}
          className="block h-[75vh] min-h-[720px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <p className="mt-6">
        If the embedded policy does not load in your browser, you can open it
        directly here:{" "}
        <a href={IUBENDA_POLICY_URL} target="_blank" rel="noopener noreferrer">
          View Privacy & Cookie Policy
        </a>
        .
      </p>
    </div>
  );
};

export default PrivacyPolicy;
