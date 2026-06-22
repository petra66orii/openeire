"use client";

import type { AppliedDiscount } from "@/types/checkout";

interface CheckoutDiscountCardProps {
  value: string;
  onChange: (value: string) => void;
  onApply: () => void;
  onRemove: () => void;
  appliedDiscount: AppliedDiscount | null;
  errorMessage: string | null;
  isApplying: boolean;
  disabled?: boolean;
}

export function CheckoutDiscountCard({
  value,
  onChange,
  onApply,
  onRemove,
  appliedDiscount,
  errorMessage,
  isApplying,
  disabled = false,
}: CheckoutDiscountCardProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-gray-950/90 p-6 shadow-2xl shadow-black/30">
      <h2 className="font-serif text-xl font-bold text-white">Discount Code</h2>
      <p className="mt-2 text-xs leading-relaxed text-gray-500">
        Discounts are validated by the backend and applied only where eligible.
      </p>

      {appliedDiscount ? (
        <div className="mt-5 rounded-xl border border-brand-500/30 bg-brand-500/10 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                Applied
              </p>
              <p className="mt-1 font-bold text-white">{appliedDiscount.code}</p>
              {appliedDiscount.label ? (
                <p className="mt-1 text-xs text-gray-400">
                  {appliedDiscount.label}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400 transition-colors hover:text-red-200"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col">
          <input
            value={value}
            onChange={(event) => onChange(event.target.value.toUpperCase())}
            disabled={disabled || isApplying}
            placeholder="WELCOME10"
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black px-4 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white outline-none transition-colors placeholder:text-gray-700 focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
          />
          <button
            type="button"
            onClick={onApply}
            disabled={disabled || isApplying}
            className="rounded-xl bg-brand-700 px-5 py-3 text-sm font-bold text-paper transition-colors hover:bg-brand-500 disabled:cursor-not-allowed disabled:bg-brand-700/50 disabled:opacity-70"
          >
            {isApplying ? "Applying..." : "Apply"}
          </button>
        </div>
      )}

      {errorMessage ? (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm font-bold text-red-300">
          {errorMessage}
        </div>
      ) : null}
    </section>
  );
}

