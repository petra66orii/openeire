import { api } from "@/lib/api/client";
import type {
  GalleryAccessRequestPayload,
  GalleryAccessRequestResponse,
  GalleryAccessVerifyPayload,
  GalleryAccessVerifyResponse,
} from "@/types/galleryAccess";

export const requestGalleryAccess = async (
  payload: GalleryAccessRequestPayload,
): Promise<GalleryAccessRequestResponse> => {
  const response = await api.post<GalleryAccessRequestResponse>(
    "gallery-request/",
    payload,
  );
  return response.data;
};

export const verifyGalleryAccess = async (
  payload: GalleryAccessVerifyPayload,
): Promise<GalleryAccessVerifyResponse> => {
  const response = await api.post<GalleryAccessVerifyResponse>(
    "gallery-verify/",
    payload,
    { retryOnAuthRefresh: true },
  );
  return response.data;
};
