import { JsonLd } from "@/components/JsonLd";
import {
  HomeCertsSection,
  HomeHeroSection,
  HomeServicesSection,
} from "@/components/home/HomeSections";
import {
  ORGANIZATION_LOGO_PATH,
  SITE_CONTACT_EMAIL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_NAME_ASCII,
  buildAbsoluteUrl,
} from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
} from "@/lib/seo/jsonLd";

export const metadata = buildPageMetadata({
  title: "Fine Art Prints & Commercial Licensing in Ireland | OpenÉire Studios",
  description:
    "Discover premium fine art prints from Ireland, commercial drone footage licensing, and curated aerial visuals from OpenÉire Studios.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <JsonLd
        data={[
          buildOrganizationJsonLd({
            name: SITE_NAME,
            alternateName: SITE_NAME_ASCII,
            url: buildAbsoluteUrl("/"),
            logo: buildAbsoluteUrl(ORGANIZATION_LOGO_PATH),
            description: SITE_DESCRIPTION,
            contactEmail: SITE_CONTACT_EMAIL,
          }),
          buildWebsiteJsonLd({
            name: SITE_NAME,
            alternateName: SITE_NAME_ASCII,
            url: buildAbsoluteUrl("/"),
          }),
        ]}
      />
      <HomeHeroSection />
      <HomeServicesSection />
      <HomeCertsSection />
    </>
  );
}
