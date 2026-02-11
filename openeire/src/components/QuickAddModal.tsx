import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { getProductDetail, PhotoDetail } from "../services/api";
import { useCart } from "../context/CartContext";
import { FaTimes, FaCheck, FaShoppingBag } from "react-icons/fa";
import toast from "react-hot-toast";

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

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = (await getProductDetail(
          "physical",
          productId.toString(),
        )) as PhotoDetail;
        setProduct(data);

        if (data.variants && data.variants.length > 0) {
          const first = data.variants[0];
          setSelectedMaterial(first.material);
          setSelectedSize(first.size);
          setPrice(first.price);
        }
      } catch (err) {
        console.error("Failed to load quick view", err);
        toast.error("Could not load product options");
        onClose();
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [productId, onClose]);

  useEffect(() => {
    if (!product) return;
    const variant = product.variants.find(
      (v) => v.material === selectedMaterial && v.size === selectedSize,
    );
    if (variant) setPrice(variant.price);
  }, [selectedMaterial, selectedSize, product]);

  const handleAddToCart = () => {
    if (!product) return;
    const variant = product.variants.find(
      (v) => v.material === selectedMaterial && v.size === selectedSize,
    );

    if (!variant) {
      toast.error("Please select a valid option");
      return;
    }

    const cartItem = {
      ...product,
      id: variant.id,
      price: variant.price,
      title: `${product.title} (${variant.material_display} - ${variant.size_display})`,
      product_type: "physical" as const,
      preview_image: product.preview_image,
    };

    addToCart(cartItem, 1);
    toast.success("Added to Bag");
    onClose();
  };

  const uniqueMaterials = product
    ? Array.from(new Set(product.variants.map((v) => v.material)))
    : [];

  const availableSizes = product
    ? product.variants
        .filter((v) => v.material === selectedMaterial)
        .map((v) => v.size)
    : [];

  if (!product && !loading) return null;

  // MODAL CONTENT
  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Dark Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>

      {/* MAIN CONTAINER */}
      <div className="relative bg-gray-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-all backdrop-blur-md border border-white/10 shadow-lg"
        >
          <FaTimes />
        </button>

        {loading ? (
          <div className="h-96 flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : (
          <>
            {/* 1. CINEMATIC HEADER WITH GRADIENT */}
            <div className="relative h-64 w-full shrink-0 bg-black group">
              <img
                src={product?.preview_image}
                alt={product?.title}
                className="w-full h-full object-cover opacity-90 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
            </div>

            {/* 2. CONTENT BODY */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
              {/* Header Info */}
              <div className="mb-8 border-b border-white/10 pb-6 relative z-10 -mt-16">
                <span className="inline-block px-3 py-1 mb-3 text-[10px] font-bold uppercase tracking-widest text-brand-900 bg-accent rounded shadow-lg">
                  Fine Art Print
                </span>
                <h3 className="text-white font-serif font-bold text-4xl leading-tight drop-shadow-xl">
                  {product?.title}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* LEFT: Paper Type */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                    Paper Type
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {uniqueMaterials.map((mat) => {
                      const isActive = selectedMaterial === mat;
                      const label = product?.variants.find(
                        (v) => v.material === mat,
                      )?.material_display;

                      return (
                        <button
                          key={mat}
                          onClick={() => {
                            setSelectedMaterial(mat);
                            const firstValid = product?.variants.find(
                              (v) => v.material === mat,
                            );
                            if (firstValid) setSelectedSize(firstValid.size);
                          }}
                          className={`w-full relative px-5 py-4 text-sm rounded-lg border text-left transition-all duration-200 flex items-center justify-between group ${
                            isActive
                              ? "border-accent bg-accent/10 text-white shadow-md ring-1 ring-accent/50"
                              : "border-white/10 bg-white/5 text-gray-400 hover:border-white/30 hover:bg-white/10"
                          }`}
                        >
                          <span className="font-bold leading-tight">
                            {label}
                          </span>
                          {isActive && (
                            <FaCheck className="text-accent text-sm shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* RIGHT: Size & Info */}
                <div className="flex flex-col">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                    Select Size
                  </label>
                  <div className="relative mb-6">
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full appearance-none bg-black border border-white/20 rounded-lg p-4 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none cursor-pointer text-base font-medium transition-all hover:border-white/40 shadow-inner"
                    >
                      {availableSizes.map((size) => (
                        <option key={size} value={size}>
                          {
                            product?.variants.find(
                              (v) =>
                                v.size === size &&
                                v.material === selectedMaterial,
                            )?.size_display
                          }
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>

                  <div className="bg-white/5 p-5 rounded-xl border border-white/5 mt-auto">
                    <p className="text-xs text-gray-400 leading-relaxed">
                      <strong className="text-gray-200 block mb-2 text-sm">
                        Museum Quality Guarantee
                      </strong>
                      All prints are produced on archival-grade paper using
                      pigment-based inks, ensuring color fidelity for 100+
                      years.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. FOOTER */}
            <div className="p-8 border-t border-white/10 bg-gray-900 mt-auto z-10">
              <div className="flex items-center justify-between gap-8">
                <div>
                  <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1 font-bold">
                    Total Price
                  </span>
                  <span className="text-4xl font-serif font-bold text-white">
                    €{price}
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="px-10 py-4 bg-accent hover:bg-white text-brand-900 font-bold rounded-xl transition-all transform active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg whitespace-nowrap min-w-[200px]"
                >
                  <FaShoppingBag />
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default QuickAddModal;
