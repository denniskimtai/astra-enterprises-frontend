import { useAuthStore } from '@/stores/auth.store'
import type { UserRole } from '@/types/auth.types'

export function usePermission() {
  const authStore = useAuthStore()

  const hasRole = (roles: UserRole[]) => {
    return roles.includes(authStore.user?.role ?? UserRole.LOAN_OFFICER)
  }

  return {
    currentRole: authStore.user?.role ?? null,
    hasRole
  }
}
