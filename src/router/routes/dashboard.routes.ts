import type { RouteRecordRaw } from 'vue-router'

const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/pages/DashboardHome.vue'),
    meta: { layout: 'dashboard', requiresAuth: true }
  },
  {
    path: '/customers/active',
    name: 'customers-active',
    component: () => import('@/pages/ActiveCustomersPage.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Active Customers' }
  },
  {
    path: '/customers/leads',
    name: 'customers-leads',
    component: () => import('@/pages/LeadsPage.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Leads' }
  },
  {
    path: '/crm/interactions',
    name: 'crm-interactions',
    component: () => import('@/pages/InteractionsPage.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Interactions' }
  },
  {
    path: '/loans/all',
    name: 'loans-all',
    component: () => import('@/pages/PagePlaceholder.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'All Loans' }
  },
  {
    path: '/loans/defaulters',
    name: 'loans-defaulters',
    component: () => import('@/pages/PagePlaceholder.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Defaulters' }
  },
  {
    path: '/loans/installments',
    name: 'loans-installments',
    component: () => import('@/pages/PagePlaceholder.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Installments' }
  },
  {
    path: '/loans/failing-due',
    name: 'loans-failing-due',
    component: () => import('@/pages/PagePlaceholder.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Failing Due' }
  },
  {
    path: '/loans/approvals',
    name: 'loans-approvals',
    component: () => import('@/pages/PagePlaceholder.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Approvals' }
  },
  {
    path: '/payments',
    name: 'payments',
    component: () => import('@/pages/PagePlaceholder.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Payments' }
  },
  {
    path: '/organization/staff',
    name: 'organization-staff',
    component: () => import('@/pages/PagePlaceholder.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Staff' }
  },
  {
    path: '/organization/branches',
    name: 'organization-branches',
    component: () => import('@/pages/PagePlaceholder.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Branches' }
  },
  {
    path: '/reports/all',
    name: 'reports-all',
    component: () => import('@/pages/PagePlaceholder.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'All Reports' }
  },
  {
    path: '/reports/locations',
    name: 'reports-locations',
    component: () => import('@/pages/PagePlaceholder.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'All Locations' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/pages/PagePlaceholder.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Settings' }
  },
  {
    path: '/403',
    name: 'forbidden',
    component: () => import('@/pages/ForbiddenPage.vue'),
    meta: { layout: 'dashboard', requiresAuth: true }
  }
]

export default dashboardRoutes
