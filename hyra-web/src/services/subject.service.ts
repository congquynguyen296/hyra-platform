import { ApiResponse } from "@/types/ApiResponse"
import { axiosClient } from "@/lib/axios.lib"
import { apiRoutes } from "@/routes/apiRoutes"
import { CreateSubjectInput, SubjectDetailDTO, SubjectStatsDTO, UpdateSubjectInput } from "@/types/Subject"

class SubjectService {
  async getAllSubjectByUser(): Promise<ApiResponse<SubjectStatsDTO[]>> {
    const response = await axiosClient.axiosInstance.get<ApiResponse<SubjectStatsDTO[]>>(apiRoutes.subjects.list)
    return response.data;
  }
  async getSubjectById(subjectId: string): Promise<ApiResponse<SubjectDetailDTO>> {
    const encodedId = encodeURIComponent(subjectId)
    const response = await axiosClient.axiosInstance.get<ApiResponse<SubjectDetailDTO>>(apiRoutes.subjects.detail(encodedId))
    return response.data;
  }
  async createSubject(data: CreateSubjectInput): Promise<ApiResponse<SubjectStatsDTO>> {
    const response = await axiosClient.axiosInstance.post<ApiResponse<SubjectStatsDTO>>(apiRoutes.subjects.create, data)
    return response.data;
  }
  async updateSubject(data: UpdateSubjectInput): Promise<ApiResponse<SubjectStatsDTO>> {
    const encodedId = encodeURIComponent(data.id)
    const response = await axiosClient.axiosInstance.put<ApiResponse<SubjectStatsDTO>>(apiRoutes.subjects.update(encodedId), data)
    return response.data;
  }
}

export default new SubjectService();