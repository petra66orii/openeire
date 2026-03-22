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

const BRAND_NAME = "Open\u00C9ire Studios";
const COPYRIGHT_SYMBOL = "\u00A9";

const INTRO_TEXT = `${BRAND_NAME} offers premium fine-art photography and high-resolution aerial footage. To protect the integrity of the work, all media is subject to strict licensing terms. Please review the tiers below to ensure your intended use complies with our copyright and licensing policies.`;

const INTERNATIONAL_USE_TEXT = `Licences issued by ${BRAND_NAME} apply to customers worldwide. Your permitted usage is governed by the licence you purchase and the scope we approve. Copyright protection is recognised internationally and unauthorised use may be pursued in Ireland and/or the jurisdiction where the use occurs.`;

// --- PERSONAL TIER DATA ---
const PERSONAL_RIGHTS = [
  "Display physical prints in your home or private office",
  "Give physical prints as a personal gift to another individual",
  "Store digital files on your personal devices and make reasonable backup copies",
  "Print digital files solely for your own personal, non-commercial display",
];

const PERSONAL_PROHIBITED = [
  "Any business activity, advertising, client work, or promotional materials",
  "Resale, redistribution, sublicensing, or sharing files publicly",
  'Uploading to stock libraries, marketplaces, or "free asset" platforms',
  "Uploading to Print-on-Demand (POD) services or merchandise platforms",
  "Use in logos, trademarks, brand identities, templates, or design packs",
  "Training artificial intelligence, machine learning systems, or dataset creation",
];

const PERSONAL_ADDITIONAL_TERMS = [
  "Third-Party Rights: Images may depict locations or elements subject to third-party rights. This licence does not grant permission to use any trademarks or private property rights.",
  "Privacy & Personality Rights: You must not use any work in a way that invades privacy, misrepresents a person, or implies endorsement by an identifiable individual.",
  "Consumer Rights: Nothing in this licence limits your statutory rights under Irish or EU consumer protection law.",
];

// --- COMMERCIAL TIER DATA ---
const COMMERCIAL_KEY_TERMS = [
  "Defined scope (specific campaign, property listing, brand, or project)",
  "Non-exclusive by default (exclusivity only by written agreement)",
  "Time-limited duration (e.g., 3 / 6 / 12 months)",
  "Territory-limited (e.g., Ireland / EU / US / Worldwide)",
  "Media-limited (e.g., web, social, print, broadcast, paid ads)",
];

const LICENCE_SCHEDULE_ITEMS = [
  "Licensed Asset(s): specific file(s), ID(s), and SHA-256 hashes",
  "Permitted Media: precisely defined usage channels",
  "Territory: authorized geographic regions",
  "Duration: activation date to expiry date",
  "Project / Campaign: specific brand or project name",
  "Reach / Distribution Limits: e.g., print run, ad spend cap, or impression limits",
  "Modifications Allowed: defined limitations on edits",
];

const COMMERCIAL_PROHIBITED_USES = [
  "Reselling, sublicensing, redistributing, or making the standalone file available to third parties",
  "Physical merchandise, apparel, posters, or uploading to Print-on-Demand (POD) platforms for resale",
  "Uploading to stock libraries, marketplaces, or asset repositories",
  "Use as a trademark, logo, service mark, or source identifier",
  "Use in political campaigns, defamatory material, adult content, or misleading endorsements",
  "Incorporation into template packs, design kits, LUT bundles, or resale toolkits",
  "NFT minting, tokenisation, blockchain registration, or smart-contract systems",
];

const AI_PROHIBITIONS = [
  "Training, fine-tuning, or evaluating any AI, machine learning, deep learning, or generative models",
  "Inclusion in any dataset, corpus, or archive for computational analysis",
  "Use as input, conditioning material, or style reference for automated generation systems",
  "Creation of derivative synthetic imagery, video, or 3D assets algorithmically",
  "Reverse engineering or extraction of compositional data for machine-readable pattern replication",
];

const EDITORIAL_CONDITIONS = [
  "Written approval required",
  "Mandatory visual credit (when required)",
  "No advertising, paid promotion, or commercial endorsement",
];

const COMMERCIAL_LEGAL_INTRO = {
  prefix:
    "The terms below summarise the legal licensing framework for commercial usage. The exact scope of your licence is set out in the",
  emphasis: "Licence Schedule",
  suffix:
    "(asset, media, territory, duration, and any limits). By purchasing or using licensed media, the Licensee agrees to the Master Rights-Managed Agreement.",
};

