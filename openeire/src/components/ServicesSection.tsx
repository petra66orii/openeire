import React from "react";
// Importing icons from react-icons
import { FaVideo, FaImage, FaGlobeAmericas } from "react-icons/fa";

const services = [
  {
    icon: <FaVideo className="h-12 w-12 text-green-600" />,
    title: "4K Stock Footage",
    description:
      "High-resolution, professionally graded 4K video clips ready for your commercial or personal projects.",
  },
  {
    icon: <FaImage className="h-12 w-12 text-green-600" />,
    title: "Premium Art Prints",
    description:
      "Transform your space with stunning aerial photography, available as framed prints or on high-quality canvas.",
  },
  {
    icon: <FaGlobeAmericas className="h-12 w-12 text-green-600" />,
    title: "Global Locations",
    description:
      "Explore breathtaking landscapes from around the world, from the coasts of Ireland to the mountains of New Zealand.",
  },
];

const ServicesSection: React.FC = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Our Services</h2>
          <p className="text-gray-600 mt-2">What we offer</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="text-center p-6">
              <div className="flex justify-center mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-500">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
