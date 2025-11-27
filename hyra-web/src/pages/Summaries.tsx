import React, { useState, useEffect } from "react";
import fileService from "@/services/file.service";
import { FileDto } from "@/types/File";
import { toast } from "sonner";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Input } from "@/components/ui/input";
import { Search, FileText, Calendar, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SummaryEmptyState } from "@/components/summaries/SummaryEmptyState";

export default function Summaries() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await fileService.getAllFiles();
      if (response.result?.files) {
        // Filter only files with summaries
        const filesWithSummaries = response.result.files.filter(
          (file) => file.summaryCount && file.summaryCount > 0
        );
        setFiles(filesWithSummaries);
      } else {
        toast.error("Failed to load files");
      }
    } catch (error) {
      console.error("Error loading files:", error);
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  // Filter files based on search query
  const filteredFiles = files.filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFiles = filteredFiles.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPrevPage = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  };

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleViewSummary = (fileId: string) => {
    navigate(`/files/${fileId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] py-6">
        <LoadingSpinner
          message="Loading summaries..."
          variant="inline"
          size="lg"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Summaries</h1>
          <p className="text-muted-foreground">
            View and manage your file summaries
          </p>
        </div>
        {files.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {filteredFiles.length}{" "}
            {filteredFiles.length === 1 ? "summary" : "summaries"}
            {searchQuery && ` (filtered from ${files.length})`}
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by file name or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Files Grid */}
      {files.length === 0 ? (
        <SummaryEmptyState />
      ) : filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-gray-600">
              No files found matching "{searchQuery}"
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentFiles.map((file) => (
              <Card
                key={file.id}
                className="transition-all hover:shadow-lg hover:border-primary cursor-pointer"
                onClick={() => handleViewSummary(file.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate mb-1">
                        {file.name}
                      </h3>
                      {file.subject && (
                        <p className="text-sm text-purple-600 font-medium mb-2">
                          {file.subject}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {file.uploadDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(file.uploadDate).toLocaleDateString()}
                          </span>
                        )}
                        {file.size && <span>{file.size}</span>}
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <span className="text-purple-600 font-medium">
                          {file.summaryCount}{" "}
                          {file.summaryCount === 1 ? "summary" : "summaries"}
                        </span>
                        {file.quizCount !== undefined && file.quizCount > 0 && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600">
                              {file.quizCount}{" "}
                              {file.quizCount === 1 ? "quiz" : "quizzes"}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className="min-w-[40px]"
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
