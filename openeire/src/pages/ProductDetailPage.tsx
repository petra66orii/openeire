import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { getProductDetail, ProductDetailItem } from "../services/api";
import ReviewForm from "../components/ReviewForm";
import ProductReviewList from "../components/ProductReviewList";
import AddToCartForm from "../components/AddToCartForm";
import { toast } from "react-toastify";
import { useBreadcrumb } from "../context/BreadcrumbContext";
import RelatedProducts from "../components/RelatedProducts";
import SEOHead from "../components/SEOHead";

type PurchaseMode = "physical" | "digital";

const ProductDetailPage: React.FC = () => {
  // 1. Get Params, Location, and Navigation
  const { type: paramType, id } = useParams<{ type?: string; id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useBreadcrumb();

  // 2. Intelligent Type Detection
  const type = useMemo(() => {
    if (paramType) return paramType;
    if (location.pathname.includes("/physical/")) return "physical";
    if (location.pathname.includes("/photo/")) return "photo";
    if (location.pathname.includes("/video/")) return "video";
    return null;
  }, [paramType, location.pathname]);

  // 3. Check Authentication for Digital Access
  const isDigitalAuthorized = useMemo(() => {
    const session = localStorage.getItem("gallery_access");
    if (!session) return false;
    try {
      const parsed = JSON.parse(session);
      return !!parsed.code;
    } catch {
      return false;
    }
  }, []);

  const [product, setProduct] = useState<ProductDetailItem | null>(null);
  const [purchaseMode, setPurchaseMode] = useState<PurchaseMode>(() => {
    if (type === "photo" || type === "video") return "digital";
    return "physical"; // Default to physical only if URL is physical
  });

  // Physical Selection State
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  // Digital Selection State
  const [digitalLicense, setDigitalLicense] = useState<"hd" | "4k">("hd");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0);

  const fetchProductDetail = useCallback(async () => {
    if (!type || !id) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getProductDetail(type, id);
      setProduct(data);
      setReviewRefreshKey((prev) => prev + 1);

      setBreadcrumbTitle(location.pathname, data.title);

      const hasPhysical = "variants" in data && data.variants.length > 0;
      const isVideo = data.product_type === "video";

      if (isVideo) {
        setPurchaseMode("digital");
      } else if (type === "physical") {
        if (hasPhysical) {
          setPurchaseMode("physical");
        } else {
          setPurchaseMode("digital"); // Fallback if no prints exist
        }
      } else if (type === "photo" || type === "video" || type === "digital") {
        setPurchaseMode("digital");
      } else {
        if (hasPhysical) setPurchaseMode("physical");
        else setPurchaseMode("digital");
      }
    } catch (err) {
      setError("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  }, [type, id, location.pathname, setBreadcrumbTitle]);

  useEffect(() => {
    fetchProductDetail();
  }, [fetchProductDetail]);

  // --- INTERCEPTOR FOR DIGITAL MODE ---
  const handleModeSwitch = (mode: PurchaseMode) => {
    if (mode === "digital" && !isDigitalAuthorized) {
      toast.info("Digital downloads require a private gallery access code.");
      navigate("/gallery-gate", { state: { from: location } });
      return;
    }
    setPurchaseMode(mode);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // --- VARIANT LOGIC (Physical) ---
  const variants = useMemo(() => {
    if (!product) return [];
    if ("variants" in product && Array.isArray(product.variants)) {
      return product.variants;
    }
    if ("photo" in product && product.photo && "variants" in product.photo) {
      return (product.photo as any).variants;
    }
    return [];
  }, [product]);

  const uniqueMaterials = useMemo(() => {
    const map = new Map();
    variants.forEach((v: any) => {
      if (!map.has(v.material)) {
        map.set(v.material, v.material_display);
      }
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

  // --- CART & PRICING LOGIC ---
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );

  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!product)
    return <div className="text-center mt-10">Product not found.</div>;

  const isVideo = product.product_type === "video";
  const hasVariants = variants.length > 0;

  // Calculate Price based on Mode
  let displayPrice = "0.00";
  let activeProductForCart = product;

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
    // Digital Mode
    displayPrice =
      digitalLicense === "hd"
        ? (product as any).price_hd
        : (product as any).price_4k;

    const strictType = product.product_type === "video" ? "video" : "photo";
    activeProductForCart = {
      ...product,
      price: displayPrice,
      title: `${
        product.title
      } (${digitalLicense.toUpperCase()} Digital License)`,
      product_type: strictType,
    };
  }

  const reviewProductId =
    product.product_type === "physical" && "photo" in product
      ? String((product as any).photo.id)
      : String(product.id);

  const reviewProductType =
    product.product_type === "physical" ? "photo" : product.product_type;

  let imageUrl = "";
  if (product.product_type === "physical" && "photo" in product) {
    imageUrl = (product as any).photo.preview_image || "";
  } else if ("preview_image" in product) {
    imageUrl = product.preview_image || "";
  } else if ("thumbnail_image" in product) {
    imageUrl = product.thumbnail_image || "";
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <SEOHead
        title={product.title}
        description={`Buy ${product.title} - Available as High-Res Download or Fine Art Print.`}
        image={product.preview_image}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* LEFT: Media */}
        <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md">
          {isVideo && "video_file" in product ? (
            <video
              src={(product as any).video_file}
              controls
              className="w-full"
              poster={product.thumbnail_image}
            >
              Your browser does not support video.
            </video>
          ) : (
            <img
              src={imageUrl}
              alt={product.title}
              className="w-full h-auto object-cover"
            />
          )}
        </div>

        {/* RIGHT: Details & Selectors */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 font-sans">
              {product.title}
            </h1>
            {"description" in product && (
              <p className="text-gray-600 leading-relaxed font-serif">
                {(product as any).description}
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 space-y-6">
            {/* 1. FORMAT TOGGLE (Protected) */}
            {!isVideo && hasVariants && (
              <div className="flex p-1 bg-gray-200 rounded-lg mb-6">
                <button
                  onClick={() => handleModeSwitch("physical")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                    purchaseMode === "physical"
                      ? "bg-white text-green-700 shadow"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Physical Print
                </button>

                {/* LOCKED DIGITAL BUTTON */}
                <button
                  onClick={() => handleModeSwitch("digital")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${
                    purchaseMode === "digital"
                      ? "bg-white text-green-700 shadow"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Digital Download
                  {!isDigitalAuthorized && (
                    // Lock Icon
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            )}

            {/* 2. PHYSICAL SELECTORS */}
            {purchaseMode === "physical" && hasVariants && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material / Finish
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
                    className="w-full border-gray-300 rounded-md shadow-sm p-3 bg-white"
                  >
                    {uniqueMaterials.map(([code, label]) => (
                      <option key={code} value={code}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size
                  </label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm p-3 bg-white"
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

            {/* 3. DIGITAL SELECTORS */}
            {purchaseMode === "digital" && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setDigitalLicense("hd")}
                      className={`border rounded-md p-3 text-center transition-all ${
                        digitalLicense === "hd"
                          ? "border-green-500 bg-green-50 ring-1 ring-green-500"
                          : "border-gray-300 bg-white hover:border-green-300"
                      }`}
                    >
                      <div className="font-bold text-gray-800">
                        Standard (HD)
                      </div>
                      <div className="text-sm text-gray-500">
                        For Web/Social
                      </div>
                    </button>
                    <button
                      onClick={() => setDigitalLicense("4k")}
                      className={`border rounded-md p-3 text-center transition-all ${
                        digitalLicense === "4k"
                          ? "border-green-500 bg-green-50 ring-1 ring-green-500"
                          : "border-gray-300 bg-white hover:border-green-300"
                      }`}
                    >
                      <div className="font-bold text-gray-800">
                        Commercial (4K)
                      </div>
                      <div className="text-sm text-gray-500">For Print/Ads</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PRICE & ADD TO CART */}
            <div className="pt-6 border-t border-gray-200 mt-6">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <span className="block text-sm text-gray-500">
                    Total Price
                  </span>
                  <span className="text-3xl font-bold text-green-700">
                    €{displayPrice}
                  </span>
                </div>
              </div>
              <AddToCartForm product={activeProductForCart} />
            </div>
          </div>
          {isVideo && (
            <div className="mt-8 mb-8 animate-fadeIn">
              <h3 className="text-lg font-bold text-gray-900 mb-4 font-sans">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                {/* Resolution */}
                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                  <span className="block text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Resolution
                  </span>
                  <span className="font-bold text-gray-800 text-sm">
                    {(product as any).resolution || "N/A"}
                  </span>
                </div>

                {/* Frame Rate */}
                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                  <span className="block text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Frame Rate
                  </span>
                  <span className="font-bold text-gray-800 text-sm">
                    {(product as any).frame_rate || "N/A"}
                  </span>
                </div>

                {/* Duration */}
                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                  <span className="block text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Duration
                  </span>
                  <span className="font-bold text-gray-800 text-sm">
                    {formatDuration((product as any).duration)}
                  </span>
                </div>
              </div>
            </div>
          )}
          {/* Reviews Section */}
          <div className="mt-12 pt-10 border-t">
            <h3 className="text-2xl font-bold mb-6 font-sans">Reviews</h3>
            <ReviewForm
              productType={reviewProductType}
              productId={reviewProductId}
              onReviewSubmitted={fetchProductDetail}
            />
            <ProductReviewList
              productType={reviewProductType}
              productId={reviewProductId}
              refreshKey={reviewRefreshKey}
            />
          </div>
        </div>
        {product && "related_products" in product && (
          <RelatedProducts
            products={(product as any).related_products}
            contextType={purchaseMode === "physical" ? "physical" : "digital"}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
