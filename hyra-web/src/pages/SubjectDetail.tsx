import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";
import { FileTableRow } from "@/components/files/FileTableRow";
import { UploadFileDialog } from "@/components/files/UploadFileDialog";
import { FileText, Upload, ArrowLeft, FileIcon } from "lucide-react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import subjectService from "@/services/subject.service";
import { SubjectDetailDTO } from "@/types/Subject";

export default function SubjectDetail() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { subjects, files, addFile, deleteFile, addSummary } = useAppStore();

  // const subject = subjects.find((s) => s.id === subjectId);
  const [subject, setSubject] = useState<SubjectDetailDTO>();
  // const [subjectFiles, setSubjectFiles] = useState()
  const subjectFiles = files.filter((f) => f.subject === subject?.name);

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSubject = async () => {
    if (!subjectId) {
      setLoading(false);
      return;
    }
    try {
      const res = await subjectService.getSubjectById(subjectId);
      setSubject(res?.result);
    } catch (error) {
      console.error("Error fetching subject:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen py-6">
        <LoadingSpinner
          message="Loading subject..."
          variant="inline"
          size="lg"
        />
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="flex items-center justify-center h-screen py-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Subject Not Found
          </h2>
          <Button onClick={() => navigate("/subjects")}>
            Back to Subjects
          </Button>
        </div>
      </div>
    );
  }

  const handleFileUpload = async () => {
    // After upload success, refetch subject to get updated file list
    try {
      await fetchSubject();
      toast.success("Subject data refreshed successfully");
    } catch (error) {
      console.error("Error refetching subject:", error);
      toast.error("Failed to refresh subject data");
    }
  };

  const handleDeleteFile = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    deleteFile(fileId);
    toast.success(`File "${file?.name}" deleted successfully`);
  };

  const handleGenerateSummary = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    toast.info("Generating summary...");

    // Simulate API call
    setTimeout(() => {
      const newSummary = {
        id: `sum${Date.now()}`,
        fileId: file.id,
        fileName: file.name,
        content: `This is an automatically generated summary for ${file.name}. The document covers key concepts and important information relevant to ${subject.name}.`,
        keyConcepts: [
          "Core Principles",
          "Applications",
          "Key Formulas",
          "Important Theorems",
        ],
        createdAt: new Date().toISOString().split("T")[0],
        isImportant: false,
      };

      addSummary(newSummary);
      toast.success("Summary generated successfully!");
    }, 2000);
  };

  const handleViewFile = (fileId: string) => {
    navigate(`/subject/${subjectId}/file/${fileId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/subjects")}
              className="mb-2 -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Subjects
            </Button>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: subject.color + "20" }}
              >
                <FileText
                  className="h-6 w-6"
                  style={{ color: subject.color }}
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {subject.name}
                </h1>
                <p className="text-gray-600 mt-1">
                  {subject?.files?.length} file
                  {subject?.files?.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
          <Button
            onClick={() => setUploadDialogOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload File
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Files</CardDescription>
              <CardTitle className="text-3xl">
                {subject?.files?.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Summaries</CardDescription>
              <CardTitle className="text-3xl">
                {subject?.files?.reduce(
                  (acc, f) => acc + (f?.summaryContent?.trim() ? 1 : 0),
                  0
                )}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Quizzes</CardDescription>
              <CardTitle className="text-3xl">
                {subject?.files?.reduce((acc, f) => acc + f.quizCount, 0)}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Files Table */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-xl">Files</CardTitle>
            <CardDescription>
              Manage your uploaded files for {subject.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {subject?.files?.length === 0 ? (
              <div className="text-center py-12">
                <FileIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No files yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Upload your first file to get started with summaries and
                  quizzes
                </p>
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File Name</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Upload Date
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Size
                      </TableHead>
                      <TableHead className="text-center">Summaries</TableHead>
                      <TableHead className="text-center">Quizzes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subject?.files?.map((file) => (
                      <FileTableRow
                        key={file._id}
                        file={file}
                        onView={handleViewFile}
                        onGenerateSummary={handleGenerateSummary}
                        onDelete={handleDeleteFile}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <UploadFileDialog
        isOpen={uploadDialogOpen}
        onClose={() => {
          setUploadDialogOpen(false);
          handleFileUpload();
        }}
        onSubmit={handleFileUpload}
      />
    </div>
  );
}
