import React, { lazy } from "react";



import HeroSection from "../components/HeroSection";



import ServicesSection from "../components/ServicesSection";



import CertsSection from "../components/CertsSection";



import SEOHead from "../components/SEOHead";



import DeferredSection from "../components/ui/DeferredSection";







const TestimonialCarousel = lazy(



  () => import("../components/TestimonialCarousel"),



);







const HomePage: React.FC = () => {



  return (



    <div>



      <SEOHead

        title="Home"

        description="Discover cinematic stock footage, high-quality photography, and fine art prints from OpenÉire Studios."

        canonicalPath="/"

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



