import React from "react";
import fileService from "@/services/file.service";
import { FileMeta } from "@/types/File";
import { toast } from "sonner";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface SummariesTabProps {
  fileId: string;
}

export function SummariesTab({ fileId }: SummariesTabProps) {
  const [file, setFile] = React.useState<FileMeta | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [contentHtml, setContentHtml] = React.useState<string>("");

  React.useEffect(() => {
    if (!fileId) return;

    setLoading(true);
    setError(null);
    fileService
      .getFileById(fileId)
      .then((res) => {
        if (res.result) {
          setFile(res.result.data.file);
          setContentHtml(res.result.data.file.summaryContent || "");
        }
      })
      .catch((e) => {
        setError("Failed to load file");
        console.error(e);
        toast.error("Failed to load file summary");
      })
      .finally(() => setLoading(false));
  }, [fileId]);

  return (
    <div className="space-y-4">
      <div className="relative border rounded-lg bg-white overflow-hidden h-[75vh] mt-2">
        {!loading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <LoadingSpinner
              message="Loading summaries..."
              variant="inline"
              size="lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}
