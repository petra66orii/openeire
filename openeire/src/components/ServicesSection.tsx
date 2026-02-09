import React from "react";
import { FaVideo, FaImage, FaGlobeAmericas } from "react-icons/fa";
import { Link } from "react-router-dom";
import RevealOnScroll from "./ui/RevealOnScroll";

const services = [
  {
    icon: <FaVideo className="h-10 w-10 text-paper" />,
    title: "4K Stock Footage",
    description:
      "Cinematic, color-graded aerial footage ready for your next documentary, ad, or film project.",
    link: "/gallery/digital",
    cta: "Browse Clips",
  },
  {
    icon: <FaImage className="h-10 w-10 text-paper" />,
    title: "Fine Art Prints",
    description:
      "Bring the raw beauty of Ireland into your home. Museum-quality paper and framing options available.",
    link: "/gallery/physical",
    cta: "Shop Prints",
  },
  {
    icon: <FaGlobeAmericas className="h-10 w-10 text-paper" />,
    title: "Global Commission",
    description:
      "Need a specific shot? We are available for custom aerial shoots across Ireland and New Zealand.",
    link: "/contact",
    cta: "Hire Us",
  },
];

const ServicesSection: React.FC = () => {
  return (
    <section className="bg-dark py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <RevealOnScroll>
          <div className="text-center max-w-2xl mx-auto mb-16 pt-10 md:pt-0">
            <span className="text-accent font-bold tracking-widest uppercase text-xs">
              What We Do
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mt-3 mb-6">
              Visual Storytelling from the Sky
            </h2>
            <p className="text-gray-400 font-sans leading-relaxed">
              Whether you need the perfect establishing shot or a centerpiece
              for your living room, we deliver uncompromising quality.
            </p>
          </div>
        </RevealOnScroll>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <RevealOnScroll key={index} delay={index * 100}>
              <div
                key={index}
                className="group bg-dark rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700"
              >
                <div className="mb-6 p-4 bg-brand-500 rounded-2xl inline-block group-hover:bg-accent-hover transition-colors duration-300">
                  {/* Clone element to change color on hover if needed, or just keep accent */}
                  <div className="group-hover:text-white transition-colors duration-300">
                    {service.icon}
                  </div>
                </div>

                <h3 className="text-xl font-serif font-bold text-white mb-3">
                  {service.title}
                </h3>

                <p className="text-gray-400 mb-6 leading-relaxed text-sm">
                  {service.description}
                </p>

                <Link
                  to={service.link}
                  className="inline-flex items-center text-brand-500 font-bold text-sm uppercase tracking-wide hover:text-accent transition-colors"
                >
                  {service.cta} <span className="ml-2 text-lg">&rarr;</span>
                </Link>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
