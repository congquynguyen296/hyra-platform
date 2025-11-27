import { ApiResponse } from '@/types/ApiResponse';
import { axiosClient } from '@/lib/axios.lib';
import { apiRoutes } from '@/routes/apiRoutes';
import { GenerateQuizRequest, GenerateQuizResult } from '@/types/Quiz';

class QuizService {
  /**
   * Generate an AI quiz for a file.
   * Calls POST /quizzes/generate with body { numQuestions, difficulty, id }
   */
  async generateQuiz(fileId: string, numQuestions = 10, difficulty = 'medium'):
    Promise<ApiResponse<GenerateQuizResult>> {
    const body: GenerateQuizRequest = {
      numQuestions,
      difficulty,
      id: fileId,
    };

    const response = await axiosClient.axiosInstance.post<ApiResponse<GenerateQuizResult>>(
      apiRoutes.quizzes.generate,
      body,
    );

    return response.data;
  }
}

export default new QuizService();
