import { api } from "./api";

export type VideoUploadPurpose = "master" | "preview";

export interface VideoUploadTarget {
  id: number;
  title: string;
  collection: string;
  is_active: boolean;
}

export interface StartedVideoUpload {
  upload_id: string;
  object_key: string;
  bucket: string;
  part_size: number;
  max_concurrency: number;
  purpose: VideoUploadPurpose;
  target_video_id?: number | null;
}

export interface CompletedVideoUploadPart {
  part_number: number;
  etag: string;
}

export interface CompletedVideoUpload {
  success: boolean;
  object_key: string;
  status: string;
  video_id?: number | null;
}

export const requestVideoUploadStart = async (payload: {
  filename: string;
  content_type: string;
  file_size: number;
  purpose: VideoUploadPurpose;
  target_video_id?: number | null;
}): Promise<StartedVideoUpload> => {
  const response = await api.post<StartedVideoUpload>("uploads/videos/start/", payload);
  return response.data;
};

export const requestVideoUploadPartUrl = async (payload: {
  upload_id: string;
  object_key: string;
  part_number: number;
}): Promise<{ url: string }> => {
  const response = await api.post<{ url: string }>("uploads/videos/part-url/", payload);
  return response.data;
};

export const completeVideoUpload = async (payload: {
  upload_id: string;
  object_key: string;
  parts: CompletedVideoUploadPart[];
}): Promise<CompletedVideoUpload> => {
  const response = await api.post<CompletedVideoUpload>(
    "uploads/videos/complete/",
    payload,
  );
  return response.data;
};

export const abortVideoUpload = async (payload: {
  upload_id: string;
  object_key: string;
}): Promise<{ success: boolean; status: string }> => {
  const response = await api.post<{ success: boolean; status: string }>(
    "uploads/videos/abort/",
    payload,
  );
  return response.data;
};

export const searchVideoUploadTargets = async (
  query = "",
): Promise<VideoUploadTarget[]> => {
  const response = await api.get<VideoUploadTarget[]>("uploads/videos/targets/", {
    params: query ? { query } : undefined,
  });
  return response.data;
};
