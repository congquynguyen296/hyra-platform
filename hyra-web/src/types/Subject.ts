import { FileMeta } from './File'

export interface SubjectStatsDTO {
  id: string
  name: string
  color: string
  createdAt: Date
  stats: {
    totalFiles: number
    totalSummaries: number
    totalQuizzes: number
  }
}

export interface SubjectDetailDTO {
  id: string
  name: string
  color: string
  createdAt: Date
  files: FileMeta[]
}

export interface CreateSubjectInput {
  name: string
  color: string
}

export interface UpdateSubjectInput {
  name: string
  id: string
}

