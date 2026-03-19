import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getGalleryProducts, GalleryItem } from "../services/api";
import ProductCard from "../components/ProductCard";
import VisualCategoryHero from "../components/VisualCategoryHero";
import MinimalToolbar from "../components/MinimalToolbar";

type GalleryType = "digital" | "physical" | "all";

// Define Breakpoints for columns
const breakpointColumnsObj = {
  default: 4, // 4 columns on big screens
  1100: 3,
  700: 2,
  500: 1, // 1 column on mobile
};
const MASONRY_GAP_PX = 32;
const COLLECTION_LABELS: Record<string, string> = {
  all: "All Footage",
  ireland: "Ireland",
  "new zealand": "New Zealand",
  thailand: "Thailand",
  romania: "Romania",
  australia: "Australia",
};
const COMING_SOON_COLLECTIONS = new Set(["australia"]);

const getColumnCount = (width: number): number => {
  if (width <= 500) return breakpointColumnsObj[500];
  if (width <= 700) return breakpointColumnsObj[700];
  if (width <= 1100) return breakpointColumnsObj[1100];
  return breakpointColumnsObj.default;
};

const getProductKey = (product: GalleryItem): string =>
  `${product.product_type}-${product.id}`;

interface VirtualizedVisibleCardProps {
  product: GalleryItem;
  top: number;
  productKey: string;
  onModalOpen: () => void;
  onModalClose: () => void;
  onHeightMeasured: (key: string, height: number) => void;
}

const VirtualizedVisibleCard: React.FC<VirtualizedVisibleCardProps> = ({
  product,
  top,
  productKey,
  onModalOpen,
  onModalClose,
  onHeightMeasured,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const node = contentRef.current;
    const measure = () => {
      const height = node.getBoundingClientRect().height;
      if (height > 0) {
        onHeightMeasured(productKey, height);
      }
    };

    measure();

    if (typeof ResizeObserver === "undefined") return;
    const resizeObserver = new ResizeObserver(() => measure());
    resizeObserver.observe(node);
    return () => resizeObserver.disconnect();
  }, [onHeightMeasured, productKey]);

  return (
    <div
      ref={contentRef}
      style={{ position: "absolute", top, left: 0, right: 0 }}
    >
      <ProductCard
        product={product}
        onModalOpen={onModalOpen}
        onModalClose={onModalClose}
      />
    </div>
  );
};

