import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getProductDetail, ProductDetailItem } from "../services/api";
import ReviewForm from "../components/ReviewForm";
import ProductReviewList from "../components/ProductReviewList";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useBreadcrumb } from "../context/BreadcrumbContext";
import RelatedProducts from "../components/RelatedProducts";
import LicenseRequestModal from "../components/LicenseRequestModal";
import SEOHead from "../components/SEOHead";
import {
  isDigitalProductType,
  isPhysicalProductType,
  normalizeDigitalLicense,
  shouldShowGalleryAccessCodeUx,
} from "../utils/purchaseFlow";
import {
  FaPlay,
  FaShieldAlt,
  FaShippingFast,
  FaFileContract,
  FaShoppingBag,
} from "react-icons/fa";

const ProductDetailPage: React.FC = () => {
  // --- 1. HOOKS & ROUTING ---
  const { type: paramType, id } = useParams<{ type?: string; id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useBreadcrumb();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  // Media Player Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);

  // --- 2. LOGIC ---
  const type = useMemo(() => {
    if (paramType) return paramType;
    if (location.pathname.includes("/physical/")) return "physical";
    if (location.pathname.includes("/photo/")) return "photo";
    if (location.pathname.includes("/video/")) return "video";
    return null;
  }, [paramType, location.pathname]);

  const [product, setProduct] = useState<ProductDetailItem | null>(null);

  // Physical State (Only used if it's a physical print)
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedDigitalLicense, setSelectedDigitalLicense] = useState<
    "hd" | "4k"
  >("hd");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0);

  // --- 3. DATA FETCHING ---
  const fetchProductDetail = useCallback(async () => {
    if (!type || !id) return;
    setLoading(true);
    try {
      const data = await getProductDetail(type, id);
      setProduct(data);
      setReviewRefreshKey((prev) => prev + 1);
      setBreadcrumbTitle(location.pathname, data.title);
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        shouldShowGalleryAccessCodeUx(type, err.response?.status)
      ) {
        toast.info("Please re-enter your gallery access code.");
        navigate("/gallery-gate", {
          replace: true,
          state: { from: { pathname: location.pathname } },
        });
        return;
      }
      setError("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  }, [type, id, location.pathname, navigate, setBreadcrumbTitle]);

  useEffect(() => {
    fetchProductDetail();
  }, [fetchProductDetail]);

  // --- 4. COMPUTED VALUES ---
  const variants = useMemo(() => {
    if (!product) return [];
    if ("variants" in product && Array.isArray(product.variants))
      return product.variants;
    if ("photo" in product && product.photo && "variants" in product.photo)
      return (product.photo as any).variants;
    return [];
  }, [product]);

  const uniqueMaterials = useMemo(() => {
    const map = new Map();
    variants.forEach((v: any) => {
      if (!map.has(v.material)) map.set(v.material, v.material_display);
    });
    return Array.from(map.entries());
  }, [variants]);

  const availableSizes = useMemo(() => {
    return variants
      .filter((v: any) => v.material === selectedMaterial)
      .map((v: any) => ({ code: v.size, label: v.size_display }));
  }, [variants, selectedMaterial]);

  const activePhysicalVariant = useMemo(() => {
    return variants.find(
      (v: any) => v.material === selectedMaterial && v.size === selectedSize,
    );
  }, [variants, selectedMaterial, selectedSize]);

  useEffect(() => {
    if (variants.length > 0 && !selectedMaterial) {
      setSelectedMaterial(variants[0].material);
      setSelectedSize(variants[0].size);
    }
  }, [variants, selectedMaterial]);

  // Determine Page Mode (Prefer product type; fallback to route)
  const resolvedType = product?.product_type ?? type;
  const isPhysical = isPhysicalProductType(resolvedType);
  const isDigital = isDigitalProductType(resolvedType);
  const isVideo = resolvedType === "video";
  const isPhoto = resolvedType === "photo";

  const toMoneyNumber = (value: string | number | undefined): number => {
    if (value === undefined) return 0;
    const parsed = parseFloat(String(value));
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const digitalHdPrice = useMemo(() => {
    if (!product || !isDigital) return 0;
    return toMoneyNumber((product as any).price ?? (product as any).starting_price);
  }, [product, isDigital]);

  const digital4kPrice = useMemo(() => {
    if (!product || !isDigital) return 0;
    return toMoneyNumber((product as any).price_4k ?? (product as any).price);
  }, [product, isDigital]);

  const selectedDigitalPrice = useMemo(() => {
    if (selectedDigitalLicense === "4k") return digital4kPrice || digitalHdPrice;
    return digitalHdPrice || digital4kPrice;
  }, [selectedDigitalLicense, digital4kPrice, digitalHdPrice]);

  useEffect(() => {
    if (!isDigital) return;
    if (digitalHdPrice <= 0 && digital4kPrice > 0) {
      setSelectedDigitalLicense("4k");
      return;
    }
    setSelectedDigitalLicense("hd");
  }, [isDigital, digitalHdPrice, digital4kPrice, product?.id]);

  // Pricing & Cart Object Construction (Only for Physical Prints now)
  let displayPrice = "0.00";
  let activeProductForCart = product;

  if (product && isPhysical && activePhysicalVariant) {
    displayPrice = activePhysicalVariant.price;
    activeProductForCart = {
      ...product,
      id: activePhysicalVariant.id,
      title: `${product.title} (${activePhysicalVariant.material_display} - ${activePhysicalVariant.size_display})`,
      price: activePhysicalVariant.price,
      product_type: "physical",
      preview_image:
        "photo" in product && (product as any).photo
          ? (product as any).photo.preview_image
          : product.preview_image,
    };
  }

  // --- 5. HANDLERS ---
  const handleAddToCart = () => {
    // Only allow adding to cart for physical products with a resolved variant
    if (!isPhysical) return;
    if (!product) return;
    if (!activePhysicalVariant) {
      toast.error("Please select a print option before adding to your bag.");
      return;
    }
    if (!activeProductForCart) return;
    addToCart(activeProductForCart, 1, {
      type: "physical",
      material: selectedMaterial,
      size: selectedSize,
      variantId: activePhysicalVariant.id,
      sourceProductId: Number(product.id),
    });
    toast.success("Added to Bag");
  };

  const handleAddDigitalToCart = () => {
    if (!product || !isDigital) return;
    if (!isAuthenticated) {
      toast.info("Please log in to purchase and download digital assets.");
      navigate("/login", {
        state: { from: { pathname: location.pathname } },
      });
      return;
    }

    if (selectedDigitalPrice <= 0) {
      toast.error("Price unavailable. Please contact support.");
      return;
    }

    addToCart(product, 1, {
      type: "digital",
      license: selectedDigitalLicense,
      unitPrice: selectedDigitalPrice,
      sourceProductId: Number(product.id),
    });

    toast.success("Added to Bag");
  };

  const handleRequestLicense = () => {
    setIsLicenseModalOpen(true); // Open the modal instead of the toast
  };

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Loading/Error Views
  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  if (error || !product)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        {error || "Product not found"}
      </div>
    );

  // Image URL Resolver
  let imageUrl = "";
  if (product.product_type === "physical" && "photo" in product)
    imageUrl = (product as any).photo.preview_image || "";
  else if ("preview_image" in product) imageUrl = product.preview_image || "";
  else if ("thumbnail_image" in product)
    imageUrl = product.thumbnail_image || "";
  const videoPreviewUrl =
    isVideo && typeof (product as any).file === "string"
      ? (product as any).file
      : "";

  const reviewProductId =
    product.product_type === "physical" && "photo" in product
      ? String((product as any).photo.id)
      : String(product.id);
  const reviewProductType =
    product.product_type === "physical" ? "photo" : product.product_type;

  return (
    <div className="bg-black min-h-screen text-white pt-24 pb-20 font-sans selection:bg-accent selection:text-black">
      <SEOHead
        title={product.title}
        description={
          isDigital
            ? `Buy ${product.title} for personal use or request commercial licensing`
            : `Buy ${product.title}`
        }
        image={product.preview_image}
      />

      <div className="container mx-auto px-4 lg:px-8">
        {/* BREADCRUMB */}
        <nav className="text-xs uppercase tracking-widest text-gray-500 mb-8 flex items-center gap-2">
          <Link to="/gallery" className="hover:text-accent transition-colors">
            Gallery
          </Link>
          <span>/</span>
          <span className="text-white truncate max-w-[200px]">
            {product.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* --- LEFT COL: MEDIA (STICKY) --- */}
          <div className="lg:col-span-8">
            <div className="sticky top-32">
              <div className="relative w-fit mx-auto rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black group">
                {isVideo && videoPreviewUrl ? (
                  <>
                    <video
                      ref={videoRef}
                      src={videoPreviewUrl}
                      className="w-auto h-auto max-h-[75vh] max-w-full shadow-lg block"
                      loop
                      poster={product.thumbnail_image}
                      onClick={toggleVideo}
                    />
                    {!isPlaying && (
                      <div
                        onClick={toggleVideo}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-all cursor-pointer"
                      >
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 text-white shadow-lg hover:scale-110 transition-transform">
                          <FaPlay className="ml-2 text-3xl" />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <img
                    src={imageUrl}
                    alt={product.title}
                    className="w-auto h-auto max-h-[75vh] max-w-full shadow-lg block"
                  />
                )}
              </div>

              {/* TECH SPECS GRID */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-lg overflow-hidden">
                <SpecBox
                  label="Resolution"
                  value={(product as any).resolution || "High Res"}
                />
                <SpecBox
                  label="Format"
                  value={isVideo ? "MP4 / ProRes" : "Fine Art / JPEG"}
                />
                <SpecBox
                  label="Frame Rate"
                  value={(product as any).frame_rate || "N/A"}
                />
                <SpecBox
                  label="Duration"
                  value={formatDuration((product as any).duration)}
                />
              </div>
            </div>
          </div>

          {/* --- RIGHT COL: COMMERCE / LICENSING --- */}
          <div className="lg:col-span-4">
            <div className="bg-gray-900/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-white/10">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4 leading-tight">
                {product.title}
              </h1>

              {/* DESCRIPTION */}
              {"description" in product && (
                <p className="text-gray-400 text-sm leading-relaxed mb-8 border-l-2 border-accent pl-4">
                  {(product as any).description}
                </p>
              )}

              {/* =========================================
                  FLOW A: PHYSICAL ART PRINT (RETAIL) 
                  ========================================= */}
              {isPhysical && variants.length > 0 && (
                <div className="space-y-5 animate-fade-in-up">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">
                      Material
                    </label>
                    <select
                      value={selectedMaterial}
                      onChange={(e) => {
                        setSelectedMaterial(e.target.value);
                        const firstSize = variants.find(
                          (v: any) => v.material === e.target.value,
                        )?.size;
                        if (firstSize) setSelectedSize(firstSize);
                      }}
                      className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none appearance-none"
                    >
                      {uniqueMaterials.map(([code, label]) => (
                        <option key={code} value={code}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">
                      Size
                    </label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none appearance-none"
                    >
                      {availableSizes.map((s: any) => (
                        <option key={s.code} value={s.code}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Physical Checkout */}
                  <div className="border-t border-white/10 pt-6 mt-8">
                    <div className="flex justify-between items-end mb-6">
                      <span className="text-gray-400 text-sm font-medium">
                        Total
                      </span>
                      <span className="text-4xl font-serif font-bold text-white">
                        €{displayPrice}
                      </span>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="w-full py-4 bg-brand-700 text-paper font-bold text-lg rounded-xl hover:bg-brand-900 transition-all transform active:scale-[0.98] shadow-[0_0_20px_rgba(0,196,0,0.2)] flex items-center justify-center gap-2"
                    >
                      Add to Cart
                    </button>

                    {/* Art print legal disclaimer */}
                    <p className="mt-4 text-[11px] text-gray-500 text-center leading-relaxed px-4">
                      Art prints are sold for personal display only and do not
                      include reproduction or commercial usage rights.
                    </p>

                    <div className="mt-4 flex justify-center gap-6 text-[10px] text-gray-500 uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <FaShieldAlt /> Secure
                      </span>
                      <span className="flex items-center gap-1">
                        <FaShippingFast /> US & IE Ship
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================
                  FLOW B: DIGITAL (PERSONAL CHECKOUT + COMMERCIAL LICENSING)
                  ========================================= */}
              {isDigital && (
                <div className="space-y-5 animate-fade-in-up">
                  <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
                    <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-widest">
                      Personal Use Purchase
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Buy this {isPhoto ? "photo" : "video"} for personal use.
                      Commercial usage requires a separate rights-managed
                      licence request.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">
                      Personal License
                    </label>
                    <select
                      value={selectedDigitalLicense}
                      onChange={(e) =>
                        setSelectedDigitalLicense(
                          normalizeDigitalLicense(e.target.value),
                        )
                      }
                      className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none appearance-none"
                    >
                      <option value="hd">HD Personal Licence</option>
                      <option value="4k">4K Personal Licence</option>
                    </select>
                  </div>

                  <div className="border-t border-white/10 pt-6 mt-8">
                    <div className="flex justify-between items-end mb-6">
                      <span className="text-gray-400 text-sm font-medium">
                        Total
                      </span>
                      <span className="text-4xl font-serif font-bold text-white">
                        €{selectedDigitalPrice.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={handleAddDigitalToCart}
                      className="w-full py-4 bg-brand-700 text-paper font-bold text-lg rounded-xl hover:bg-brand-900 transition-all transform active:scale-[0.98] shadow-[0_0_20px_rgba(0,196,0,0.2)] flex items-center justify-center gap-2"
                    >
                      <FaShoppingBag /> Add to Bag
                    </button>
                  </div>

                  <div className="border-t border-white/10 pt-5">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
                      Need editorial/commercial rights?
                    </p>
                    <button
                      onClick={handleRequestLicense}
                      className="w-full py-4 bg-transparent border-2 border-white/20 text-white font-bold text-lg rounded-xl hover:bg-white hover:text-black transition-all transform active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                      <FaFileContract /> Request Commercial Licence
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- REVIEWS & RELATED (Dark Background Container) --- */}
        <div className="mt-24 pt-12 border-t border-white/10">
          <h3 className="text-2xl font-serif font-bold mb-8 text-white">
            Reviews
          </h3>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
            <ReviewForm
              productType={reviewProductType}
              productId={reviewProductId}
              onReviewSubmitted={fetchProductDetail}
            />
            <div className="mt-8">
              <ProductReviewList
                productType={reviewProductType}
                productId={reviewProductId}
                refreshKey={reviewRefreshKey}
              />
            </div>
          </div>
        </div>

        {product && "related_products" in product && (
          <div className="mt-20">
            <RelatedProducts products={(product as any).related_products} />
          </div>
        )}
      </div>
      {isDigital && product && (
        <LicenseRequestModal
          isOpen={isLicenseModalOpen}
          onClose={() => setIsLicenseModalOpen(false)}
          assetId={product.id}
          assetType={product.product_type as "photo" | "video"}
          assetTitle={product.title}
        />
      )}
    </div>
  );
};

// --- HELPER COMPONENTS ---
const SpecBox = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-black/40 p-4 text-center group hover:bg-white/5 transition-colors">
    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
      {label}
    </p>
    <p className="text-white font-bold text-sm truncate">{value}</p>
  </div>
);

export default ProductDetailPage;
