// src/components/HeroSection.tsx
import React from "react";
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
  return (
    <div className="relative h-screen flex items-center justify-center text-center text-white">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>

      {/* Content */}
      <div className="relative z-20 p-4">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Capturing the World from Above
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Stunning 4K aerial stock footage and premium art prints from Ireland
          and beyond.
        </p>
        <Link
          to="/gallery"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300"
        >
          Explore Gallery
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
