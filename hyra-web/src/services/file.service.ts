import { ApiResponse } from '../type/ApiResponse';
import axiosInstance from '../lib/axios.lib';
import { FileMeta } from "@/type/File";
import { TranslateHtmlRequest, TranslateHtmlResponse } from "../type/Translate";


export interface UploadFileOptions {
  subject?: string;
  createSummary?: boolean;
  generateQuiz?: boolean;
  quizQuestions?: number;
  quizDifficulty?: string;
  name?: string;
}

export interface UploadFileResult {
  file: {
    id: string;
    name: string;
    subject?: string;
    uploadDate?: string;
    size?: string;
    sizeBytes?: number;
    mimeType?: string;
    summaryCount?: number;
    quizCount?: number;
    url?: string;
    metadata?: Record<string, unknown>;
  };
  processing?: Record<string, unknown>;
}


// --- File detail types and methods ---
export interface FileDto {
  id: string;
  name: string;
  subject?: string;
  uploadDate?: string;
  size?: string;
  sizeBytes?: number;
  mimeType?: string;
  summaryCount?: number;
  quizCount?: number;
  url?: string;
  metadata?: Record<string, unknown>;
}

export interface SummaryAuthorDto {
  id: string;
  name?: string;
}

export interface SummaryDto {
  id: string;
  createdAt: string;
  excerpt?: string; // HTML excerpt
  aiMatchScore?: number | null;
  author?: SummaryAuthorDto;
  url?: string;
}

export interface QuizDto {
  id: string;
  createdAt?: string;
  questionCount?: number;
  averageScore?: number | null;
  url?: string;
}

export interface FileDetailData {
  file: FileDto;
  summaries: SummaryDto[];
  quizzes: QuizDto[];
}




export interface QuizApiResponse {
  _id: string;
  name: string;
  fileId: string;
  level: string;
  content: string | null;
  highestScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizzesListResponse {
  success: boolean;
  data: QuizApiResponse[];
  count: number;
}

export interface Answer {
  _id?: string;
  content: string;
  isCorrect: boolean;
  explain?: string;
}

export interface Question {
  _id: string;
  name: string;
  question: string;
  quizId: string;
  answers: Answer[];
  userAnswer?: number; // Index of answer that user selected in previous attempt
  createdAt: string;
  updatedAt: string;
  explanation?: string
}

export interface QuestionsListResponse {
  success: boolean;
  data: Question[];
  count: number;
  isReview?: boolean;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number;
}

export interface SubmitQuizRequest {
  answers: QuizAnswer[];
  timeSpent?: string;
}

export interface QuizResult {
  questionId: string;
  isCorrect: boolean;
  selectedAnswer: number;
  correctAnswer: number;
}

export interface SubmitQuizResponse {
  success: boolean;
  message?: string;
  data: {
    quizId: string;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    timeSpent?: string;
    completed: boolean;
    completedAt?: string;
    results: QuizResult[];
  };
}

class FileService {
  /**
   * Upload a file with optional processing flags.
   * The backend expects multipart/form-data fields (see screenshot):
   * - file (File)
   * - subject (string)
   * - createSummary (boolean)
   * - generateQuiz (boolean)
   * - quizQuestions (number)
   * - quizDifficulty (string)
   * - name (string)
   */
  /**
   * Upload a file. Only `file` and `name` are required by the caller.
   * Other processing flags default to true and sensible quiz defaults are applied.
   */
  async uploadFile(file: File, name: string, subject?: string): Promise<ApiResponse<UploadFileResult>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);

    if (subject) formData.append('subject', subject);

    // Default processing flags as requested
    formData.append('createSummary', 'true');
    formData.append('generateQuiz', 'true');

    // sensible defaults for quiz generation
    formData.append('quizQuestions', '10');
    formData.append('quizDifficulty', 'medium');

    const response = await axiosInstance.axiosInstance.post<ApiResponse<UploadFileResult>>('/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async getFileDetail(fileId: string): Promise<ApiResponse<FileDetailData>> {
    const response = await axiosInstance.axiosInstance.get<ApiResponse<FileDetailData>>(`/files/files/${fileId}`);
    return response.data;
  }

  async getAllQuizzes(): Promise<QuizzesListResponse> {
    const response = await axiosInstance.axiosInstance.get<QuizzesListResponse>(
      `/quizzes`
    );
    return response.data;
  }

  async getFileQuizzes(fileId: string): Promise<QuizzesListResponse> {
    const response = await axiosInstance.axiosInstance.get<QuizzesListResponse>(
      `/files/${fileId}/quizzes`
    //   `/files/69184dd8deb649695b3c271a/quizzes`
    );
    return response.data;
  }

  async getQuizQuestions(
    quizId: string,
    isReview: boolean = false
  ): Promise<QuestionsListResponse> {
    const url = isReview
      ? `/files/quizzes/${quizId}/questions?review=true`
      : `/files/quizzes/${quizId}/questions`;
    const response =
      await axiosInstance.axiosInstance.get<QuestionsListResponse>(url);
    return response.data;
  }

  async getQuizById(
    quizId: string
  ): Promise<{ success: boolean; data: QuizApiResponse }> {
    const response = await axiosInstance.axiosInstance.get<{
      success: boolean;
      data: QuizApiResponse;
    }>(`/files/quizzes/${quizId}`);
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
    const response = await axiosInstance.axiosInstance.post<SubmitQuizResponse>(
      `/files/quizzes/${quizId}/submit`,
      requestBody
    );
    return response.data;
  }

  async getFileById(fileId: string): Promise<ApiResponse<FileMeta>> {
    const res = await axiosInstance.axiosInstance.get<ApiResponse<FileMeta>>(
      `/files/files/${fileId}`
    );
    return res.data;
  }

  async translateHtml(
    payload: TranslateHtmlRequest
  ): Promise<TranslateHtmlResponse> {
    const res = await axiosInstance.axiosInstance.post<TranslateHtmlResponse>(
      `/generate-ai/translate`,
      payload
    );
    return res.data;
  }

  async searchFiles(query: string): Promise<ApiResponse<{ files: FileDto[] }>> {
    const response = await axiosInstance.axiosInstance.get<ApiResponse<{ files: FileDto[] }>>(
      `/files/search?query=${encodeURIComponent(query)}`
    );
    return response.data;
  }

  async getAllFiles(): Promise<ApiResponse<{ files: FileDto[] }>> {
    const response = await axiosInstance.axiosInstance.get<ApiResponse<{ files: FileDto[] }>>(
      `/files`
    );
    return response.data;
  }

}

export default new FileService();