const GalleryPage: React.FC = () => {
  const { type: paramType } = useParams<{ type?: string }>();
  const location = useLocation();

  // 1. Determine Type (Same logic as before)
  const type: GalleryType = useMemo(() => {
    if (paramType === "digital" || paramType === "physical") return paramType;
    if (location.pathname.includes("/digital")) return "digital";
    if (location.pathname.includes("/photo")) return "digital";
    if (location.pathname.includes("/video")) return "digital";
    if (location.pathname.includes("/physical")) return "physical";
    return "all";
  }, [paramType, location.pathname]);

  const [products, setProducts] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [collection, setCollection] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState("date_desc");
  const [isGridHovered, setIsGridHovered] = useState(false);
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);
  const [modalOwnerKey, setModalOwnerKey] = useState<string | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState<number>(() =>
    typeof window === "undefined"
      ? breakpointColumnsObj.default
      : getColumnCount(window.innerWidth),
  );
  const [scrollY, setScrollY] = useState<number>(() =>
    typeof window === "undefined" ? 0 : window.scrollY,
  );
  const [viewportHeight, setViewportHeight] = useState<number>(() =>
    typeof window === "undefined" ? 0 : window.innerHeight,
  );
  const [gridTop, setGridTop] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [measuredHeights, setMeasuredHeights] = useState<Record<string, number>>({});
  const normalizedSearchTerm = searchTerm.trim();

  const measureGridMetrics = useCallback(() => {
    if (!gridRef.current || typeof window === "undefined") return;
    const rect = gridRef.current.getBoundingClientRect();
    const nextTop = rect.top + window.scrollY;
    setGridTop((prev) => (Math.abs(prev - nextTop) < 1 ? prev : nextTop));
    setContainerWidth((prev) =>
      Math.abs(prev - rect.width) < 1 ? prev : rect.width,
    );
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let scrollRafId: number | null = null;

    const syncScrollPosition = () => {
      scrollRafId = null;
      setScrollY(window.scrollY);
    };

    const requestScrollSync = () => {
      if (scrollRafId !== null) return;
      scrollRafId = window.requestAnimationFrame(syncScrollPosition);
    };

    const syncViewportSize = () => {
      setViewportHeight(window.innerHeight);
      measureGridMetrics();
      setColumnCount((prev) => {
        const next = getColumnCount(window.innerWidth);
        return prev === next ? prev : next;
      });
    };

    setScrollY(window.scrollY);
    syncViewportSize();
    window.addEventListener("scroll", requestScrollSync, { passive: true });
    window.addEventListener("resize", syncViewportSize);

    return () => {
      if (scrollRafId !== null) {
        window.cancelAnimationFrame(scrollRafId);
      }
      window.removeEventListener("scroll", requestScrollSync);
      window.removeEventListener("resize", syncViewportSize);
    };
  }, [measureGridMetrics]);

  useEffect(() => {
    if (!gridRef.current || !pageRef.current || typeof window === "undefined")
      return;

    measureGridMetrics();

    if (typeof ResizeObserver === "undefined") return;
    const resizeObserver = new ResizeObserver(() => measureGridMetrics());
    resizeObserver.observe(gridRef.current);
    resizeObserver.observe(pageRef.current);
    return () => resizeObserver.disconnect();
  }, [measureGridMetrics, columnCount, products.length, loading]);

  const columnWidth = useMemo(() => {
    if (columnCount <= 0 || containerWidth <= 0) return 0;
    const totalGapWidth = (columnCount - 1) * MASONRY_GAP_PX;
    const availableWidth = Math.max(0, containerWidth - totalGapWidth);
    return availableWidth / columnCount;
  }, [columnCount, containerWidth]);

  const layoutKey = useMemo(
    () => `${columnCount}-${Math.round(columnWidth)}`,
    [columnCount, columnWidth],
  );

  useEffect(() => {
    const activeKeys = new Set(products.map((product) => getProductKey(product)));
    const currentLayoutPrefix = `${layoutKey}|`;
    setMeasuredHeights((prev) => {
      let changed = false;
      const next: Record<string, number> = {};

      for (const [key, value] of Object.entries(prev)) {
        const separatorIndex = key.indexOf("|");
        const productKey =
          separatorIndex >= 0 ? key.slice(separatorIndex + 1) : key;
        if (activeKeys.has(productKey) && key.startsWith(currentLayoutPrefix)) {
          next[key] = value;
        } else {
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [products, layoutKey]);

  useEffect(() => {
    if (!modalOwnerKey) return;
    const ownerStillPresent = products.some(
      (product) => getProductKey(product) === modalOwnerKey,
    );
    if (ownerStillPresent) return;
    setModalOwnerKey(null);
    setIsAnyModalOpen(false);
  }, [products, modalOwnerKey]);

  const columns = useMemo<
    Array<Array<{ product: GalleryItem; index: number; productKey: string }>>
  >(() => {
    const grouped = Array.from({ length: columnCount }, () => [] as Array<{
      product: GalleryItem;
      index: number;
      productKey: string;
    }>);
    products.forEach((product, index) => {
      grouped[index % columnCount].push({
        product,
        index,
        productKey: getProductKey(product),
      });
    });
    return grouped;
  }, [products, columnCount]);

  const estimatedCardHeight = useMemo(() => {
    const mediaHeight = columnWidth > 0 ? columnWidth * 0.75 : 240;
    return Math.round(mediaHeight + 126);
  }, [columnWidth]);

  const virtualizationOverscanPx = useMemo(() => {
    if (viewportHeight <= 0) return 800;
    return columnCount === 1
      ? Math.max(480, Math.round(viewportHeight * 0.9))
      : Math.max(700, Math.round(viewportHeight * 1.2));
  }, [columnCount, viewportHeight]);

  const visibleTop = scrollY - gridTop - virtualizationOverscanPx;
  const visibleBottom =
    scrollY - gridTop + viewportHeight + virtualizationOverscanPx;

  const handleHeightMeasured = useCallback(
    (productKey: string, height: number) => {
      const key = `${layoutKey}|${productKey}`;
      const normalizedHeight = Math.round(height);
      setMeasuredHeights((prev) => {
        const current = prev[key] ?? 0;
        if (Math.abs(current - normalizedHeight) < 4) return prev;
        return { ...prev, [key]: normalizedHeight };
      });
    },
    [layoutKey],
  );

  const columnLayouts = useMemo(
    () =>
      columns.map((column) => {
        let offset = 0;
        const items = column.map((entry) => {
          const height =
            measuredHeights[`${layoutKey}|${entry.productKey}`] ??
            estimatedCardHeight;
          const top = offset;
          offset += height + MASONRY_GAP_PX;

          return {
            ...entry,
            top,
            height,
          };
        });

        const totalHeight = Math.max(0, offset - MASONRY_GAP_PX);
        // Intentional virtualization: keep only near-viewport cards mounted.
        // The modal owner stays mounted while quick-add is open to avoid modal teardown on scroll.
        const visibleItems = items.filter(
          (item) =>
            item.productKey === modalOwnerKey ||
            (item.top + item.height >= visibleTop && item.top <= visibleBottom),
        );

        return {
          totalHeight,
          visibleItems,
        };
      }),
    [
      columns,
      measuredHeights,
      layoutKey,
      estimatedCardHeight,
      modalOwnerKey,
      visibleTop,
      visibleBottom,
    ],
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      if (COMING_SOON_COLLECTIONS.has(collection)) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const response = await getGalleryProducts(
          type,
          collection,
          normalizedSearchTerm || undefined,
          sortOrder,
        );

        // Handle both paginated (response.results) and non-paginated (array) formats
        const scrubDigitalPricing = (items: GalleryItem[]) =>
          items.map((item) =>
            item.product_type === "physical"
                ? item
                : {
                    ...item,
                    price: "",
                    price_hd: undefined,
                    price_4k: undefined,
                    starting_price: undefined,
                  },
          );

        if (Array.isArray(response)) {
          setProducts(scrubDigitalPricing(response));
        } else if (response && response.results) {
          setProducts(scrubDigitalPricing(response.results));
        } else {
          // Fallback for empty or unexpected structure
          setProducts([]);
        }
      } catch (err) {
        console.error("Gallery Error:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [type, collection, normalizedSearchTerm, sortOrder]);

  return (
    // Dark mode background for the gallery canvas
    <div ref={pageRef} className="bg-black min-h-screen pb-20">
      {/* 1. 3D SWIPER HERO (Controls Collection State) */}
      <VisualCategoryHero
        activeCollection={collection}
        onSelectCollection={setCollection}
        isPaused={isGridHovered || isAnyModalOpen}
      />

      {/* 2. MINIMAL TOOLBAR (Search & Sort) */}
      <MinimalToolbar onSearch={setSearchTerm} onSortChange={setSortOrder} />

      <div
        ref={gridRef}
        className="container mx-auto px-4 lg:px-8 relative z-10"
        onMouseEnter={() => setIsGridHovered(true)}
        onMouseLeave={() => setIsGridHovered(false)}
      >
        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        )}

        {/* Masonry Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="flex w-full items-start gap-8">
            {columnLayouts.map((layout, columnIndex) => (
              <div
                key={`gallery-column-${columnIndex}`}
                className="min-w-0 bg-clip-padding"
                style={{
                  position: "relative",
                  minHeight: layout.totalHeight,
                  flex: "1 1 0",
                }}
              >
                {layout.visibleItems.map(({ product, productKey, top }) => (
                  <VirtualizedVisibleCard
                    key={`${layoutKey}|${productKey}`}
                    productKey={productKey}
                    product={product}
                    top={top}
                    onModalOpen={() => {
                      setModalOwnerKey(productKey);
                      setIsAnyModalOpen(true);
                    }}
                    onModalClose={() => {
                      setModalOwnerKey((prev) =>
                        prev === productKey ? null : prev,
                      );
                      setIsAnyModalOpen(false);
                    }}
                    onHeightMeasured={handleHeightMeasured}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="py-20 text-center">
            {normalizedSearchTerm ? (
              <div className="text-gray-500">No results found.</div>
            ) : collection !== "all" ? (
              <>
                <div className="text-2xl font-serif font-bold text-white">
                  {COLLECTION_LABELS[collection] ?? "This collection"} is coming
                  soon!
                </div>
                <p className="mt-3 text-gray-500">
                  We&apos;re curating this collection now. Check back soon for
                  new releases.
                </p>
              </>
            ) : (
              <div className="text-gray-500">No results found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
