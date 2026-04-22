import React from "react";
import { Link } from "react-router-dom";
import { FaCamera, FaMapMarkedAlt, FaRegImage } from "react-icons/fa";
import USPrintLandingPage from "../components/USPrintLandingPage";
import {
  FREE_SHIPPING_COUNTRY_LABEL,
  FREE_SHIPPING_PROMO_ENABLED,
  FREE_SHIPPING_THRESHOLD,
} from "../utils/freeShipping";

const USAerialPhotographyPrintsPage: React.FC = () => {
  const shippingNote = FREE_SHIPPING_PROMO_ENABLED
    ? `Shipping is calculated at checkout. Current free-shipping messaging applies to eligible ${FREE_SHIPPING_COUNTRY_LABEL} orders over EUR ${FREE_SHIPPING_THRESHOLD.toFixed(2)}, while United States delivery uses the same print-order flow.`
    : "Shipping is calculated at checkout for each made-to-order print.";

  return (
    <USPrintLandingPage
      title="Aerial Photography Prints USA | Premium Wall Art | OpenÉire Studios"
      description="Discover premium aerial photography prints for buyers in the United States. Original wall art with a distinctive perspective and gallery-led feel."
      canonicalPath="/us/aerial-photography-prints"
      breadcrumbLabel="US Aerial Photography Prints"
      eyebrow="Original aerial photography for the United States"
      heading="Aerial Photography Prints for United States Interiors"
      intro={
        <>
          Explore wall art built from original aerial photography. These prints
          offer a higher viewpoint, stronger geometry, and a more distinctive
          presence than standard landscape imagery, making them ideal for
          interiors that need structure, scale, and visual clarity.
        </>
      }
      heroPrimaryCta={{
        label: "Browse Aerial Prints",
        to: "/gallery/physical",
      }}
      heroSecondaryCta={{
        label: "Ask About a Print",
        to: "/contact",
        variant: "secondary",
      }}
      heroNote={
        <>
          If you want the broader premium print overview first, visit{" "}
          <Link
            to="/us/fine-art-prints"
            className="text-accent hover:text-white"
          >
            United States fine art prints
          </Link>
          .
        </>
      }
      angleTitle="Why aerial photography changes the feel of the piece"
      angleIntro={
        <>
          The aerial perspective is the differentiator here. These prints are
          for buyers who specifically want height, scale, geometry, and a point
          of view that standard landscape photography cannot offer.
        </>
      }
      angleCards={[
        {
          icon: <FaCamera />,
          title: "Original aerial source material",
          text: "Built from original aerial photography rather than generic wall-art imagery bought to fill a trend.",
        },
        {
          icon: <FaMapMarkedAlt />,
          title: "Elevated perspective",
          text: "The higher viewpoint gives landscape, coastline, and place-based imagery a more graphic and distinctive structure.",
        },
        {
          icon: <FaRegImage />,
          title: "Aerial wall art with intent",
          text: "Designed for buyers who want the medium itself to be part of what makes the print compelling.",
        },
      ]}
      premiumTitle="Premium positioning for aerial prints"
      premiumIntro={
        <>
          This is not just landscape art with a different label. The aerial
          perspective creates a different kind of wall piece: more spatial, more
          graphic, and often more memorable in a room.
        </>
      }
      premiumPoints={[
        <>
          Original aerial photography curated as physical artwork rather than
          generic print inventory.
        </>,
        <>
          A stronger alternative for buyers who want wall art with viewpoint and
          photographic character.
        </>,
        <>
          A natural route into{" "}
          <Link to="/art-prints" className="text-accent hover:text-white">
            art prints page
          </Link>{" "}
          or{" "}
          <Link
            to="/us/fine-art-prints"
            className="text-accent hover:text-white"
          >
            United States fine art prints
          </Link>{" "}
          when you want the wider collection context.
        </>,
      ]}
      relevanceTitle="Ordering from the United States"
      relevanceParagraphs={[
        <>
          Aerial photography prints are available to buyers in the United States
          through the same print workflow used across the collection.
        </>,
        <>
          Orders remain tied to the existing checkout flow, so delivery and
          order handling stay grounded in the same process used across the print
          range.
        </>,
      ]}
      relevanceBullets={[
        "Available to buyers in the United States",
        "Produced to order as physical prints",
        shippingNote,
      ]}
      relevanceNote={
        <>
          To browse available pieces directly, open the{" "}
          <Link to="/gallery/physical" className="text-accent hover:text-white">
            print gallery
          </Link>
          .
        </>
      }
      faqs={[
        {
          question: "Are these original aerial photography prints?",
          answer:
            "Yes. The collection is built around original aerial photography curated by OpenEire Studios.",
        },
        {
          question: "What makes aerial wall art different?",
          answer:
            "The aerial viewpoint changes the structure of the image, giving the print more scale, pattern, and perspective than standard eye-level photography.",
        },
      ]}
      ctaTitle="Ready to explore the aerial collection?"
      ctaText={
        <>
          Go straight into{" "}
          <Link to="/gallery/physical" className="text-accent hover:text-white">
            print gallery
          </Link>
          , compare the wider{" "}
          <Link to="/art-prints" className="text-accent hover:text-white">
            art prints page
          </Link>
          , or contact the studio for a more specific print conversation.
        </>
      }
      ctas={[
        { label: "Browse Prints", to: "/gallery/physical" },
        {
          label: "Main Art Prints Page",
          to: "/art-prints",
          variant: "secondary",
        },
        {
          label: "Contact the Studio",
          to: "/contact",
          variant: "tertiary",
        },
      ]}
    />
  );
};

export default USAerialPhotographyPrintsPage;
