import React from "react";
import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import {
  FaImage,
  FaBuilding,
  FaNewspaper,
  FaBan,
  FaGavel,
  FaGlobe,
} from "react-icons/fa";

const BRAND_NAME = "OpenEire Studios";
const COPYRIGHT_SYMBOL = "\u00A9";

const INTRO_TEXT = `${BRAND_NAME} offers premium fine-art photography and high-resolution aerial footage. To protect the integrity of the work, all media is subject to strict licensing terms. Please review the tiers below to ensure your intended use complies with our copyright and licensing policies.`;

const INTERNATIONAL_USE_TEXT = `Licences issued by ${BRAND_NAME} apply to customers worldwide. Your permitted usage is governed by the licence you purchase and the scope we approve. Copyright protection is recognised internationally and unauthorised use may be pursued in Ireland and/or the jurisdiction where the use occurs.`;

const PERSONAL_RIGHTS = [
  "Personal display only (home or private office)",
  "Personal device backgrounds",
];

const PERSONAL_PROHIBITED = [
  "Any form of reproduction, scanning, copying, or tracing",
  "Commercial, promotional, advertising, or corporate use",
  "Resale, redistribution, sublicensing, or sharing files",
  'Uploading to stock libraries or "free asset" platforms',
  "AI training, model fine-tuning, dataset creation, or similar",
  "NFT minting, tokenisation, or blockchain-based commercialisation",
];

const COMMERCIAL_KEY_TERMS = [
  "Defined scope (specific campaign, property listing, brand, or project)",
  "Non-exclusive by default (exclusivity only by written agreement)",
  "Time-limited duration (e.g., 3 / 6 / 12 months)",
  "Territory-limited (e.g., Ireland / EU / US / Worldwide)",
  "Media-limited (e.g., web, social, print, broadcast, paid ads)",
];

const LICENCE_SCHEDULE_ITEMS = [
  "Licensed Asset(s): specific file(s) / ID(s)",
  "Permitted Media: e.g., website, organic social, print brochure, property listing, OOH, broadcast, paid digital ads",
  "Territory: e.g., Ireland, EU/EEA, United States, North America, Worldwide",
  "Duration: start date + end date (or fixed term from activation)",
  "Project / Campaign: brand, property listing, or campaign name",
  "Reach / Distribution Limits (if applicable): e.g., print run, ad spend cap, audience size, placement types",
  "Exclusivity (if applicable): scope + duration + territory + category",
];

const COMMERCIAL_PROHIBITED_USES = [
  "Resale, redistribution, sublicensing, or making the file available to third parties except as allowed below",
  'Uploading to stock libraries, marketplaces, or "asset packs"',
  "Use in logos, trademarks, service marks, or as a primary brand identifier",
  "AI training, dataset creation, model fine-tuning, or similar machine learning usage",
  "NFT minting, tokenisation, or blockchain-based commercialisation",
  "Use that is unlawful, defamatory, or misleading (including false endorsement)",
];

const EDITORIAL_CONDITIONS = [
  "Written approval required",
  "Mandatory visual credit (when required)",
  "No advertising or paid promotion",
];

const COMMERCIAL_LEGAL_INTRO = {
  prefix:
    "The terms below form the legal licensing framework for commercial usage. The exact scope of your licence is set out in the",
  emphasis: "Licence Schedule",
  suffix:
    "(asset, media, territory, duration, and any limits). By purchasing or using licensed media, the Licensee agrees to these terms.",
};

const COMMERCIAL_NOTE =
  "Note: Your commercial licence is valid only after written approval and payment. If you are unsure whether your use is within scope, request clarification before publishing.";

type Paragraph = {
  text: string;
  className?: string;
};

type LegalSection = {
  title: string;
  paragraphs?: Paragraph[];
  listItems?: string[];
  creditLine?: string;
};

