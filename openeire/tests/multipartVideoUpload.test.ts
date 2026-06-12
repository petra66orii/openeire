import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  MultipartUploadCancelledError,
  UploadPartError,
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

vi.mock("../src/services/videoUploads", () => ({
  requestVideoUploadStart: vi.fn(),
  requestVideoUploadPartUrl: vi.fn(),
  completeVideoUpload: vi.fn(),
  abortVideoUpload: vi.fn(),
}));

class PendingUploadXMLHttpRequest {
  static instances: PendingUploadXMLHttpRequest[] = [];

  upload = {
    onprogress: null as ((event: ProgressEvent) => void) | null,
  };
  status = 200;
  responseText = "";
  onload: ((event: ProgressEvent) => void) | null = null;
  onerror: ((event: ProgressEvent) => void) | null = null;
  onabort: ((event: ProgressEvent) => void) | null = null;

  open = vi.fn();
  setRequestHeader = vi.fn();
  send = vi.fn();
  getAllResponseHeaders = vi.fn(() => 'ETag: "etag-1"\r\n');
  abort = vi.fn(() => {
    this.onabort?.({} as ProgressEvent);
  });

  constructor() {
    PendingUploadXMLHttpRequest.instances.push(this);
  }
}

describe("multipartVideoUpload helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    PendingUploadXMLHttpRequest.instances = [];
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
    const message = getMultipartUploadErrorMessage(
      new UploadPartError("Network request failed.", {
        code: "ERR_NETWORK",
        requestUrl: "https://r2.example.com/upload-part",
      }),
    );

    expect(message).toContain("Cloudflare R2 CORS");
  });

  it("maps cancelled uploads to an explicit cancellation message", () => {
    const message = getMultipartUploadErrorMessage(
      new MultipartUploadCancelledError(),
    );

    expect(message).toBe("Upload cancelled.");
  });
});

describe("createMultipartVideoUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    PendingUploadXMLHttpRequest.instances = [];
  });

  it("aborts only once and rejects with MultipartUploadCancelledError on cancel", async () => {
    vi.stubGlobal("XMLHttpRequest", PendingUploadXMLHttpRequest);
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

    const file = new File(["preview-video"], "preview.mp4", { type: "video/mp4" });
    const task = createMultipartVideoUpload({
      file,
      purpose: "preview",
    });

    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();

    const cancelPromise = task.cancel();
    await expect(task.promise).rejects.toBeInstanceOf(MultipartUploadCancelledError);
    await cancelPromise;

    expect(PendingUploadXMLHttpRequest.instances).toHaveLength(1);
    expect(PendingUploadXMLHttpRequest.instances[0].abort).toHaveBeenCalledTimes(1);
    expect(abortVideoUpload).toHaveBeenCalledTimes(1);
  });
});
