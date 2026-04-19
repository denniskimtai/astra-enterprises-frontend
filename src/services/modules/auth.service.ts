import api from '../api'
import type { AuthResponse } from '@/types/auth.types'

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', {
    email,
    password
  })
  
  return response.data
}
