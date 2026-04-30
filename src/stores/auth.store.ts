import { defineStore } from 'pinia'
import type { AuthState, User } from '@/types/auth.types'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: '',
    refreshToken: '',
    isAuthenticated: false
  }),
  getters: {
    role: (state) => state.user?.role ?? null
  },
  actions: {
    setCredentials(user: User, token: string, refreshToken = '') {
      this.user = user
      this.token = token
      this.refreshToken = refreshToken
      this.isAuthenticated = true
    },
    clearAuth() {
      this.user = null
      this.token = ''
      this.refreshToken = ''
      this.isAuthenticated = false
    }
  }
})
