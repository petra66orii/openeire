import { api } from "@/lib/api/client";
import type { OrderHistory } from "@/types/orders";

export const getOrderHistory = async (): Promise<OrderHistory[]> => {
  const response = await api.get<OrderHistory[]>("checkout/order-history/", {
    retryOnAuthRefresh: true,
  });
  return response.data;
};
