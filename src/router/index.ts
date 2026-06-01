import { createRouter as createVueRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import authRoutes from './routes/auth.routes'
import dashboardRoutes from './routes/dashboard.routes'
import setupGuards from './guards'

const routes: Array<RouteRecordRaw> = [
  ...authRoutes,
  ...dashboardRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { layout: 'dashboard', requiresAuth: true }
  }
]

const router = createVueRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

setupGuards(router)

export function createRouter() {
  return router
}
