export interface GalleryCollectionConfig {
  id: string;
  label: string;
  image: string;
  isAvailable?: boolean;
}

export const GALLERY_COLLECTIONS: GalleryCollectionConfig[] = [
  {
    id: "all",
    label: "All Footage",
    image: "/all-gallery-card.webp",
    isAvailable: true,
  },
  {
    id: "Ireland",
    label: "Ireland",
    image: "/ireland-gallery-card.webp",
    isAvailable: true,
  },
  {
    id: "New Zealand",
    label: "New Zealand",
    image: "/new-zealand-gallery-card.webp",
    isAvailable: true,
  },
  {
    id: "Thailand",
    label: "Thailand",
    image: "/thailand-gallery-card.webp",
    isAvailable: true,
  },
  {
    id: "Romania",
    label: "Romania",
    image: "/romania-gallery-card.webp",
    isAvailable: true,
  },
  {
    id: "Australia",
    label: "Australia",
    image: "/australia-gallery-card.webp",
    isAvailable: true,
  },
];

export const getCollectionLabel = (collection?: string | null): string => {
  if (!collection || collection === "all") return "Gallery";
  return (
    GALLERY_COLLECTIONS.find(
      (item) => item.id.toLowerCase() === collection.toLowerCase(),
    )?.label ?? collection
  );
};

export const isGalleryCollectionAvailable = (
  collectionId?: string | null,
): boolean => {
  if (!collectionId || collectionId === "all") return true;
  const collection = GALLERY_COLLECTIONS.find(
    ({ id }) => id.toLowerCase() === collectionId.toLowerCase(),
  );
  return collection?.isAvailable !== false;
};
