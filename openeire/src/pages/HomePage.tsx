import React, { lazy } from "react";
import HeroSection from "../components/HeroSection";
import SEOHead from "../components/SEOHead";
import DeferredSection from "../components/ui/DeferredSection";

const ServicesSection = lazy(() => import("../components/ServicesSection"));
const CertsSection = lazy(() => import("../components/CertsSection"));
const TestimonialCarousel = lazy(
  () => import("../components/TestimonialCarousel"),
);

const HomePage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Home"
        description="Welcome to OpenÉire Studios. Discover premium stock footage, high-quality photography, and fine art prints capturing the raw beauty of Ireland, New Zealand and much more."
        image="https://openeire.online/static/images/og-home-preview.jpg"
      />
      <HeroSection />
      <DeferredSection
        className="bg-dark"
        placeholderClassName="min-h-[560px] bg-dark"
        rootMargin="160px"
      >
        <ServicesSection />
      </DeferredSection>
      <DeferredSection
        className="bg-brand-900"
        placeholderClassName="min-h-[180px] bg-brand-900"
        rootMargin="220px"
      >
        <CertsSection />
      </DeferredSection>
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
