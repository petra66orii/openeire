import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductDetail, ProductDetailItem } from "../services/api";
import ReviewForm from "../components/ReviewForm";
import ProductReviewList from "../components/ProductReviewList";
import AddToCartForm from "../components/AddToCartForm";

type PurchaseMode = "physical" | "digital";

const ProductDetailPage: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [product, setProduct] = useState<ProductDetailItem | null>(null);

  // 1. New State: distinct mode for buying
  const [purchaseMode, setPurchaseMode] = useState<PurchaseMode>("physical");

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

      // Smart Default: If it's a video, or a photo with NO physical variants, default to digital
      if (data.product_type === "video") {
        setPurchaseMode("digital");
      } else if ("variants" in data && data.variants.length === 0) {
        setPurchaseMode("digital");
      } else {
        setPurchaseMode("physical"); // Default to print if available
      }
    } catch (err) {
      setError("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  }, [type, id]);

  useEffect(() => {
    fetchProductDetail();
  }, [fetchProductDetail]);

  // --- VARIANT LOGIC (Physical) ---
  const variants = useMemo(() => {
    if (!product) return [];
    if ("variants" in product && Array.isArray(product.variants)) {
      return product.variants;
    }
    if ("photo" in product && product.photo && "variants" in product.photo) {
      return product.photo.variants;
    }
    return [];
  }, [product]);

  const uniqueMaterials = useMemo(() => {
    const map = new Map();
    variants.forEach((v) => {
      if (!map.has(v.material)) {
        map.set(v.material, v.material_display);
      }
    });
    return Array.from(map.entries());
  }, [variants]);

  const availableSizes = useMemo(() => {
    return variants
      .filter((v) => v.material === selectedMaterial)
      .map((v) => ({ code: v.size, label: v.size_display }));
  }, [variants, selectedMaterial]);

  const activePhysicalVariant = useMemo(() => {
    return variants.find(
      (v) => v.material === selectedMaterial && v.size === selectedSize
    );
  }, [variants, selectedMaterial, selectedSize]);

  // Set Physical Defaults
  useEffect(() => {
    if (variants.length > 0 && !selectedMaterial) {
      setSelectedMaterial(variants[0].material);
      setSelectedSize(variants[0].size);
    }
  }, [variants, selectedMaterial]);

  // --- CART & PRICING LOGIC ---

  if (loading) return <div className="text-center mt-10">Loading...</div>;
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
      id: activePhysicalVariant.id, // Use Variant ID
      title: `${product.title} (${activePhysicalVariant.material_display} - ${activePhysicalVariant.size_display})`,
      price: activePhysicalVariant.price,
      product_type: "physical",
      preview_image:
        "photo" in product
          ? product.photo.preview_image
          : product.preview_image,
    };
  } else {
    // Digital Mode
    displayPrice =
      digitalLicense === "hd"
        ? (product as any).price_hd
        : (product as any).price_4k;
    activeProductForCart = {
      ...product,
      price: displayPrice,
      title: `${
        product.title
      } (${digitalLicense.toUpperCase()} Digital License)`,
    };
  }

  const reviewProductId =
    product.product_type === "physical" && "photo" in product
      ? String(product.photo.id)
      : String(product.id);

  const reviewProductType =
    product.product_type === "physical" ? "photo" : product.product_type;

  // Image Helper
  let imageUrl = "";
  if (product.product_type === "physical" && "photo" in product) {
    imageUrl = product.photo.preview_image || "";
  } else if ("preview_image" in product) {
    imageUrl = product.preview_image || "";
  } else if ("thumbnail_image" in product) {
    imageUrl = product.thumbnail_image || "";
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="mb-8">
        <Link to="/gallery/physical" className="text-green-600 hover:underline">
          &larr; Back to Gallery
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* LEFT: Media */}
        <div>
          {isVideo && "video_file" in product ? (
            <video
              src={product.video_file}
              controls
              className="w-full rounded-lg shadow-lg"
            >
              Your browser does not support video.
            </video>
          ) : (
            <img
              src={imageUrl}
              alt={product.title}
              className="w-full rounded-lg shadow-lg"
            />
          )}
        </div>

        {/* RIGHT: Details & Selectors */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>
            {"description" in product && (
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 space-y-6">
            {/* 1. FORMAT TOGGLE (Only if both Physical AND Digital exist) */}
            {!isVideo && hasVariants && (
              <div className="flex p-1 bg-gray-200 rounded-lg mb-6">
                <button
                  onClick={() => setPurchaseMode("physical")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                    purchaseMode === "physical"
                      ? "bg-white text-green-700 shadow"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Physical Print
                </button>
                <button
                  onClick={() => setPurchaseMode("digital")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                    purchaseMode === "digital"
                      ? "bg-white text-green-700 shadow"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Digital Download
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
                        (v) => v.material === e.target.value
                      )?.size;
                      if (firstSize) setSelectedSize(firstSize);
                    }}
                    className="w-full border-gray-300 rounded-md shadow-sm p-2 bg-white"
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
                    className="w-full border-gray-300 rounded-md shadow-sm p-2 bg-white"
                  >
                    {availableSizes.map((s) => (
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
                      className={`border rounded-md p-3 text-center ${
                        digitalLicense === "hd"
                          ? "border-green-500 bg-green-50 ring-1 ring-green-500"
                          : "border-gray-300 bg-white"
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
                      className={`border rounded-md p-3 text-center ${
                        digitalLicense === "4k"
                          ? "border-green-500 bg-green-50 ring-1 ring-green-500"
                          : "border-gray-300 bg-white"
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

          {/* Reviews Section */}
          <div className="mt-12 pt-10 border-t">
            <h3 className="text-2xl font-bold mb-6">Reviews</h3>
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
      </div>
    </div>
  );
};

export default ProductDetailPage;
