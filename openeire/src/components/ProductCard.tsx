import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { GalleryItem } from "../services/api";
import QuickAddModal from "./QuickAddModal";
import { FaPlay, FaExpand, FaImage } from "react-icons/fa";
import {
  isDigitalProductType,
  isPhysicalProductType,
} from "../utils/purchaseFlow";
import { resolveMediaUrl } from "../config/backend";

interface ProductCardProps {
  product: GalleryItem;
  onModalOpen?: () => void;
  onModalClose?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onModalOpen,
  onModalClose,
}) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVideo = product.product_type === "video";
  const isPhysical = isPhysicalProductType(product.product_type);
  const isDigital = isDigitalProductType(product.product_type);

  const displayPrice = isPhysical
    ? product.starting_price || product.price || "0.00"
    : null;

  let detailUrl = "";
  if (isVideo) detailUrl = `/gallery/video/${product.id}`;
  else if (isPhysical) detailUrl = `/gallery/physical/${product.id}`;
  else detailUrl = `/gallery/photo/${product.id}`;

  const rawImageUrl = product.preview_image || product.thumbnail_image;
  const imageUrl =
    resolveMediaUrl(rawImageUrl) || "https://via.placeholder.com/400x300?text=No+Preview";

  const rawVideoFile = product.file;
  const fullVideoUrl = resolveMediaUrl(rawVideoFile) ?? null;
  const videoUrl = shouldLoadVideo ? fullVideoUrl : null;

  useEffect(() => {
    if (!isVideo || shouldLoadVideo || !cardRef.current) return;

    if (typeof IntersectionObserver === "undefined") {
      setShouldLoadVideo(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" },
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [isVideo, shouldLoadVideo]);

  useEffect(() => {
    if (!isVideo || !videoRef.current || !videoUrl) {
      setIsVideoPlaying(false);
      return;
    }

    if (isHovered) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsVideoPlaying(true))
          .catch(() => setIsVideoPlaying(false));
      }
      return;
    }

    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setIsVideoPlaying(false);
  }, [isHovered, isVideo, videoUrl]);

  const handleQuickAdd = (e: React.MouseEvent) => {
    if (!isPhysical) return;

    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
    if (onModalOpen) onModalOpen();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (isVideo) {
      setShouldLoadVideo(true);
    }
  };

  const getBadge = () => {
    if (isVideo)
      return {
        label: "4K Footage",
        color: "bg-white/90 text-brand-900",
        icon: <FaPlay className="text-[8px] mr-1" />,
      };
    if (isPhysical)
      return {
        label: "Fine Art Print",
        color: "bg-accent text-brand-900",
        icon: <FaImage className="text-[8px] mr-1" />,
      };
    return {
      label: "Digital Photo",
      color: "bg-brand-100 text-brand-900",
      icon: <FaExpand className="text-[8px] mr-1" />,
    };
  };
  const badge = getBadge();

  return (
    <>
      <div
        ref={cardRef}
        className="group relative bg-black rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-white/10"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          to={detailUrl}
          className="block relative aspect-[4/3] overflow-hidden bg-gray-900"
        >
          <img
            src={imageUrl}
            alt={product.title}
            loading="lazy"
            className={`absolute inset-0 z-10 w-full h-full object-cover transition-opacity duration-500 ${
              isVideoPlaying ? "opacity-0" : "opacity-100"
            }`}
          />

          {isVideo && shouldLoadVideo && videoUrl && (
            <video
              ref={videoRef}
              src={videoUrl}
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 z-0 w-full h-full object-cover"
            />
          )}

          <div className="absolute top-3 right-3 z-20">
            <span
              className={`flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-md backdrop-blur-md ${badge.color}`}
            >
              {badge.icon} {badge.label}
            </span>
          </div>

          {isVideo && (
            <div
              className={`absolute inset-0 flex items-center justify-center z-20 pointer-events-none transition-opacity duration-300 ${isHovered ? "opacity-0" : "opacity-100"}`}
            >
              <div className="w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 shadow-lg">
                <FaPlay className="ml-1 text-sm" />
              </div>
            </div>
          )}

          <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-black via-black/80 to-transparent flex justify-between items-end z-20">
            {isPhysical ? (
              <div className="text-white">
                <p className="text-[10px] opacity-80 uppercase tracking-wider font-bold">
                  Price
                </p>
                <span className="font-serif font-bold text-lg">
                  {"\u20AC"}{displayPrice}
                </span>
              </div>
            ) : (
              <div className="text-white">
                <p className="text-[10px] opacity-80 uppercase tracking-wider font-bold">
                  Personal Checkout
                </p>
                <span className="font-serif font-bold text-lg">
                  View Options
                </span>
              </div>
            )}
            {isPhysical && (
              <button
                onClick={handleQuickAdd}
                className="bg-white text-brand-900 w-10 h-10 rounded-full flex items-center justify-center hover:bg-accent hover:scale-110 transition-all shadow-lg"
                aria-label="Select print options"
              >
                <FaExpand className="text-sm" />
              </button>
            )}
          </div>
        </Link>

        <div className="p-5">
          <Link to={detailUrl}>
            <h3 className="text-white font-bold font-serif text-lg leading-tight mb-1 truncate hover:text-accent transition-colors">
              {product.title}
            </h3>
          </Link>
          <div className="flex justify-between items-center mt-2">
            <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">
              {product.collection}
            </p>
            {isDigital && (
              <span className="text-[10px] text-gray-400 bg-white/10 px-2 py-0.5 rounded border border-white/10">
                4K Available
              </span>
            )}
          </div>
        </div>
      </div>

      {showQuickView && (
        <QuickAddModal
          productId={product.id}
          onClose={() => {
            setShowQuickView(false);
            if (onModalClose) onModalClose();
          }}
        />
      )}
    </>
  );
};

export default ProductCard;
