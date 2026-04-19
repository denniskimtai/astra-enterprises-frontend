# CLAUDE.md

## Project Overview
- App name: Astra Enterprise Loans System - Frontend
- Purpose: Enterprise loan management dashboard for customer, CRM, loan, payment, organization, and reporting workflows
- Tech stack: Vue 3 + Vite + TypeScript + Tailwind CSS + Pinia + Vue Router

## Color Tokens
- Primary: `#4F1964`
- Primary light: `#6B2385`
- Primary dark: `#380F47`
- Secondary: `#F9DA82`
- Secondary dark: `#F0C84A`
- Surface default: `#FFFFFF`
- Surface muted: `#F8F7FA`
- Surface border: `#E5E0EA`
- Text: `#1A1A2E` (common high-contrast text)
- Border token: `#E5E0EA`

## Project Structure
- `src/pages/` — route page views and page-level presentation
- `src/components/ui/` — atomic primitives: buttons, inputs, cards, badges
- `src/components/shared/` — shared UI components for dashboards and tables
- `src/layouts/` — layout wrappers: `AuthLayout.vue`, `DashboardLayout.vue`
- `src/router/` — route definitions, guard logic, meta-driven layout selection
- `src/stores/` — Pinia stores: auth and UI state
- `src/services/` — centralized Axios client plus feature services
- `src/composables/` — reusable logic hooks like auth, permission, pagination, notifications
- `src/types/` — centralized TypeScript feature type definitions
- `src/utils/` — helper utilities for formatting and validation
- `tailwind.config.ts` — theme tokens and color extension config

## Implemented Routes
| Path | Component | Status |
|---|---|---|
| `/login` | `src/pages/LoginPage.vue` | Done |
| `/dashboard` | `src/pages/DashboardHome.vue` | Done |
| `/customers/active` | `src/pages/ActiveCustomersPage.vue` | Done |
| `/customers/leads` | `src/pages/LeadsPage.vue` | Done |
| `/crm/interactions` | `src/pages/InteractionsPage.vue` | Done |
| `/loans/all` | `src/pages/PagePlaceholder.vue` | Placeholder |
| `/loans/defaulters` | `src/pages/PagePlaceholder.vue` | Placeholder |
| `/loans/installments` | `src/pages/PagePlaceholder.vue` | Placeholder |
| `/loans/failing-due` | `src/pages/PagePlaceholder.vue` | Placeholder |
| `/loans/approvals` | `src/pages/PagePlaceholder.vue` | Placeholder |
| `/payments` | `src/pages/PagePlaceholder.vue` | Placeholder |
| `/organization/staff` | `src/pages/PagePlaceholder.vue` | Placeholder |
| `/organization/branches` | `src/pages/PagePlaceholder.vue` | Placeholder |
| `/reports/all` | `src/pages/PagePlaceholder.vue` | Placeholder |
| `/reports/locations` | `src/pages/PagePlaceholder.vue` | Placeholder |
| `/settings` | `src/pages/PagePlaceholder.vue` | Placeholder |
| `/403` | `src/pages/ForbiddenPage.vue` | Done |
| `*` catch-all | `src/pages/NotFoundPage.vue` | Done |

## Sidebar Navigation
- Customers
  - Active Customers (`/customers/active`) — wired
  - Leads (`/customers/leads`) — wired
- CRM
  - Interactions (`/crm/interactions`) — wired
- Loans
  - All Loans (`/loans/all`) — placeholder
  - Defaulters (`/loans/defaulters`) — placeholder
  - Installments (`/loans/installments`) — placeholder
  - Failing Due (`/loans/failing-due`) — placeholder
  - Approvals (`/loans/approvals`) — placeholder
- Payments
  - Payments (`/payments`) — placeholder
- Organization
  - Staff (`/organization/staff`) — placeholder
  - Branches (`/organization/branches`) — placeholder
- Reports
  - All Reports (`/reports/all`) — placeholder
  - All Locations (`/reports/locations`) — placeholder
- Settings
  - Settings (`/settings`) — placeholder

## Stores
- `src/stores/auth.store.ts`
  - State: `user`, `token`, `refreshToken`, `isAuthenticated`
  - Getters: `role`
  - Actions: `setCredentials(user, token, refreshToken)`, `clearAuth()`
- `src/stores/ui.store.ts`
  - State: `sidebarOpen`, `loading`, `notifications`
  - Actions: `setSidebarOpen(open)`, `toggleSidebar()`, `closeSidebar()`, `setLoading(value)`, `addNotification(notification)`, `removeNotification(id)`

## Reusable Components
### `src/components/ui/`
- `AppBadge.vue` — badge primitive with `primary`, `secondary`, and `muted` variants
- `AppButton.vue` — standard button primitive with primary styling and disabled state support
- `AppCard.vue` — simple rounded card container for page sections
- `AppInput.vue` — styled input primitive with `update:modelValue` binding support

### `src/components/shared/`
- `DashboardStatCard.vue` — KPI stat card used on the dashboard overview
- `DataTable.vue` — simple tabular list component for keyed rows and columns
- `PageHeader.vue` — page heading component with optional description
- `StatCard.vue` — small summary card for numeric values and labels
- `TimeSeriesChart.vue` — line chart wrapper using `vue-chartjs` and `chart.js`

## Patterns & Conventions
- Pages use local state and mock arrays inside the page component rather than per-page stores.
- Layout selection is meta-driven in `src/App.vue`: `dashboard` → `DashboardLayout`, otherwise `AuthLayout`.
- Router guard logic is in `src/router/guards.ts`; it checks `meta.requiresAuth` and supports `meta.roles`.
- API service layer is centralized in `src/services/api.ts` with Axios interceptors:
  - attaches `Authorization: Bearer <token>`
  - auto-redirects on `401`
  - returns `response.data` via `ApiResponse<T>` extraction
- Feature services under `src/services/modules/` declare typed requests, e.g. `auth.service.ts`.
- TypeScript conventions use strict typing and generic wrappers like `ApiResponse<T>`.
- Dashboard pages follow a common page pattern: filter row → summary / records section → card/table layout.
- Badges use color variants in `AppBadge.vue`:
  - `primary` → secondary background with dark text
  - `secondary` → primary background with white text
  - `muted` → surface-muted background with medium gray text

## Pages Implemented
- `src/pages/LoginPage.vue` — login form page
- `src/pages/DashboardHome.vue` — dashboard overview with stat cards and time-series chart
- `src/pages/ActiveCustomersPage.vue` — active customers list with local `ActiveCustomer` interface
- `src/pages/LeadsPage.vue` — leads list with local `Lead` interface
- `src/pages/InteractionsPage.vue` — CRM interactions list with local `Interaction` interface
- `src/pages/ForbiddenPage.vue` — 403 forbidden page
- `src/pages/NotFoundPage.vue` — catch-all 404 page
- `src/pages/PagePlaceholder.vue` — placeholder renderer for unfinished routes

## Known Placeholders
- `src/pages/PagePlaceholder.vue` is used for:
  - `/loans/all`
  - `/loans/defaulters`
  - `/loans/installments`
  - `/loans/failing-due`
  - `/loans/approvals`
  - `/payments`
  - `/organization/staff`
  - `/organization/branches`
  - `/reports/all`
  - `/reports/locations`
  - `/settings`
