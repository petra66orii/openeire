import axios from "axios";
import {
  abortVideoUpload,
  completeVideoUpload,
  requestVideoUploadPartUrl,
  requestVideoUploadStart,
  type CompletedVideoUpload,
  type CompletedVideoUploadPart,
  type StartedVideoUpload,
  type VideoUploadPurpose,
} from "../services/videoUploads";

const DEFAULT_RETRY_LIMIT = 3;

const R2_CORS_ERROR_MESSAGE =
  "Upload blocked by Cloudflare R2 CORS. Allow this frontend origin on the target bucket and expose the ETag header.";

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

interface UploadMultipartVideoOptions {
  file: File;
  purpose: VideoUploadPurpose;
  targetVideoId?: number | null;
  retryLimit?: number;
  onProgress?: (progress: MultipartUploadProgress) => void;
  onStatusChange?: (status: string) => void;
}

const buildProgressSnapshot = (
  partProgress: Map<number, number>,
  totalBytes: number,
  uploadedParts: number,
  totalParts: number,
): MultipartUploadProgress => {
  const bytesUploaded = Array.from(partProgress.values()).reduce(
    (sum, current) => sum + current,
    0,
  );

  return {
    bytesUploaded,
    totalBytes,
    percentage: totalBytes > 0 ? Math.min(100, (bytesUploaded / totalBytes) * 100) : 0,
    uploadedParts,
    totalParts,
  };
};

const sortCompletedParts = (
  completedParts: Map<number, string>,
): CompletedVideoUploadPart[] =>
  Array.from(completedParts.entries())
    .sort(([partA], [partB]) => partA - partB)
    .map(([part_number, etag]) => ({ part_number, etag }));

const getMultipartUploadErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const requestUrl = typeof error.config?.url === "string" ? error.config.url : "";
    const isDirectR2Request =
      requestUrl.startsWith("http://") || requestUrl.startsWith("https://");

    if ((error.code === "ERR_NETWORK" || !error.response) && isDirectR2Request) {
      return R2_CORS_ERROR_MESSAGE;
    }

    if (error.response?.status === 403 && isDirectR2Request) {
      return R2_CORS_ERROR_MESSAGE;
    }

    const detail =
      (typeof error.response?.data?.detail === "string" && error.response.data.detail) ||
      (typeof error.response?.data?.message === "string" && error.response.data.message);

    if (detail) {
      return detail;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Video upload failed.";
};

export const createMultipartVideoUpload = ({
  file,
  purpose,
  targetVideoId,
  retryLimit = DEFAULT_RETRY_LIMIT,
  onProgress,
  onStatusChange,
}: UploadMultipartVideoOptions) => {
  const abortController = new AbortController();
  let startedUpload: StartedVideoUpload | null = null;
  let hasCompleted = false;

  const uploadPromise = (async (): Promise<MultipartUploadResult> => {
    onStatusChange?.("Starting upload session...");

    const upload = await requestVideoUploadStart({
      filename: file.name,
      content_type: file.type,
      file_size: file.size,
      purpose,
      target_video_id: targetVideoId ?? null,
    });
    startedUpload = upload;

    const totalParts = Math.ceil(file.size / upload.part_size);
    const completedParts = new Map<number, string>();
    const partProgress = new Map<number, number>();
    const uploadedPartNumbers = new Set<number>();

    const emitProgress = () => {
      onProgress?.(
        buildProgressSnapshot(
          partProgress,
          file.size,
          uploadedPartNumbers.size,
          totalParts,
        ),
      );
    };

    const uploadSinglePart = async (partNumber: number) => {
      const partStart = (partNumber - 1) * upload.part_size;
      const partEnd = Math.min(file.size, partStart + upload.part_size);
      const chunk = file.slice(partStart, partEnd);

      let lastError: unknown = null;

      for (let attempt = 1; attempt <= retryLimit; attempt += 1) {
        try {
          onStatusChange?.(
            `Uploading part ${partNumber} of ${totalParts}${
              attempt > 1 ? ` (retry ${attempt}/${retryLimit})` : ""
            }...`,
          );

          const { url } = await requestVideoUploadPartUrl({
            upload_id: upload.upload_id,
            object_key: upload.object_key,
            part_number: partNumber,
          });

          const response = await axios.put(url, chunk, {
            signal: abortController.signal,
            headers: {
              "Content-Type": file.type || "application/octet-stream",
            },
            onUploadProgress: (event) => {
              partProgress.set(partNumber, Math.min(event.loaded, chunk.size));
              emitProgress();
            },
          });

          const etagHeader = response.headers.etag || response.headers.ETag;
          const etag = String(etagHeader || "").trim();
          if (!etag) {
            throw new Error(`Missing ETag for uploaded part ${partNumber}.`);
          }

          partProgress.set(partNumber, chunk.size);
          uploadedPartNumbers.add(partNumber);
          completedParts.set(partNumber, etag);
          emitProgress();
          return;
        } catch (error) {
          lastError = error;
          if (abortController.signal.aborted) {
            throw error;
          }
          if (attempt === retryLimit) {
            break;
          }
        }
      }

      throw lastError instanceof Error
        ? lastError
        : new Error(`Failed to upload part ${partNumber}.`);
    };

    const queue = Array.from({ length: totalParts }, (_, index) => index + 1);
    const workerCount = Math.max(1, Math.min(upload.max_concurrency, queue.length));

    const workers = Array.from({ length: workerCount }, async () => {
      while (queue.length > 0) {
        const nextPart = queue.shift();
        if (!nextPart) {
          return;
        }
        await uploadSinglePart(nextPart);
      }
    });

    try {
      await Promise.all(workers);
      onStatusChange?.("Finalising upload...");

      const completion = await completeVideoUpload({
        upload_id: upload.upload_id,
        object_key: upload.object_key,
        parts: sortCompletedParts(completedParts),
      });

      hasCompleted = true;
      onStatusChange?.("Upload complete.");
      return { upload, completion };
    } catch (error) {
      if (startedUpload && !hasCompleted) {
        try {
          await abortVideoUpload({
            upload_id: startedUpload.upload_id,
            object_key: startedUpload.object_key,
          });
        } catch {
          // Best-effort cleanup only.
        }
      }
      throw new Error(getMultipartUploadErrorMessage(error));
    }
  })();

  return {
    promise: uploadPromise,
    cancel: async () => {
      abortController.abort();

      if (startedUpload && !hasCompleted) {
        try {
          await abortVideoUpload({
            upload_id: startedUpload.upload_id,
            object_key: startedUpload.object_key,
          });
        } catch {
          // Best-effort cleanup only.
        }
      }
    },
  };
};
