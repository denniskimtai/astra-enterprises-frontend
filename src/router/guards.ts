import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { UserRole } from '@/types/auth.types'

const BYPASS_AUTH = import.meta.env.VITE_BYPASS_AUTH === 'true'

export default function setupGuards(router: Router) {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const requiresAuth = Boolean(to.meta.requiresAuth)
    const roles = (to.meta.roles ?? []) as UserRole[]

    // Skip auth checks in bypass mode
    if (BYPASS_AUTH) {
      return next()
    }

    if (requiresAuth && !authStore.isAuthenticated) {
      return next({ name: 'Login' })
    }

    if (!requiresAuth && authStore.isAuthenticated && to.name === 'Login') {
      return next({ name: 'Dashboard' })
    }

    if (requiresAuth && roles.length > 0 && !roles.includes(authStore.user?.role ?? UserRole.LOAN_OFFICER)) {
      return next({ name: 'Forbidden' })
    }

    return next()
  })
}
