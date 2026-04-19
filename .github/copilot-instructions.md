# Astra Enterprise Loans System - Frontend Workspace Instructions

## Overview

This is a **Vue 3 + TypeScript + Vite** single-page application for an enterprise loan management system. The project uses a modular, feature-based architecture with role-based access control.

## Tech Stack

- **Framework**: Vue 3 (Composition API) 3.4.0
- **Build Tool**: Vite 5.4.0
- **Language**: TypeScript 5.5.4 (strict mode)
- **State Management**: Pinia 3.0.4
- **Routing**: Vue Router 4.2.0
- **HTTP Client**: Axios 1.6.0
- **Styling**: Tailwind CSS 3.4.0 + PostCSS
- **Package Manager**: npm (ESM modules)

## Essential Commands

```bash
npm run dev       # Start Vite dev server (http://localhost:5173)
npm run build     # TypeScript check + production build
npm run preview   # Preview production build locally
```

## Project Architecture

### Directory Structure

```
src/
├── pages/           # Route pages (LoginPage, DashboardHome, LoansPage)
├── components/      # Reusable UI components
│   ├── shared/      # Complex components (DataTable, PageHeader, StatCard)
│   └── ui/          # Atomic UI primitives (AppButton, AppCard, AppInput)
├── layouts/         # Dynamic layout wrappers (AuthLayout, DashboardLayout)
├── modules/         # Feature barrel exports (auth/, customers/, loans/)
├── stores/          # Pinia stores (auth.store, ui.store)
├── services/        # API layer with Axios
│   └── modules/     # Feature-specific services
├── composables/     # Reusable logic (useAuth, usePermission, usePagination)
├── types/           # Centralized type definitions by feature
├── utils/           # Utility functions (formatCurrency, formatDate, validators)
├── router/          # Vue Router config + guards
└── styles/          # Global Tailwind CSS
```

### Data Flow

**Route → Layout → Page → Components**, with side effects via:
- **Pinia stores**: Global state (auth, UI)
- **Composables**: Reusable logic and lifecycle management
- **Services**: Axios API calls with interceptors
- **Guards**: Router-level access control

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| **Components** | PascalCase | `DataTable.vue`, `AppButton.vue` |
| **Pages** | PascalCase + "Page" | `DashboardHome.vue`, `LoginPage.vue` |
| **Stores** | snake_case + "store" | `auth.store.ts`, `ui.store.ts` |
| **Services** | snake_case + "service" | `auth.service.ts`, `customer.service.ts` |
| **Composables** | camelCase + "use" prefix | `useAuth()`, `usePagination()` |
| **Type Definitions** | snake_case + ".types" | `auth.types.ts`, `loan.types.ts` |
| **Path Alias** | `@/` | Resolves to `src/` |

## Key Patterns

### Authentication & Authorization

**User Session:**
- Persisted in localStorage under key `astra-auth`
- Contains: `{ user, token, refreshToken }`
- Restored automatically on app init via `useAuth().initializeAuth()`

**Role-Based Access Control:**
```typescript
// Enum in auth.types.ts
enum UserRole {
  LOAN_OFFICER = 'LOAN_OFFICER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN'
}

// Route guard checks roles in meta
meta: { layout: 'dashboard', requiresAuth: true, roles: [UserRole.ADMIN] }

// Runtime checks via composable
const { hasRole } = usePermission()
if (hasRole([UserRole.MANAGER, UserRole.ADMIN])) { /* ... */ }
```

**Axios Interceptors:**
- All requests auto-inject `Authorization: Bearer <token>` header
- All 401 responses auto-logout and redirect to `/login`
- Response transformer auto-extracts `response.data`

### Component Development

**Naming & Structure:**
- Use `<script setup lang="ts">` with `defineProps<T>()`
- Use strict prop typing; avoid untyped object syntax
- Separate UI (atomic) from business logic (shared/complex)

**Example Pattern:**
```vue
<script setup lang="ts">
import type { Loan } from '@/types/loan.types'

interface Props {
  loans: Loan[]
  isLoading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{ select: [loan: Loan] }>()
</script>

<template>
  <DataTable :data="loans" :loading="isLoading" @row-click="emit('select', $event)" />
</template>
```

### Routing & Layout Selection

**Dynamic Layouts** (in App.vue):
```typescript
const layoutName = computed(() => route.meta.layout || 'dashboard')
const Layout = defineAsyncComponent(() => import(`@/layouts/${layoutName}.vue`))
```

**All routes MUST include both `layout` and `requiresAuth` meta properties:**
```typescript
{
  path: '/dashboard',
  component: DashboardHome,
  meta: {
    layout: 'dashboard',
    requiresAuth: true,
    roles: [UserRole.LOAN_OFFICER, UserRole.MANAGER]
  }
}
```

**Route Guard Flow:**
1. If `requiresAuth: false` but user authenticated and route is login → redirect to `/dashboard`
2. If `requiresAuth: true` but user not authenticated → redirect to `/login`
3. If `roles` meta exists and user doesn't have role → redirect to `/403`
4. Otherwise allow navigation

### API Services

**Pattern:**
```typescript
// All services use centralized Axios instance with interceptors
import { api } from '@/services/api'

export async function fetchCustomers(): Promise<Customer[]> {
  const response = await api.get<Customer[]>('/customers')
  return response.data // Auto-extracted by interceptor
}
```