const COMMERCIAL_NOTE =
  "Note: Your commercial licence is valid only after written approval and full payment. If you are unsure whether your use is within scope, request clarification before publishing.";

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
    title: "1. Ownership & Copyright",
    paragraphs: [
      {
        text: `All Licensed Asset(s) remain the exclusive intellectual property of ${BRAND_NAME}. No ownership, title, or copyright is transferred. The Licensee receives only the limited rights expressly granted in the Licence Schedule.`,
      },
    ],
  },
  {
    title: "2. Drone Capture Compliance & Limited Warranty",
    paragraphs: [
      {
        text: `${BRAND_NAME} represents that, to the best of its knowledge, assets were captured in material compliance with applicable unmanned aircraft rules (including airspace restrictions and geographic zones). However, regulations evolve and ${BRAND_NAME} does not warrant the absence of all third-party rights in every element of the captured scene.`,
      },
    ],
  },
  {
    title: "3. Grant of Licence, Territory & Duration",
    paragraphs: [
      {
        text: `Subject to written approval and full payment, ${BRAND_NAME} grants a non-exclusive, non-transferable, rights-managed licence strictly within the defined scope, territory, duration, and permitted media channels stated in the Licence Schedule. Use is limited to the stated purpose; any new campaign, placement type, or media channel not listed is outside scope. Upon expiry, all usage must cease, and digital copies must be deleted except for one secure archival copy retained solely for legal record purposes.`,
      },
    ],
  },
  {
    title: "4. Modifications & Moral Rights",
    paragraphs: [
      {
        text: `Only modifications expressly permitted in the Licence Schedule are allowed. The Licensee shall not distort, mutilate, misrepresent, or treat the asset in a manner prejudicial to the honour or reputation of ${BRAND_NAME}.`,
      },
    ],
  },
  {
    title: "5. Prohibited Uses & Standalone Value",
    paragraphs: [
      {
        text: "The Licensed Asset(s) may not be used as the primary value component of any product for resale, redistribution, or extraction.",
        className: "mb-2",
      },
    ],
    listItems: COMMERCIAL_PROHIBITED_USES,
  },
  {
    title: "6. Artificial Intelligence & Automated Systems Prohibition",
    paragraphs: [
      {
        text: "The Licensee shall not, directly or indirectly, use, upload, distribute, embed, or make available the Licensed Asset(s) for:",
        className: "mb-2",
      },
    ],
    listItems: AI_PROHIBITIONS,
  },
  {
    title: "7. Metadata & Copyright Management Information",
    paragraphs: [
      {
        text: "The Licensee shall not remove, alter, obscure, or falsify copyright notices, attribution, embedded metadata (including EXIF/IPTC), digital watermarks, or file identifiers. Such removal may constitute material breach and statutory violation.",
      },
    ],
  },
  {
    title: "8. Third-Party Rights, Releases & Clearances",
    paragraphs: [
      {
        text: "Unless expressly stated as 'Releases Included', no model, property, trademark, or location releases are provided. The Licensee bears sole and absolute responsibility for determining whether their specific intended use requires any additional third-party releases, particularly for advertising or sensitive contexts.",
      },
    ],
  },
  {
    title: "9. Agencies, Contractors & No Implied Endorsement",
    paragraphs: [
      {
        text: `The Licensee may provide assets to contracted third parties solely for execution of the defined scope, remaining fully liable for their acts and omissions. The asset may not be used to suggest endorsement, sponsorship, or affiliation by ${BRAND_NAME} unless expressly authorised.`,
      },
    ],
  },
  {
    title: "10. Editorial Use & Credit",
    paragraphs: [
      {
        text: "Editorial use requires written approval and may not be used for advertising, paid promotion, or product/service endorsement.",
        className: "mb-2",
      },
    ],
    creditLine: `Where required by ${BRAND_NAME}, credit must be displayed as:`,
  },
  {
    title: "11. Indemnity & Limitation of Liability",
    paragraphs: [
      {
        text: `The Licensee agrees to indemnify and hold harmless ${BRAND_NAME} against claims and costs arising from misuse, breach, or use beyond the defined scope. ${BRAND_NAME} shall not be liable for indirect, incidental, or consequential damages.`,
      },
    ],
  },
  {
    title: "12. Governing Law, Audit & Enforcement",
    paragraphs: [
      {
        text: "This Licence is governed by the laws of Ireland and applicable EU law. Upon reasonable request, the Licensee shall provide written certification confirming compliance.",
        className: "mb-2",
      },
      {
        text: `${BRAND_NAME} reserves the right to pursue enforcement and remedies (including injunctive relief and statutory damages) in the jurisdiction where infringement occurs and/or where the Licensee is established.`,
      },
    ],
  },
  {
    title: "13. Breach, Termination & Remedies",
    paragraphs: [
      {
        text: `Any unauthorised use constitutes material breach and infringement. ${BRAND_NAME} may terminate the licence immediately upon breach. Remedies may include takedown demands, injunctive relief, damages (including statutory damages where available), account of profits, and recovery of reasonable legal costs.`,
      },
    ],
  },
  {
    title: "14. Entire Agreement",
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
    <div className="bg-black min-h-screen text-white pt-24 pb-20 font-sans selection:bg-accent selection:text-black mobile-page-offset">
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
              Applies where you purchase an {BRAND_NAME} photograph, artwork, or
              video as an individual for personal use, and not in connection
              with a business, trade, profession, or organisation.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-3">
                  Permitted Personal Use
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

            <div className="bg-black/30 border border-white/10 rounded-xl p-5">
              <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-3">
                Important Notices
              </h3>
              <ul className="space-y-3 text-sm text-gray-300">
                {PERSONAL_ADDITIONAL_TERMS.map((term, i) => (
                  <li key={i}>{term}</li>
                ))}
              </ul>
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
              licence and requires approval.
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
                    Licence Schedule Format
                  </p>
                  <BulletList
                    items={LICENCE_SCHEDULE_ITEMS}
                    className="space-y-1 text-gray-300"
                  />
                </div>

                {LEGAL_SECTIONS.map((section) => (
                  <div key={section.title}>
                    <p className="text-gray-200 font-semibold mb-1">
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
                        className="space-y-1 mt-2"
                      />
                    )}
                    {section.creditLine && (
                      <p className="mt-2">
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
            {COPYRIGHT_SYMBOL} {new Date().getFullYear()} {BRAND_NAME}. All
            rights reserved. Unauthorised use may constitute copyright
            infringement and may result in takedown demands, injunctive relief,
            damages, and recovery of legal costs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LicensingPage;
