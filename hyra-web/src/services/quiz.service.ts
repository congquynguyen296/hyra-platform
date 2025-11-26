import { ApiResponse } from '../type/ApiResponse';
import axiosInstance from '../lib/axios.lib';

export interface GenerateQuizRequest {
  numQuestions: number;
  difficulty: string;
  id: string; // file id
}

export interface QuizQuestionDto {
  id: string;
  question: string;
  options: string[];
  correctAnswer?: number;
}

export interface GenerateQuizResult {
  id: string; // quiz id
  fileId?: string;
  questions: QuizQuestionDto[];
  difficulty?: string;
}

class QuizService {
  /**
   * Generate an AI quiz for a file.
   * Calls POST /generate-ai/quiz with body { numQuestions, difficulty, id }
   */
  async generateQuiz(fileId: string, numQuestions = 10, difficulty = 'medium'):
    Promise<ApiResponse<GenerateQuizResult>> {
    const body: GenerateQuizRequest = {
      numQuestions,
      difficulty,
      id: fileId,
    };

    const response = await axiosInstance.axiosInstance.post<ApiResponse<GenerateQuizResult>>(
      '/generate-ai/quiz',
      body,
    );

    return response.data;
  }
}

export default new QuizService();
