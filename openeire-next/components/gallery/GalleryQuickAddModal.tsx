"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { FaShoppingBag, FaTimes } from "react-icons/fa";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/components/ui/ToastProvider";
import { getPublicPhysicalProduct } from "@/lib/api/gallery";
import { formatCartCurrency } from "@/lib/cart/pricing";
import type { CartProductSnapshot } from "@/lib/cart/types";
import {
  formatAnalyticsVariantLabel,
  toAnalyticsMoney,
  trackEcommerceEvent,
} from "@/lib/ecommerceAnalytics";
import { resolveMediaUrl } from "@/lib/media";
import type { ProductVariant, PublicPhysicalProductDetail } from "@/types/gallery";

interface GalleryQuickAddModalProps {
  productId: number;
  onClose: () => void;
}

const customScrollbarStyles = `
  .quick-add-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .quick-add-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }
  .quick-add-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }
  .quick-add-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

export function GalleryQuickAddModal({
  productId,
  onClose,
}: GalleryQuickAddModalProps) {
  const { addToCart, isLoaded: isCartLoaded } = useCart();
  const { showToast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [product, setProduct] = useState<PublicPhysicalProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);

    getPublicPhysicalProduct(productId)
      .then((payload) => {
        if (!isActive) return;
        if (!payload || payload.variants.length === 0) {
          showToast("Could not load product options.", "error");
          onClose();
          return;
        }

        const firstVariant = payload.variants[0];
        setProduct(payload);
        setSelectedMaterial(firstVariant.material);
        setSelectedSize(firstVariant.size);
      })
      .catch(() => {
        if (!isActive) return;
        showToast("Could not load product options.", "error");
        onClose();
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [onClose, productId, showToast]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const selectedVariant = useMemo(
    () =>
      product?.variants.find(
        (variant) =>
          variant.material === selectedMaterial && variant.size === selectedSize,
      ) ?? null,
    [product, selectedMaterial, selectedSize],
  );

  const uniqueMaterials = useMemo(
    () =>
      product
        ? Array.from(new Set(product.variants.map((variant) => variant.material)))
        : [],
    [product],
  );

  const availableSizes = useMemo(
    () =>
      product
        ? product.variants
            .filter((variant) => variant.material === selectedMaterial)
            .map((variant) => variant.size)
        : [],
    [product, selectedMaterial],
  );

  const imageUrl = product
    ? resolveMediaUrl(product.preview_image || product.thumbnail_image)
    : null;

  const selectMaterial = (material: string) => {
    setSelectedMaterial(material);
    const firstMatchingVariant = product?.variants.find(
      (variant) => variant.material === material,
    );
    if (firstMatchingVariant) setSelectedSize(firstMatchingVariant.size);
  };

  const findVariantForSize = (size: string): ProductVariant | undefined =>
    product?.variants.find(
      (variant) => variant.material === selectedMaterial && variant.size === size,
    );

  const findVariantForMaterial = (material: string): ProductVariant | undefined =>
    product?.variants.find((variant) => variant.material === material);

  const handleAddToCart = () => {
    if (!isCartLoaded) return;

    if (!product || !selectedVariant) {
      showToast("Please select a valid option.", "error");
      return;
    }

    const cartProduct: CartProductSnapshot = {
      id: selectedVariant.id,
      title: `${product.title} (${selectedVariant.material_display} - ${selectedVariant.size_display})`,
      product_type: "physical",
      price: selectedVariant.price,
      preview_image: product.preview_image ?? product.thumbnail_image ?? null,
      thumbnail_image: product.thumbnail_image ?? product.preview_image ?? null,
      collection: product.collection ?? null,
    };

    addToCart({
      product: cartProduct,
      quantity: 1,
      options: {
        type: "physical",
        material: selectedMaterial,
        size: selectedSize,
        variantId: selectedVariant.id,
        sourceProductId: product.id,
      },
    });

    const unitPrice = toAnalyticsMoney(selectedVariant.price);
    trackEcommerceEvent("add_to_cart", {
      currency: "EUR",
      ...(unitPrice !== undefined ? { value: unitPrice } : {}),
      items: [
        {
          item_id: String(selectedVariant.id),
          item_name: product.title,
          item_category: "physical",
          item_category2: product.collection || undefined,
          item_variant: formatAnalyticsVariantLabel(
            selectedVariant.material_display,
            selectedVariant.size_display,
          ),
          price: unitPrice,
          quantity: 1,
        },
      ],
    });

    showToast("Added to Bag", "success");
    onClose();
  };

  if (!isMounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-add-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/90 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close quick add"
      />

      <style>{customScrollbarStyles}</style>

      <div className="animate-fade-in-up relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-gray-900 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick add modal"
          className="absolute right-4 top-4 z-50 rounded-full border border-white/10 bg-black/50 p-2 text-white shadow-lg backdrop-blur-md transition-all hover:bg-black/80"
        >
          <FaTimes aria-hidden="true" />
        </button>

        {isLoading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-accent" />
            <span className="sr-only">Loading print options</span>
          </div>
        ) : product ? (
          <>
            <div className="relative h-64 w-full shrink-0 bg-black">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.title}
                  className="h-full w-full object-cover opacity-90 transition-transform duration-700"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
            </div>

            <div className="quick-add-scrollbar flex-1 overflow-y-auto p-8">
              <div className="relative z-10 -mt-16 mb-8 border-b border-white/10 pb-6">
                <span className="mb-3 inline-block rounded bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-900 shadow-lg">
                  Fine Art Print
                </span>
                <h2
                  id="quick-add-title"
                  className="font-serif text-4xl font-bold leading-tight text-white drop-shadow-xl"
                >
                  {product.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="quick-add-material"
                    className="mb-3 block text-xs font-bold uppercase tracking-widest text-gray-500"
                  >
                    Material
                  </label>
                  <div className="relative">
                    <select
                      id="quick-add-material"
                      value={selectedMaterial}
                      onChange={(event) => selectMaterial(event.target.value)}
                      className="w-full cursor-pointer appearance-none rounded-lg border border-white/20 bg-black p-4 text-base font-medium text-white shadow-inner outline-none transition-all hover:border-white/40 focus:border-accent focus:ring-1 focus:ring-accent"
                    >
                      {uniqueMaterials.map((material) => (
                        <option key={material} value={material}>
                          {findVariantForMaterial(material)?.material_display ??
                            material}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="quick-add-size"
                    className="mb-3 block text-xs font-bold uppercase tracking-widest text-gray-500"
                  >
                    Size
                  </label>
                  <div className="relative">
                    <select
                      id="quick-add-size"
                      value={selectedSize}
                      onChange={(event) => setSelectedSize(event.target.value)}
                      className="w-full cursor-pointer appearance-none rounded-lg border border-white/20 bg-black p-4 text-base font-medium text-white shadow-inner outline-none transition-all hover:border-white/40 focus:border-accent focus:ring-1 focus:ring-accent"
                    >
                      {availableSizes.map((size) => (
                        <option key={size} value={size}>
                          {findVariantForSize(size)?.size_display ?? size}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-white/5 bg-white/5 p-5">
                <p className="text-xs leading-relaxed text-gray-400">
                  <strong className="mb-2 block text-sm text-gray-200">
                    Museum Quality Guarantee
                  </strong>
                  All prints are produced on archival-grade paper using
                  pigment-based inks, ensuring colour fidelity for 100+ years.
                </p>
              </div>
            </div>

            <div className="z-10 mt-auto border-t border-white/10 bg-gray-900 p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                <div>
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Total Price
                  </span>
                  <span className="font-serif text-4xl font-bold text-white">
                    {formatCartCurrency(
                      Number.parseFloat(selectedVariant?.price ?? "0"),
                    )}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!isCartLoaded || !selectedVariant}
                  className="flex min-w-[200px] items-center justify-center gap-3 whitespace-nowrap rounded-xl bg-brand-700 px-10 py-4 text-lg font-bold text-paper shadow-lg transition-all hover:bg-brand-900 hover:shadow-xl active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
                >
                  <FaShoppingBag aria-hidden="true" />
                  <span>{isCartLoaded ? "Add to Bag" : "Preparing Bag..."}</span>
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
