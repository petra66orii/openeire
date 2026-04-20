import React, { lazy } from "react";

import CertsSection from "../components/CertsSection";
import DeferredSection from "../components/ui/DeferredSection";
import HeroSection from "../components/HeroSection";
import SEOHead from "../components/SEOHead";
import ServicesSection from "../components/ServicesSection";
import logoImage from "../assets/full-logo-white.png";
import { buildAbsoluteSiteUrl } from "../config/site";
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
        schema={[
          buildOrganizationSchema({
            name: "OpenÉire Studios",
            url: buildAbsoluteSiteUrl("/"),
            logo: buildAbsoluteSiteUrl(logoImage),
            description:
              "OpenÉire Studios creates fine art prints, commercial licensing assets, and aerial visuals from Ireland.",
          }),
          buildWebsiteSchema({
            name: "OpenÉire Studios",
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

