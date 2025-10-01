import React from "react";

interface CollectionFilterProps {
  activeCollection: string;
  onSelectCollection: (collection: string) => void;
}

// For now, we'll hardcode the collections. We can fetch these from the API later.
const collections = ["All", "Ireland", "New Zealand", "Thailand"];

const CollectionFilter: React.FC<CollectionFilterProps> = ({
  activeCollection,
  onSelectCollection,
}) => {
  return (
    <div className="flex justify-center space-x-2 sm:space-x-4 mb-8">
      {collections.map((collection) => (
        <button
          key={collection}
          onClick={() => onSelectCollection(collection.toLowerCase())}
          className={`px-4 py-2 text-sm sm:text-base font-semibold rounded-full transition-colors duration-200 ${
            activeCollection.toLowerCase() === collection.toLowerCase()
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {collection}
        </button>
      ))}
    </div>
  );
};

export default CollectionFilter;
