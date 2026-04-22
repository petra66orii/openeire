import React from "react";
import { Link } from "react-router-dom";
import FAQTopicPage, { FAQEntry } from "../components/FAQTopicPage";

const usageFaqs: FAQEntry[] = [
  {
    question: "Can I use drone footage without permission?",
    answerLead: "Not for most public, commercial, or editorial uses.",
    answerParagraphs: [
      "If the footage is copyrighted and you are using it beyond private personal viewing, you should assume permission is required.",
    ],
    bridge: (
      <>
        The clearest next step is to review the{" "}
        <Link to="/licensing" className="text-accent hover:text-white">
          licensing page
        </Link>
        .
      </>
    ),
    schemaAnswer:
      "Not for most public, commercial, or editorial uses. If the footage is copyrighted and you are using it beyond private personal viewing, you should assume permission is required. The clearest next step is to review /licensing.",
  },
  {
    question: "What counts as commercial use?",
    answerLead:
      "Commercial use usually means the footage supports a business, organisation, campaign, client, or promotion.",
    bullets: [
      "Advertising",
      "Brand campaigns",
      "Property marketing",
      "Paid social content",
      "Client work",
    ],
    bridge: (
      <>
        For a fuller distinction between use types, read the{" "}
        <Link
          to="/blog/personal-vs-commercial-drone-footage-what-youre-actually-allowed-to-do"
          className="text-accent hover:text-white"
        >
          personal vs commercial guide
        </Link>
        .
      </>
    ),
    schemaAnswer:
      "Commercial use usually means the footage supports a business, organisation, campaign, client, or promotion, including advertising, brand campaigns, property marketing, paid social content, and client work. For a fuller distinction between use types, read the personal vs commercial guide.",
  },
  {
    question: "Can I use drone footage on social media?",
    answerLead:
      "Yes, but the answer depends on what kind of social media use it is.",
    answerParagraphs: [
      "Private personal posting is different from branded, client, promotional, or paid social use. Once the footage is part of a business or campaign context, licensing usually matters.",
    ],
    bridge: (
      <>
        If the use is commercial, continue to the{" "}
        <Link to="/licensing" className="text-accent hover:text-white">
          licensing page
        </Link>
        .
      </>
    ),
    schemaAnswer:
      "Yes, but the answer depends on what kind of social media use it is. Private personal posting is different from branded, client, promotional, or paid social use. Once the footage is part of a business or campaign context, licensing usually matters. If the use is commercial, continue to /licensing.",
  },
  {
    question: "Do I own the footage after buying it?",
    answerLead:
      "No. Buying or licensing footage does not usually transfer copyright ownership.",
    answerParagraphs: [
      "You are typically receiving permission for a defined use rather than acquiring the underlying rights.",
    ],
    bridge: (
      <>
        That is why the usage route matters on the{" "}
        <Link to="/licensing" className="text-accent hover:text-white">
          licensing page
        </Link>
        .
      </>
    ),
    schemaAnswer:
      "No. Buying or licensing footage does not usually transfer copyright ownership. You are typically receiving permission for a defined use rather than acquiring the underlying rights. That is why the usage route matters on /licensing.",
  },
  {
    question: "What is the difference between personal and commercial use?",
    answerLead:
      "Personal use is private. Commercial use supports business, promotion, or client-facing activity.",
    answerParagraphs: [
      "That distinction matters because the same footage can sit in very different usage categories depending on where and why it is being published.",
    ],
    bridge: (
      <>
        The fastest explanation is in the{" "}
        <Link
          to="/blog/personal-vs-commercial-drone-footage-what-youre-actually-allowed-to-do"
          className="text-accent hover:text-white"
        >
          usage blog post
        </Link>
        .
      </>
    ),
    schemaAnswer:
      "Personal use is private. Commercial use supports business, promotion, or client-facing activity. That distinction matters because the same footage can sit in very different usage categories depending on where and why it is being published. The fastest explanation is in the usage blog post.",
  },
  {
    question: "Can I reuse licensed footage in a new campaign?",
    answerLead: "Not automatically.",
    answerParagraphs: [
      "A new campaign may fall outside the original scope if the audience, territory, timing, or media plan has changed.",
    ],
    bridge: (
      <>
        When reuse becomes a new use case, return to the{" "}
        <Link to="/licensing" className="text-accent hover:text-white">
          licensing page
        </Link>{" "}
        before launch.
      </>
    ),
    schemaAnswer:
      "Not automatically. A new campaign may fall outside the original scope if the audience, territory, timing, or media plan has changed. When reuse becomes a new use case, return to /licensing before launch.",
  },
  {
    question: "Can I edit or crop licensed drone footage?",
    answerLead: "Possibly, but that depends on the permitted use.",
    answerParagraphs: [
      "Simple edits may be acceptable in some contexts, but usage permissions should match the way the footage is being adapted and published.",
    ],
    bridge: (
      <>
        If you are still choosing source material, start with the{" "}
        <Link to="/footage" className="text-accent hover:text-white">
          footage page
        </Link>{" "}
        and then confirm the licensing route.
      </>
    ),
    schemaAnswer:
      "Possibly, but that depends on the permitted use. Simple edits may be acceptable in some contexts, but usage permissions should match the way the footage is being adapted and published. If you are still choosing source material, start with /footage and then confirm the licensing route.",
  },
];

const DroneFootageUsageFAQPage: React.FC = () => (
  <FAQTopicPage
    title="Drone Footage Usage FAQ | OpenÉire Studios"
    description="Learn what you can and cannot do with licensed drone footage, including commercial use, social media, editing, and ownership questions."
    canonicalPath="/faq/drone-footage-usage"
    breadcrumbLabel="Drone Footage Usage FAQ"
    eyebrow="Drone footage usage answers"
    heading="Drone Footage Usage FAQ"
    intro="Answers for buyers who are trying to work out what counts as permitted use, where permission is needed, and how commercial and personal use differ."
    supportingIntro="Use this page when the main question is not which shot to choose, but what you can actually do with footage once you have it."
    faqs={usageFaqs}
    ctaTitle="Need the next step?"
    ctaText="If you are ready to confirm permissions, go to licensing. If you are still choosing source material, return to the footage page first."
    ctas={[
      { label: "Go to Licensing", to: "/licensing", variant: "primary" },
      { label: "Browse Footage", to: "/footage", variant: "secondary" },
      {
        label: "Read Licensing Guide",
        to: "/blog/how-to-license-drone-footage-in-ireland-complete-guide",
        variant: "tertiary",
      },
    ]}
  />
);

export default DroneFootageUsageFAQPage;
