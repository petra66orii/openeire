import React from "react";
import HeroSection from "../components/HeroSection";
import ServicesSection from "../components/ServicesSection";
import CertsSection from "../components/CertsSection";
import TestimonialCarousel from "../components/TestimonialCarousel";

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <ServicesSection />
      <CertsSection />
      <TestimonialCarousel />
    </div>
  );
};

export default HomePage;