**Type Wrapping:**
```typescript
export interface ApiResponse<T> {
  data: T
  message?: string
  meta?: Record<string, unknown>
}
```

### State Management (Pinia)

**Example Store (auth.store.ts):**
```typescript
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = computed(() => !!token.value)

  const setCredentials = (payload: { user: User; token: string; refreshToken: string }) => {
    user.value = payload.user
    token.value = payload.token
    localStorage.setItem('astra-auth', JSON.stringify(payload))
  }

  const clearAuth = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('astra-auth')
  }

  return { user, token, isAuthenticated, setCredentials, clearAuth }
})
```

### Composables

| Composable | Purpose | Key Methods |
|-----------|---------|------------|
| `useAuth()` | Session persistence, login | `login()`, `logout()`, `initializeAuth()` |
| `usePermission()` | Role-based checks | `hasRole()`, `currentRole` (computed) |
| `usePagination()` | Pagination state | `setPage()`, `reset()`, `page`, `pageSize` |
| `useNotification()` | Toast notifications | `push()`, `remove()`, `notifications` (ref) |

## Environment Variables

Defined in `.env.local` (git-ignored):
```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

**Default:** `https://api.example.com` (if undefined)

## Common Pitfalls & How to Avoid

### 1. Missing Route Meta Properties
❌ **Wrong:**
```typescript
{ path: '/admin', component: AdminPage }
```

✅ **Right:**
```typescript
{
  path: '/admin',
  component: AdminPage,
  meta: {
    layout: 'dashboard',
    requiresAuth: true,
    roles: [UserRole.ADMIN]
  }
}
```

### 2. Incorrect Component Prop Typing
❌ **Wrong:**
```typescript
const props = defineProps({
  items: Array
})
```

✅ **Right:**
```typescript
import type { Item } from '@/types/item.types'

const props = defineProps<{
  items: Item[]
}>()
```

### 3. Bypassing Axios Interceptor
❌ **Wrong:**
```typescript
const response = await api.get('/endpoint')
const data = response.data.data // Double extraction!
```

✅ **Right:**
```typescript
const response = await api.get('/endpoint')
const data = response.data // Interceptor already extracted
```

### 4. Auth Guard Logic Confusion
- Route guard checks for authenticated users accessing login page first
- If you redirect in the wrong order, already-logged-in users may loop on login

### 5. Component Placement
- **UI primitives** (buttons, inputs, cards) → `components/ui/`
- **Complex/domain-specific** (DataTable, PageHeader) → `components/shared/`
- **Route pages** → `pages/` (never import directly into other pages)

### 6. Missing Type Definitions
- Always add feature types to `types/<feature>.types.ts`
- Import types from centralized location, don't scatter inline interfaces

### 7. Tailwind Color Usage
- Custom colors in `tailwind.config.ts` (primary, secondary, surface)
- No CSS variable alternatives; don't reference undefined Tailwind colors

## Development Workflow

### Adding a New Feature (Page + Service Pattern)

1. **Create Route** in `src/router/routes/<feature>.routes.ts`:
   ```typescript
   export default [{
     path: '/loans',
     component: LoansPage,
     meta: { layout: 'dashboard', requiresAuth: true, roles: [UserRole.LOAN_OFFICER] }
   }]
   ```

2. **Create Types** in `src/types/<feature>.types.ts`

3. **Create Service** in `src/services/modules/<feature>.service.ts` (uses Axios)

4. **Optional: Create Store** in `src/stores/<feature>.store.ts` (for shared state)

5. **Create Page** in `src/pages/<Feature>Page.vue` (uses service + composable)

6. **Create UI Components** in `src/components/` as needed

7. **Register Route** in `src/router/index.ts`:
   ```typescript
   import featureRoutes from './routes/feature.routes'
   router.addRoutes(featureRoutes)
   ```

### Debugging Tips

- **Dev Server Issues**: Check `VITE_API_BASE_URL` in `.env.local`
- **Route Not Loading**: Verify meta properties (`layout`, `requiresAuth`)
- **Auth Not Persisting**: Check localStorage key `astra-auth` is set
- **API Failures**: Check network tab; Axios interceptor should inject token
- **Component Not Rendering**: Verify it's not wrapped in template condition that hides on auth

## File Locations Reference

| Concern | Location |
|---------|----------|
| View a page | [src/pages/](src/pages/) |
| Add UI component | [src/components/ui/](src/components/ui/) |
| Add complex component | [src/components/shared/](src/components/shared/) |
| Add route | [src/router/routes/](src/router/routes/) |
| Add API service | [src/services/modules/](src/services/modules/) |
| Add types | [src/types/](src/types/) |
| Add composable | [src/composables/](src/composables/) |
| Add store | [src/stores/](src/stores/) |
| Global styles | [src/styles/index.css](src/styles/index.css) |
| Build config | [vite.config.ts](vite.config.ts) |
| Tailwind config | [tailwind.config.ts](tailwind.config.ts) |

## Additional Resources

- **Vue 3 Docs**: https://vuejs.org/
- **TypeScript Vue**: https://vuejs.org/guide/typescript/overview.html
- **Pinia**: https://pinia.vuejs.org/
- **Vue Router**: https://router.vuejs.org/
- **Vite**: https://vitejs.dev/
- **Tailwind CSS**: https://tailwindcss.com/

---

**Last Updated**: April 2026 | **Project**: Astra Enterprise Loans System Frontend
