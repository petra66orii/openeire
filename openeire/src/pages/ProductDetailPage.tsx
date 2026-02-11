import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { getProductDetail, ProductDetailItem } from "../services/api";
import ReviewForm from "../components/ReviewForm";
import ProductReviewList from "../components/ProductReviewList";
import { useCart } from "../context/CartContext"; // Direct Cart Access for custom button
import { toast } from "react-toastify";
import { useBreadcrumb } from "../context/BreadcrumbContext";
import RelatedProducts from "../components/RelatedProducts";
import SEOHead from "../components/SEOHead";
import {
  FaPlay,
  FaCheck,
  FaShieldAlt,
  FaShippingFast,
  FaDownload,
  FaLock,
  FaExpand,
} from "react-icons/fa";

type PurchaseMode = "physical" | "digital";

const ProductDetailPage: React.FC = () => {
  // --- 1. HOOKS & ROUTING ---
  const { type: paramType, id } = useParams<{ type?: string; id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useBreadcrumb();
  const { addToCart } = useCart();

  // Media Player Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // --- 2. LOGIC (Kept from your original file) ---
  const type = useMemo(() => {
    if (paramType) return paramType;
    if (location.pathname.includes("/physical/")) return "physical";
    if (location.pathname.includes("/photo/")) return "photo";
    if (location.pathname.includes("/video/")) return "video";
    return null;
  }, [paramType, location.pathname]);

  const isDigitalAuthorized = useMemo(() => {
    const session = localStorage.getItem("gallery_access");
    if (!session) return false;
    try {
      return !!JSON.parse(session).code;
    } catch {
      return false;
    }
  }, []);

  const [product, setProduct] = useState<ProductDetailItem | null>(null);
  const [purchaseMode, setPurchaseMode] = useState<PurchaseMode>("physical");

  // Physical State
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  // Digital State
  const [digitalLicense, setDigitalLicense] = useState<"hd" | "4k">("hd");

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

      // Intelligent Default Mode Setting
      const hasPhysical = "variants" in data && data.variants.length > 0;
      const isVideo = data.product_type === "video";

      if (isVideo) setPurchaseMode("digital");
      else if (type === "physical" && hasPhysical) setPurchaseMode("physical");
      else setPurchaseMode("digital");
    } catch (err) {
      setError("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  }, [type, id, location.pathname, setBreadcrumbTitle]);

  useEffect(() => {
    fetchProductDetail();
  }, [fetchProductDetail]);

  // --- 4. COMPUTED VALUES ---
  const handleModeSwitch = (mode: PurchaseMode) => {
    if (mode === "digital" && !isDigitalAuthorized) {
      toast.info("Digital downloads require a private gallery access code.");
      navigate("/gallery-gate", { state: { from: location } });
      return;
    }
    setPurchaseMode(mode);
  };

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

  // Pricing & Cart Object Construction
  let displayPrice = "0.00";
  let activeProductForCart = product;

  if (product) {
    if (purchaseMode === "physical" && activePhysicalVariant) {
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
    } else {
      displayPrice =
        digitalLicense === "hd"
          ? (product as any).price_hd
          : (product as any).price_4k;
      activeProductForCart = {
        ...product,
        price: displayPrice,
        title: `${product.title} (${digitalLicense.toUpperCase()} License)`,
        product_type: product.product_type === "video" ? "video" : "photo",
      };
    }
  }

  // --- 5. HANDLERS ---
  const handleAddToCart = () => {
    if (!activeProductForCart) return;
    addToCart(activeProductForCart, 1);
    toast.success("Added to Bag");
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

  // Render Helpers
  const isVideo = product.product_type === "video";
  const hasVariants = variants.length > 0;

  // Image URL Resolver
  let imageUrl = "";
  if (product.product_type === "physical" && "photo" in product)
    imageUrl = (product as any).photo.preview_image || "";
  else if ("preview_image" in product) imageUrl = product.preview_image || "";
  else if ("thumbnail_image" in product)
    imageUrl = product.thumbnail_image || "";

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
        description={`Buy ${product.title}`}
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
                {isVideo && "video_file" in product ? (
                  <>
                    <video
                      ref={videoRef}
                      src={(product as any).video_file}
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
          {/* --- RIGHT COL: COMMERCE --- */}
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

              {/* --- MODE SWITCHER (PHYSICAL / DIGITAL) --- */}
              {!isVideo && hasVariants && (
                <div className="flex p-1 bg-white/5 rounded-lg mb-8 border border-white/10">
                  <ModeButton
                    label="Physical Print"
                    active={purchaseMode === "physical"}
                    onClick={() => handleModeSwitch("physical")}
                  />
                  <ModeButton
                    label="Digital Download"
                    active={purchaseMode === "digital"}
                    onClick={() => handleModeSwitch("digital")}
                    locked={!isDigitalAuthorized}
                  />
                </div>
              )}

              {/* --- PHYSICAL SELECTORS --- */}
              {purchaseMode === "physical" && hasVariants && (
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
                </div>
              )}

              {/* --- DIGITAL LICENSE CARDS --- */}
              {purchaseMode === "digital" && (
                <div className="space-y-4 animate-fade-in-up">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                    Select License
                  </h3>

                  <LicenseCard
                    title="Standard (HD)"
                    subtitle="Web, Social Media"
                    selected={digitalLicense === "hd"}
                    onClick={() => setDigitalLicense("hd")}
                  />
                  <LicenseCard
                    title="Commercial (4K)"
                    subtitle="TV, Film, Ads, Print"
                    selected={digitalLicense === "4k"}
                    onClick={() => setDigitalLicense("4k")}
                    isPremium
                  />
                </div>
              )}

              {/* --- TOTAL & CHECKOUT --- */}
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
                  {purchaseMode === "physical" ? "Add to Cart" : "Download Now"}
                </button>

                <div className="mt-4 flex justify-center gap-6 text-[10px] text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <FaShieldAlt /> Secure
                  </span>
                  <span className="flex items-center gap-1">
                    {purchaseMode === "physical" ? (
                      <>
                        <FaShippingFast /> Global Ship
                      </>
                    ) : (
                      <>
                        <FaDownload /> Instant
                      </>
                    )}
                  </span>
                </div>
              </div>
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
            <RelatedProducts
              products={(product as any).related_products}
              contextType={purchaseMode === "physical" ? "physical" : "digital"}
            />
          </div>
        )}
      </div>
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

const ModeButton = ({ label, active, onClick, locked }: any) => (
  <button
    onClick={onClick}
    className={`flex-1 py-3 text-sm font-bold rounded-md transition-all flex items-center justify-center gap-2 ${
      active
        ? "bg-gray-800 text-white shadow-lg ring-1 ring-white/10"
        : "text-gray-400 hover:text-white"
    }`}
  >
    {label}
    {locked && <FaLock className="text-xs opacity-50" />}
  </button>
);

const LicenseCard = ({
  title,
  subtitle,
  selected,
  onClick,
  isPremium,
}: any) => (
  <div
    onClick={onClick}
    className={`cursor-pointer relative p-4 rounded-xl border-2 transition-all duration-300 flex justify-between items-center group ${
      selected
        ? "border-accent bg-accent/10"
        : "border-white/5 bg-white/5 hover:border-white/20"
    }`}
  >
    <div className="flex items-start gap-3">
      <div
        className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
          selected
            ? "border-accent bg-accent text-brand-900"
            : "border-gray-600 group-hover:border-gray-400"
        }`}
      >
        {selected && <FaCheck className="text-[10px]" />}
      </div>
      <div>
        <span
          className={`font-bold block ${isPremium ? "text-accent" : "text-white"}`}
        >
          {title}
        </span>
        <span className="text-xs text-gray-400">{subtitle}</span>
      </div>
    </div>
  </div>
);

export default ProductDetailPage;
