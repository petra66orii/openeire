import Link from "next/link";
import {
  FaBan,
  FaBuilding,
  FaGavel,
  FaGlobe,
  FaImage,
  FaNewspaper,
} from "react-icons/fa";
import { JsonLd } from "@/components/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildAbsoluteUrl } from "@/lib/site";

const BRAND_NAME = "OpenÉire Studios";

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

type LegalSection = {
  title: string;
  paragraphs: Array<{ text: string; className?: string }>;
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

function BulletList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`list-inside list-disc ${className}`.trim()}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export const metadata = buildPageMetadata({
  title: "Licensing Terms & Legal Agreement | OpenÉire Studios",
  description:
    "Read the legal licensing terms for personal, editorial, and rights-managed commercial use of aerial footage and fine art photography from OpenÉire Studios.",
  path: "/licensing/terms",
  noIndex: true,
});

export default function LicensingTermsPage() {
  return (
    <main className="page-top-offset min-h-screen bg-black pb-20 font-sans text-white selection:bg-accent selection:text-black">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", url: buildAbsoluteUrl("/") },
          { name: "Licensing", url: buildAbsoluteUrl("/licensing") },
          { name: "Terms", url: buildAbsoluteUrl("/licensing/terms") },
        ])}
      />

      <div className="container mx-auto max-w-5xl px-4 lg:px-8">
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Need the commercial overview?
          </p>
          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="max-w-3xl text-sm leading-relaxed text-gray-300">
              Looking for the buyer-friendly licensing overview? Start with the
              main Licensing page, then return here when you need the legal
              wording.
            </p>
            <Link
              href="/licensing"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Go to Licensing Overview
            </Link>
          </div>
        </div>

        <h1 className="mb-6 font-serif text-4xl font-bold text-white md:text-5xl">
          Licensing Terms &amp; Legal Agreement
        </h1>
        <p className="mb-6 max-w-3xl text-lg leading-relaxed text-gray-400">
          {BRAND_NAME} offers premium fine-art photography and high-resolution
          aerial footage. To protect the integrity of the work, all media is
          subject to strict licensing terms. Please review the tiers below to
          ensure your intended use complies with our copyright and licensing
          policies.
        </p>

        <div className="mb-12 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-lg text-white">
              <FaGlobe aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold">International use (EU, US, and beyond)</h2>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            Licences issued by {BRAND_NAME} apply to customers worldwide. Your
            permitted usage is governed by the licence you purchase and the
            scope we approve. Copyright protection is recognised internationally
            and unauthorised use may be pursued in Ireland and/or the
            jurisdiction where the use occurs.
          </p>
        </div>

        <div className="space-y-12">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-8 md:p-10">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-xl text-white">
                <FaImage aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold">Art &amp; Personal Use (Default)</h2>
            </div>
            <p className="mb-6 text-gray-400">
              Applies where you purchase an {BRAND_NAME} photograph, artwork,
              or video as an individual for personal use, and not in connection
              with a business, trade, profession, or organisation.
            </p>
            <div className="mb-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm uppercase tracking-widest text-gray-500">
                  Permitted Personal Use
                </h3>
                <BulletList items={PERSONAL_RIGHTS} className="space-y-2 text-sm text-gray-300" />
              </div>
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm uppercase tracking-widest text-red-400">
                  <FaBan aria-hidden="true" /> Strictly Prohibited
                </h3>
                <BulletList items={PERSONAL_PROHIBITED} className="space-y-2 text-sm text-gray-300" />
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-5">
              <h3 className="mb-3 text-sm uppercase tracking-widest text-gray-500">
                Important Notices
              </h3>
              <ul className="space-y-3 text-sm text-gray-300">
                {PERSONAL_ADDITIONAL_TERMS.map((term) => (
                  <li key={term}>{term}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-8 md:p-10">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-xl text-white">
                <FaBuilding aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold">
                Commercial &amp; Marketing Licence (Rights-Managed)
              </h2>
            </div>
            <p className="mb-6 text-gray-400">
              Applies to real estate agencies, hospitality brands, developers,
              and tourism operators. This is a{" "}
              <span className="font-semibold text-white">Rights-Managed</span>{" "}
              licence and requires approval.
            </p>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm uppercase tracking-widest text-gray-500">
                  Key Terms (Summary)
                </h3>
                <BulletList items={COMMERCIAL_KEY_TERMS} className="space-y-2 text-sm text-gray-300" />
              </div>
              <div className="flex md:items-start md:justify-end">
                <Link
                  href="/licensing"
                  className="mt-4 inline-block rounded-lg bg-white px-6 py-3 font-bold text-black transition-colors hover:bg-gray-200"
                >
                  Back to Licensing Overview
                </Link>
              </div>
            </div>

            <div className="mt-10 border-t border-white/10 pt-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-lg text-white">
                  <FaGavel aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold">
                  Commercial Rights-Managed Licence Agreement
                </h3>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-gray-400">
                The terms below summarise the legal licensing framework for
                commercial usage. The exact scope of your licence is set out in
                the <span className="font-semibold text-white">Licence Schedule</span>{" "}
                (asset, media, territory, duration, and any limits). By
                purchasing or using licensed media, the Licensee agrees to the
                Master Rights-Managed Agreement.
              </p>
              <div className="space-y-6 text-sm leading-relaxed text-gray-300">
                <div className="rounded-xl border border-white/10 bg-black/30 p-5">
                  <p className="mb-2 font-semibold text-gray-200">Licence Schedule Format</p>
                  <BulletList items={LICENCE_SCHEDULE_ITEMS} className="space-y-1 text-gray-300" />
                </div>
                {LEGAL_SECTIONS.map((section) => (
                  <div key={section.title}>
                    <p className="mb-1 font-semibold text-gray-200">{section.title}</p>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph.text} className={paragraph.className}>
                        {paragraph.text}
                      </p>
                    ))}
                    {section.listItems ? (
                      <BulletList items={section.listItems} className="mt-2 space-y-1" />
                    ) : null}
                    {section.creditLine ? (
                      <p className="mt-2">
                        {section.creditLine}{" "}
                        <span className="font-semibold text-white">© {BRAND_NAME}</span>.
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs leading-relaxed text-gray-400">
                  Note: Your commercial licence is valid only after written
                  approval and full payment. If you are unsure whether your use
                  is within scope, request clarification before publishing.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-8 md:p-10">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-xl text-white">
                <FaNewspaper aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold">Editorial Licence</h2>
            </div>
            <p className="mb-6 text-gray-400">
              Applies to media outlets, documentaries, magazines, and
              educational content where the goal is storytelling, not selling.
              Editorial usage requires written approval.
            </p>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm uppercase tracking-widest text-gray-500">
                  Conditions (Summary)
                </h3>
                <BulletList items={EDITORIAL_CONDITIONS} className="space-y-2 text-sm text-gray-300" />
              </div>
            </div>
          </section>
        </div>

        <div className="mt-16 border-t border-white/10 p-6 text-center">
          <p className="text-xs uppercase leading-loose tracking-widest text-gray-500">
            © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
            Unauthorised use may constitute copyright infringement and may
            result in takedown demands, injunctive relief, damages, and recovery
            of legal costs.
          </p>
        </div>
      </div>
    </main>
  );
}
