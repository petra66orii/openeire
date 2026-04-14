import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  createMultipartVideoUpload,
  isMultipartUploadCancelledError,
  type MultipartUploadProgress,
} from "../utils/multipartVideoUpload";
import {
  searchVideoUploadTargets,
  type VideoUploadPurpose,
  type VideoUploadTarget,
} from "../services/videoUploads";

const StaffVideoUploadsPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [purpose, setPurpose] = useState<VideoUploadPurpose>("master");
  const [attachToVideo, setAttachToVideo] = useState(true);
  const [targetQuery, setTargetQuery] = useState("");
  const [targets, setTargets] = useState<VideoUploadTarget[]>([]);
  const [selectedTargetId, setSelectedTargetId] = useState<number | null>(null);
  const [isLoadingTargets, setIsLoadingTargets] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Choose a file to begin.");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [progress, setProgress] = useState<MultipartUploadProgress | null>(null);
  const [completedObjectKey, setCompletedObjectKey] = useState<string | null>(null);
  const [completionVideoId, setCompletionVideoId] = useState<number | null>(null);
  const [cancelUpload, setCancelUpload] = useState<(() => Promise<void>) | null>(null);

  useEffect(() => {
    let isMounted = true;
    const timeoutId = window.setTimeout(async () => {
      if (!attachToVideo) {
        setTargets([]);
        setSelectedTargetId(null);
        return;
      }

      setIsLoadingTargets(true);
      try {
        const results = await searchVideoUploadTargets(targetQuery.trim());
        if (!isMounted) return;
        setTargets(results);
        setSelectedTargetId((currentTarget) => {
          if (currentTarget && results.some((target) => target.id === currentTarget)) {
            return currentTarget;
          }
          return results[0]?.id ?? null;
        });
      } catch {
        if (!isMounted) return;
        setTargets([]);
      } finally {
        if (isMounted) {
          setIsLoadingTargets(false);
        }
      }
    }, 250);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [attachToVideo, targetQuery]);

  const selectedTarget = useMemo(
    () => targets.find((target) => target.id === selectedTargetId) ?? null,
    [targets, selectedTargetId],
  );

  const resetUploadState = () => {
    setUploadError(null);
    setCompletedObjectKey(null);
    setCompletionVideoId(null);
    setProgress(null);
  };

  const handleStartUpload = async () => {
    if (!selectedFile) {
      toast.error("Choose a video file first.");
      return;
    }

    if (attachToVideo && !selectedTargetId) {
      toast.error("Choose a target video before uploading.");
      return;
    }

    resetUploadState();
    setIsUploading(true);

    const uploadTask = createMultipartVideoUpload({
      file: selectedFile,
      purpose,
      targetVideoId: attachToVideo ? selectedTargetId : null,
      onStatusChange: setStatusMessage,
      onProgress: setProgress,
    });

    setCancelUpload(() => uploadTask.cancel);

    try {
      const result = await uploadTask.promise;
      setCompletedObjectKey(result.completion.object_key);
      setCompletionVideoId(result.completion.video_id ?? null);
      setStatusMessage("Upload complete.");
      toast.success("Video uploaded successfully.");
    } catch (error) {
      if (isMultipartUploadCancelledError(error)) {
        setUploadError(null);
        setStatusMessage("Upload cancelled.");
        return;
      }
      const message =
        error instanceof Error ? error.message : "Video upload failed.";
      setUploadError(message);
      setStatusMessage("Upload failed.");
      toast.error(message);
    } finally {
      setIsUploading(false);
      setCancelUpload(null);
    }
  };

  const handleCancelUpload = async () => {
    if (!cancelUpload) return;

    setStatusMessage("Cancelling upload...");
    try {
      await cancelUpload();
      setStatusMessage("Upload cancelled.");
      toast("Upload cancelled.", { icon: "i" });
    } catch {
      setStatusMessage("Could not cancel cleanly. The upload may already be stopping.");
      toast.error("Could not cancel upload cleanly.");
    } finally {
      setIsUploading(false);
      setCancelUpload(null);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white pt-24 pb-20 mobile-page-offset">
      <div className="container mx-auto max-w-5xl px-4 lg:px-8">
        <div className="mb-10 border-b border-white/10 pb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">
            Staff Tools
          </p>
          <h1 className="text-4xl font-serif font-bold mb-3">
            Multipart Video Uploads
          </h1>
          <p className="max-w-3xl text-gray-400 leading-relaxed">
            Upload large private master videos or public preview clips directly to
            Cloudflare R2 without pushing file bytes through Django.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-3xl border border-white/10 bg-gray-900 p-6 md:p-8 shadow-2xl">
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
                  Upload purpose
                </label>
                <select
                  value={purpose}
                  onChange={(event) =>
                    setPurpose(event.target.value as VideoUploadPurpose)
                  }
                  disabled={isUploading}
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-accent"
                >
                  <option value="master">Private master video</option>
                  <option value="preview">Public preview clip</option>
                </select>
                <p className="mt-2 text-sm text-gray-500">
                  {purpose === "master"
                    ? "Master uploads stay private and feed secure purchase/licence delivery."
                    : "Preview uploads are public-safe watermarked clips used for storefront playback."}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
                  Video file
                </label>
                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm,video/x-m4v"
                  disabled={isUploading}
                  onChange={(event) => {
                    setSelectedFile(event.target.files?.[0] ?? null);
                    resetUploadState();
                    setStatusMessage("Ready to upload.");
                  }}
                  className="block w-full rounded-xl border border-dashed border-white/20 bg-black px-4 py-4 text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:font-semibold file:text-black hover:file:bg-white"
                />
                {selectedFile && (
                  <p className="mt-3 text-sm text-gray-400">
                    {selectedFile.name} · {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={attachToVideo}
                    disabled={isUploading}
                    onChange={(event) => setAttachToVideo(event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-black text-accent focus:ring-accent"
                  />
                  <span>
                    <span className="block font-semibold text-white">
                      Attach to an existing video record
                    </span>
                    <span className="mt-1 block text-sm text-gray-400">
                      Leave this on to write the final object key straight onto a
                      `Video` record. Turn it off if you only want to park the
                      upload in R2 for later admin work.
                    </span>
                  </span>
                </label>

                {attachToVideo && (
                  <div className="mt-5 space-y-4">
                    <input
                      type="text"
                      value={targetQuery}
                      disabled={isUploading}
                      onChange={(event) => setTargetQuery(event.target.value)}
                      placeholder="Search videos by title..."
                      className="w-full rounded-xl border border-white/10 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-accent"
                    />

                    <div className="max-h-64 overflow-y-auto rounded-2xl border border-white/10 bg-gray-950">
                      {isLoadingTargets ? (
                        <div className="px-4 py-5 text-sm text-gray-500">
                          Loading videos...
                        </div>
                      ) : targets.length === 0 ? (
                        <div className="px-4 py-5 text-sm text-gray-500">
                          No matching videos found.
                        </div>
                      ) : (
                        <ul className="divide-y divide-white/5">
                          {targets.map((target) => (
                            <li key={target.id}>
                              <button
                                type="button"
                                disabled={isUploading}
                                onClick={() => setSelectedTargetId(target.id)}
                                className={`flex w-full items-center justify-between px-4 py-4 text-left transition ${
                                  selectedTargetId === target.id
                                    ? "bg-brand-500/10 text-white"
                                    : "text-gray-300 hover:bg-white/5"
                                }`}
                              >
                                <div>
                                  <p className="font-semibold">{target.title}</p>
                                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gray-500">
                                    {target.collection} · #{target.id}
                                  </p>
                                </div>
                                {!target.is_active && (
                                  <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gray-400">
                                    Inactive
                                  </span>
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleStartUpload}
                  disabled={isUploading || !selectedFile}
                  className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUploading ? "Uploading..." : "Start upload"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelUpload}
                  disabled={!isUploading || !cancelUpload}
                  className="rounded-xl border border-white/15 px-6 py-3 text-sm font-bold text-white transition hover:border-white hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Cancel upload
                </button>
              </div>
            </div>
          </section>

          <aside className="rounded-3xl border border-white/10 bg-gray-900 p-6 md:p-8 shadow-2xl">
            <h2 className="text-2xl font-serif font-bold mb-6">Upload status</h2>

            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 mb-2">
                  Current state
                </p>
                <p className="text-sm leading-relaxed text-gray-300">{statusMessage}</p>
              </div>

              {progress && (
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-gray-500">
                    <span>Progress</span>
                    <span>{progress.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-black">
                    <div
                      className="h-full rounded-full bg-brand-500 transition-all"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-gray-400">
                    {progress.uploadedParts} / {progress.totalParts} parts uploaded ·{" "}
                    {(progress.bytesUploaded / 1024 / 1024).toFixed(1)} MB of{" "}
                    {(progress.totalBytes / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              )}

              <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 mb-2">
                  Target
                </p>
                {attachToVideo ? (
                  selectedTarget ? (
                    <div>
                      <p className="font-semibold text-white">{selectedTarget.title}</p>
                      <p className="mt-1 text-sm text-gray-400">
                        #{selectedTarget.id} · {selectedTarget.collection}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No target selected yet.</p>
                  )
                ) : (
                  <p className="text-sm text-gray-500">
                    This upload will remain unattached until you wire it to a video later.
                  </p>
                )}
              </div>

              {uploadError && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-100">
                  {uploadError}
                </div>
              )}

              {completedObjectKey && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-200 mb-2">
                    Uploaded object key
                  </p>
                  <code className="block break-all rounded-xl bg-black/40 px-3 py-3 text-sm text-emerald-100">
                    {completedObjectKey}
                  </code>
                  <p className="mt-3 text-sm text-emerald-100">
                    {completionVideoId
                      ? `Attached to video #${completionVideoId}.`
                      : "Stored in R2 and ready to attach later."}
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default StaffVideoUploadsPage;

