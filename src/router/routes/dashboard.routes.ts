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
    path: '/customers/active/new',
    name: 'customers-active-new',
    component: () => import('@/modules/customers/views/CreateCustomer.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Add New Customer' }
  },
  {
    path: '/customers/leads',
    name: 'customers-leads',
    component: () => import('@/pages/LeadsPage.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Leads' }
  },
  {
    path: '/customers/leads/new',
    name: 'customers-leads-new',
    component: () => import('@/modules/customers/views/CreateCustomer.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Add New Lead' }
  },
  {
    path: '/customers/:id',
    name: 'customer-detail',
    component: () => import('@/modules/customers/views/CustomerDetail.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Customer Details' }
  },
  {
    path: '/crm/interactions',
    name: 'crm-interactions',
    component: () => import('@/pages/InteractionsPage.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Interactions' }
  },
  {
    path: '/crm/interactions/new',
    name: 'crm-interactions-new',
    component: () => import('@/modules/crm/views/CreateInteraction.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Add New Interaction' }
  },
  {
    path: '/loans/all',
    name: 'loans-all',
    component: () => import('@/modules/loans/views/AllLoans.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'All Loans' }
  },
  {
    path: '/loans/defaulters',
    name: 'loans-defaulters',
    component: () => import('@/modules/loans/views/Defaulters.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Defaulters' }
  },
  {
    path: '/loans/installments',
    name: 'loans-installments',
    component: () => import('@/modules/loans/views/Installments.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Installments' }
  },
  {
    path: '/loans/failing-due',
    name: 'loans-failing-due',
    component: () => import('@/modules/loans/views/FailingDue.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Failing Due' }
  },
  {
    path: '/loans/approvals',
    name: 'loans-approvals',
    component: () => import('@/modules/loans/views/Approvals.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Approvals' }
  },
  {
    path: '/loans/new',
    name: 'loans-new',
    component: () => import('@/modules/loans/views/CreateLoan.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'New Loan' }
  },
  {
    path: '/loans/:id',
    name: 'loan-detail',
    component: () => import('@/modules/loans/views/LoanDetail.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Loan Details' }
  },
  {
    path: '/payments',
    name: 'payments',
    component: () => import('@/pages/PaymentsPage.vue'),
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
    path: '/settings/loan-products',
    name: 'settings-loan-products',
    component: () => import('@/modules/settings/views/LoanProductsList.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Loan Products' }
  },
  {
    path: '/403',
    name: 'forbidden',
    component: () => import('@/pages/ForbiddenPage.vue'),
    meta: { layout: 'dashboard', requiresAuth: true }
  }
]

export default dashboardRoutes
