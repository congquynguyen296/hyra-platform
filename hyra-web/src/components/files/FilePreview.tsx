import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import PdfViewer from "./PdfViewer";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";

interface FilePreviewProps {
  fileName: string;
  fileUrl?: string | null;
}

export function FilePreview({ fileName, fileUrl }: FilePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeBlocked, setIframeBlocked] = useState(false);

  useEffect(() => {
    if (!fileUrl) return;
    setIframeLoaded(false);
    setIframeBlocked(false);

    const timer = setTimeout(() => {
      if (!iframeLoaded) setIframeBlocked(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [fileUrl, iframeLoaded]);

  // If fileUrl exists, prefer rendering PDFs via PdfViewer to avoid embed restrictions
  if (fileUrl) {
    const isPdf = fileUrl.split("?")[0].toLowerCase().endsWith(".pdf");
    if (isPdf) {
      return (
        <Card className="border-0 shadow-xl overflow-hidden">
          <CardContent className="p-6">
            <PdfViewer url={fileUrl} />
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="border-0 shadow-xl overflow-hidden relative">
        <CardContent className="p-0">
          <div className="w-full h-[75vh] bg-white relative">
            <iframe
              ref={iframeRef}
              title={fileName}
              src={`http://localhost:8017/hackathon/cloudinary-file?url=https%3A%2F%2Fres.cloudinary.com%2Fdijyyybm2%2Fraw%2Fupload%2Fv1763215157%2Fhackathon-files%2Fminimum-standard-of-product-backend_1763215145237_vzw2s8.pdf`}
              className="w-full h-full"
              frameBorder={0}
              onLoad={() => setIframeLoaded(true)}
              sandbox="allow-popups allow-forms"
            />

            {iframeBlocked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 p-6">
                <p className="text-center text-sm text-gray-700 mb-4">
                  This file cannot be embedded due to browser/security headers
                  (X-Frame-Options or Content-Security-Policy).
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => window.open(fileUrl, "_blank", "noopener")}
                  >
                    Open in new tab
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      window.location.href = fileUrl;
                    }}
                  >
                    Download
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center py-12 space-y-6">
          <div className="w-24 h-24 rounded-2xl bg-gray-100 flex items-center justify-center">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
          <div className="text-center space-y-3 max-w-md">
            <h3 className="text-xl font-semibold text-gray-900">
              File Preview
            </h3>
            <p className="text-gray-600">
              This is a preview of {fileName}. In production, this would display
              the actual file content.
            </p>
          </div>
          <Button size="lg" variant="outline" className="gap-2">
            <Download className="h-5 w-5" />
            {fileName}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default FilePreview;
