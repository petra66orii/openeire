import { api } from "@/lib/api/client";
import type {
  CreatePaymentIntentPayload,
  CreatePaymentIntentResponse,
  DiscountValidationPayload,
  DiscountValidationResponse,
} from "@/types/checkout";

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

export const createPaymentIntent = async (
  payload: CreatePaymentIntentPayload,
  signal?: AbortSignal,
): Promise<CreatePaymentIntentResponse> => {
  const response = await api.post<CreatePaymentIntentResponse>(
    "checkout/create-payment-intent/",
    payload,
    {
      cache: "no-store",
      signal,
      // A 401 means authentication rejected the request before intent creation.
      retryOnAuthRefresh: true,
    },
  );
  return response.data;
};
