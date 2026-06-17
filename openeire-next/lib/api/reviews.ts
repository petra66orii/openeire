import { api, isApiError, type ApiRequestConfig } from "@/lib/api/client";
import type {
  ProductReview,
  ReviewProductType,
  ReviewSubmissionResponse,
  ReviewSubmitData,
} from "@/types/reviews";

const reviewPath = (productType: ReviewProductType, productId: string | number) =>
  `${productType}/${productId}/reviews/`;

const firstStringFromValue = (value: unknown): string | null => {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value)) {
    for (const entry of value) {
      const message = firstStringFromValue(entry);
      if (message) return message;
    }
  }
  if (value && typeof value === "object") {
    for (const entry of Object.values(value)) {
      const message = firstStringFromValue(entry);
      if (message) return message;
    }
  }
  return null;
};

export const getReviewErrorMessage = (
  error: unknown,
  fallback = "Failed to submit review.",
): string => {
  if (isApiError(error)) {
    const payload = error.response?.data;
    return firstStringFromValue(payload) ?? error.message ?? fallback;
  }

  return firstStringFromValue(error) ?? fallback;
};

export const getProductReviews = async (
  productType: ReviewProductType,
  productId: string | number,
  config?: ApiRequestConfig,
): Promise<ProductReview[]> => {
  const response = await api.get<ProductReview[]>(
    reviewPath(productType, productId),
    config,
  );

  return Array.isArray(response.data) ? response.data : [];
};

export const submitProductReview = async (
  productType: ReviewProductType,
  productId: string | number,
  data: ReviewSubmitData,
): Promise<ReviewSubmissionResponse> => {
  const response = await api.post<ReviewSubmissionResponse>(
    reviewPath(productType, productId),
    data,
    {
      skipAuthRefresh: true,
    },
  );

  return response.data;
};
