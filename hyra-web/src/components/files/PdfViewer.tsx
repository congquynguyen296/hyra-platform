import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  AlertCircle,
  ExternalLink,
  Download,
} from "lucide-react";

interface PdfViewerProps {
  url: string;
}

export function PdfViewer({ url }: PdfViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const openInNewTab = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || 'document.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <AlertCircle className="h-16 w-16 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-900">
          Failed to load PDF
        </h3>
        <p className="text-sm text-gray-600 text-center max-w-md">
          Unable to display the PDF in the browser.
        </p>
        <div className="flex gap-2">
          <Button onClick={openInNewTab} variant="outline" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Open in New Tab
          </Button>
          <Button onClick={downloadFile} className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            PDF Document
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={openInNewTab}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">Open in New Tab</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={downloadFile}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </Button>
        </div>
      </div>

      {/* PDF Display using Google Docs Viewer */}
      <div className="relative border rounded-lg bg-white overflow-hidden h-[75vh] mt-2">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-3" />
            <p className="text-sm text-gray-600">Loading PDF...</p>
          </div>
        )}
        <iframe
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
          className="w-full h-full"
          frameBorder="0"
          onLoad={handleLoad}
          onError={handleError}
          title="PDF Viewer"
        />
      </div>
    </div>
  );
}

export default PdfViewer;
