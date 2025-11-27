import { ApiResponse } from "@/types/ApiResponse";
import { axiosClient } from "@/lib/axios.lib";
import { apiRoutes } from "@/routes/apiRoutes";
import {
  FileDetailData,
  FileDto,
  FileMeta,
  UploadFileResult,
} from "@/types/File";
import {
  QuestionsListResponse,
  QuizAnswer,
  QuizApiResponse,
  QuizzesListResponse,
  SubmitQuizRequest,
  SubmitQuizResponse,
} from "@/types/Quiz";
import { TranslateHtmlRequest, TranslateHtmlResponse } from "@/types/Translate";

class FileService {
  async uploadFile(
    file: File,
    name: string,
    subject?: string
  ): Promise<ApiResponse<UploadFileResult>> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);

    if (subject) formData.append("subject", subject);

    // Default processing flags as requested
    formData.append("createSummary", "true");
    formData.append("generateQuiz", "true");

    // sensible defaults for quiz generation
    formData.append("quizQuestions", "10");
    formData.append("quizDifficulty", "medium");

    const response = await axiosClient.axiosInstance.post<
      ApiResponse<UploadFileResult>
    >(apiRoutes.files.upload, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  async getFileDetail(fileId: string): Promise<ApiResponse<FileDetailData>> {
    const response = await axiosClient.axiosInstance.get<
      ApiResponse<FileDetailData>
    >(apiRoutes.files.detail(encodeURIComponent(fileId)));
    return response.data;
  }

  async getAllQuizzes(): Promise<QuizzesListResponse> {
    const response = await axiosClient.axiosInstance.get<QuizzesListResponse>(
      apiRoutes.quizzes.list
    );
    return response.data;
  }

  async getFileQuizzes(fileId: string): Promise<QuizzesListResponse> {
    const response = await axiosClient.axiosInstance.get<QuizzesListResponse>(
      apiRoutes.quizzes.byFile(encodeURIComponent(fileId))
    );
    return response.data;
  }

  async getQuizQuestions(
    quizId: string,
    isReview: boolean = false
  ): Promise<QuestionsListResponse> {
    const basePath = apiRoutes.quizzes.questions(encodeURIComponent(quizId));
    const url = isReview ? `${basePath}?review=true` : basePath;
    const response =
      await axiosClient.axiosInstance.get<QuestionsListResponse>(url);
    return response.data;
  }

  async getQuizById(
    quizId: string
  ): Promise<{ success: boolean; data: QuizApiResponse }> {
    const response = await axiosClient.axiosInstance.get<{
      success: boolean;
      data: QuizApiResponse;
    }>(apiRoutes.quizzes.detail(encodeURIComponent(quizId)));
    return response.data;
  }

  async submitQuiz(
    quizId: string,
    answers: QuizAnswer[],
    timeSpent?: string
  ): Promise<SubmitQuizResponse> {
    const requestBody: SubmitQuizRequest = {
      answers,
      ...(timeSpent && { timeSpent }),
    };
    const response = await axiosClient.axiosInstance.post<SubmitQuizResponse>(
      apiRoutes.quizzes.submit(encodeURIComponent(quizId)),
      requestBody
    );
    return response.data;
  }

  async getFileById(fileId: string): Promise<ApiResponse<FileMeta>> {
    const res = await axiosClient.axiosInstance.get<ApiResponse<FileMeta>>(
      apiRoutes.files.detail(encodeURIComponent(fileId))
    );
    return res.data;
  }

  async translateHtml(
    payload: TranslateHtmlRequest
  ): Promise<TranslateHtmlResponse> {
    const res = await axiosClient.axiosInstance.post<TranslateHtmlResponse>(
      apiRoutes.summarize.translation,
      payload
    );
    return res.data;
  }

  async searchFiles(query: string): Promise<ApiResponse<{ files: FileDto[] }>> {
    const response = await axiosClient.axiosInstance.get<
      ApiResponse<{ files: FileDto[] }>
    >(
      `${apiRoutes.files.search}?query=${encodeURIComponent(query)}`
    );
    return response.data;
  }

  async getAllFiles(): Promise<ApiResponse<{ files: FileDto[] }>> {
    const response = await axiosClient.axiosInstance.get<
      ApiResponse<{ files: FileDto[] }>
    >(apiRoutes.files.list);
    return response.data;
  }
}

export default new FileService();
