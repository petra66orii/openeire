import React from "react";

import { useLocation } from "react-router-dom";

import SEOHead from "../components/SEOHead";



const IUBENDA_POLICY_URL = "https://www.iubenda.com/privacy-policy/77203310";

const IUBENDA_EMBED_URL =

  "https://www.iubenda.com/privacy-policy/77203310/legal";



const PrivacyPolicy: React.FC = () => {

  const location = useLocation();

  const isCookiePolicyRoute = location.pathname === "/cookie-policy";



  return (

    <div className="bg-black min-h-screen text-white">

      <SEOHead

        title="Privacy and Cookie Policy"

        description="Read the OpenÉire Studios privacy and cookie policy hosted by iubenda."

        canonicalPath="/privacy"

        noindex={isCookiePolicyRoute}

      />

      <div className="legal-content">

        <h1>Privacy & Cookie Policy</h1>

        <p>This policy is hosted by iubenda, our compliance provider.</p>



        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm">

          <iframe

            title="OpenEire Studios Privacy and Cookie Policy"

            src={IUBENDA_EMBED_URL}

            className="block h-[75vh] min-h-[720px] w-full border-0 bg-white"

            loading="lazy"

            referrerPolicy="no-referrer"

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

    </div>

  );

};



export default PrivacyPolicy;

