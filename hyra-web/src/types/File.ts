export type FileType = '.docx' | '.doc' | '.pdf' | '.md'
export type StatusType = 'ACTIVE' | 'DELETED'

export interface FileMeta {
  data: any
  data: any
  id?: string
  _id?: string
  name: string
  type: FileType
  size: number
  storagePath?: string
  cloudinaryUrl?: string
  cloudinaryPublicId?: string
  mimeType?: string
  subjectId?: string
  summaryContent?: string
  summaryCount: number
  quizCount: number
  uploadDate: string | Date
  status: StatusType
  createdAt: string | Date
  updatedAt: string | Date
}

export interface UploadFileOptions {
  subject?: string
  createSummary?: boolean
  generateQuiz?: boolean
  quizQuestions?: number
  quizDifficulty?: string
  name?: string
}

export interface UploadFileResult {
  file: {
    id: string
    name: string
    subject?: string
    uploadDate?: string
    size?: string
    sizeBytes?: number
    mimeType?: string
    summaryCount?: number
    quizCount?: number
    url?: string
    metadata?: Record<string, unknown>
  }
  processing?: Record<string, unknown>
}

export interface FileDto {
  id: string
  name: string
  subject?: string
  uploadDate?: string
  size?: string
  sizeBytes?: number
  mimeType?: string
  summaryCount?: number
  quizCount?: number
  url?: string
  metadata?: Record<string, unknown>
}

export interface SummaryAuthorDto {
  id: string
  name?: string
}

export interface SummaryDto {
  id: string
  createdAt: string
  excerpt?: string
  aiMatchScore?: number | null
  author?: SummaryAuthorDto
  url?: string
}

export interface QuizDto {
  id: string
  createdAt?: string
  questionCount?: number
  averageScore?: number | null
  url?: string
}

export interface FileDetailData {
  file: FileDto
  summaries: SummaryDto[]
  quizzes: QuizDto[]
}
