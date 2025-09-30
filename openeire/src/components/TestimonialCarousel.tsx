import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getTestimonials, Testimonial } from "../services/api";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import StarRating from "./StarRating"; // Re-use our StarRating component

const TestimonialsCarousel: React.FC = () => {
  // Fetch testimonials using React Query
  const {
    data: testimonials,
    isLoading,
    isError,
  } = useQuery<Testimonial[], Error>({
    queryKey: ["testimonials"],
    queryFn: getTestimonials,
  });

  if (isLoading) return <div>Loading testimonials...</div>;
  if (isError || !testimonials) return <div>Failed to load testimonials.</div>;

  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          What Our Clients Say
        </h2>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="bg-white p-6 rounded-lg shadow-lg min-h-[250px] flex flex-col justify-between">
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
                <div className="mt-4">
                  <p className="font-bold text-gray-800">{testimonial.name}</p>
                  <StarRating
                    rating={testimonial.rating}
                    onRatingChange={() => {}}
                    readOnly
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
