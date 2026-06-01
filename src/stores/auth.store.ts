import { defineStore } from 'pinia'
import type { AuthState, User } from '@/types/auth.types'

const REFRESH_BUFFER_SECONDS = 60

function getRefreshDelay(expiresIn: number): number {
  if (expiresIn <= REFRESH_BUFFER_SECONDS) {
    return Math.max(1000, Math.floor(expiresIn * 0.8 * 1000))
  }

  return Math.max(1000, (expiresIn - REFRESH_BUFFER_SECONDS) * 1000)
}

function redirectToLogin(): void {
  if (window.location.pathname !== '/login') {
    window.location.assign('/login')
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    expiresAt: null,
    isInitialized: false,
    isLoading: false,
    refreshTimerId: null
  }),
  getters: {
    token: (state) => state.accessToken,
    isAuthenticated: (state) => Boolean(state.accessToken),
    role: (state) => state.user?.role ?? null
  },
  actions: {
    setAccessToken(accessToken: string, expiresIn: number) {
      this.accessToken = accessToken
      this.expiresAt = Date.now() + expiresIn * 1000
      this.scheduleRefresh(expiresIn)
    },
    setUser(user: User) {
      this.user = user
    },
    scheduleRefresh(expiresIn: number) {
      this.clearRefreshTimer()
      this.refreshTimerId = window.setTimeout(() => {
        void this.refreshSession().catch(() => {
          this.clearAuth()
          redirectToLogin()
        })
      }, getRefreshDelay(expiresIn))
    },
    clearRefreshTimer() {
      if (this.refreshTimerId !== null) {
        window.clearTimeout(this.refreshTimerId)
        this.refreshTimerId = null
      }
    },
    clearAuth() {
      this.clearRefreshTimer()
      this.user = null
      this.accessToken = null
      this.expiresAt = null
    },
    async login(email: string, password: string) {
      this.isLoading = true
      try {
        const authService = await import('@/services/modules/auth.service')
        const { accessToken, expiresIn } = await authService.login(email, password)
        this.setAccessToken(accessToken, expiresIn)
        await this.fetchCurrentUser()
      } finally {
        this.isLoading = false
      }
    },
    async refreshSession() {
      const authService = await import('@/services/modules/auth.service')
      const { accessToken, expiresIn } = await authService.refreshToken()
      this.setAccessToken(accessToken, expiresIn)
      return accessToken
    },
    async fetchCurrentUser() {
      const authService = await import('@/services/modules/auth.service')
      const user = await authService.getCurrentUser()
      this.setUser(user)
      return user
    },
    async initializeSession() {
      if (this.isInitialized) {
        return
      }

      try {
        await this.refreshSession()
        await this.fetchCurrentUser()
      } catch {
        this.clearAuth()
      } finally {
        this.isInitialized = true
      }
    },
    async logout() {
      try {
        const authService = await import('@/services/modules/auth.service')
        await authService.logout()
      } finally {
        this.clearAuth()
        redirectToLogin()
      }
    }
  }
})
