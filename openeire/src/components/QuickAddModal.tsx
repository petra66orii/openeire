import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { getProductDetail, PhotoDetail } from "../services/api";

interface QuickAddModalProps {
  productId: number;
  onClose: () => void;
}

const QuickAddModal: React.FC<QuickAddModalProps> = ({
  productId,
  onClose,
}) => {
  const { addToCart } = useCart();
  const [product, setProduct] = useState<PhotoDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Selection State
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [price, setPrice] = useState<string>("0.00");

  // 1. Fetch Full Details on Open
  useEffect(() => {
    const loadData = async () => {
      try {
        // 👇 FIX 2: Use the existing generic function with type "physical"
        // We cast it 'as PhotoDetail' because we know this modal is for Prints
        const data = (await getProductDetail(
          "physical",
          productId.toString()
        )) as PhotoDetail;

        setProduct(data);

        // Default to first variant
        if (data.variants && data.variants.length > 0) {
          const first = data.variants[0];
          setSelectedMaterial(first.material);
          setSelectedSize(first.size);
          setPrice(first.price);
        }
      } catch (err) {
        console.error("Failed to load quick view", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [productId]);

  // 2. Handle Selection Logic
  useEffect(() => {
    if (!product) return;
    const variant = product.variants.find(
      (v) => v.material === selectedMaterial && v.size === selectedSize
    );
    if (variant) setPrice(variant.price);
  }, [selectedMaterial, selectedSize, product]);

  // 3. Add to Cart Action
  const handleAddToCart = () => {
    if (!product) return;

    const variant = product.variants.find(
      (v) => v.material === selectedMaterial && v.size === selectedSize
    );

    if (variant) {
      // Construct a "Product" object that has the specific Variant Price
      // This ensures the Cart Context calculates the total correctly.
      const productToAdd = {
        ...product,
        price: variant.price, // OVERWRITE with specific variant price
      };

      const options = {
        material: selectedMaterial,
        size: selectedSize,
        variantId: variant.id,
        details: `${variant.material_display} - ${variant.size_display}`,
        type: "physical",
      };

      // Call the Context function
      addToCart(productToAdd, 1, options);

      onClose();

      toast.success(`${product.title} added to bag!`, {
        style: {
          border: "1px solid #166534",
          padding: "16px",
          color: "#166534",
          background: "#F0FDF4",
        },
        iconTheme: {
          primary: "#166534",
          secondary: "#FFFAEE",
        },
      });
    } else {
      toast.error("Please select a valid size.");
    }
  };

  // Helper lists
  const uniqueMaterials = product
    ? Array.from(new Set(product.variants.map((v) => v.material)))
    : [];

  const availableSizes = product
    ? product.variants
        .filter((v) => v.material === selectedMaterial)
        .map((v) => v.size)
    : [];

  if (!product && !loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-fadeIn">
        {/* Header / Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 z-10 bg-white/80 rounded-full"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {loading ? (
          <div className="p-12 text-center text-gray-500">
            Loading options...
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Image Banner */}
            <div className="h-48 w-full bg-gray-100 relative">
              <img
                src={product?.preview_image}
                alt={product?.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-white font-bold text-xl font-sans">
                  {product?.title}
                </h3>
              </div>
            </div>

            {/* Options Form */}
            <div className="p-6 space-y-4">
              {/* Material Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Material
                </label>
                <div className="flex gap-2">
                  {uniqueMaterials.map((mat) => (
                    <button
                      key={mat}
                      onClick={() => {
                        // 1. Set the new material
                        setSelectedMaterial(mat);

                        // 2. 👇 FIX: Find the first valid size for this new material and auto-select it
                        const firstValidVariant = product?.variants.find(
                          (v) => v.material === mat
                        );
                        if (firstValidVariant) {
                          setSelectedSize(firstValidVariant.size);
                        }
                      }}
                      className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                        selectedMaterial === mat
                          ? "border-green-600 bg-green-50 text-green-700 font-medium"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {
                        product?.variants.find((v) => v.material === mat)
                          ?.material_display
                      }
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Size
                </label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full border-gray-300 rounded-md p-2 text-sm"
                >
                  {availableSizes.map((size) => (
                    <option key={size} value={size}>
                      {
                        product?.variants.find(
                          (v) =>
                            v.size === size && v.material === selectedMaterial
                        )?.size_display
                      }
                    </option>
                  ))}
                </select>
              </div>

              {/* Price & Action */}
              <div className="pt-4 mt-2 border-t flex items-center justify-between">
                <div>
                  <span className="block text-xs text-gray-500">
                    Total Price
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    €{price}
                  </span>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickAddModal;
