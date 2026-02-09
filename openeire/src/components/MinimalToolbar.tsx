import React from "react";
import { FaSearch, FaSortAmountDown } from "react-icons/fa";

interface Props {
  onSearch: (q: string) => void;
  onSortChange: (s: string) => void;
}

const MinimalToolbar: React.FC<Props> = ({ onSearch, onSortChange }) => {
  return (
    <div className="container mx-auto px-4 lg:px-8 mb-12">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-brand-200/20 pb-6">
        {/* Search - Minimal Input */}
        <div className="relative w-full md:w-96 group">
          <FaSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            placeholder="Search keywords..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-transparent pl-8 py-2 text-white border-none focus:ring-0 placeholder-gray-500 text-lg font-serif border-b border-gray-700 focus:border-accent transition-colors outline-none"
          />
          <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent group-focus-within:w-full transition-all duration-500" />
        </div>

        {/* Sort - Minimal Text Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">
            Sort By
          </span>
          <div className="relative">
            <select
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none bg-transparent text-white font-medium pr-8 pl-2 py-1 cursor-pointer outline-none hover:text-accent transition-colors text-right"
            >
              <option value="date_desc" className="bg-dark text-gray-300">
                Newest
              </option>
              <option value="price_asc" className="bg-dark text-gray-300">
                Price: Low to High
              </option>
              <option value="price_desc" className="bg-dark text-gray-300">
                Price: High to Low
              </option>
            </select>
            <FaSortAmountDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinimalToolbar;
