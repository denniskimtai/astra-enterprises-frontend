export enum UserRole {
  LOAN_OFFICER = 'LOAN_OFFICER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
}

export interface AuthState {
  user: User | null
  token: string
  refreshToken: string
  isAuthenticated: boolean
}

export interface LoginPayload {
  email: string
  password: string
}
