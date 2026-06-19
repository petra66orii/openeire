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

export interface MultipartUploadProgress {
  bytesUploaded: number;
  totalBytes: number;
  percentage: number;
  uploadedParts: number;
  totalParts: number;
}

export interface MultipartUploadResult {
  upload: StartedVideoUpload;
  completion: CompletedVideoUpload;
}