const LEGAL_SECTIONS: LegalSection[] = [
  {
    title: "1. Ownership",
    paragraphs: [
      {
        text: `All imagery and footage remain the exclusive intellectual property of ${BRAND_NAME}. No ownership rights are transferred. The Licensee receives only the limited rights expressly granted in the Licence Schedule and these terms.`,
      },
    ],
  },
  {
    title: "2. Grant of Licence",
    paragraphs: [
      {
        text: `Subject to (a) written approval by ${BRAND_NAME} and (b) full payment, ${BRAND_NAME} grants the Licensee a non-exclusive, non-transferable, rights-managed licence to use the Licensed Asset(s) solely within the agreed scope. Any usage outside scope requires a separate written licence.`,
      },
    ],
  },
  {
    title: "3. Territory",
    paragraphs: [
      {
        text: "Usage is restricted to the territory defined in the Licence Schedule. Use outside the agreed territory constitutes unauthorised use.",
      },
    ],
  },
  {
    title: "4. Duration",
    paragraphs: [
      {
        text: "Rights are granted for the term defined in the Licence Schedule. Use after expiry requires renewal or a new licence.",
      },
    ],
  },
  {
    title: "5. Permitted Media & Purpose",
    paragraphs: [
      {
        text: "The Licensee may use the Licensed Asset(s) only in the media channels and for the purpose stated in the Licence Schedule. Any new campaign, brand, property listing, product, or placement type not specified is outside scope.",
      },
    ],
  },
  {
    title: "6. Modifications & Derivative Works",
    paragraphs: [
      {
        text: "Unless the Licence Schedule states otherwise, limited modifications are permitted strictly to implement the approved usage: resizing, cropping, compression, minor colour grading, and adding text/graphics overlays.",
        className: "mb-2",
      },
      {
        text: "Prohibited: modifications that materially alter the meaning, context, or integrity of the work; removal of embedded watermarks/metadata; and creation of derivative commercial products intended for redistribution or resale.",
      },
    ],
  },
  {
    title: "7. Prohibited Uses (Commercial)",
    listItems: COMMERCIAL_PROHIBITED_USES,
  },
  {
    title: "8. Agencies, Contractors & Limited Sharing",
    paragraphs: [
      {
        text: "The Licensee may provide the Licensed Asset(s) to contracted agencies or contractors solely to execute the approved project, provided such parties are bound to comply with these terms. The Licensee remains responsible for all usage and any breach.",
      },
    ],
  },
  {
    title: "9. Editorial Use",
    paragraphs: [
      {
        text: "Editorial licences are for storytelling, reporting, documentary, educational, or commentary purposes and require written approval. Editorial use may not be used for advertising, paid promotion, or product/service endorsement.",
        className: "mb-2",
      },
    ],
    creditLine: `Where required by ${BRAND_NAME}, credit must be displayed as:`,
  },
  {
    title: "10. Warranty (Limited)",
    paragraphs: [
      {
        text: `${BRAND_NAME} warrants only that it is the lawful copyright holder of the Licensed Asset(s) or has the right to license them. No other warranties are provided.`,
      },
    ],
  },
  {
    title: "11. Indemnity",
    paragraphs: [
      {
        text: `The Licensee agrees to indemnify and hold harmless ${BRAND_NAME} against claims, damages, liabilities, costs, and expenses arising from the Licensee's use of the Licensed Asset(s), including use beyond scope or in breach of this Agreement.`,
      },
    ],
  },
  {
    title: "12. Limitation of Liability",
    paragraphs: [
      {
        text: `To the maximum extent permitted by applicable law, ${BRAND_NAME} shall not be liable for indirect, incidental, special, or consequential damages arising out of or related to the licence or use of the Licensed Asset(s).`,
      },
    ],
  },
  {
    title: "13. Governing Law & Jurisdiction",
    paragraphs: [
      {
        text: "This Agreement is governed by the laws of Ireland and applicable European Union law. The parties submit to the jurisdiction of the Irish courts.",
        className: "mb-2",
      },
      {
        text: `${BRAND_NAME} may also pursue enforcement and remedies in the jurisdiction where the unauthorised use occurs and/or where the Licensee is established. For US-based usage, remedies may also be available under Title 17 of the United States Code.`,
      },
    ],
  },
  {
    title: "14. Breach, Termination & Remedies",
    paragraphs: [
      {
        text: `Any unauthorised use constitutes infringement and material breach. ${BRAND_NAME} may immediately terminate the licence upon breach. Remedies may include takedown demands, injunctive relief, damages (including statutory damages where available), account of profits, and recovery of reasonable legal costs.`,
      },
    ],
  },
  {
    title: "15. Entire Agreement",
    paragraphs: [
      {
        text: `These terms, together with the Licence Schedule and any written approval issued by ${BRAND_NAME}, constitute the entire agreement between the parties regarding the Licensed Asset(s) and supersede prior discussions or communications.`,
      },
    ],
  },
];

const BulletList: React.FC<{ items: string[]; className?: string }> = ({
  items,
  className,
}) => (
  <ul className={`list-disc list-inside ${className ?? ""}`.trim()}>
    {items.map((item, index) => (
      <li key={`${item}-${index}`}>{item}</li>
    ))}
  </ul>
);

