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
import { isApiError } from "../services/fetchClient";

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

export class UploadPartError extends Error {
  code?: string;
  status?: number;
  data?: unknown;
  requestUrl: string;

  constructor(
    message: string,
    {
      code,
      status,
      data,
      requestUrl,
    }: {
      code?: string;
      status?: number;
      data?: unknown;
      requestUrl: string;
    },
  ) {
    super(message);
    this.name = "UploadPartError";
    this.code = code;
    this.status = status;
    this.data = data;
    this.requestUrl = requestUrl;
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

const isUploadPartError = (error: unknown): error is UploadPartError =>
  error instanceof UploadPartError;

const parseHeaderString = (headers: string): Record<string, string> =>
  headers
    .trim()
    .split(/[\r\n]+/)
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, line) => {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex === -1) return acc;
      const key = line.slice(0, separatorIndex).trim().toLowerCase();
      const value = line.slice(separatorIndex + 1).trim();
      if (key) acc[key] = value;
      return acc;
    }, {});

const parseResponseText = (text: string): unknown => {
  if (!text.trim()) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const getPayloadDetail = (payload: unknown): string | null => {
  if (typeof payload === "string" && payload.trim()) {
    return payload.trim();
  }
  if (!payload || typeof payload !== "object") {
    return null;
  }
  const record = payload as Record<string, unknown>;
  return (
    (typeof record.detail === "string" && record.detail) ||
    (typeof record.message === "string" && record.message) ||
    null
  );
};

const uploadPartWithProgress = ({
  url,
  chunk,
  contentType,
  signal,
  onProgress,
}: {
  url: string;
  chunk: Blob;
  contentType: string;
  signal: AbortSignal;
  onProgress: (loadedBytes: number) => void;
}): Promise<{ headers: Record<string, string> }> =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let settled = false;

    const rejectOnce = (error: unknown) => {
      if (settled) return;
      settled = true;
      signal.removeEventListener("abort", abortHandler);
      reject(error);
    };

    const resolveOnce = (value: { headers: Record<string, string> }) => {
      if (settled) return;
      settled = true;
      signal.removeEventListener("abort", abortHandler);
      resolve(value);
    };

    const abortHandler = () => {
      xhr.abort();
      rejectOnce(new MultipartUploadCancelledError());
    };

    xhr.upload.onprogress = (event) => {
      onProgress(Math.min(event.loaded, chunk.size));
    };

    xhr.onerror = () => {
      rejectOnce(
        new UploadPartError("Network request failed.", {
          code: "ERR_NETWORK",
          requestUrl: url,
        }),
      );
    };

    xhr.onabort = () => {
      rejectOnce(new MultipartUploadCancelledError());
    };

    xhr.onload = () => {
      const headers = parseHeaderString(xhr.getAllResponseHeaders());
      if (xhr.status >= 200 && xhr.status < 300) {
        resolveOnce({ headers });
        return;
      }
      rejectOnce(
        new UploadPartError(`Upload part request failed with status ${xhr.status}.`, {
          status: xhr.status,
          data: parseResponseText(xhr.responseText),
          requestUrl: url,
        }),
      );
    };

    signal.addEventListener("abort", abortHandler, { once: true });
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.send(chunk);
  });

export const getMultipartUploadErrorMessage = (error: unknown): string => {
  if (
    error instanceof MultipartUploadCancelledError ||
    (isUploadPartError(error) && error.code === "ERR_CANCELED")
  ) {
    return UPLOAD_CANCELLED_MESSAGE;
  }

  if (isUploadPartError(error)) {
    const requestUrl = error.requestUrl;
    const isDirectR2Request = isDirectRequestUrl(requestUrl);

    if (error.code === "ERR_NETWORK" && isDirectR2Request) {
      return R2_CORS_ERROR_MESSAGE;
    }

    if (error.status === 403 && isDirectR2Request) {
      return R2_CORS_ERROR_MESSAGE;
    }

    const detail = getPayloadDetail(error.data);
    if (detail) {
      return detail;
    }
  }

  if (isApiError(error)) {
    const detail = getPayloadDetail(error.response?.data);
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
  (isApiError(error) && error.code === "ERR_CANCELED") ||
  (isUploadPartError(error) && error.code === "ERR_CANCELED");

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

          const response = await uploadPartWithProgress({
            url,
            chunk,
            contentType: uploadContentType,
            signal: abortController.signal,
            onProgress: (loadedBytes) => {
              partProgress.set(partNumber, loadedBytes);
              emitProgress();
            },
          });

          const etagHeader = response.headers.etag;
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

