import { useEffect, useState } from "react";
import LoadingSpinner from "../common/LoadingSpinner";

interface FilePreviewProps {
  fileName: string;
  fileUrl?: string | null;
}

export function FilePreview({ fileName, fileUrl }: FilePreviewProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeBlocked, setIframeBlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!fileUrl) return;
    setIframeLoaded(false);
    setIframeBlocked(false);

    const timer = setTimeout(() => {
      if (!iframeLoaded) setIframeBlocked(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [fileUrl, iframeLoaded]);

  return (
    <div className="space-y-4">
      <div className="relative border rounded-lg bg-white overflow-hidden h-[75vh] mt-2">
        {!loading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <LoadingSpinner
              message="Loading PDF..."
              variant="inline"
              size="lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default FilePreview;
