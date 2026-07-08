export enum UserRole {
  LOAN_OFFICER = 'LoanOfficer',
  MANAGER = 'Manager',
  ADMIN = 'Admin',
  COLLECTION_OFFICER = 'CollectionOfficer'
}

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  branchId: string | null
}

export interface AuthResponse {
  accessToken: string
  expiresIn: number
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  expiresAt: number | null
  isInitialized: boolean
  isLoading: boolean
  refreshTimerId: number | null
}

export interface LoginPayload {
  email: string
  password: string
}