const LicensingPage: React.FC = () => {
  return (
    <div className="bg-black min-h-screen text-white pt-24 pb-20 font-sans selection:bg-accent selection:text-black">
      <SEOHead
        title="Licensing & Usage Rights"
        description={`Understanding personal, commercial (rights-managed), and editorial licensing for ${BRAND_NAME}.`}
      />

      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
          Licensing & Usage Rights
        </h1>

        <p className="text-gray-400 text-lg leading-relaxed mb-6 max-w-3xl">
          {INTRO_TEXT}
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white text-lg">
              <FaGlobe />
            </div>
            <h2 className="text-lg font-bold">
              International use (EU, US, and beyond)
            </h2>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            {INTERNATIONAL_USE_TEXT}
          </p>
        </div>

        <div className="space-y-12">
          {/* TIER 1: ART / PERSONAL USE */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white text-xl">
                <FaImage />
              </div>
              <h2 className="text-2xl font-bold">
                Art & Personal Use (Default)
              </h2>
            </div>

            <p className="text-gray-400 mb-6">
              Applies to all physical purchases (canvas, framed prints, metal
              prints) and approved personal digital downloads. This tier is for
              private enjoyment only.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-3">
                  Rights Granted
                </h3>
                <BulletList
                  items={PERSONAL_RIGHTS}
                  className="space-y-2 text-sm text-gray-300"
                />
              </div>

              <div>
                <h3 className="text-sm uppercase tracking-widest text-red-400 mb-3 flex items-center gap-2">
                  <FaBan /> Strictly Prohibited
                </h3>
                <BulletList
                  items={PERSONAL_PROHIBITED}
                  className="space-y-2 text-sm text-gray-300"
                />
              </div>
            </div>
          </section>

          {/* TIER 2: COMMERCIAL MARKETING */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white text-xl">
                <FaBuilding />
              </div>
              <h2 className="text-2xl font-bold">
                Commercial & Marketing Licence (Rights-Managed)
              </h2>
            </div>

            <p className="text-gray-400 mb-6">
              Applies to real estate agencies, hospitality brands, developers,
              and tourism operators. This is a{" "}
              <span className="text-white font-semibold">Rights-Managed</span>{" "}
              licence and requires approval. Pricing and approval depend on
              intended usage (media, territory, duration, reach).
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-3">
                  Key Terms (Summary)
                </h3>
                <BulletList
                  items={COMMERCIAL_KEY_TERMS}
                  className="space-y-2 text-sm text-gray-300"
                />
              </div>

              <div className="flex md:justify-end md:items-start">
                <Link
                  to="/gallery/digital"
                  className="inline-block mt-4 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Browse Footage & Request Licence
                </Link>
              </div>
            </div>

            {/* FULL RM LICENSE AGREEMENT */}
            <div className="mt-10 border-t border-white/10 pt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white text-lg">
                  <FaGavel />
                </div>
                <h3 className="text-xl font-bold">
                  Commercial Rights-Managed Licence Agreement
                </h3>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {COMMERCIAL_LEGAL_INTRO.prefix}{" "}
                <span className="text-white font-semibold">
                  {COMMERCIAL_LEGAL_INTRO.emphasis}
                </span>{" "}
                {COMMERCIAL_LEGAL_INTRO.suffix}
              </p>

              <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
                <div className="bg-black/30 border border-white/10 rounded-xl p-5">
                  <p className="text-gray-200 font-semibold mb-2">
                    Licence Schedule (must be defined for each commercial
                    licence)
                  </p>
                  <BulletList
                    items={LICENCE_SCHEDULE_ITEMS}
                    className="space-y-1 text-gray-300"
                  />
                </div>

                {LEGAL_SECTIONS.map((section) => (
                  <div key={section.title}>
                    <p className="text-gray-200 font-semibold">
                      {section.title}
                    </p>
                    {section.paragraphs?.map((paragraph, index) => (
                      <p
                        key={`${section.title}-paragraph-${index}`}
                        className={paragraph.className}
                      >
                        {paragraph.text}
                      </p>
                    ))}
                    {section.listItems && (
                      <BulletList
                        items={section.listItems}
                        className="space-y-1"
                      />
                    )}
                    {section.creditLine && (
                      <p>
                        {section.creditLine}{" "}
                        <span className="text-white font-semibold">
                          {COPYRIGHT_SYMBOL} {BRAND_NAME}
                        </span>
                        .
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-5">
                <p className="text-xs text-gray-400 leading-relaxed">
                  {COMMERCIAL_NOTE}
                </p>
              </div>
            </div>
          </section>

          {/* TIER 3: EDITORIAL */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white text-xl">
                <FaNewspaper />
              </div>
              <h2 className="text-2xl font-bold">Editorial Licence</h2>
            </div>

            <p className="text-gray-400 mb-6">
              Applies to media outlets, documentaries, magazines, and
              educational content where the goal is storytelling, not selling.
              Editorial usage requires written approval.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-3">
                  Conditions (Summary)
                </h3>
                <BulletList
                  items={EDITORIAL_CONDITIONS}
                  className="space-y-2 text-sm text-gray-300"
                />
              </div>
            </div>
          </section>
        </div>

        {/* COPYRIGHT NOTICE */}
        <div className="mt-16 p-6 border-t border-white/10 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-widest leading-loose">
            {COPYRIGHT_SYMBOL} {new Date().getFullYear()} {BRAND_NAME}. All rights
            reserved.
            Unauthorised use may constitute copyright infringement and may
            result in takedown demands, injunctive relief, damages, and recovery
            of legal costs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LicensingPage;
