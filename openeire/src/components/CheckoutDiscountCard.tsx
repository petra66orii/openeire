import React from "react";
import { FaTag } from "react-icons/fa";

interface CheckoutDiscountCardProps {
  value: string;
  onChange: (value: string) => void;
  onApply: () => void;
  onRemove: () => void;
  isApplying: boolean;
  appliedCode: string | null;
  discountAmount: number;
  discountLabel: string | null;
  errorMessage: string | null;
  disabled?: boolean;
}

const CheckoutDiscountCard: React.FC<CheckoutDiscountCardProps> = ({
  value,
  onChange,
  onApply,
  onRemove,
  isApplying,
  appliedCode,
  discountAmount,
  discountLabel,
  errorMessage,
  disabled = false,
}) => {
  const hasAppliedDiscount = Boolean(appliedCode && discountAmount > 0);

  return (
    <div className="mb-4 rounded-2xl border border-white/10 bg-gray-900 p-6 shadow-xl">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-full border border-white/10 bg-white/5 p-2 text-accent">
          <FaTag className="text-sm" />
        </div>
        <div>
          <h2 className="font-serif text-lg font-bold text-white">
            Welcome Discount
          </h2>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
            Art prints only
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
            Discount Code
          </span>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="WELCOME10"
              autoCapitalize="characters"
              spellCheck={false}
              disabled={disabled || isApplying}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="button"
              onClick={onApply}
              disabled={disabled || isApplying}
              className="inline-flex min-w-[132px] items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isApplying ? "Applying..." : hasAppliedDiscount ? "Reapply" : "Apply"}
            </button>
          </div>
        </label>

        {hasAppliedDiscount && (
          <div className="rounded-xl border border-brand-500/20 bg-brand-500/10 px-4 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-white">
                  {discountLabel || appliedCode} applied
                </p>
                <p className="mt-1 text-sm text-brand-100/80">
                  You&apos;re saving €{discountAmount.toFixed(2)} on eligible art
                  prints.
                </p>
              </div>
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex items-center justify-center rounded-full border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-gray-300 transition-colors hover:border-white/20 hover:text-white"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </div>
        )}

        <p className="text-xs leading-6 text-gray-500">
          Applies to art prints only. Shipping, digital licences, commercial
          licences, and custom services are excluded.
        </p>
      </div>
    </div>
  );
};

export default CheckoutDiscountCard;
