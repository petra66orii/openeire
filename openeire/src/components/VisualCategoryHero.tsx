import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Navigation,
  Mousewheel,
  Autoplay,
} from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/effect-coverflow";

const categories = [
  {
    id: "all",
    label: "All Footage",
    image: "../public/all-gallery.webp",
  },
  {
    id: "ireland",
    label: "Ireland",
    image: "../public/ireland-gallery.webp",
  },
  {
    id: "new zealand",
    label: "New Zealand",
    image: "../public/new-zealand-gallery.webp",
  },
  {
    id: "thailand",
    label: "Thailand",
    image: "../public/thailand-gallery.webp",
  },
  {
    id: "romania",
    label: "Romania",
    image: "../public/romania-gallery.webp",
  },
];

interface VisualCategoryHeroProps {
  activeCollection: string;
  onSelectCollection: (id: string) => void;
  isPaused: boolean;
}

const VisualCategoryHero: React.FC<VisualCategoryHeroProps> = ({
  onSelectCollection,
  isPaused,
}) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  useEffect(() => {
    if (!swiperInstance) return;

    if (isPaused) {
      // User is hovering grid -> STOP
      swiperInstance.autoplay.stop();
    } else {
      // User left grid -> RESUME
      // We check if it's already running to avoid stuttering
      if (!swiperInstance.autoplay.running) {
        swiperInstance.autoplay.start();
      }
    }
  }, [isPaused, swiperInstance]);

  return (
    <div className="relative w-full py-16 md:py-24 overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#000000_100%)] z-0 pointer-events-none" />

      {/* Header Text */}
      <div className="relative z-10 text-center mb-10">
        <h2 className="text-white font-serif text-4xl md:text-5xl font-bold mb-3 tracking-tight drop-shadow-lg">
          Explore the World
        </h2>
        <p className="text-gray-400 text-xs md:text-sm uppercase tracking-[0.3em] font-sans opacity-80">
          Swipe to Travel
        </p>
      </div>

      <Swiper
        onSwiper={setSwiperInstance}
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        initialSlide={0}
        loop={false} // Keeps the deck stable
        rewind={true}
        slideToClickedSlide={true}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 150,
          modifier: 1.5,
          slideShadows: true,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        mousewheel={{ forceToAxis: true }}
        modules={[EffectCoverflow, Navigation, Mousewheel, Autoplay]}
        className="w-full relative z-20 py-8"
        onSlideChange={(swiper) => {
          const index = swiper.activeIndex;
          if (categories[index]) {
            onSelectCollection(categories[index].id);
          }
        }}
      >
        {categories.map((cat) => (
          <SwiperSlide
            key={cat.id}
            style={{ width: "300px", height: "450px" }}
            className="rounded-2xl overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 bg-gray-900 group"
          >
            <img
              src={cat.image}
              alt={cat.label}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-[.swiper-slide-active]:opacity-100 filter grayscale group-[.swiper-slide-active]:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
            <div className="absolute bottom-8 left-0 w-full text-center transform translate-y-2 transition-all duration-500">
              <h3 className="text-2xl font-serif font-bold text-white tracking-wide">
                {cat.label}
              </h3>
              <div className="h-0.5 w-0 bg-brand-500 mx-auto mt-2 transition-all duration-500 group-[.swiper-slide-active]:w-12"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-30 pointer-events-none"></div>
    </div>
  );
};

export default VisualCategoryHero;
