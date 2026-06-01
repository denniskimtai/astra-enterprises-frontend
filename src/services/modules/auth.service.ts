import { AxiosError } from 'axios'
import api, { authApi } from '@/services/api'
import type { AuthResponse, User } from '@/types/auth.types'

type LoginField = 'email' | 'password'

interface ValidationErrorResponse {
  title: 'Validation Error'
  errors: string[]
}

interface BusinessErrorResponse {
  title: 'Bad Request'
  error: {
    code: string
    message: string
  }
}

export class AuthApiError extends Error {
  status: number
  fieldErrors: Partial<Record<LoginField, string>>
  errors: string[]

  constructor(message: string, status: number, fieldErrors: Partial<Record<LoginField, string>> = {}, errors: string[] = []) {
    super(message)
    this.name = 'AuthApiError'
    this.status = status
    this.fieldErrors = fieldErrors
    this.errors = errors
  }
}

function toFieldErrors(errors: string[]): Partial<Record<LoginField, string>> {
  return errors.reduce<Partial<Record<LoginField, string>>>((acc, message) => {
    const normalized = message.toLowerCase()
    if (normalized.includes('email')) {
      acc.email = message
    }
    if (normalized.includes('password')) {
      acc.password = message
    }
    return acc
  }, {})
}

function normalizeAuthError(error: unknown): AuthApiError {
  if (!(error instanceof AxiosError)) {
    return new AuthApiError('Something went wrong. Please try again.', 500)
  }

  const status = error.response?.status ?? 500
  const data = error.response?.data as ValidationErrorResponse | BusinessErrorResponse | undefined

  if (status === 400 && data?.title === 'Validation Error' && Array.isArray(data.errors)) {
    return new AuthApiError('Please correct the highlighted fields.', status, toFieldErrors(data.errors), data.errors)
  }

  if (status === 400 && data?.title === 'Bad Request' && data.error?.message) {
    return new AuthApiError(data.error.message, status)
  }

  return new AuthApiError(error.message || 'Authentication failed. Please try again.', status)
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await authApi.post<AuthResponse>('/api/auth/login', { email, password })
    return response.data
  } catch (error) {
    throw normalizeAuthError(error)
  }
}

export async function refreshToken(): Promise<AuthResponse> {
  const response = await authApi.post<AuthResponse>('/api/auth/refresh', {})
  return response.data
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get<User>('/api/auth/me')
  return response.data
}

export async function logout(): Promise<void> {
  await authApi.post('/api/auth/logout', {})
}
