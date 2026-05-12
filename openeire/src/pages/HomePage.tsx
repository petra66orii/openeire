import React, { lazy } from "react";

import CertsSection from "../components/CertsSection";
import DeferredSection from "../components/ui/DeferredSection";
import HeroSection from "../components/HeroSection";
import SEOHead from "../components/SEOHead";
import ServicesSection from "../components/ServicesSection";
import {
  ORGANIZATION_LOGO_PATH,
  SITE_CONTACT_EMAIL,
  SITE_DESCRIPTION,
  SITE_SOCIAL_SAME_AS,
  SITE_TITLE,
  SITE_TITLE_ASCII,
  buildAbsoluteSiteUrl,
} from "../config/site";
import {
  buildOrganizationSchema,
  buildWebsiteSchema,
} from "../lib/seoSchema";

const TestimonialCarousel = lazy(
  () => import("../components/TestimonialCarousel"),
);

const HomePage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Fine Art Prints & Commercial Licensing in Ireland"
        description="Discover premium fine art prints from Ireland, commercial drone footage licensing, and curated aerial visuals from OpenÉire Studios."
        canonicalPath="/"
        image="/hero-poster.jpg"
        schema={[
          buildOrganizationSchema({
            name: SITE_TITLE,
            alternateName: SITE_TITLE_ASCII,
            url: buildAbsoluteSiteUrl("/"),
            logo: buildAbsoluteSiteUrl(ORGANIZATION_LOGO_PATH),
            description: SITE_DESCRIPTION,
            contactEmail: SITE_CONTACT_EMAIL,
            sameAs: SITE_SOCIAL_SAME_AS,
          }),
          buildWebsiteSchema({
            name: SITE_TITLE,
            alternateName: SITE_TITLE_ASCII,
            url: buildAbsoluteSiteUrl("/"),
          }),
        ]}
      />

      <HeroSection />
      <ServicesSection />
      <CertsSection />

      <DeferredSection
        className="bg-brand-50"
        placeholderClassName="min-h-[680px] bg-brand-50"
        rootMargin="320px"
      >
        <TestimonialCarousel />
      </DeferredSection>
    </div>
  );
};

export default HomePage;

