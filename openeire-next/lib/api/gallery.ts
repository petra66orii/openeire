import { api, isApiError } from "@/lib/api/client";
import type {
  PaginatedResponse,
  PublicGalleryItem,
  PublicGalleryType,
  PublicPhysicalProductDetail,
} from "@/types/gallery";

const GALLERY_REVALIDATE_SECONDS = 300;

export interface GalleryQuery {
  type?: PublicGalleryType;
  collection?: string;
  search?: string;
  sort?: string;
  page?: number | string;
}

const asGalleryPage = (
  payload: PublicGalleryItem[] | PaginatedResponse<PublicGalleryItem>,
): PaginatedResponse<PublicGalleryItem> => {
  if (Array.isArray(payload)) {
    return {
      count: payload.length,
      next: null,
      previous: null,
      results: payload,
    };
  }

  return payload;
};

export const getPublicGalleryItems = async (
  query: GalleryQuery = {},
): Promise<PaginatedResponse<PublicGalleryItem>> => {
  const response = await api.get<
    PublicGalleryItem[] | PaginatedResponse<PublicGalleryItem>
  >("gallery/", {
    params: {
      type: query.type === "all" ? undefined : (query.type ?? "physical"),
      collection:
        !query.collection || query.collection === "all"
          ? undefined
          : query.collection,
      search: query.search,
      sort: query.sort ?? "date_desc",
      page: query.page,
    },
    next: { revalidate: GALLERY_REVALIDATE_SECONDS },
  });

  return asGalleryPage(response.data);
};

export const getPublicPhysicalProduct = async (
  id: string | number,
): Promise<PublicPhysicalProductDetail | null> => {
  try {
    const response = await api.get<PublicPhysicalProductDetail>(
      `products/${id}/`,
      {
        next: { revalidate: GALLERY_REVALIDATE_SECONDS },
      },
    );

    if (response.data.product_type !== "physical") return null;
    return response.data;
  } catch (error) {
    if (
      isApiError(error) &&
      (error.response?.status === 404 ||
        error.response?.status === 401 ||
        error.response?.status === 403)
    ) {
      return null;
    }
    throw error;
  }
};

export const getAllPublicPhysicalProductsForSitemap = async (): Promise<
  PublicGalleryItem[]
> => {
  const products: PublicGalleryItem[] = [];
  let page = 1;

  while (page <= 20) {
    const response = await getPublicGalleryItems({
      type: "physical",
      page,
      sort: "date_desc",
    });
    products.push(...response.results);
    if (!response.next) break;
    page += 1;
  }

  return products;
};
