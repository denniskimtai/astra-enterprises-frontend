import axios, { type AxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth.store'
import type { ApiResponse } from '@/types/api.types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token && config.headers) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    const payload = response.data as ApiResponse<unknown>
    return payload?.data ?? payload
  },
  (error: AxiosError<unknown>) => {
    const authStore = useAuthStore()
    if (error.response?.status === 401) {
      authStore.clearAuth()
      window.location.href = '/login'
    }

    const errorMessage = typeof error.response?.data === 'object'
      ? JSON.stringify(error.response.data)
      : error.message

    return Promise.reject({
      status: error.response?.status ?? 500,
      message: errorMessage
    })
  }
)

export default api
