import React, { useState } from "react";
import { downloadProduct } from "../services/api";
import toast from "react-hot-toast";

interface DownloadButtonProps {
  productType: "photo" | "video" | "physical";
  productId: number;
  fileName: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  productType,
  productId,
  fileName,
}) => {
  const [downloading, setDownloading] = useState(false);

  // If it's physical, we don't need a download button
  if (productType === "physical") return null;

  const handleDownload = async () => {
    setDownloading(true);
    const toastId = toast.loading("Verifying purchase...");

    try {
      // Calls the secure API. If 403 Forbidden, it throws an error.
      await downloadProduct(
        productType as "photo" | "video",
        productId,
        fileName,
      );
      toast.success("Download started!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Download failed. Purchase not found.", { id: toastId });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-colors shadow-sm
        ${
          downloading
            ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
            : "bg-brand-500 text-white hover:bg-brand-700 border border-transparent"
        }
      `}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      {downloading ? "Downloading..." : "Download HD"}
    </button>
  );
};

export default DownloadButton;
