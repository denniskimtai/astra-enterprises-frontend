import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { login as loginRequest } from '@/services/modules/auth.service'
import type { AuthResponse, LoginPayload, User, UserRole } from '@/types/auth.types'

const STORAGE_KEY = 'astra-auth'
const BYPASS_AUTH = true
const isLoading = ref(false)
let initialized = false

// Mock user for development/testing
const MOCK_USER: User = {
  id: 'dev-user-001',
  name: 'Dev Test User',
  email: 'dev@example.com',
  role: 'ADMIN' as UserRole
}

const MOCK_TOKEN = 'dev-mock-token-' + Date.now()

function restoreSession(authStore: ReturnType<typeof useAuthStore>) {
  if (typeof window === 'undefined') {
    return
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return
  }

  try {
    const payload = JSON.parse(stored) as { user: AuthResponse['user']; token: string; refreshToken?: string }
    if (payload?.token && payload.user) {
      authStore.setCredentials(payload.user, payload.token, payload.refreshToken ?? '')
    }
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
  }
}

function initializePersistence(authStore: ReturnType<typeof useAuthStore>) {
  if (initialized) {
    return
  }

  // If in bypass auth mode, initialize with mock user
  if (BYPASS_AUTH && !authStore.isAuthenticated) {
    authStore.setCredentials(MOCK_USER, MOCK_TOKEN)
  }

  restoreSession(authStore)

  watch(
    () => authStore.token,
    (token) => {
      if (token) {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            user: authStore.user,
            token,
            refreshToken: authStore.refreshToken
          })
        )
        return
      }

      window.localStorage.removeItem(STORAGE_KEY)
    },
    { immediate: true }
  )

  initialized = true
}

export function useAuth() {
  const authStore = useAuthStore()
  initializePersistence(authStore)

  const login = async (email: string, password: string): Promise<boolean> => {
    // In bypass mode, skip actual login call
    if (BYPASS_AUTH) {
      return true
    }

    isLoading.value = true

    try {
      const response = await loginRequest(email, password)
      authStore.setCredentials(response.user, response.token, response.refreshToken ?? '')
      return true
    } catch {
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    login,
    logout: authStore.clearAuth,
    isLoading,
    authStore
  }
}
