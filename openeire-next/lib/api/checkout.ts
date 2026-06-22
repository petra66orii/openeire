import { api } from "@/lib/api/client";
import type { DiscountValidationPayload, DiscountValidationResponse } from "@/types/checkout";

export const validateDiscountCode = async (
  payload: DiscountValidationPayload,
): Promise<DiscountValidationResponse> => {
  const response = await api.post<DiscountValidationResponse>(
    "checkout/validate-discount/",
    payload,
    {
      cache: "no-store",
      retryOnAuthRefresh: true,
    },
  );
  return response.data;
};

