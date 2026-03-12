import React from "react";
import HeroSection from "../components/HeroSection";
import ServicesSection from "../components/ServicesSection";
import CertsSection from "../components/CertsSection";
import TestimonialCarousel from "../components/TestimonialCarousel";
import SEOHead from "../components/SEOHead";

const HomePage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Home" // Will become: "Home | Open\u00C9ire Studios"
        description="Welcome to Open\u00C9ire Studios. Discover premium stock footage, high-quality photography, and fine art prints capturing the raw beauty of Ireland, New Zealand and much more."
        image="https://openeire.online/static/images/og-home-preview.jpg"
      />
      <HeroSection />
      <ServicesSection />
      <CertsSection />
      <TestimonialCarousel />
    </div>
  );
};

export default HomePage;
