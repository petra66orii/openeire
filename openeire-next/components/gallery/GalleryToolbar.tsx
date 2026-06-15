import { FaSearch, FaSortAmountDown } from "react-icons/fa";

const sortOptions = [
  { value: "date_desc", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export function GalleryToolbar({
  search,
  sort,
  collection,
}: {
  search?: string;
  sort?: string;
  collection?: string;
}) {
  return (
    <div className="container mx-auto mb-8 px-4 sm:mb-10 lg:mb-12 lg:px-8">
      <form
        action="/gallery/physical"
        className="rounded-[28px] border border-white/10 bg-white/5 px-4 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:px-5 sm:py-5"
      >
        <input type="hidden" name="collection" value={collection ?? ""} />
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
                name="search"
                defaultValue={search}
                placeholder="Search by keyword, location, or collection..."
                aria-label="Search gallery keywords"
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
                  name="sort"
                  aria-label="Sort gallery products"
                  defaultValue={sort ?? "date_desc"}
                  className="w-full appearance-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 pr-11 text-sm font-medium text-white outline-none transition-all hover:border-white/20 focus:border-accent/60 sm:text-base"
                >
                  {sortOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-dark text-gray-200"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                <FaSortAmountDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              className="rounded-2xl bg-brand-700 px-6 py-3 text-sm font-bold text-paper transition-colors hover:bg-brand-900 sm:text-base"
            >
              Apply
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
