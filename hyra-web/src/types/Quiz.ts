export interface GenerateQuizRequest {
  numQuestions: number
  difficulty: string
  id: string
}

export interface QuizQuestionDto {
  id: string
  question: string
  options: string[]
  correctAnswer?: number
}

export interface GenerateQuizResult {
  id: string
  fileId?: string
  questions: QuizQuestionDto[]
  difficulty?: string
}

export interface QuizApiResponse {
  _id: string
  name: string
  fileId: string
  level: string
  content: string | null
  highestScore: number
  createdAt: string
  updatedAt: string
}

export interface QuizzesListResponse {
  success: boolean
  data: QuizApiResponse[]
  count: number
}

export interface Answer {
  _id?: string
  content: string
  isCorrect: boolean
  explain?: string
}

export interface Question {
  _id: string
  name: string
  question: string
  quizId: string
  answers: Answer[]
  userAnswer?: number
  createdAt: string
  updatedAt: string
  explanation?: string
}

export interface QuestionsListResponse {
  success: boolean
  data: Question[]
  count: number
  isReview?: boolean
}

export interface QuizAnswer {
  questionId: string
  selectedAnswer: number
}

export interface SubmitQuizRequest {
  answers: QuizAnswer[]
  timeSpent?: string
}

export interface QuizResult {
  questionId: string
  isCorrect: boolean
  selectedAnswer: number
  correctAnswer: number
}

export interface SubmitQuizResponse {
  success: boolean
  message?: string
  data: {
    quizId: string
    score: number
    correctAnswers: number
    totalQuestions: number
    timeSpent?: string
    completed: boolean
    completedAt?: string
    results: QuizResult[]
  }
}

