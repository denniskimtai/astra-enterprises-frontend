import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'

export function useAuth() {
  const authStore = useAuthStore()
  const { isLoading } = storeToRefs(authStore)

  return {
    login: (email: string, password: string) => authStore.login(email, password),
    logout: () => authStore.logout(),
    isLoading,
    authStore
  }
}
