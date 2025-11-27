export interface LoginWithGoogleResponse {
  valid: boolean
  email: string
  name: string
  image: string
  accessToken: string
  refreshToken: string
}

export interface UserProfileResponse {
  id: string
  name: string
  email: string
  image: string
}

export interface UserStatisticsTrends {
  files: string
  quizzes: string
}

export interface UserStatisticsResponse {
  totalFiles: number
  totalSummaries: number
  totalQuizzes: number
  completedQuizzes: number
  averageScore: string
  trends: UserStatisticsTrends
}

