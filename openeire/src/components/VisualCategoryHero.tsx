import React from "react";
import { FaArrowDown } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Mousewheel } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";

import { GALLERY_COLLECTIONS } from "../config/galleryCollections";

interface VisualCategoryHeroProps {
  activeCollection: string;
  onSelectCollection: (id: string) => void;
  isPaused: boolean;
  onScrollToGallery: () => void;
}

const VisualCategoryHero: React.FC<VisualCategoryHeroProps> = ({
  activeCollection,
  onSelectCollection,
  onScrollToGallery,
}) => {
  return (
    <div className="relative w-full overflow-hidden py-4 min-h-[400px] sm:min-h-[470px] md:min-h-[640px] lg:min-h-[720px] md:py-24">
      {/* Background Atmosphere */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#000000_100%)]" />

      {/* Header Text */}
      <div className="relative z-10 mt-24 mb-5 text-center md:mt-0 md:mb-10">
        <h2 className="mb-2 text-2xl font-serif font-bold leading-[1.02] tracking-tight text-white drop-shadow-lg sm:text-3xl md:text-5xl">
          Browse the Collection
        </h2>
        <p className="text-[9px] uppercase tracking-[0.26em] text-gray-400 opacity-80 font-sans sm:text-xs md:text-sm">
          Fine art prints and licensing-ready visuals
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
          if (GALLERY_COLLECTIONS[index]) {
            onSelectCollection(GALLERY_COLLECTIONS[index].id);
          }
        }}
      >
        {GALLERY_COLLECTIONS.map((cat) => (
          <SwiperSlide
            key={cat.id}
            style={{ width: "300px", height: "450px" }}
            className="rounded-2xl overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 bg-gray-900 group"
            onClick={() => {
              if (activeCollection === cat.id) {
                onScrollToGallery();
                return;
              }
              onSelectCollection(cat.id);
            }}
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

      <div className="relative z-30 mt-5 flex justify-center px-4 md:mt-8">
        <button
          type="button"
          onClick={onScrollToGallery}
          aria-label="Scroll to gallery"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-md transition-colors hover:border-accent/60 hover:text-accent"
        >
          <span>Scroll to gallery</span>
          <FaArrowDown className="text-[10px]" />
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 z-30 h-10 w-full bg-gradient-to-t from-black to-transparent md:h-32" />
    </div>
  );
};

export default VisualCategoryHero;
