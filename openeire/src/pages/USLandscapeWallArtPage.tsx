import React from "react";
import { Link } from "react-router-dom";
import { FaMountain, FaTree, FaWater } from "react-icons/fa";
import USPrintLandingPage from "../components/USPrintLandingPage";
import {
  FREE_SHIPPING_COUNTRY_LABEL,
  FREE_SHIPPING_PROMO_ENABLED,
  FREE_SHIPPING_THRESHOLD,
} from "../utils/freeShipping";

const USLandscapeWallArtPage: React.FC = () => {
  const shippingNote = FREE_SHIPPING_PROMO_ENABLED
    ? `Shipping is calculated at checkout. Current free-shipping messaging applies to eligible ${FREE_SHIPPING_COUNTRY_LABEL} orders over EUR ${FREE_SHIPPING_THRESHOLD.toFixed(2)}, while United States orders move through the same print workflow.`
    : "Shipping is calculated at checkout for each made-to-order print.";

  return (
    <USPrintLandingPage
      title="Landscape Wall Art USA | Premium Scenic Prints | OpenÉire Studios"
      description="Explore premium landscape wall art for the United States, including scenic aerial prints with atmosphere, coastline, and countryside character."
      canonicalPath="/us/landscape-wall-art"
      breadcrumbLabel="US Landscape Wall Art"
      eyebrow="Scenic wall art for the United States"
      heading="Landscape Wall Art for Homes and Interiors in the United States"
      intro={
        <>
          Discover landscape wall art focused on atmosphere, place, and natural
          composition. This collection is designed for buyers looking for scenic
          prints that bring calm, depth, and a stronger sense of environment
          into interior spaces.
        </>
      }
      heroPrimaryCta={{
        label: "Browse Landscape Prints",
        to: "/gallery/physical",
      }}
      heroSecondaryCta={{
        label: "View Fine Art Overview",
        to: "/us/fine-art-prints",
        variant: "secondary",
      }}
      heroNote={
        <>
          If you are comparing scenic pieces for a room or project, use{" "}
          <Link to="/contact" className="text-accent hover:text-white">
            contact page
          </Link>{" "}
          for a direct conversation.
        </>
      }
      angleTitle="Landscape character, not just decoration"
      angleIntro={
        <>
          This page is built around scenic intent first. The emphasis is on
          coastlines, countryside, atmosphere, and prints that give a room a
          stronger sense of place.
        </>
      }
      angleCards={[
        {
          icon: <FaWater />,
          title: "Coastlines and shoreline atmosphere",
          text: "Scenic aerial views that bring openness, weather, and coastal character into the room.",
        },
        {
          icon: <FaTree />,
          title: "Countryside calm",
          text: "Landscape-led compositions with quieter pacing for interiors that need mood rather than noise.",
        },
        {
          icon: <FaMountain />,
          title: "Scenic scale",
          text: "Prints chosen for buyers who want wall art with depth, place, and a stronger sense of landscape presence.",
        },
      ]}
      premiumTitle="Premium scenic prints for real spaces"
      premiumIntro={
        <>
          These landscape prints are not treated as generic filler imagery. The
          work is curated for mood, visual restraint, and how scenery actually
          lands in a real interior.
        </>
      }
      premiumPoints={[
        <>
          Scenic aerial compositions with coastline, countryside, and
          landscape-led character.
        </>,
        <>A more premium alternative to mass-market scenic wall decor.</>,
        <>
          A natural path into{" "}
          <Link
            to="/us/fine-art-prints"
            className="text-accent hover:text-white"
          >
            United States fine art prints
          </Link>{" "}
          or directly into{" "}
          <Link to="/gallery/physical" className="text-accent hover:text-white">
            print gallery
          </Link>
          .
        </>,
      ]}
      relevanceTitle="Buying from the United States"
      relevanceParagraphs={[
        <>
          Landscape wall art prints are available to buyers in the United States
          through the current print order flow.
        </>,
        <>
          The process stays simple: made-to-order prints, checkout-based
          shipping, and no extra promises beyond what the site currently
          supports.
        </>,
      ]}
      relevanceBullets={[
        "Available to buyers in the United States",
        "Scenic physical prints for interiors",
        shippingNote,
      ]}
      relevanceNote={
        <>
          For the broader collection overview, visit the{" "}
          <Link to="/art-prints" className="text-accent hover:text-white">
            art prints page
          </Link>
          .
        </>
      }
      faqs={[
        {
          question: "What kind of landscape wall art do you offer?",
          answer:
            "The collection includes scenic aerial prints with coastline, countryside, and landscape-led compositions chosen for atmosphere and place.",
        },
        {
          question: "Are these prints suitable for larger spaces?",
          answer:
            "Yes. The imagery is chosen to carry scale and mood well, which makes it suited to larger rooms and statement placements.",
        },
      ]}
      ctaTitle="Ready to browse scenic wall art?"
      ctaText={
        <>
          Explore the physical print collection, compare the broader{" "}
          <Link
            to="/us/fine-art-prints"
            className="text-accent hover:text-white"
          >
            fine art overview
          </Link>
          , or contact the studio if you want help choosing the right
          landscape-led piece.
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

export default USLandscapeWallArtPage;
