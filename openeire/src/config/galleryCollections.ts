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
    id: "ireland",
    label: "Ireland",
    image: "/ireland-gallery-card.webp",
    isAvailable: true,
  },
  {
    id: "new zealand",
    label: "New Zealand",
    image: "/new-zealand-gallery-card.webp",
    isAvailable: true,
  },
  {
    id: "thailand",
    label: "Thailand",
    image: "/thailand-gallery-card.webp",
    isAvailable: true,
  },
  {
    id: "romania",
    label: "Romania",
    image: "/romania-gallery-card.webp",
    isAvailable: true,
  },
  {
    id: "australia",
    label: "Australia",
    image: "/australia-gallery-card.webp",
    isAvailable: true,
  },
];

export const GALLERY_COLLECTION_LABELS: Record<string, string> =
  Object.fromEntries(
    GALLERY_COLLECTIONS.map(({ id, label }) => [id, label]),
  );

export const isGalleryCollectionAvailable = (collectionId: string): boolean => {
  const collection = GALLERY_COLLECTIONS.find(({ id }) => id === collectionId);
  return collection?.isAvailable !== false;
};
