import React from "react";

interface SortDropdownProps {
  onSortChange: (sortKey: string) => void;
}

const sortOptions = [
  { key: "date_desc", label: "Newest" },
  { key: "price_asc", label: "Price: Low to High" },
  { key: "price_desc", label: "Price: High to Low" },
];

const SortDropdown: React.FC<SortDropdownProps> = ({ onSortChange }) => {
  return (
    <div className="flex items-center">
      <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">
        Sort by:
      </label>
      <select
        id="sort"
        name="sort"
        onChange={(e) => onSortChange(e.target.value)}
        className="p-2 border border-gray-300 rounded-md text-sm"
      >
        {sortOptions.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown;
