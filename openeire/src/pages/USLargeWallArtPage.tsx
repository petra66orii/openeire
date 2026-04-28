import React from "react";
import { Link } from "react-router-dom";
import { FaArrowsAlt, FaRegSquare, FaWarehouse } from "react-icons/fa";
import USPrintLandingPage from "../components/USPrintLandingPage";

const USLargeWallArtPage: React.FC = () => {
  return (
    <USPrintLandingPage
      title="Large Wall Art USA | Statement Prints | OpenÉire Studios"
      description="Discover large wall art for buyers in the United States, with premium statement prints designed for interiors that need scale, presence, and a stronger focal point."
      canonicalPath="/us/large-wall-art"
      breadcrumbLabel="US Large Wall Art"
      eyebrow="Large-format wall art for the United States"
      heading="Large Wall Art for Interiors in the United States"
      intro={
        <>
          Explore large-format wall art designed for interiors that need scale
          and presence. This collection focuses on statement pieces that anchor
          a room rather than smaller decorative prints.
        </>
      }
      heroPrimaryCta={{
        label: "Browse Large Wall Art",
        to: "/gallery/physical",
      }}
      heroSecondaryCta={{
        label: "View Fine Art Overview",
        to: "/us/fine-art-prints",
        variant: "secondary",
      }}
      heroNote={
        <>
          If you are comparing options for a larger room or open-plan space, the{" "}
          <Link
            to="/us/wall-art-for-living-room"
            className="text-accent hover:text-white"
          >
            living room wall art page
          </Link>{" "}
          and{" "}
          <Link
            to="/us/wall-art-for-office"
            className="text-accent hover:text-white"
          >
            office wall art page
          </Link>{" "}
          show how the collection shifts by setting.
        </>
      }
      angleTitle="Why scale changes the way wall art works"
      angleIntro={
        <>
          Large wall art does a different job in a room. It sets the visual
          pace, anchors larger walls, and gives open interiors a focal point
          that smaller pieces often cannot carry on their own.
        </>
      }
      angleCards={[
        {
          icon: <FaArrowsAlt />,
          title: "Built for visual presence",
          text: "These pieces are chosen for rooms that need weight and scale rather than a quieter decorative accent.",
        },
        {
          icon: <FaRegSquare />,
          title: "Statement placement",
          text: "The emphasis is on artwork that can hold a larger wall with confidence, whether above furniture or across more open surfaces.",
        },
        {
          icon: <FaWarehouse />,
          title: "Suited to bigger interiors",
          text: "Large-format wall art makes sense in loft-style homes, hospitality settings, and other spaces where smaller prints can feel lost.",
        },
      ]}
      premiumTitle="Statement pieces with a more considered finish"
      premiumIntro={
        <>
          OpenÉire Studios approaches large wall art as physical artwork for
          real interiors, not oversized filler. The emphasis stays on curation,
          composition, and how a piece feels once it owns the room.
        </>
      }
      premiumPoints={[
        <>
          Premium aerial and landscape imagery chosen for presence rather than
          trend-driven wall decor.
        </>,
        <>
          Made-to-order physical prints that feel art-led in larger interiors,
          not like generic stock imagery scaled up for convenience.
        </>,
        <>
          For the broader premium overview, continue to{" "}
          <Link
            to="/us/fine-art-prints"
            className="text-accent hover:text-white"
          >
            United States fine art prints
          </Link>{" "}
          or go straight into{" "}
          <Link to="/gallery/physical" className="text-accent hover:text-white">
            the print gallery
          </Link>
          .
        </>,
      ]}
      relevanceTitle="Buying large wall art in the United States"
      relevanceParagraphs={[
        <>
          Large wall art from OpenÉire Studios is available to buyers in the
          United States as made-to-order physical pieces.
        </>,
        <>
          Larger prints follow the same straightforward buying flow, with
          shipping handled at checkout.
        </>,
      ]}
      relevanceBullets={[
        "Available to buyers in the United States",
        "Large-format wall art for interiors",
        "Shipping is calculated at checkout",
      ]}
      relevanceNote={
        <>
          For the broader collector-led overview, visit the{" "}
          <Link
            to="/us/fine-art-prints"
            className="text-accent hover:text-white"
          >
            United States fine art prints page
          </Link>
          .
        </>
      }
      ctaTitle="Need a print with more presence?"
      ctaText={
        <>
          Browse the{" "}
          <Link to="/gallery/physical" className="text-accent hover:text-white">
            print gallery
          </Link>
          , compare the collector-led{" "}
          <Link
            to="/us/fine-art-prints"
            className="text-accent hover:text-white"
          >
            fine art overview
          </Link>
          , or explore the more placement-specific{" "}
          <Link
            to="/us/wall-art-for-living-room"
            className="text-accent hover:text-white"
          >
            living room page
          </Link>{" "}
          and{" "}
          <Link
            to="/us/wall-art-for-office"
            className="text-accent hover:text-white"
          >
            office page
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
          label: "Fine Art Overview",
          to: "/us/fine-art-prints",
          variant: "tertiary",
        },
      ]}
    />
  );
};

export default USLargeWallArtPage;
