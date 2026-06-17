import { api } from "@/lib/api/client";
import type {
  ChangePasswordPayload,
  Country,
  DeleteAccountPayload,
  MessageResponse,
  ProfileUpdatePayload,
  UserProfile,
} from "@/types/auth";

export const updateProfile = async (
  payload: ProfileUpdatePayload,
): Promise<UserProfile> => {
  const response = await api.patch<UserProfile>("auth/profile/", payload, {
    retryOnAuthRefresh: true,
  });
  return response.data;
};

export const changePassword = async (
  payload: ChangePasswordPayload,
): Promise<MessageResponse> => {
  const response = await api.put<MessageResponse>(
    "auth/password/change/",
    payload,
    { retryOnAuthRefresh: true },
  );
  return response.data;
};

export const deleteAccount = async (
  payload: DeleteAccountPayload,
): Promise<MessageResponse | undefined> => {
  const response = await api.delete<MessageResponse | undefined>("auth/delete/", {
    data: payload,
    retryOnAuthRefresh: true,
  });
  return response.data;
};

export const getCountries = async (): Promise<Country[]> => {
  const response = await api.get<Country[]>("auth/countries/");
  return response.data;
};
