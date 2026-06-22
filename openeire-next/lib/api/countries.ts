import { api } from "@/lib/api/client";
import type { Country } from "@/types/auth";

export const getCheckoutCountries = async (
  signal?: AbortSignal,
): Promise<Country[]> => {
  const response = await api.get<Country[]>("auth/countries/", {
    cache: "no-store",
    signal,
  });
  return response.data;
};
