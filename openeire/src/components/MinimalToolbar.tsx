import React from "react";
import { FaSearch, FaSortAmountDown } from "react-icons/fa";

export type GalleryMediaFilter = "all" | "photos" | "videos";

interface Props {
  onSearch: (q: string) => void;
  onSortChange: (s: string) => void;
  mediaFilter?: GalleryMediaFilter;
  onMediaFilterChange?: (filter: GalleryMediaFilter) => void;
  showMediaFilter?: boolean;
}

const sortOptions = [
  { value: "date_desc", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

const mediaFilterOptions: Array<{
  value: GalleryMediaFilter;
  label: string;
  helper: string;
}> = [
  { value: "all", label: "All", helper: "Everything" },
  { value: "photos", label: "Photos", helper: "Still imagery" },
  { value: "videos", label: "Videos", helper: "Motion clips" },
];

const MinimalToolbar: React.FC<Props> = ({
  onSearch,
  onSortChange,
  mediaFilter = "all",
  onMediaFilterChange,
  showMediaFilter = false,
}) => {
  return (
    <div className="container mx-auto px-4 lg:px-8 mb-8 sm:mb-10 lg:mb-12">
      <div className="rounded-[28px] border border-white/10 bg-white/5 px-4 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:px-5 sm:py-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-400">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              Search gallery
            </div>
            <label className="group relative block">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-accent" />
              <input
                type="text"
                placeholder="Search by keyword, location, or collection..."
                aria-label="Search gallery keywords"
                onChange={(e) => onSearch(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 py-3 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-gray-500 focus:border-accent/60 focus:bg-black/55 sm:text-base"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-[220px]">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
                Sort by
              </div>
              <div className="relative">
                <select
                  aria-label="Sort gallery products"
                  onChange={(e) => onSortChange(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 pr-11 text-sm font-medium text-white outline-none transition-all hover:border-white/20 focus:border-accent/60 sm:text-base"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-dark text-gray-200">
                      {option.label}
                    </option>
                  ))}
                </select>
                <FaSortAmountDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {showMediaFilter && onMediaFilterChange && (
          <div className="mt-5 border-t border-white/10 pt-5">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
                  Media type
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Narrow the stock footage gallery to stills or motion clips.
                </p>
              </div>
              <div className="hidden rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-gray-400 md:block">
                {mediaFilterOptions.find((option) => option.value === mediaFilter)?.helper}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {mediaFilterOptions.map((option) => {
                const isActive = mediaFilter === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onMediaFilterChange(option.value)}
                    aria-pressed={isActive}
                    className={`group rounded-2xl border px-4 py-3 text-left transition-all ${
                      isActive
                        ? "border-accent/60 bg-accent/10 text-white shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
                        : "border-white/10 bg-black/25 text-gray-300 hover:border-white/20 hover:bg-black/35 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold tracking-wide">
                        {option.label}
                      </span>
                      <span
                        className={`h-2.5 w-2.5 rounded-full transition-colors ${
                          isActive ? "bg-accent" : "bg-gray-600 group-hover:bg-gray-400"
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-[0.22em] text-gray-500">
                      {option.helper}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinimalToolbar;
