import React from "react";
import { Link } from "react-router-dom";
import FAQTopicPage, { FAQEntry } from "../components/FAQTopicPage";

const licensingFaqs: FAQEntry[] = [
  {
    question: "How much does drone footage licensing cost?",
    answerLead: "Drone footage licensing cost depends on the intended use.",
    bullets: [
      "Duration",
      "Territory",
      "Media channels",
      "Exclusivity",
      "Whether the use is commercial or editorial",
    ],
    bridge: (
      <>
        For the full licensing route and scope details, continue to the{" "}
        <Link to="/licensing" className="text-accent hover:text-white">
          licensing page
        </Link>
        .
      </>
    ),
    schemaAnswer:
      "Drone footage licensing cost depends on the intended use, including duration, territory, media channels, exclusivity, and whether the use is commercial or editorial. For the full licensing route and scope details, continue to /licensing.",
  },
  {
    question: "What affects the price of aerial footage?",
    answerLead:
      "The price is shaped by how widely and how long the footage will be used.",
    answerParagraphs: [
      "A short local use is different from a multi-market campaign or wider distribution plan.",
    ],
    bridge: (
      <>
        If you are still comparing footage options, start with the{" "}
        <Link to="/footage" className="text-accent hover:text-white">
          footage page
        </Link>{" "}
        and then move into the{" "}
        <Link
          to="/blog/how-much-does-drone-footage-cost-in-ireland"
          className="text-accent hover:text-white"
        >
          pricing guide
        </Link>
        .
      </>
    ),
    schemaAnswer:
      "The price of aerial footage is shaped by how widely and how long the footage will be used. A short local use is different from a multi-market campaign or wider distribution plan. If you are still comparing footage options, start with /footage and then move into the pricing guide.",
  },
  {
    question: "Can I use drone footage for advertising?",
    answerLead: "Yes, advertising use normally requires a commercial licence.",
    answerParagraphs: [
      "If the footage is helping market a service, product, property, or destination, that is usually treated as commercial usage rather than personal or editorial usage.",
    ],
    bridge: (
      <>
        The best next step is to review the{" "}
        <Link to="/licensing" className="text-accent hover:text-white">
          licensing page
        </Link>{" "}
        before you request approval.
      </>
    ),
    schemaAnswer:
      "Yes, advertising use normally requires a commercial licence. If the footage is helping market a service, product, property, or destination, that is usually treated as commercial usage rather than personal or editorial usage. The best next step is to review /licensing before you request approval.",
  },
  {
    question: "Do I need a licence for drone footage?",
    answerLead:
      "If the footage is being used beyond private personal use, a licence is usually required.",
    answerParagraphs: [
      "That includes most campaign, brand, client, editorial, and promotional contexts where the footage is published or distributed.",
    ],
    bridge: (
      <>
        For a clearer overview, read the{" "}
        <Link
          to="/blog/how-to-license-drone-footage-in-ireland-complete-guide"
          className="text-accent hover:text-white"
        >
          licensing guide
        </Link>
        .
      </>
    ),
    schemaAnswer:
      "If the footage is being used beyond private personal use, a licence is usually required. That includes most campaign, brand, client, editorial, and promotional contexts where the footage is published or distributed. For a clearer overview, read the licensing guide.",
  },
  {
    question: "What does rights-managed mean?",
    answerLead:
      "Rights-managed means the licence is tied to a defined use rather than being unlimited.",
    answerParagraphs: [
      "The agreed scope usually reflects the project itself, where it appears, and how long it runs.",
    ],
    bridge: (
      <>
        That fuller explanation lives on the{" "}
        <Link to="/licensing" className="text-accent hover:text-white">
          licensing page
        </Link>
        .
      </>
    ),
    schemaAnswer:
      "Rights-managed means the licence is tied to a defined use rather than being unlimited. The agreed scope usually reflects the project itself, where it appears, and how long it runs. That fuller explanation lives on /licensing.",
  },
  {
    question: "Can drone footage be licensed for editorial use?",
    answerLead:
      "Yes, editorial use may be available for suitable publishing and documentary contexts.",
    answerParagraphs: [
      "Editorial use is different from advertising because the footage supports reporting, documentary, educational, or feature work rather than direct promotion.",
    ],
    bridge: (
      <>
        If you need to compare commercial and editorial routes, see the{" "}
        <Link
          to="/blog/personal-vs-commercial-drone-footage-what-youre-actually-allowed-to-do"
          className="text-accent hover:text-white"
        >
          usage guide
        </Link>
        .
      </>
    ),
    schemaAnswer:
      "Yes, editorial use may be available for suitable publishing and documentary contexts. Editorial use is different from advertising because the footage supports reporting, documentary, educational, or feature work rather than direct promotion. If you need to compare commercial and editorial routes, see the usage guide.",
  },
  {
    question: "What changes the scope of a footage licence?",
    answerLead: "The scope changes when the planned use changes.",
    bullets: [
      "A new campaign",
      "A wider territory",
      "Additional media channels",
      "A longer usage period",
      "A need for exclusivity",
    ],
    bridge: (
      <>
        When that happens, return to the{" "}
        <Link to="/licensing" className="text-accent hover:text-white">
          licensing page
        </Link>{" "}
        before publishing the expanded use.
      </>
    ),
    schemaAnswer:
      "The scope changes when the planned use changes, such as a new campaign, a wider territory, additional media channels, a longer usage period, or a need for exclusivity. When that happens, return to /licensing before publishing the expanded use.",
  },
];

const DroneFootageLicensingFAQPage: React.FC = () => (
  <FAQTopicPage
    title="Drone Footage Licensing FAQ | OpenÉire Studios"
    description="Get clear answers about drone footage licensing, pricing factors, rights-managed use, and commercial aerial footage usage."
    canonicalPath="/faq/drone-footage-licensing"
    breadcrumbLabel="Drone Footage Licensing FAQ"
    eyebrow="Drone footage licensing answers"
    heading="Drone Footage Licensing FAQ"
    intro="Answers for buyers trying to understand licensing, pricing factors, and rights-managed aerial footage before they request approval."
    supportingIntro="This page is designed to support licensing decisions while still pointing you back to available footage when you are choosing the right asset."
    faqs={licensingFaqs}
    ctaTitle="Need the full licensing route?"
    ctaText="Use the licensing page for the deeper decision layer, or return to the footage collection if you are still choosing the right asset."
    ctas={[
      { label: "Go to Licensing", to: "/licensing", variant: "primary" },
      { label: "Browse Footage", to: "/footage", variant: "secondary" },
      {
        label: "Read Pricing Guide",
        to: "/blog/how-much-does-drone-footage-cost-in-ireland",
        variant: "tertiary",
      },
    ]}
  />
);

export default DroneFootageLicensingFAQPage;
