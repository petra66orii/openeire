"use client";

import { useMemo, useState } from "react";
import { FaInfoCircle, FaShieldAlt, FaShippingFast } from "react-icons/fa";
import { useCart } from "@/components/cart/CartProvider";
import { PrintMaterialsModal } from "@/components/gallery/PrintMaterialsModal";
import { useToast } from "@/components/ui/ToastProvider";
import { formatCartCurrency } from "@/lib/cart/pricing";
import type { CartProductSnapshot } from "@/lib/cart/types";
import {
  formatAnalyticsVariantLabel,
  toAnalyticsMoney,
  trackEcommerceEvent,
} from "@/lib/ecommerceAnalytics";
import type { ProductVariant } from "@/types/gallery";

export function PhysicalAddToCartPanel({
  productId,
  title,
  previewImage,
  variants,
  onAdded,
}: {
  productId: number;
  title: string;
  previewImage?: string | null;
  variants: ProductVariant[];
  onAdded?: () => void;
}) {
  const { addToCart, isLoaded: isCartLoaded } = useCart();
  const { showToast } = useToast();
  const [selectedMaterial, setSelectedMaterial] = useState(
    variants[0]?.material ?? "",
  );
  const [selectedSize, setSelectedSize] = useState(variants[0]?.size ?? "");
  const [isMaterialsModalOpen, setIsMaterialsModalOpen] = useState(false);

  const selectedVariant = useMemo(
    () =>
      variants.find(
        (variant) =>
          variant.material === selectedMaterial && variant.size === selectedSize,
      ) ?? null,
    [selectedMaterial, selectedSize, variants],
  );
  const materials = useMemo(
    () =>
      Array.from(
        new Map(
          variants.map((variant) => [
            variant.material,
            variant.material_display,
          ]),
        ),
      ),
    [variants],
  );
  const sizes = useMemo(
    () =>
      variants
        .filter((variant) => variant.material === selectedMaterial)
        .map((variant) => ({
          value: variant.size,
          label: variant.size_display,
        })),
    [selectedMaterial, variants],
  );

  const handleMaterialChange = (material: string) => {
    setSelectedMaterial(material);
    const firstMatchingVariant = variants.find(
      (variant) => variant.material === material,
    );
    setSelectedSize(firstMatchingVariant?.size ?? "");
  };

  const handleAddToCart = () => {
    if (!isCartLoaded) return;

    if (!selectedVariant) {
      showToast("Please select a print option before adding to your bag.", "error");
      return;
    }

    const product: CartProductSnapshot = {
      id: selectedVariant.id,
      title: `${title} (${selectedVariant.material_display} - ${selectedVariant.size_display})`,
      product_type: "physical",
      price: selectedVariant.price,
      preview_image: previewImage ?? null,
      thumbnail_image: previewImage ?? null,
    };

    addToCart({
      product,
      quantity: 1,
      options: {
        type: "physical",
        material: selectedVariant.material,
        size: selectedVariant.size,
        variantId: selectedVariant.id,
        sourceProductId: productId,
      },
    });
    const unitPrice = toAnalyticsMoney(selectedVariant.price);
    trackEcommerceEvent("add_to_cart", {
      ...(unitPrice !== undefined ? { value: unitPrice } : {}),
      items: [
        {
          item_id: String(selectedVariant.id),
          item_name: title,
          item_category: "physical",
          item_variant: formatAnalyticsVariantLabel(
            selectedVariant.material_display,
            selectedVariant.size_display,
          ),
          price: unitPrice,
          quantity: 1,
        },
      ],
    });
    showToast("Added to bag.", "success");
    onAdded?.();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="relative">
          <label
            htmlFor="print-material"
            className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
          >
            Material
          </label>
          <select
            id="print-material"
            value={selectedMaterial}
            onChange={(event) => handleMaterialChange(event.target.value)}
            className="w-full cursor-pointer appearance-none rounded-lg border border-white/20 bg-black p-4 pr-10 text-base font-medium text-white shadow-inner outline-none transition-all hover:border-white/40 focus:border-accent focus:ring-1 focus:ring-accent"
          >
            {materials.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute bottom-4 right-4 text-gray-400">
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M19 9l-7 7-7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <button
            type="button"
            onClick={() => setIsMaterialsModalOpen(true)}
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black"
            aria-haspopup="dialog"
            aria-controls="print-materials-modal"
            id="print-materials-modal-trigger"
          >
            <FaInfoCircle aria-hidden="true" />
            <span>About our print materials</span>
          </button>
        </div>

        <div className="relative">
        <label
          htmlFor="print-size"
          className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
        >
          Size
        </label>
        <select
          id="print-size"
          value={selectedSize}
          onChange={(event) => setSelectedSize(event.target.value)}
          className="w-full cursor-pointer appearance-none rounded-lg border border-white/20 bg-black p-4 pr-10 text-base font-medium text-white shadow-inner outline-none transition-all hover:border-white/40 focus:border-accent focus:ring-1 focus:ring-accent"
        >
          {sizes.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute bottom-4 right-4 text-gray-400">
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M19 9l-7 7-7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        </div>
      </div>

      <PrintMaterialsModal
        isOpen={isMaterialsModalOpen}
        onClose={() => setIsMaterialsModalOpen(false)}
      />

      <div className="mt-8 border-t border-white/10 pt-6">
        <div className="mb-6 flex items-end justify-between">
          <span className="text-sm font-medium text-gray-400">Selected</span>
          <span className="font-serif text-4xl font-bold text-white">
            {formatCartCurrency(Number.parseFloat(selectedVariant?.price ?? "0"))}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!isCartLoaded}
          className="flex w-full items-center justify-center rounded-xl bg-brand-700 py-4 text-lg font-bold text-paper shadow-[0_0_20px_rgba(0,196,0,0.2)] transition-all hover:bg-brand-500 active:scale-[0.98] disabled:cursor-wait disabled:bg-brand-700/60 disabled:opacity-75"
        >
          {isCartLoaded ? "Add to Cart" : "Preparing Bag..."}
        </button>

        <p className="mt-4 px-4 text-center text-[11px] leading-relaxed text-gray-500">
          Art prints are sold for personal display only and do not include
          reproduction or commercial usage rights.
        </p>

        <div className="mt-4 flex justify-center gap-6 text-[10px] uppercase tracking-wider text-gray-500">
          <span className="flex items-center gap-1">
            <FaShieldAlt /> Secure
          </span>
          <span className="flex items-center gap-1">
            <FaShippingFast /> IE, US, AU & RO Ship
          </span>
        </div>
      </div>
    </div>
  );
}
