import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { GalleryItem } from "../services/api";
import { useCart } from "../context/CartContext";
import QuickAddModal from "./QuickAddModal";
import toast from "react-hot-toast";
import { FaPlay, FaShoppingCart, FaExpand, FaImage } from "react-icons/fa";

interface ProductCardProps {
  product: GalleryItem;
  contextType?: "digital" | "physical" | "all";
}

// ⚠️ CHANGE THIS if your Django backend runs on a different port/URL
const BACKEND_BASE_URL = "http://127.0.0.1:8000";

const ProductCard: React.FC<ProductCardProps> = ({ product, contextType }) => {
  const { addToCart } = useCart();
  const [showQuickView, setShowQuickView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // --- 1. DETERMINE PRODUCT TYPE & PATHS ---
  const isVideo = product.product_type === "video";

  // Decide if we are showing the Digital Price (license) or Physical Price (print)
  // Logic: If we are in "Digital" mode OR it's a video, show license price. Otherwise, physical.
  const showDigitalPrice =
    contextType === "digital" ||
    product.product_type === "video" ||
    (contextType !== "physical" && product.product_type !== "physical");

  const displayPrice = showDigitalPrice
    ? product.price_hd || product.price || "0.00"
    : product.starting_price || product.price || "0.00";

  // Construct the Detail URL based on type
  let detailUrl = "";
  if (isVideo) detailUrl = `/gallery/video/${product.id}`;
  else if (showDigitalPrice) detailUrl = `/gallery/photo/${product.id}`;
  else detailUrl = `/gallery/physical/${product.id}`;

  // --- 2. IMAGE & VIDEO SOURCE ---
  const rawImageUrl = product.preview_image || product.thumbnail_image;
  const imageUrl = rawImageUrl
    ? rawImageUrl.startsWith("http")
      ? rawImageUrl
      : `${BACKEND_BASE_URL}${rawImageUrl}`
    : "https://via.placeholder.com/400x300?text=No+Preview";

  // ideally, your API should return a small 'preview_file' for hover.
  // For now, we use the main file (be careful with file size!)
  const videoUrl = product.file
    ? product.file.startsWith("http")
      ? product.file
      : `${BACKEND_BASE_URL}${product.file}`
    : null;

  // --- 3. EVENT HANDLERS ---

  // Play video on hover
  useEffect(() => {
    if (isVideo && videoRef.current) {
      if (isHovered) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            // Auto-play was prevented or video not loaded; silently fail to just show image
            console.warn("Video hover preview blocked:", error);
          });
        }
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0; // Reset to start
      }
    }
  }, [isHovered, isVideo]);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Don't open the product page
    e.stopPropagation();

    // A. ADD VIDEO (Default to HD)
    if (isVideo) {
      addToCart({ ...product, price: product.price_hd || product.price }, 1, {
        license: "hd",
        type: "digital",
      });
      toast.success("HD Video added to cart");
    }
    // B. ADD DIGITAL PHOTO (Default to Standard/HD)
    else if (showDigitalPrice) {
      addToCart({ ...product, price: product.price }, 1, {
        license: "standard",
        type: "digital",
      });
      toast.success("Digital Photo added to cart");
    }
    // C. PHYSICAL PRINT (Open Modal)
    else {
      setShowQuickView(true);
    }
  };

  // --- 4. BADGE LOGIC ---
  const getBadge = () => {
    if (isVideo)
      return {
        label: "4K Footage",
        color: "bg-white/90 text-brand-900",
        icon: <FaPlay className="text-[8px] mr-1" />,
      };
    if (!showDigitalPrice)
      return {
        label: "Fine Art Print",
        color: "bg-accent text-brand-900",
        icon: <FaImage className="text-[8px] mr-1" />,
      };
    return {
      label: "Digital Photo",
      color: "bg-brand-100 text-brand-800",
      icon: <FaExpand className="text-[8px] mr-1" />,
    };
  };
  const badge = getBadge();

  return (
    <>
      <div
        className="group relative bg-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-brand-800"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          to={detailUrl}
          className="block relative aspect-[4/3] overflow-hidden bg-brand-500"
        >
          {/* A. MAIN IMAGE */}
          <img
            src={imageUrl}
            alt={product.title}
            loading="lazy"
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              isHovered && isVideo ? "opacity-0" : "opacity-100"
            } group-hover:scale-105`}
          />

          {/* B. VIDEO PREVIEW LAYER (Only renders if video) */}
          {isVideo && videoUrl && (
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="none"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          )}

          {/* C. BADGE (Top Right) */}
          <div className="absolute top-3 right-3 z-20">
            <span
              className={`flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-md backdrop-blur-md ${badge.color}`}
            >
              {badge.icon} {badge.label}
            </span>
          </div>

          {/* D. CENTER PLAY ICON (For videos not hovering) */}
          {isVideo && (
            <div
              className={`absolute inset-0 flex items-center justify-center z-10 pointer-events-none transition-opacity duration-300 ${isHovered ? "opacity-0" : "opacity-100"}`}
            >
              <div className="w-12 h-12 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/30 shadow-lg">
                <FaPlay className="ml-1 text-sm" />
              </div>
            </div>
          )}

          {/* E. QUICK ADD SLIDE-UP BAR */}
          <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-brand-900/90 via-brand-900/60 to-transparent flex justify-between items-end z-20">
            <div className="text-white">
              <p className="text-[10px] opacity-80 uppercase tracking-wider font-bold">
                Price
              </p>
              <span className="font-serif font-bold text-lg">
                €{displayPrice}
              </span>
            </div>

            <button
              onClick={handleQuickAdd}
              className="bg-white text-brand-900 w-10 h-10 rounded-full flex items-center justify-center hover:bg-accent hover:scale-110 transition-all shadow-lg"
              title={showDigitalPrice ? "Add to Cart" : "Select Options"}
            >
              {showDigitalPrice ? (
                <FaShoppingCart className="text-sm" />
              ) : (
                <FaExpand className="text-sm" />
              )}
            </button>
          </div>
        </Link>

        {/* F. DETAILS SECTION */}
        <div className="p-5">
          <Link to={detailUrl}>
            <h3 className="text-brand-500 font-bold font-serif text-lg leading-tight mb-1 truncate hover:text-accent transition-colors">
              {product.title}
            </h3>
          </Link>
          <div className="flex justify-between items-center mt-2">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">
              {product.location || "Ireland"}
            </p>
            {/* Optional: Show aspect ratio or resolution if digital */}
            {showDigitalPrice && (
              <span className="text-[10px] text-brand-300 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                4K Available
              </span>
            )}
          </div>
        </div>
      </div>

      {/* MODAL (Only for Physical Products) */}
      {showQuickView && (
        <QuickAddModal
          productId={product.id}
          onClose={() => setShowQuickView(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
