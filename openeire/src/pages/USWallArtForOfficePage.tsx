import React from "react";
import { Link } from "react-router-dom";
import { FaBriefcase, FaRegBuilding, FaThLarge } from "react-icons/fa";
import USPrintLandingPage from "../components/USPrintLandingPage";

const USWallArtForOfficePage: React.FC = () => {
  return (
    <USPrintLandingPage
      title="Office Wall Art USA | Professional Interior Prints | OpenÉire Studios"
      description="Explore premium office wall art for the United States, with refined aerial and landscape prints chosen for workspaces, studios, and professional interiors."
      canonicalPath="/us/wall-art-for-office"
      breadcrumbLabel="US Wall Art for Office"
      eyebrow="Office wall art for the United States"
      heading="Wall Art for Offices and Workspaces in the United States"
      intro={
        <>
          Explore wall art suited for professional environments, including
          offices, studios, and hospitality spaces. These prints are selected
          for clarity, structure, and a refined visual tone.
        </>
      }
      heroPrimaryCta={{
        label: "Browse Office Prints",
        to: "/gallery/physical",
      }}
      heroSecondaryCta={{
        label: "View Fine Art Overview",
        to: "/us/fine-art-prints",
        variant: "secondary",
      }}
      heroNote={
        <>
          If you need help narrowing the collection for a workspace, use{" "}
          <Link to="/contact" className="text-accent hover:text-white">
            contact page
          </Link>{" "}
          for a direct studio enquiry, or compare the more medium-led{" "}
          <Link
            to="/us/aerial-photography-prints"
            className="text-accent hover:text-white"
          >
            aerial photography page
          </Link>
          .
        </>
      }
      angleTitle="Why office wall art needs a cleaner visual language"
      angleIntro={
        <>
          Workspaces benefit from artwork with structure and restraint. The goal
          is to add character, depth, and a more considered atmosphere without
          distracting from the room’s professional function.
        </>
      }
      angleCards={[
        {
          icon: <FaBriefcase />,
          title: "Appropriate for professional settings",
          text: "The collection is suited to offices, studios, meeting spaces, and client-facing environments that need a more polished visual tone.",
        },
        {
          icon: <FaThLarge />,
          title: "Clear structure and composition",
          text: "Aerial and landscape imagery with stronger geometry can bring order and visual rhythm to a workspace wall.",
        },
        {
          icon: <FaRegBuilding />,
          title: "Works across commercial interiors",
          text: "The tone stays refined enough for hospitality, studio, and office environments where the artwork needs to feel deliberate.",
        },
      ]}
      premiumTitle="Professional interiors still deserve real artwork"
      premiumIntro={
        <>
          OpenÉire Studios positions office wall art as a design decision, not
          an afterthought. The collection is curated for environments that want
          visual distinction without tipping into generic decor.
        </>
      }
      premiumPoints={[
        <>
          Premium physical prints selected for clarity, structure, and a more
          composed presence in workspaces.
        </>,
        <>
          Made-to-order artwork that feels more considered than generic office
          filler or commodity stock decor.
        </>,
        <>
          A direct route into{" "}
          <Link
            to="/us/aerial-photography-prints"
            className="text-accent hover:text-white"
          >
            aerial photography prints
          </Link>{" "}
          when perspective matters most, and into{" "}
          <Link
            to="/us/fine-art-prints"
            className="text-accent hover:text-white"
          >
            United States fine art prints
          </Link>{" "}
          for the broader premium overview.
        </>,
      ]}
      relevanceTitle="Wall art for offices and workspaces in the United States"
      relevanceParagraphs={[
        <>
          Office wall art from OpenÉire Studios is available to buyers in the
          United States through the same print ordering flow used across the
          collection.
        </>,
        <>
          Orders are made to order, which keeps the process grounded in the
          existing print workflow rather than promising a separate commercial
          fulfillment model.
        </>,
      ]}
      relevanceBullets={[
        "Available to buyers in the United States",
        "Suitable for offices and professional environments",
        "Shipping is calculated at checkout",
      ]}
      relevanceNote={
        <>
          For a broader premium overview before you browse, visit{" "}
          <Link
            to="/us/fine-art-prints"
            className="text-accent hover:text-white"
          >
            the United States fine art prints page
          </Link>
          .
        </>
      }
      ctaTitle="Need artwork for a more professional setting?"
      ctaText={
        <>
          Browse{" "}
          <Link to="/gallery/physical" className="text-accent hover:text-white">
            the print gallery
          </Link>
          , compare the more perspective-led{" "}
          <Link
            to="/us/aerial-photography-prints"
            className="text-accent hover:text-white"
          >
            aerial photography page
          </Link>
          , or use{" "}
          <Link to="/contact" className="text-accent hover:text-white">
            contact page
          </Link>{" "}
          if you want help choosing a print for an office, studio, or
          hospitality interior.
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

export default USWallArtForOfficePage;
