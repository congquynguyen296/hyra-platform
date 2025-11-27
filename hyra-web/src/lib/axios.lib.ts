import axios, { AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../store/useAuthStore'
import { API_BASE_URL, API_PREFIX } from '@/routes/apiRoutes'

function getAccessToken(): string | null {
  try {
    const tokenFromStore = useAuthStore.getState().data?.accessToken
    if (tokenFromStore) return tokenFromStore
  } catch {
    // ignore
  }
  try {
    const persisted = localStorage.getItem('user-storage')
    if (persisted) {
      const parsed = JSON.parse(persisted)
      const token = parsed?.state?.data?.accessToken as string | undefined
      if (token) return token
    }
  } catch {
    // ignore
  }
  const legacy = localStorage.getItem('access_token')
  return legacy
}

class AxiosClient {
  public axiosInstance: AxiosInstance

  constructor() {
    const normalizedBase = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL
    this.axiosInstance = axios.create({
      baseURL: `${normalizedBase}${API_PREFIX}`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this._initializeInterceptors()
  }

  private _initializeInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        // Lấy access_token từ Zustand store (persist) hoặc localStorage
        const token = getAccessToken()
        if (token && config.headers) {
          // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTE4MmM1MjA4ZDYyOTgyOTNmYmVlZDEiLCJ0b2tlblR5cGUiOiIxNW0iLCJpYXQiOjE3NjMxOTM5MzYsImV4cCI6MTc3MDk2OTkzNn0.Pi5c6LKz_wHlv6jTNf-N1IOAkjONyuDMzhwEsGfU7Bc'
          config.headers.Authorization = `Bearer ${token}`
          // config.headers.Authorization = `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTE4MmM1MjA4ZDYyOTgyOTNmYmVlZDEiLCJ0b2tlblR5cGUiOiIxNW0iLCJpYXQiOjE3NjMxOTM5MzYsImV4cCI6MTc3MDk2OTkzNn0.Pi5c6LKz_wHlv6jTNf-N1IOAkjONyuDMzhwEsGfU7Bc'}`
        }
        return config
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error: any) => Promise.reject(error)
    )

    this.axiosInstance.interceptors.response.use(this._handleResponse, this._handleError)
  }

  private _handleResponse(response: AxiosResponse): AxiosResponse {
    return response
  }

  private _handleError(error: AxiosError): Promise<unknown> {
    console.error('Axios error:', error.message)
    return Promise.reject(error)
  }
}

// Provide both default and named export to avoid ESM interop issues
export const axiosClient = new AxiosClient()
export default axiosClient
