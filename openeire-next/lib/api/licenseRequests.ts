import { api } from "@/lib/api/client";
import type {
  LicenseRequestPayload,
  LicenseRequestResponse,
} from "@/types/licenseRequests";

export const submitLicenseRequest = async (
  payload: LicenseRequestPayload,
): Promise<LicenseRequestResponse> => {
  const response = await api.post<LicenseRequestResponse>(
    "license-requests/",
    payload,
    { retryOnAuthRefresh: true },
  );
  return response.data;
};
