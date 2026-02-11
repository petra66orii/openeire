import React from "react";
import { Link } from "react-router-dom";
import { FaCamera, FaPlane, FaMapMarkedAlt, FaAward } from "react-icons/fa";

const AboutPage: React.FC = () => {
  return (
    <div className="bg-black min-h-screen text-white">
      {/* 1. HERO SECTION (Parallax feel) */}
      <div className="relative h-[70vh] w-full overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60 scale-105 animate-slow-zoom"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&q=80&w=2000")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <span className="text-accent text-sm font-bold uppercase tracking-[0.3em] mb-4 block animate-fade-in-up">
            Established 2026
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight animate-fade-in-up delay-100">
            Capturing the <br /> Spirit of the Wild
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            OpenEire Studios is a premier digital gallery dedicated to the raw,
            unspoken beauty of the Irish landscape and beyond.
          </p>
        </div>
      </div>

      {/* 2. THE STORY */}
      <div className="container mx-auto px-4 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
              More than just pixels. <br />
              <span className="text-gray-500">It's about the feeling.</span>
            </h2>
            <div className="space-y-6 text-gray-400 leading-loose text-lg">
              <p>
                It started with a single drone flight over the cliffs of Moher.
                The way the light hit the water, the sheer scale of the
                Atlantic—it wasn't just a view; it was an emotion.
              </p>
              <p>
                At OpenEire Studios, we believe that photography should
                transport you. Whether it's the mist rolling over a New Zealand
                peak or the golden hour striking an Irish castle, our mission is
                to freeze those fleeting moments in time.
              </p>
              <p>
                We specialize in <strong>High-Fidelity 4K Stock Footage</strong>{" "}
                for creators and <strong>Museum-Grade Fine Art Prints</strong>{" "}
                for collectors who want to bring a piece of the wild into their
                homes.
              </p>
            </div>

            <div className="pt-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_sample.svg"
                alt="Signature"
                className="h-12 opacity-50 invert"
              />
            </div>
          </div>

          {/* Right: Image Grid */}
          <div className="grid grid-cols-2 gap-4 relative">
            <img
              src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=800"
              className="rounded-2xl w-full h-64 object-cover transform translate-y-8 border border-white/10 shadow-2xl"
              alt="Irish Coast"
            />
            <img
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=800"
              className="rounded-2xl w-full h-64 object-cover transform -translate-y-8 border border-white/10 shadow-2xl"
              alt="Mountain Hike"
            />

            {/* Decorative Element */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/5 blur-3xl rounded-full"></div>
          </div>
        </div>
      </div>

      {/* 3. STATS / TRUST BANNER */}
      <div className="border-y border-white/10 bg-gray-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <FaCamera className="text-3xl text-brand-500 mx-auto mb-4" />
              <h4 className="text-4xl font-serif font-bold">50k+</h4>
              <p className="text-xs uppercase tracking-widest text-gray-500">
                Photos Taken
              </p>
            </div>
            <div className="space-y-2">
              <FaPlane className="text-3xl text-brand-500 mx-auto mb-4" />
              <h4 className="text-4xl font-serif font-bold">12</h4>
              <p className="text-xs uppercase tracking-widest text-gray-500">
                Countries Explored
              </p>
            </div>
            <div className="space-y-2">
              <FaAward className="text-3xl text-brand-500 mx-auto mb-4" />
              <h4 className="text-4xl font-serif font-bold">100%</h4>
              <p className="text-xs uppercase tracking-widest text-gray-500">
                Quality Guarantee
              </p>
            </div>
            <div className="space-y-2">
              <FaMapMarkedAlt className="text-3xl text-brand-500 mx-auto mb-4" />
              <h4 className="text-4xl font-serif font-bold">24/7</h4>
              <p className="text-xs uppercase tracking-widest text-gray-500">
                Global Delivery
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. THE PROCESS */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
            How We Work
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            From the raw capture in the field to the final print in your hands,
            we obsess over every detail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-gray-900 border border-white/10 p-8 rounded-2xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
            <div className="absolute top-0 right-0 p-8 text-6xl font-serif font-bold text-white/5 group-hover:text-white/10 transition-colors">
              01
            </div>
            <h3 className="text-xl font-bold text-white mb-4 relative z-10">
              The Capture
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed relative z-10">
              We use cinema-grade drones and high-resolution mirrorless cameras,
              waiting hours for the perfect light to strike the landscape.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-gray-900 border border-white/10 p-8 rounded-2xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
            <div className="absolute top-0 right-0 p-8 text-6xl font-serif font-bold text-white/5 group-hover:text-white/10 transition-colors">
              02
            </div>
            <h3 className="text-xl font-bold text-white mb-4 relative z-10">
              The Edit
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed relative z-10">
              Every image is professionally color-graded to enhance the natural
              mood without looking artificial. We aim for timeless, cinematic
              tones.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-gray-900 border border-white/10 p-8 rounded-2xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
            <div className="absolute top-0 right-0 p-8 text-6xl font-serif font-bold text-white/5 group-hover:text-white/10 transition-colors">
              03
            </div>
            <h3 className="text-xl font-bold text-white mb-4 relative z-10">
              The Print
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed relative z-10">
              We partner with the world's best fine art labs. Using archival
              papers and pigment inks, our prints are rated to last 100+ years.
            </p>
          </div>
        </div>
      </div>

      {/* 5. CTA SECTION */}
      <div className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1511576661531-b34d7da5d0bb?auto=format&fit=crop&q=80&w=2000"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          alt="CTA Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="relative z-10 text-center px-4">
          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">
            Ready to explore?
          </h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/gallery"
              className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-accent transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              View Gallery
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 border border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
