import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth.store'
import type { AuthResponse } from '@/types/auth.types'

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://loansystem-production-9a0e.up.railway.app'
const API_TIMEOUT_MS = 15000

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const authApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

let refreshRequest: Promise<string> | null = null

api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const authStore = useAuthStore()
    const originalRequest = error.config as RetriableRequestConfig | undefined

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      if (!refreshRequest) {
        refreshRequest = authApi
          .post<AuthResponse>('/api/auth/refresh', {})
          .then((response) => {
            const { accessToken, expiresIn } = response.data
            authStore.setAccessToken(accessToken, expiresIn)
            return accessToken
          })
          .finally(() => {
            refreshRequest = null
          })
      }

      const accessToken = await refreshRequest
      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return api(originalRequest)
    } catch (refreshError) {
      authStore.clearAuth()
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }

      return Promise.reject(refreshError)
    }
  }
)

export default api
