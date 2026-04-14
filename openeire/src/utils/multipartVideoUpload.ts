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
const UPLOAD_CANCELLED_MESSAGE = "Upload cancelled.";

const VIDEO_CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
  ".m4v": "video/x-m4v",
};

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

export class MultipartUploadCancelledError extends Error {
  constructor(message = UPLOAD_CANCELLED_MESSAGE) {
    super(message);
    this.name = "MultipartUploadCancelledError";
  }
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

export const sortCompletedParts = (
  completedParts: Map<number, string>,
): CompletedVideoUploadPart[] =>
  Array.from(completedParts.entries())
    .sort(([partA], [partB]) => partA - partB)
    .map(([part_number, etag]) => ({ part_number, etag }));

export const inferVideoContentType = (file: File): string => {
  if (file.type) {
    return file.type;
  }

  const filename = file.name.toLowerCase();
  const matchedExtension = Object.keys(VIDEO_CONTENT_TYPE_BY_EXTENSION).find((extension) =>
    filename.endsWith(extension),
  );

  return matchedExtension
    ? VIDEO_CONTENT_TYPE_BY_EXTENSION[matchedExtension]
    : "application/octet-stream";
};

const isDirectRequestUrl = (value?: string): boolean =>
  typeof value === "string" &&
  (value.startsWith("http://") || value.startsWith("https://"));

export const getMultipartUploadErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") {
    return UPLOAD_CANCELLED_MESSAGE;
  }

  if (axios.isAxiosError(error)) {
    const requestUrl = typeof error.config?.url === "string" ? error.config.url : "";
    const isDirectR2Request = isDirectRequestUrl(requestUrl);

    if (error.code === "ERR_NETWORK" && isDirectR2Request) {
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

const isCancellationError = (error: unknown): boolean =>
  error instanceof MultipartUploadCancelledError ||
  (axios.isAxiosError(error) && error.code === "ERR_CANCELED");

export const isMultipartUploadCancelledError = (
  error: unknown,
): error is MultipartUploadCancelledError => error instanceof MultipartUploadCancelledError;

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
  let hasCancelled = false;
  let abortPromise: Promise<void> | null = null;
  let fatalError: unknown = null;

  const abortMultipartUploadOnce = async () => {
    if (!startedUpload || hasCompleted) {
      return;
    }
    if (!abortPromise) {
      abortPromise = abortVideoUpload({
        upload_id: startedUpload.upload_id,
        object_key: startedUpload.object_key,
      })
        .then(() => undefined)
        .catch(() => undefined);
    }
    await abortPromise;
  };

  const uploadPromise = (async (): Promise<MultipartUploadResult> => {
    onStatusChange?.("Starting upload session...");
    const uploadContentType = inferVideoContentType(file);

    const upload = await requestVideoUploadStart({
      filename: file.name,
      content_type: uploadContentType,
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
          partProgress.set(partNumber, 0);
          emitProgress();
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
              "Content-Type": uploadContentType,
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
            throw new MultipartUploadCancelledError();
          }
          if (attempt === retryLimit) {
            break;
          }
        }
      }

      const resolvedError =
        lastError instanceof Error
          ? lastError
          : new Error(`Failed to upload part ${partNumber}.`);
      fatalError = resolvedError;
      abortController.abort();
      throw resolvedError;
    };

    let nextPartIndex = 0;
    const workerCount = Math.max(1, Math.min(upload.max_concurrency, totalParts));

    const workers = Array.from({ length: workerCount }, async () => {
      while (!fatalError && !abortController.signal.aborted) {
        const currentIndex = nextPartIndex;
        nextPartIndex += 1;
        if (currentIndex >= totalParts) {
          return;
        }
        const nextPart = currentIndex + 1;
        await uploadSinglePart(nextPart);
      }
    });

    try {
      await Promise.all(workers);

      if (hasCancelled || abortController.signal.aborted) {
        throw new MultipartUploadCancelledError();
      }

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
      if (hasCancelled || isCancellationError(error)) {
        throw new MultipartUploadCancelledError();
      }

      if (startedUpload && !hasCompleted) {
        await abortMultipartUploadOnce();
      }
      throw new Error(getMultipartUploadErrorMessage(fatalError ?? error));
    }
  })();

  return {
    promise: uploadPromise,
    cancel: async () => {
      hasCancelled = true;
      abortController.abort();
      await abortMultipartUploadOnce();
    },
  };
};
