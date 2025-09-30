import React from "react";

const CertsSection: React.FC = () => {
  return (
    <div className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Certified & Fully Insured</h2>
        <p className="max-w-3xl mx-auto mb-6 text-gray-300">
          Operating with the highest standards of safety and professionalism,
          fully certified by European and Irish aviation authorities.
        </p>
        <div className="flex justify-center space-x-8 font-semibold">
          <span>IAA (Irish Aviation Authority)</span>
          <span>EASA (European Union Aviation Safety Agency)</span>
        </div>
      </div>
    </div>
  );
};

export default CertsSection;
