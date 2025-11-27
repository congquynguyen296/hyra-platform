import { ApiResponse } from "@/types/ApiResponse";
import { axiosClient } from "@/lib/axios.lib";
import { apiRoutes } from "@/routes/apiRoutes";
import {
  LoginWithGoogleResponse,
  UserProfileResponse,
  UserStatisticsResponse,
} from "@/types/User";

class UserService {
  async loginWithGoogle(code: string): Promise<ApiResponse<LoginWithGoogleResponse>> {
    const response = await axiosClient.axiosInstance.post<ApiResponse<LoginWithGoogleResponse>>(
      `${apiRoutes.auth.googleLogin}?code=${encodeURIComponent(code)}`
    );
    return response.data;
  }

  async getUserProfile(): Promise<ApiResponse<UserProfileResponse>> {
    const response = await axiosClient.axiosInstance.get<ApiResponse<UserProfileResponse>>(apiRoutes.users.profile);
    return response.data;
  }

  async getUserStatistics(): Promise<ApiResponse<UserStatisticsResponse>> {
    const response = await axiosClient.axiosInstance.get<ApiResponse<UserStatisticsResponse>>(apiRoutes.users.statistics);
    return response.data;
  }
}

export default new UserService();