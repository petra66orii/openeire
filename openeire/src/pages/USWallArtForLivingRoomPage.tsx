import React from "react";
import { Link } from "react-router-dom";
import { FaCouch, FaRegMoon, FaVectorSquare } from "react-icons/fa";
import USPrintLandingPage from "../components/USPrintLandingPage";

const USWallArtForLivingRoomPage: React.FC = () => {
  return (
    <USPrintLandingPage
      title="Living Room Wall Art USA | Interior Prints | OpenÉire Studios"
      description="Discover premium wall art for living rooms in the United States, with curated prints chosen for balance, atmosphere, and a strong but measured presence in the room."
      canonicalPath="/us/wall-art-for-living-room"
      breadcrumbLabel="US Wall Art for Living Room"
      eyebrow="Living room wall art for the United States"
      heading="Wall Art for Living Rooms in the United States"
      intro={
        <>
          Discover wall art designed for living room spaces, where placement,
          balance, and atmosphere matter. These pieces are selected to hold
          visual weight without overwhelming the room.
        </>
      }
      heroPrimaryCta={{
        label: "Browse Living Room Prints",
        to: "/gallery/physical",
      }}
      heroSecondaryCta={{
        label: "Contact the Studio",
        to: "/contact",
        variant: "secondary",
      }}
      heroNote={
        <>
          If you are comparing broader scenic pieces, the{" "}
          <Link
            to="/us/landscape-wall-art"
            className="text-accent hover:text-white"
          >
            landscape wall art page
          </Link>{" "}
          and{" "}
          <Link
            to="/us/large-wall-art"
            className="text-accent hover:text-white"
          >
            large wall art page
          </Link>{" "}
          offer a useful next step.
        </>
      }
      angleTitle="Why living room wall art needs balance"
      angleIntro={
        <>
          Living rooms ask more of a piece than simple decoration. The artwork
          has to create atmosphere, sit comfortably with furniture and light,
          and hold the room without becoming visually heavy.
        </>
      }
      angleCards={[
        {
          icon: <FaCouch />,
          title: "Designed for placement",
          text: "The focus here is on prints that feel considered above sofas, consoles, and other main living room sightlines.",
        },
        {
          icon: <FaRegMoon />,
          title: "Atmosphere over noise",
          text: "These pieces are selected to add mood and depth without making the room feel crowded or overly busy.",
        },
        {
          icon: <FaVectorSquare />,
          title: "Visual weight with restraint",
          text: "The aim is presence, but with enough calm and structure to support the room rather than dominate it.",
        },
      ]}
      premiumTitle="Curated prints for rooms people actually live in"
      premiumIntro={
        <>
          OpenÉire Studios treats living room wall art as part of the interior
          composition. The collection is made for buyers who want a more refined
          answer than generic decor or trend-led poster sets.
        </>
      }
      premiumPoints={[
        <>
          Premium physical prints chosen for their ability to bring atmosphere
          and compositional calm into a living space.
        </>,
        <>
          Made-to-order artwork with a stronger editorial and collector-led feel
          than mass-market home decor.
        </>,
        <>
          For a broader premium view, explore{" "}
          <Link
            to="/us/fine-art-prints"
            className="text-accent hover:text-white"
          >
            United States fine art prints
          </Link>{" "}
          or continue into{" "}
          <Link
            to="/us/landscape-wall-art"
            className="text-accent hover:text-white"
          >
            landscape wall art
          </Link>{" "}
          if scenery and mood are the priority.
        </>,
      ]}
      relevanceTitle="Wall art for living spaces in the United States"
      relevanceParagraphs={[
        <>
          Living room wall art from OpenÉire Studios is available to buyers in
          the United States as made-to-order physical prints.
        </>,
        <>
          Orders move through checkout, keeping the process clear and
          consistent.
        </>,
      ]}
      relevanceBullets={[
        "Available to buyers in the United States",
        "Designed for living room placement",
        "Shipping is calculated at checkout",
      ]}
      relevanceNote={
        <>
          To browse available pieces directly, open{" "}
          <Link to="/gallery/physical" className="text-accent hover:text-white">
            the print gallery
          </Link>
          .
        </>
      }
      ctaTitle="Looking for the right living room piece?"
      ctaText={
        <>
          Start with{" "}
          <Link to="/gallery/physical" className="text-accent hover:text-white">
            the print gallery
          </Link>
          , compare the more collector-led{" "}
          <Link
            to="/us/fine-art-prints"
            className="text-accent hover:text-white"
          >
            fine art overview
          </Link>
          , or continue into{" "}
          <Link
            to="/us/large-wall-art"
            className="text-accent hover:text-white"
          >
            large wall art
          </Link>{" "}
          and{" "}
          <Link
            to="/us/landscape-wall-art"
            className="text-accent hover:text-white"
          >
            landscape wall art
          </Link>{" "}
          to compare scale and mood.
        </>
      }
      ctas={[
        { label: "Browse Prints", to: "/gallery/physical" },
        {
          label: "Fine Art Overview",
          to: "/us/fine-art-prints",
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

export default USWallArtForLivingRoomPage;
