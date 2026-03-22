import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Navigation,
  Mousewheel,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";

const categories = [
  {
    id: "all",
    label: "All Footage",
    image: "/all-gallery-card.webp",
  },
  {
    id: "ireland",
    label: "Ireland",
    image: "/ireland-gallery-card.webp",
  },
  {
    id: "new zealand",
    label: "New Zealand",
    image: "/new-zealand-gallery-card.webp",
  },
  {
    id: "thailand",
    label: "Thailand",
    image: "/thailand-gallery-card.webp",
  },
  {
    id: "romania",
    label: "Romania",
    image: "/romania-gallery-card.webp",
  },
  {
    id: "australia",
    label: "Australia",
    image: "/australia-gallery-card.webp",
  },
];

interface VisualCategoryHeroProps {
  activeCollection: string;
  onSelectCollection: (id: string) => void;
  isPaused: boolean;
}

const VisualCategoryHero: React.FC<VisualCategoryHeroProps> = ({
  onSelectCollection,
}) => {
  return (
    <div className="relative w-full py-16 md:py-24 overflow-hidden min-h-[760px] md:min-h-[860px]">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#000000_100%)] z-0 pointer-events-none" />

      {/* Header Text */}
      <div className="relative z-10 mt-[var(--site-header-height)] md:mt-0 text-center mb-10">
        <h2 className="text-white font-serif text-4xl md:text-5xl font-bold mb-3 tracking-tight drop-shadow-lg">
          Explore the World
        </h2>
        <p className="text-gray-400 text-xs md:text-sm uppercase tracking-[0.3em] font-sans opacity-80">
          Swipe to Travel
        </p>
      </div>

      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        initialSlide={0}
        loop={false} // Keeps the deck stable
        rewind={true}
        slideToClickedSlide={true}
        speed={450}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 150,
          modifier: 1.5,
          slideShadows: false,
        }}
        mousewheel={{ forceToAxis: true }}
        modules={[EffectCoverflow, Navigation, Mousewheel]}
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
              width={640}
              height={960}
              loading={cat.id === "all" ? "eager" : "lazy"}
              fetchPriority={cat.id === "all" ? "high" : "auto"}
              decoding="async"
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
