import React from "react";
import { FaShieldAlt, FaPlane } from "react-icons/fa";

const CertsSection: React.FC = () => {
  return (
    <div className="bg-brand-900 text-white py-12 border-t border-brand-700 relative overflow-hidden">
      {/* Background decoration (optional subtle pattern) */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="white"
              strokeWidth="1"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          {/* Left: Heading */}
          <div>
            <h2 className="text-2xl font-serif font-bold mb-2 flex items-center justify-center md:justify-start gap-3">
              <FaShieldAlt className="text-accent" />
              Fully Certified & Insured
            </h2>
            <p className="text-brand-100 text-sm max-w-md">
              We operate with strict adherence to EU aviation safety standards.
              Safety is our priority on every flight.
            </p>
          </div>

          {/* Right: Badges */}
          <div className="flex items-center gap-6 md:gap-12">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white block mb-1">
                IAA
              </span>
              <span className="text-[10px] uppercase tracking-widest text-accent">
                Irish Aviation Authority
              </span>
            </div>
            <div className="h-10 w-px bg-brand-700 hidden md:block"></div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white block mb-1">
                EASA
              </span>
              <span className="text-[10px] uppercase tracking-widest text-accent">
                EU Aviation Safety
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertsSection;
