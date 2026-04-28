import React from "react";
import { Link } from "react-router-dom";
import FAQTopicPage, { FAQEntry } from "../components/FAQTopicPage";
import {
  FREE_SHIPPING_COUNTRY_LABEL,
  FREE_SHIPPING_PROMO_ENABLED,
  FREE_SHIPPING_THRESHOLD,
} from "../utils/freeShipping";

const ArtPrintsFAQPage: React.FC = () => {
  const shippingAnswer = FREE_SHIPPING_PROMO_ENABLED
    ? `Shipping is calculated at checkout, and current free-shipping messaging applies to eligible ${FREE_SHIPPING_COUNTRY_LABEL} orders over EUR ${FREE_SHIPPING_THRESHOLD.toFixed(2)}.`
    : "Shipping is calculated at checkout for each print order.";

  const printFaqs: FAQEntry[] = [
    {
      question: "Do you ship fine art prints to the United States?",
      answerLead: "Yes, we ship prints to the United States.",
      answerParagraphs: [
        "You can order directly through the site, and shipping is calculated at checkout based on your location and the print.",
      ],
      bridge: (
        <>
          For more details, see the{" "}
          <Link
            to="/us/fine-art-prints"
            className="text-accent hover:text-white"
          >
            United States fine art prints page
          </Link>
          .
        </>
      ),
      schemaAnswer:
        "Yes, prints are available in the United States. Orders can be placed directly through the site, with shipping calculated at checkout.",
    },

    {
      question: "What kind of prints do you sell?",
      answerLead:
        "We sell premium wall art prints created from original aerial & ground photography.",
      answerParagraphs: [
        "Each piece is designed to feel like a finished artwork rather than a generic poster, with a focus on composition, atmosphere, and perspective.",
      ],
      bridge: (
        <>
          Start with the{" "}
          <Link to="/art-prints" className="text-accent hover:text-white">
            art prints page
          </Link>{" "}
          or browse the{" "}
          <Link to="/gallery/physical" className="text-accent hover:text-white">
            print gallery
          </Link>
          .
        </>
      ),
      schemaAnswer:
        "OpenÉire Studios sells premium wall art prints created from original aerial photography, designed as finished artworks rather than generic posters.",
    },

    {
      question: "Are these original aerial photography prints?",
      answerLead: "Yes — every print comes from original aerial photography.",
      answerParagraphs: [
        "The collection is built from work captured and curated by OpenÉire Studios, not sourced from stock libraries.",
      ],
      bridge: (
        <>
          You can explore the full collection on the{" "}
          <Link to="/art-prints" className="text-accent hover:text-white">
            art prints page
          </Link>
          .
        </>
      ),
      schemaAnswer:
        "Yes. All prints are based on original aerial photography created and curated by OpenÉire Studios.",
    },

    {
      question: "Are prints suitable for gifting?",
      answerLead: "Yes, they work very well as a gift.",
      answerParagraphs: [
        "Because the prints are more distinctive and design-led, they tend to feel more considered than standard wall decor.",
      ],
      bridge: (
        <>
          If you're unsure what to choose, use the{" "}
          <Link to="/contact" className="text-accent hover:text-white">
            contact page
          </Link>
          .
        </>
      ),
      schemaAnswer:
        "Yes. These prints are well suited for gifting because they offer a more distinctive and design-led alternative to standard wall decor.",
    },

    {
      question: "What sizes or formats are available?",
      answerLead: "Sizes and formats vary depending on the individual print.",
      answerParagraphs: [
        "Each product page shows the exact options available for that piece, including dimensions and format.",
      ],
      bridge: (
        <>
          Browse the{" "}
          <Link to="/gallery/physical" className="text-accent hover:text-white">
            print gallery
          </Link>{" "}
          to see current options.
        </>
      ),
      schemaAnswer:
        "Sizes and formats vary by print. Each product page shows the available options for that specific piece.",
    },

    {
      question: "Are prints framed?",
      answerLead: "Framing depends on the specific print you choose.",
      answerParagraphs: [
        "Some prints may be available with framing options, while others are supplied unframed.",
      ],
      bridge: (
        <>
          Check the product listing or{" "}
          <Link to="/contact" className="text-accent hover:text-white">
            get in touch
          </Link>{" "}
          if you need to confirm before ordering.
        </>
      ),
      schemaAnswer:
        "Framing depends on the individual print. Check the product listing or contact the studio for confirmation.",
    },

    {
      question: "Are these limited edition?",
      answerLead: "Some prints may be limited, but not all are.",
      answerParagraphs: [
        "If a print is a limited edition, it will be clearly stated on the product page.",
      ],
      bridge: (
        <>
          The best way to check is directly in the{" "}
          <Link to="/gallery/physical" className="text-accent hover:text-white">
            print gallery
          </Link>
          .
        </>
      ),
      schemaAnswer:
        "Some prints may be limited edition. This is specified on the individual product page where applicable.",
    },

    {
      question: "How is shipping handled for print orders?",
      answerLead: "Shipping is handled during checkout.",
      answerParagraphs: [shippingAnswer],
      bridge: (
        <>
          If you have a specific question, use the{" "}
          <Link to="/contact" className="text-accent hover:text-white">
            contact page
          </Link>
          .
        </>
      ),
      schemaAnswer: `Shipping is handled during checkout. ${shippingAnswer}`,
    },

    {
      question: "When is shipping calculated for print orders?",
      answerLead: "Shipping is calculated at checkout.",
      answerParagraphs: [
        "The final cost depends on the print, size, and delivery location.",
      ],
      bridge: (
        <>
          You can browse prints first in the{" "}
          <Link to="/gallery/physical" className="text-accent hover:text-white">
            print gallery
          </Link>
          .
        </>
      ),
      schemaAnswer:
        "Shipping is calculated at checkout based on the print, size, and delivery location.",
    },

    {
      question: `Do you offer free shipping in ${FREE_SHIPPING_COUNTRY_LABEL}?`,
      answerLead: FREE_SHIPPING_PROMO_ENABLED
        ? `Yes. Orders over EUR ${FREE_SHIPPING_THRESHOLD.toFixed(
            2,
          )} qualify for free shipping in ${FREE_SHIPPING_COUNTRY_LABEL}.`
        : `There is no active free shipping offer at the moment.`,
      answerParagraphs: FREE_SHIPPING_PROMO_ENABLED
        ? ["The discount is applied automatically during checkout."]
        : [
            "Shipping costs are shown during checkout before you complete your order.",
          ],
      bridge: (
        <>
          You can start browsing on the{" "}
          <Link to="/art-prints" className="text-accent hover:text-white">
            art prints page
          </Link>
          .
        </>
      ),
      schemaAnswer: FREE_SHIPPING_PROMO_ENABLED
        ? `Orders over EUR ${FREE_SHIPPING_THRESHOLD.toFixed(
            2,
          )} qualify for free shipping in ${FREE_SHIPPING_COUNTRY_LABEL}.`
        : `There is no active free shipping promotion at the moment.`,
    },

    {
      question: "How long does print fulfilment usually take?",
      answerLead: "Fulfilment time depends on the print and delivery location.",
      answerParagraphs: [
        "Most orders are produced and shipped within a few working days, with delivery times depending on the shipping method.",
      ],
      bridge: (
        <>
          If timing matters, use the{" "}
          <Link to="/contact" className="text-accent hover:text-white">
            contact page
          </Link>
          .
        </>
      ),
      schemaAnswer:
        "Fulfilment time depends on the print and delivery location. Most orders are produced within a few working days.",
    },

    {
      question: "What should I do if I need help before ordering?",
      answerLead:
        "You can contact the studio directly before placing an order.",
      answerParagraphs: [
        "This is the best option if you need help choosing a piece or want clarity on sizing, framing, or delivery.",
      ],
      bridge: (
        <>
          Go to the{" "}
          <Link to="/contact" className="text-accent hover:text-white">
            contact page
          </Link>{" "}
          to get in touch.
        </>
      ),
      schemaAnswer:
        "Use the contact page if you need help choosing a print or clarifying details before ordering.",
    },
  ];

  return (
    <FAQTopicPage
      title="Art Prints FAQ | OpenÉire Studios"
      description="Find answers about fine art prints, shipping, gifting, formats, and what to expect when buying aerial photography prints from OpenÉire Studios."
      canonicalPath="/faq/art-prints"
      breadcrumbLabel="Art Prints FAQ"
      eyebrow="Art print buying answers"
      heading="Art Prints FAQ"
      intro="Answers for buyers who want a clearer picture of what the print product is, how ordering works, and what to expect before they buy."
      supportingIntro="This page supports the print-buying journey without replacing the collection pages themselves."
      faqs={printFaqs}
      ctaTitle="Ready to browse prints?"
      ctaText="Start with the art prints overview or go straight into the physical print gallery if you want to inspect available pieces."
      ctas={[
        { label: "Go to Art Prints", to: "/art-prints", variant: "primary" },
        {
          label: "Open Print Gallery",
          to: "/gallery/physical",
          variant: "secondary",
        },
        { label: "Contact the Studio", to: "/contact", variant: "tertiary" },
      ]}
    />
  );
};

export default ArtPrintsFAQPage;
