import { ApiResponse } from "@/type/ApiResponse"
import axiosInstance from "../lib/axios.lib";

export type FileType = '.docx' | '.doc' | '.pdf' | '.md'
export type StatusType = 'ACTIVE' | 'DELETED'


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

export interface File {
  _id: string
  name: string // Tên file gốc (ví dụ: "Calculus Notes.pdf")
  type: FileType // Loại file: .docx, .doc, .pdf, .md
  size: number // Kích thước file tính bằng bytes
  storagePath?: string // Đường dẫn lưu trữ cũ (deprecated, giữ lại để tương thích)
  cloudinaryUrl?: string // URL public từ MinIO để truy cập file
  cloudinaryPublicId?: string // Object key (path) của file trong MinIO bucket (dùng để xóa)
  mimeType?: string // MIME type của file (application/pdf, application/vnd.openxmlformats...)
  subjectId?: string// Tham chiếu đến Subject (môn học)
  summaryContent?: string // Nội dung tóm tắt của file (nếu có)
  summaryCount: number // Số lượng summaries đã tạo từ file này
  quizCount: number // Số lượng quizzes đã tạo từ file này
  uploadDate: Date // Ngày upload file
  status: StatusType // Trạng thái: ACTIVE hoặc DELETED
  createdAt: Date
  updatedAt: Date
}

export interface SubjectDetailDTO {
  id: string
  name: string
  color: string
  createdAt: Date
  files: File[]
}

export interface CreateSubjectInput {
  name: string
  color: string
}
export interface UpdateSubjectInput {
  name: string
  id: string
}

class SubjectService {
  async getAllSubjectByUser(): Promise<ApiResponse<SubjectStatsDTO[]>> {
    const response = await axiosInstance.axiosInstance.get<ApiResponse<SubjectStatsDTO[]>>(`/subjects`)
    return response.data;
  }
  async getSubjectById(subjectId: string): Promise<ApiResponse<SubjectDetailDTO>> {
    const response = await axiosInstance.axiosInstance.get<ApiResponse<SubjectDetailDTO>>(`/subject/${encodeURIComponent(subjectId)}`)
    return response.data;
  }
  async createSubject(data: CreateSubjectInput): Promise<ApiResponse<SubjectStatsDTO>> {
    const response = await axiosInstance.axiosInstance.post<ApiResponse<SubjectStatsDTO>>(`/subjects`, data)
    return response.data;
  }
  async updateSubject(data): Promise<ApiResponse<SubjectStatsDTO>> {
    const response = await axiosInstance.axiosInstance.put<ApiResponse<SubjectStatsDTO>>(`/subjects`, data)
    return response.data;
  }
}

export default new SubjectService();