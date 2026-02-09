import React from "react";
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
  return (
    <div className="relative h-screen flex items-center justify-center text-center overflow-hidden">
      {/* 1. VIDEO BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline // Crucial for iOS to prevent fullscreen
          poster="/hero-poster.jpg" // The loading placeholder
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          {/* Browser checks sources top to bottom */}
          <source src="/hero-bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Dark Overlay with a hint of Brand Green */}
        <div className="absolute inset-0 bg-dark-900/40 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
      </div>

      {/* 2. GLASS CONTENT CARD */}
      <div className="relative z-10 px-4 w-full max-w-5xl mx-auto animate-fade-in-up">
        {/* The Glass Container */}
        <div className="glass px-6 md:px-12 py-12 md:py-20 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md bg-black/20">
          <span className="inline-block py-1 px-4 rounded-full bg-black/40 border border-accent/60 text-accent text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
            Est. 2026 • Ireland
          </span>

          {/* Main Heading with IRISH TRICOLOR GRADIENT */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-md">
            Capturing the World <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-white to-accent filter drop-shadow-lg pb-2">
              From Above
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-gray-100 mb-10 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-sm font-sans">
            Stunning 4K aerial stock footage and premium art prints.{" "}
            <br className="hidden md:block" />
            Curated from the rugged coasts of Ireland and beyond.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center font-sans">
            {/* Primary Button (Brand Green) */}
            <Link
              to="/gallery/digital"
              className="px-8 py-4 bg-brand-500 hover:bg-brand-700 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-brand-500/40 border border-transparent"
            >
              Explore Footage
            </Link>

            {/* Secondary 'Glass' Button */}
            <Link
              to="/gallery/physical"
              className="px-8 py-4 bg-white/5 hover:bg-white/20 text-white border border-white/40 rounded-full font-medium transition-all backdrop-blur-sm hover:border-white"
            >
              Shop Art Prints
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-20 md:h-48 bg-gradient-to-t from-dark to-transparent z-20 pointer-events-none"></div>
    </div>
  );
};

export default HeroSection;
