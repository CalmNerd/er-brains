import axios, { type AxiosRequestConfig } from "axios"

import { API_BASE_URL } from "@/lib/api/config"
import { endpoints } from "@/lib/api/endpoints"
import {
  ApiError,
  type ApiErrorResponse,
  type ApiSuccessResponse,
} from "@/lib/api/types"
import { getAuthToken } from "@/lib/auth/storage"
import { logout } from "@/lib/auth/clear-app-state"

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => {
    const body = response.data as ApiSuccessResponse<unknown> | ApiErrorResponse

    if (!body.success) {
      throw new ApiError(body.message, body.error.code, body.error.details)
    }

    return { ...response, data: body.data }
  },
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const requestPath = error.config?.url ?? ""

      if (
        !requestPath.includes(endpoints.auth.login) &&
        !requestPath.includes(endpoints.auth.signup)
      ) {
        logout()

        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
          window.location.href = "/login"
        }
      }
    }

    if (axios.isAxiosError(error) && error.response?.data) {
      const body = error.response.data as ApiErrorResponse

      if (!body.success) {
        throw new ApiError(body.message, body.error?.code, body.error?.details)
      }
    }

    throw new ApiError(
      error instanceof Error ? error.message : "Something went wrong"
    )
  }
)

export async function apiRequest<T>(
  path: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.request<T>({
    url: path,
    ...config,
  })

  return response.data
}
