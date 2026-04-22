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
      answerLead: "Yes, prints are available to buyers in the United States.",
      answerParagraphs: [
        "Orders still follow the current print workflow, with shipping handled through checkout rather than through a separate manual quote by default.",
      ],
      bridge: (
        <>
          For the broader United States print context, visit the{" "}
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
        "Yes, prints are available to buyers in the United States. Orders still follow the current print workflow, with shipping handled through checkout rather than through a separate manual quote by default. For the broader United States print context, visit /us/fine-art-prints.",
    },
    {
      question: "What kind of prints do you sell?",
      answerLead:
        "OpenEire Studios sells premium fine art prints based on aerial photography.",
      answerParagraphs: [
        "The collection is positioned as physical wall art for collectors, interiors, and gifting rather than generic poster merchandise.",
      ],
      bridge: (
        <>
          Start with the{" "}
          <Link to="/art-prints" className="text-accent hover:text-white">
            art prints page
          </Link>{" "}
          or open the{" "}
          <Link to="/gallery/physical" className="text-accent hover:text-white">
            print gallery
          </Link>
          .
        </>
      ),
      schemaAnswer:
        "OpenEire Studios sells premium fine art prints based on aerial photography. The collection is positioned as physical wall art for collectors, interiors, and gifting rather than generic poster merchandise. Start with /art-prints or open the print gallery.",
    },
    {
      question: "Are these original aerial photography prints?",
      answerLead:
        "Yes. The print collection is built around original aerial photography curated by OpenEire Studios.",
      answerParagraphs: [
        "That is part of what separates the collection from more generic wall art marketplaces.",
      ],
      bridge: (
        <>
          If you want the collection overview, go to the{" "}
          <Link to="/art-prints" className="text-accent hover:text-white">
            art prints page
          </Link>
          .
        </>
      ),
      schemaAnswer:
        "Yes. The print collection is built around original aerial photography curated by OpenEire Studios. That is part of what separates the collection from more generic wall art marketplaces. If you want the collection overview, go to /art-prints.",
    },
    {
      question: "Are prints suitable for gifting?",
      answerLead:
        "Yes. The collection is designed to work well as a more distinctive gift choice.",
      answerParagraphs: [
        "The overall positioning is premium and interior-led, which makes the prints better suited to thoughtful gifting than off-the-shelf decor.",
      ],
      bridge: (
        <>
          If you need help choosing a piece, use the{" "}
          <Link to="/contact" className="text-accent hover:text-white">
            contact page
          </Link>
          .
        </>
      ),
      schemaAnswer:
        "Yes. The collection is designed to work well as a more distinctive gift choice. The overall positioning is premium and interior-led, which makes the prints better suited to thoughtful gifting than off-the-shelf decor. If you need help choosing a piece, use /contact.",
    },
    {
      question: "What sizes or formats are available?",
      answerLead:
        "Available sizes and formats depend on the specific print listing.",
      answerParagraphs: [
        "This FAQ page does not invent fixed dimensions because product pages remain the source of truth for the options attached to each piece.",
      ],
      bridge: (
        <>
          Browse the{" "}
          <Link to="/gallery/physical" className="text-accent hover:text-white">
            print gallery
          </Link>{" "}
          for the current print options.
        </>
      ),
      schemaAnswer:
        "Available sizes and formats depend on the specific print listing. This FAQ page does not invent fixed dimensions because product pages remain the source of truth for the options attached to each piece. Browse /gallery/physical for the current print options.",
    },
    {
      question: "Are prints framed?",
      answerLead:
        "Framing should be treated as product-specific rather than assumed across the whole collection.",
      answerParagraphs: [
        "Where framing or presentation details matter, the listing itself or a direct enquiry is the safest source of truth.",
      ],
      bridge: (
        <>
          If you need certainty before ordering, ask through the{" "}
          <Link to="/contact" className="text-accent hover:text-white">
            contact page
          </Link>
          .
        </>
      ),
      schemaAnswer:
        "Framing should be treated as product-specific rather than assumed across the whole collection. Where framing or presentation details matter, the listing itself or a direct enquiry is the safest source of truth. If you need certainty before ordering, ask through /contact.",
    },
    {
      question: "Are these limited edition?",
      answerLead:
        "Do not assume every print is a limited edition unless the specific product says so.",
      answerParagraphs: [
        "The collection is premium, but edition status should come from the individual print details rather than a blanket site-wide claim.",
      ],
      bridge: (
        <>
          The best next step is to inspect the listing in the{" "}
          <Link to="/gallery/physical" className="text-accent hover:text-white">
            print gallery
          </Link>
          .
        </>
      ),
      schemaAnswer:
        "Do not assume every print is a limited edition unless the specific product says so. The collection is premium, but edition status should come from the individual print details rather than a blanket site-wide claim. The best next step is to inspect the listing in the print gallery.",
    },
    {
      question: "How is shipping handled for print orders?",
      answerLead: "Shipping is handled through the current checkout flow.",
      answerParagraphs: [shippingAnswer],
      bridge: (
        <>
          For a more specific print enquiry, continue to the{" "}
          <Link to="/contact" className="text-accent hover:text-white">
            contact page
          </Link>
          .
        </>
      ),
      schemaAnswer: `Shipping is handled through the current checkout flow. ${shippingAnswer} For a more specific print enquiry, continue to /contact.`,
    },
    {
      question: "When is shipping calculated for print orders?",
      answerLead:
        "Shipping is calculated during checkout rather than shown as a fixed site-wide price in advance.",
      answerParagraphs: [
        "That keeps the order flow tied to the actual print options and delivery details attached to the piece you are buying.",
      ],
      bridge: (
        <>
          If you want to browse available pieces first, open the{" "}
          <Link to="/gallery/physical" className="text-accent hover:text-white">
            print gallery
          </Link>
          .
        </>
      ),
      schemaAnswer:
        "Shipping is calculated during checkout rather than shown as a fixed site-wide price in advance. That keeps the order flow tied to the actual print options and delivery details attached to the piece you are buying. If you want to browse available pieces first, open /gallery/physical.",
    },
    {
      question: `Do you offer free shipping in ${FREE_SHIPPING_COUNTRY_LABEL}?`,
      answerLead: FREE_SHIPPING_PROMO_ENABLED
        ? `Yes. Eligible ${FREE_SHIPPING_COUNTRY_LABEL} print orders over EUR ${FREE_SHIPPING_THRESHOLD.toFixed(
            2,
          )} qualify for free shipping under the current offer.`
        : `There is no active free-shipping promotion for ${FREE_SHIPPING_COUNTRY_LABEL} at the moment.`,
      answerParagraphs: FREE_SHIPPING_PROMO_ENABLED
        ? [
            "The current threshold is handled through the existing checkout flow, so the order details still remain the source of truth at purchase time.",
          ]
        : [
            "Shipping is still handled through checkout, where the current delivery cost is confirmed during the order flow.",
          ],
      bridge: (
        <>
          For the current print-buying flow, start with the{" "}
          <Link to="/art-prints" className="text-accent hover:text-white">
            art prints page
          </Link>
          .
        </>
      ),
      schemaAnswer: FREE_SHIPPING_PROMO_ENABLED
        ? `Yes. Eligible ${FREE_SHIPPING_COUNTRY_LABEL} print orders over EUR ${FREE_SHIPPING_THRESHOLD.toFixed(
            2,
          )} qualify for free shipping under the current offer. The current threshold is handled through the existing checkout flow, so the order details still remain the source of truth at purchase time. For the current print-buying flow, start with /art-prints.`
        : `There is no active free-shipping promotion for ${FREE_SHIPPING_COUNTRY_LABEL} at the moment. Shipping is still handled through checkout, where the current delivery cost is confirmed during the order flow. For the current print-buying flow, start with /art-prints.`,
    },
    {
      question: "Do you ship art prints internationally?",
      answerLead:
        "Yes, international buyers can order prints where the current checkout and fulfilment flow supports delivery.",
      answerParagraphs: [
        "The site keeps shipping tied to the actual checkout process rather than making blanket promises that may vary by destination.",
      ],
      bridge: (
        <>
          If you are buying from the United States, visit the{" "}
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
        "Yes, international buyers can order prints where the current checkout and fulfilment flow supports delivery. The site keeps shipping tied to the actual checkout process rather than making blanket promises that may vary by destination. If you are buying from the United States, visit /us/fine-art-prints.",
    },
    {
      question: "How long does print fulfilment usually take?",
      answerLead:
        "Fulfilment timing depends on the specific order rather than being treated as a fixed promise across the whole collection.",
      answerParagraphs: [
        "Because prints are produced through the current print workflow, the safest expectation-setting comes from the order flow itself or a direct enquiry where timing matters.",
      ],
      bridge: (
        <>
          If timing is important before you order, use the{" "}
          <Link to="/contact" className="text-accent hover:text-white">
            contact page
          </Link>
          .
        </>
      ),
      schemaAnswer:
        "Fulfilment timing depends on the specific order rather than being treated as a fixed promise across the whole collection. Because prints are produced through the current print workflow, the safest expectation-setting comes from the order flow itself or a direct enquiry where timing matters. If timing is important before you order, use /contact.",
    },
    {
      question: "What should I do if I need help before ordering?",
      answerLead:
        "Use the contact page if you want help choosing a print or clarifying ordering details before checkout.",
      answerParagraphs: [
        "That is the best route when the decision depends on the piece itself, presentation questions, or delivery confidence before purchase.",
      ],
      bridge: (
        <>
          Go straight to the{" "}
          <Link to="/contact" className="text-accent hover:text-white">
            contact page
          </Link>{" "}
          if you want a direct conversation.
        </>
      ),
      schemaAnswer:
        "Use the contact page if you want help choosing a print or clarifying ordering details before checkout. That is the best route when the decision depends on the piece itself, presentation questions, or delivery confidence before purchase. Go straight to /contact if you want a direct conversation.",
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
