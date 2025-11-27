import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import FileService from "@/services/file.service";
import { FileDetailData, FileDto, QuizDto, SummaryDto } from "@/types/File";
import {
  useAppStore,
  Summary as StoreSummary,
  Quiz as StoreQuiz,
} from "@/store/useAppStore";
import { FileText, BookOpen, Brain } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { FileHeader } from "@/components/files/FileHeader";
import { FilePreview } from "@/components/files/FilePreview";
import { SummariesTab } from "@/components/files/SummariesTab";
import { QuizzesTab } from "@/components/files/QuizzesTab";

export default function FileDetail() {
  const { subjectId, fileId } = useParams<{
    subjectId: string;
    fileId: string;
  }>();
  const navigate = useNavigate();
  const { files, summaries, quizzes, subjects, toggleImportant } =
    useAppStore();
  const [fetchedFile, setFetchedFile] = useState<FileDto | null>(null);
  const [fetchedSummaries, setFetchedSummaries] = useState<SummaryDto[]>([]);
  const [fetchedQuizzes, setFetchedQuizzes] = useState<QuizDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const file = fetchedFile ?? files.find((f) => f.id === fileId);
  const subject = subjects.find((s) => s.id === subjectId);

  // map fetched summaries/quizzes (API DTOs) to store types expected by components
  const mappedSummaries: StoreSummary[] = fetchedSummaries.length
    ? fetchedSummaries.map((s) => ({
        id: s.id,
        fileId: fileId ?? "",
        fileName:
          fetchedFile?.name ?? files.find((f) => f.id === fileId)?.name ?? "",
        content: s.excerpt ?? "",
        keyConcepts: [],
        createdAt: s.createdAt ?? new Date().toISOString(),
        isImportant: false,
      }))
    : summaries.filter((s) => s.fileId === fileId);

  const mappedQuizzes: StoreQuiz[] = fetchedQuizzes.length
    ? fetchedQuizzes.map((q) => ({
        id: q.id,
        fileId: fileId ?? "",
        fileName:
          fetchedFile?.name ?? files.find((f) => f.id === fileId)?.name ?? "",
        subject: subject?.name ?? "",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        difficulty: (q as any).difficulty ?? "Medium",
        questions: [],
        createdAt: q.createdAt ?? new Date().toISOString(),
        completed: false,
      }))
    : quizzes.filter((q) => q.fileId === fileId);

  // Extracted loader so parent or children can trigger a refresh after actions (e.g., generating a quiz)
  const loadFileDetail = useCallback(async () => {
    if (!fileId) return;
    setIsLoading(true);
    try {
      const res = await FileService.getFileDetail(fileId);
      if (res && res.result) {
        const result = res.result as unknown;

        function hasDataField(x: unknown): x is { data: FileDetailData } {
          return (
            typeof x === "object" &&
            x !== null &&
            "data" in (x as Record<string, unknown>)
          );
        }

        const data: FileDetailData = hasDataField(result)
          ? (result as { data: FileDetailData }).data
          : (result as FileDetailData);

        setFetchedFile(data.file ?? null);
        // normalize where summaries/quizzes may live: either at top-level or nested under file
        let summariesFromTop: SummaryDto[] = [];
        let summariesFromFile: SummaryDto[] = [];
        let quizzesFromTop: QuizDto[] = [];
        let quizzesFromFile: QuizDto[] = [];

        if (typeof data === "object" && data !== null) {
          const rec = data as unknown as Record<string, unknown>;
          if (Array.isArray(rec["summaries"]))
            summariesFromTop = rec["summaries"] as SummaryDto[];
          const fileRec = rec["file"];
          if (typeof fileRec === "object" && fileRec !== null) {
            const frec = fileRec as unknown as Record<string, unknown>;
            if (Array.isArray(frec["summaries"]))
              summariesFromFile = frec["summaries"] as SummaryDto[];
            if (Array.isArray(frec["quizzes"]))
              quizzesFromFile = frec["quizzes"] as QuizDto[];
          }
          if (Array.isArray(rec["quizzes"]))
            quizzesFromTop = rec["quizzes"] as QuizDto[];
        }

        setFetchedSummaries(
          summariesFromTop.length ? summariesFromTop : summariesFromFile
        );
        setFetchedQuizzes(
          quizzesFromTop.length ? quizzesFromTop : quizzesFromFile
        );
      }
    } catch (err) {
      // ignore - fallback to store
    } finally {
      setIsLoading(false);
    }
  }, [fileId]);

  useEffect(() => {
    // call loader on mount and when relevant store slices change
    loadFileDetail();
  }, [loadFileDetail, summaries, quizzes, files]);

  const [activeTab, setActiveTab] = useState("original");
  const [quizzesCount, setQuizzesCount] = useState<number | null>(null);

  if (!file) {
    return (
      <div className="flex items-center justify-center h-screen">
        {isLoading && (
          <LoadingSpinner
            message="Loading file..."
            variant="inline"
            size="lg"
          />
        )}
      </div>
    );
  }

  const handleToggleImportant = (summaryId: string) => {
    toggleImportant(summaryId);
    const summary = summaries.find((s) => s.id === summaryId);
    toast.success(
      summary?.isImportant ? "Removed from important" : "Marked as important"
    );
  };

  const handleDeleteSummary = (summaryId: string) => {
    // TODO: Implement delete summary functionality
    toast.success("Summary deleted");
  };

  const handleViewDetail = (summaryId: string) => {
    // TODO: Implement view detail functionality
    toast.info("View detail: " + summaryId);
  };

  const handleTranslate = async (summaryId: string, language: string) => {
    // TODO: Implement translate functionality
    toast.success(`Translating to ${language}...`);
  };

  const headerFile = {
    name: (file as unknown as { name: string }).name,
    subject:
      (file as unknown as { subject?: string }).subject ?? subject?.name ?? "",
    uploadDate: (file as unknown as { uploadDate?: string }).uploadDate ?? "",
    size: (file as unknown as { size?: string }).size ?? "",
    summaryCount: mappedSummaries.length,
    quizCount: mappedQuizzes.length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <FileHeader
          file={headerFile}
          subjectColor={subject?.color}
          subjectName={subject?.name}
          onBack={() => {
            if (subjectId) {
              navigate(`/subject/${subjectId}`);
            } else {
              navigate("/summaries");
            }
          }}
          fileId={fileId}
          onGenerated={loadFileDetail}
        />

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="original" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Original File</span>
              <span className="sm:hidden">File</span>
            </TabsTrigger>

            <TabsTrigger value="summaries" className="gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Summaries</span>
            </TabsTrigger>

            <TabsTrigger value="quizzes" className="gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Quizzes</span>
            </TabsTrigger>
          </TabsList>

          {/* Original File Tab */}
          <TabsContent value="original" className="space-y-0">
            <FilePreview
              fileName={file.name}
              fileUrl={(file as unknown as { url?: string })?.url ?? null}
            />
          </TabsContent>

          {/* Summaries Tab */}
          <TabsContent value="summaries" className="space-y-4">
            {fileId && <SummariesTab fileId={fileId} />}
          </TabsContent>

          {/* Quizzes Tab */}
          <TabsContent value="quizzes" className="space-y-4">
            {fileId && (
              <QuizzesTab fileId={fileId} onCountChange={setQuizzesCount} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
