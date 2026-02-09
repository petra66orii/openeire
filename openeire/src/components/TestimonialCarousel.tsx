import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getTestimonials, Testimonial } from "../services/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import StarRating from "./StarRating";
import RevealOnScroll from "./ui/RevealOnScroll";

const TestimonialsCarousel: React.FC = () => {
  const {
    data: testimonials,
    isLoading,
    isError,
  } = useQuery<Testimonial[], Error>({
    queryKey: ["testimonials"],
    queryFn: getTestimonials,
  });

  if (isLoading)
    return (
      <div className="py-20 text-center text-gray-400">Loading reviews...</div>
    );
  if (isError || !testimonials) return null;

  return (
    <section className="bg-brand-50 py-20 lg:py-28 overflow-hidden relative">
      {/* 🌫️ THE "DARK MIST" GRADIENT 🌫️ */}
      <div className="absolute top-0 left-0 w-full h-32 md:h-48 bg-gradient-to-b from-brand-900 to-brand-50 z-0 pointer-events-none"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left: Text Content */}
          <div className="lg:w-1/3 text-center lg:text-left pt-10 lg:pt-0">
            <RevealOnScroll>
              <span className="text-accent font-bold tracking-widest uppercase text-xs">
                Testimonials
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark mt-3 mb-6">
                Trusted by Creators & Collectors
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Don't just take our word for it. Here is what our community says
                about our prints and footage.
              </p>

              {/* Stat block */}
              <div className="inline-flex items-center bg-white px-6 py-3 rounded-full shadow-sm border border-brand-100">
                <span className="text-brand-500 font-bold text-xl mr-2">
                  5.0
                </span>
                <div className="flex text-accent text-sm">{"★".repeat(5)}</div>
                <span className="ml-3 text-gray-400 text-sm border-l pl-3">
                  Average Rating
                </span>
              </div>
            </RevealOnScroll>
          </div>

          {/* Right: The Carousel */}
          <div className="lg:w-2/3 w-full">
            <RevealOnScroll delay={200}>
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                pagination={{ clickable: true, dynamicBullets: true }}
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                loop={true}
                breakpoints={{
                  768: { slidesPerView: 2 },
                }}
                className="pb-12"
                style={
                  {
                    "--swiper-pagination-color": "var(--color-brand-500)",
                    "--swiper-pagination-bullet-inactive-color": "#999",
                  } as React.CSSProperties
                }
              >
                {testimonials.map((testimonial) => (
                  <SwiperSlide key={testimonial.id}>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col relative mt-6 hover:shadow-md transition-shadow">
                      {/* Decorative Quote Mark */}
                      <div className="absolute -top-6 -left-2 text-7xl text-brand-100 font-serif leading-none opacity-50">
                        &ldquo;
                      </div>

                      <p className="text-gray-600 italic mb-6 relative z-10 font-serif leading-relaxed">
                        "{testimonial.text}"
                      </p>

                      <div className="mt-auto flex items-center gap-4">
                        <div className="h-10 w-10 bg-brand-50 rounded-full flex items-center justify-center text-brand-700 font-bold border border-brand-100">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-dark text-sm">
                            {testimonial.name}
                          </h4>
                          <div className="scale-75 origin-left">
                            <StarRating
                              rating={testimonial.rating}
                              onRatingChange={() => {}}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
