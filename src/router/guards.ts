import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { UserRole } from '@/types/auth.types'

export default function setupGuards(router: Router) {
  router.beforeEach((to) => {
    const authStore = useAuthStore()
    const requiresAuth = Boolean(to.meta.requiresAuth)
    const guestOnly = Boolean(to.meta.guestOnly)
    const roles = (to.meta.roles ?? []) as UserRole[]

    if (requiresAuth && !authStore.isAuthenticated) {
      return {
        name: 'Login',
        query: { redirect: to.fullPath }
      }
    }

    if (guestOnly && authStore.isAuthenticated) {
      return { name: 'dashboard' }
    }

    if (requiresAuth && roles.length > 0 && !roles.includes(authStore.user?.role ?? UserRole.LOAN_OFFICER)) {
      return { name: 'forbidden' }
    }

    return true
  })
}
