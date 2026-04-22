import React from "react";
import { Link } from "react-router-dom";
import { FaBuilding, FaHome, FaRegImage } from "react-icons/fa";
import USPrintLandingPage from "../components/USPrintLandingPage";
import {
  FREE_SHIPPING_COUNTRY_LABEL,
  FREE_SHIPPING_PROMO_ENABLED,
  FREE_SHIPPING_THRESHOLD,
} from "../utils/freeShipping";

const USWallArtPrintsPage: React.FC = () => {
  const shippingNote = FREE_SHIPPING_PROMO_ENABLED
    ? `Shipping is calculated at checkout. Current free-shipping messaging applies to eligible ${FREE_SHIPPING_COUNTRY_LABEL} orders over EUR ${FREE_SHIPPING_THRESHOLD.toFixed(2)}, while United States orders follow the same print workflow.`
    : "Shipping is calculated at checkout for each made-to-order print.";

  return (
    <USPrintLandingPage
      title="Wall Art Prints USA | Premium Aerial Wall Art | OpenÉire Studios"
      description="Premium wall art prints for interiors in the United States. Discover atmospheric aerial artwork designed for homes, offices, and refined spaces."
      canonicalPath="/us/wall-art-prints"
      breadcrumbLabel="US Wall Art Prints"
      eyebrow="Premium wall art for the United States"
      heading="Wall Art Prints for Interiors in the United States"
      intro={
        <>
          Browse a curated collection of wall art prints designed for homes,
          offices, and interior projects across the United States. This page
          acts as the entry point into the OpenEire Studios print collection,
          covering a range of styles including aerial, landscape, and statement
          pieces.
        </>
      }
      heroPrimaryCta={{
        label: "Browse Wall Art Prints",
        to: "/gallery/physical",
      }}
      heroSecondaryCta={{
        label: "View Fine Art Overview",
        to: "/us/fine-art-prints",
        variant: "secondary",
      }}
      heroNote={
        <>
          If you need help choosing a piece for a room, workspace, or interior
          project, use{" "}
          <Link to="/contact" className="text-accent hover:text-white">
            contact page
          </Link>{" "}
          for a direct print enquiry.
        </>
      }
      angleTitle="Wall art that works in real spaces"
      angleIntro={
        <>
          This page is centered on placement and interior use: statement wall
          art for living rooms, offices, hospitality settings, and refined
          spaces that need a focal piece rather than generic decoration.
        </>
      }
      angleCards={[
        {
          icon: <FaHome />,
          title: "Statement pieces for homes",
          text: "Designed for rooms that need a stronger focal point than anonymous wall decor can provide.",
        },
        {
          icon: <FaBuilding />,
          title: "Suitable for offices and hospitality",
          text: "Aerial wall art with enough restraint and atmosphere to sit comfortably in professional and guest-facing interiors.",
        },
        {
          icon: <FaRegImage />,
          title: "Premium, not mass-market",
          text: "Produced as art-led physical prints for real display rather than quick-turn poster merchandise.",
        },
      ]}
      premiumTitle="Premium positioning for interiors"
      premiumIntro={
        <>
          OpenEire Studios wall art prints are meant to feel intentional in the
          room. The collection is curated for buyers who want artwork that can
          hold space visually, not simply cover it.
        </>
      }
      premiumPoints={[
        <>
          Physical artwork with a premium visual language rather than
          commodity-style wall decor.
        </>,
        <>
          Aerial imagery chosen for mood, scale, and compositional calm in
          interiors.
        </>,
        <>
          A clean path from this broader wall-art page into{" "}
          <Link
            to="/us/fine-art-prints"
            className="text-accent hover:text-white"
          >
            United States fine art prints
          </Link>{" "}
          when the buyer intent becomes more collector-led.
        </>,
      ]}
      relevanceTitle="For United States buyers"
      relevanceParagraphs={[
        <>
          Wall art prints from OpenEire Studios are available to buyers in the
          United States through the existing print order flow.
        </>,
        <>
          Orders are produced to order, with shipping handled through checkout
          rather than through a separate manual quote by default.
        </>,
      ]}
      relevanceBullets={[
        "Available to buyers in the United States",
        "Made-to-order physical prints",
        shippingNote,
      ]}
      relevanceNote={
        <>
          If you want a more collector-led overview, visit the{" "}
          <Link
            to="/us/fine-art-prints"
            className="text-accent hover:text-white"
          >
            United States fine art prints page
          </Link>
          .
        </>
      }
      faqs={[
        {
          question: "Do you ship wall art prints to the United States?",
          answer:
            "Yes. United States orders follow the existing print workflow, with shipping handled through checkout.",
        },
        {
          question: "Are these suitable for interiors and offices?",
          answer:
            "Yes. The collection is positioned for homes, offices, and curated spaces that need more considered wall art.",
        },
      ]}
      ctaTitle="Ready to place the right piece?"
      ctaText={
        <>
          Browse the physical print collection, explore the more collector-led{" "}
          <Link
            to="/us/fine-art-prints"
            className="text-accent hover:text-white"
          >
            fine art overview
          </Link>
          , or start a direct conversation through{" "}
          <Link to="/contact" className="text-accent hover:text-white">
            contact page
          </Link>
          .
        </>
      }
      ctas={[
        { label: "Browse Prints", to: "/gallery/physical" },
        {
          label: "Contact the Studio",
          to: "/contact",
          variant: "secondary",
        },
        {
          label: "Main Art Prints Page",
          to: "/art-prints",
          variant: "tertiary",
        },
      ]}
    />
  );
};

export default USWallArtPrintsPage;
