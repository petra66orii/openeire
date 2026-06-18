"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowDown } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Mousewheel, Navigation } from "swiper/modules";
import { GALLERY_COLLECTIONS } from "@/lib/gallery/collections";

const normalizeCollection = (value?: string | null): string =>
  (value || "all").trim().toLowerCase();

export function GalleryHero({
  activeCollection,
  galleryPath = "/gallery/physical",
}: {
  activeCollection?: string | null;
  galleryPath?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const normalizedActiveCollection = normalizeCollection(activeCollection);
  const initialSlide = useMemo(() => {
    const index = GALLERY_COLLECTIONS.findIndex(
      (collection) =>
        normalizeCollection(collection.id) === normalizedActiveCollection,
    );
    return index >= 0 ? index : 0;
  }, [normalizedActiveCollection]);

  const buildGalleryUrl = useCallback(
    (collectionId: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (collectionId === "all") {
        params.delete("collection");
      } else {
        params.set("collection", collectionId);
      }

      const query = params.toString();
      return query ? `${galleryPath}?${query}` : galleryPath;
    },
    [galleryPath, searchParams],
  );

  const selectCollection = useCallback(
    (collectionId: string) => {
      if (normalizeCollection(collectionId) === normalizedActiveCollection) {
        return;
      }

      router.push(buildGalleryUrl(collectionId), { scroll: false });
    },
    [buildGalleryUrl, normalizedActiveCollection, router],
  );

  const scrollToGalleryGrid = useCallback(() => {
    const grid = document.getElementById("gallery-grid");
    if (!grid) return;

    const headerOffset =
      Number.parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--site-header-height",
        ),
        10,
      ) || 0;
    const targetTop =
      grid.getBoundingClientRect().top + window.scrollY - headerOffset - 16;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: "smooth",
    });
  }, []);

  return (
    <section className="relative min-h-[400px] w-full overflow-hidden py-4 sm:min-h-[470px] md:min-h-[640px] md:py-24 lg:min-h-[720px]">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#000000_100%)]" />

      <div className="relative z-10 mb-5 mt-24 text-center md:mb-10 md:mt-0">
        <h1 className="mb-2 font-serif text-2xl font-bold leading-[1.02] tracking-tight text-white drop-shadow-lg sm:text-3xl md:text-5xl">
          Browse the Collection
        </h1>
        <p className="font-sans text-[9px] uppercase tracking-[0.26em] text-gray-400 opacity-80 sm:text-xs md:text-sm">
          Fine art prints and licensing-ready visuals
        </p>
      </div>

      <Swiper
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView="auto"
        initialSlide={initialSlide}
        loop={false}
        rewind
        slideToClickedSlide
        allowTouchMove
        simulateTouch
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
        className="relative z-20 w-full py-8"
        onSlideChange={(swiper) => {
          const collection = GALLERY_COLLECTIONS[swiper.activeIndex];
          if (collection) selectCollection(collection.id);
        }}
      >
        {GALLERY_COLLECTIONS.map((collection) => {
          const isActive =
            normalizeCollection(collection.id) === normalizedActiveCollection;

          return (
            <SwiperSlide
              key={collection.id}
              style={{ width: "300px", height: "450px" }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gray-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              role="button"
              tabIndex={0}
              aria-label={
                isActive
                  ? `Scroll to ${collection.label} gallery`
                  : `Show ${collection.label} gallery`
              }
              aria-current={isActive ? "true" : undefined}
              onClick={() => {
                if (isActive) {
                  scrollToGalleryGrid();
                  return;
                }
                selectCollection(collection.id);
              }}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                if (isActive) {
                  scrollToGalleryGrid();
                  return;
                }
                selectCollection(collection.id);
              }}
            >
              <img
                src={collection.image}
                alt={collection.label}
                width={640}
                height={960}
                loading={collection.id === "all" ? "eager" : "lazy"}
                fetchPriority={collection.id === "all" ? "high" : "auto"}
                decoding="async"
                className="h-full w-full object-cover opacity-60 grayscale transition-transform duration-700 group-hover:scale-110 group-[.swiper-slide-active]:opacity-100 group-[.swiper-slide-active]:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-8 left-0 w-full translate-y-2 text-center transition-all duration-500">
                <h2 className="font-serif text-2xl font-bold tracking-wide text-white">
                  {collection.label}
                </h2>
                <div className="mx-auto mt-2 h-0.5 w-0 bg-brand-500 transition-all duration-500 group-[.swiper-slide-active]:w-12" />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="relative z-30 mt-5 flex justify-center px-4 md:mt-8">
        <button
          type="button"
          onClick={scrollToGalleryGrid}
          aria-label="Scroll to gallery"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-md transition-colors hover:border-accent/60 hover:text-accent"
        >
          <span>Scroll to gallery</span>
          <FaArrowDown className="text-[10px]" />
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 z-30 h-10 w-full bg-gradient-to-t from-black to-transparent md:h-32" />
    </section>
  );
}
