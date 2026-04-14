import { describe, expect, it, vi, beforeEach } from "vitest";
import axios from "axios";
import {
  MultipartUploadCancelledError,
  createMultipartVideoUpload,
  getMultipartUploadErrorMessage,
  inferVideoContentType,
  sortCompletedParts,
} from "../src/utils/multipartVideoUpload";
import {
  abortVideoUpload,
  requestVideoUploadPartUrl,
  requestVideoUploadStart,
} from "../src/services/videoUploads";

vi.mock("axios", () => ({
  default: {
    put: vi.fn(),
    isAxiosError: (error: unknown) =>
      typeof error === "object" &&
      error !== null &&
      "isAxiosError" in error &&
      (error as { isAxiosError?: boolean }).isAxiosError === true,
  },
}));

vi.mock("../src/services/videoUploads", () => ({
  requestVideoUploadStart: vi.fn(),
  requestVideoUploadPartUrl: vi.fn(),
  completeVideoUpload: vi.fn(),
  abortVideoUpload: vi.fn(),
}));

describe("multipartVideoUpload helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sorts completed parts by ascending part number", () => {
    const parts = sortCompletedParts(
      new Map([
        [3, '"etag-3"'],
        [1, '"etag-1"'],
        [2, '"etag-2"'],
      ]),
    );

    expect(parts).toEqual([
      { part_number: 1, etag: '"etag-1"' },
      { part_number: 2, etag: '"etag-2"' },
      { part_number: 3, etag: '"etag-3"' },
    ]);
  });

  it("infers a supported video content type from the filename when File.type is empty", () => {
    const file = new File(["video"], "Fanore-Beach.MP4", { type: "" });
    expect(inferVideoContentType(file)).toBe("video/mp4");
  });

  it("maps direct R2 network failures to the CORS guidance message", () => {
    const message = getMultipartUploadErrorMessage({
      isAxiosError: true,
      code: "ERR_NETWORK",
      config: { url: "https://r2.example.com/upload-part" },
    });

    expect(message).toContain("Cloudflare R2 CORS");
  });

  it("maps cancelled uploads to an explicit cancellation message", () => {
    const message = getMultipartUploadErrorMessage({
      isAxiosError: true,
      code: "ERR_CANCELED",
      config: { url: "https://r2.example.com/upload-part" },
    });

    expect(message).toBe("Upload cancelled.");
  });
});

describe("createMultipartVideoUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("aborts only once and rejects with MultipartUploadCancelledError on cancel", async () => {
    vi.mocked(requestVideoUploadStart).mockResolvedValue({
      upload_id: "upload-123",
      object_key: "previews/videos/fanore-beach.mp4",
      bucket: "public-bucket",
      part_size: 1024,
      max_concurrency: 1,
      purpose: "preview",
    });
    vi.mocked(requestVideoUploadPartUrl).mockResolvedValue({
      url: "https://r2.example.com/upload-part",
    });
    vi.mocked(abortVideoUpload).mockResolvedValue({
      success: true,
      status: "aborted",
    });
    vi.mocked(axios.put).mockImplementation(
      (_url, _chunk, config?: { signal?: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          if (config?.signal?.aborted) {
            reject({
              isAxiosError: true,
              code: "ERR_CANCELED",
              config: { url: "https://r2.example.com/upload-part" },
            });
            return;
          }
          config?.signal?.addEventListener("abort", () => {
            reject({
              isAxiosError: true,
              code: "ERR_CANCELED",
              config: { url: "https://r2.example.com/upload-part" },
            });
          });
        }),
    );

    const file = new File(["preview-video"], "preview.mp4", { type: "video/mp4" });
    const task = createMultipartVideoUpload({
      file,
      purpose: "preview",
    });

    await Promise.resolve();

    const cancelPromise = task.cancel();
    await expect(task.promise).rejects.toBeInstanceOf(MultipartUploadCancelledError);
    await cancelPromise;

    expect(abortVideoUpload).toHaveBeenCalledTimes(1);
  });
});
