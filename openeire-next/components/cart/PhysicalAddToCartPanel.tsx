"use client";

import { useMemo, useState } from "react";
import { FaShieldAlt, FaShippingFast } from "react-icons/fa";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/components/ui/ToastProvider";
import { formatCartCurrency } from "@/lib/cart/pricing";
import type { CartProductSnapshot } from "@/lib/cart/types";
import type { ProductVariant } from "@/types/gallery";

export function PhysicalAddToCartPanel({
  productId,
  title,
  previewImage,
  variants,
}: {
  productId: number;
  title: string;
  previewImage?: string | null;
  variants: ProductVariant[];
}) {
  const { addToCart, isLoaded: isCartLoaded } = useCart();
  const { showToast } = useToast();
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    variants[0]?.id ?? null,
  );

  const selectedVariant = useMemo(
    () => variants.find((variant) => variant.id === selectedVariantId) ?? null,
    [selectedVariantId, variants],
  );

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
    showToast("Added to bag.", "success");
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="print-option"
          className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
        >
          Available print options
        </label>
        <select
          id="print-option"
          value={selectedVariantId ?? ""}
          onChange={(event) => setSelectedVariantId(Number(event.target.value))}
          className="w-full rounded-xl border border-white/10 bg-black/70 px-4 py-3 text-sm font-semibold text-white outline-none transition-colors focus:border-accent"
        >
          {variants.map((variant) => (
            <option key={variant.id} value={variant.id}>
              {variant.material_display} - {variant.size_display} -{" "}
              {formatCartCurrency(Number.parseFloat(variant.price))}
            </option>
          ))}
        </select>
      </div>

      {selectedVariant ? (
        <div className="rounded-lg border border-white/10 bg-black/40 p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-white">
                {selectedVariant.material_display}
              </p>
              <p className="text-sm text-gray-400">
                {selectedVariant.size_display}
              </p>
            </div>
            <p className="font-serif text-lg font-bold text-white">
              {formatCartCurrency(Number.parseFloat(selectedVariant.price))}
            </p>
          </div>
        </div>
      ) : null}

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
            <FaShippingFast /> US & IE Ship
          </span>
        </div>
      </div>
    </div>
  );
}
