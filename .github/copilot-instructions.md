# Astra Enterprise Loans System - Frontend

> Quick reference: [CLAUDE.md](../CLAUDE.md)

## Tech Stack
- Vue 3 (Composition API) 3.4.0 + Vite 5.4.0 + TypeScript 5.5.4 (strict)
- Pinia 3.0.4 | Vue Router 4.2.0 | Axios 1.6.0 | Tailwind CSS 3.4.0

## Commands
```bash
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # TypeScript check + production build
npm run preview   # Preview production build locally
```

## Architecture

### Directory Structure
```
src/
├── pages/           # Route pages (LoginPage, DashboardHome, LoansPage)
├── components/     # UI components
│   ├── ui/         # Atomic primitives (AppButton, AppInput, AppCard, AppBadge)
│   └── shared/     # Complex components (DataTable, PageHeader, StatCard)
├── layouts/        # AuthLayout, DashboardLayout
├── stores/         # Pinia stores (auth.store, ui.store)
├── services/      # Axios API layer
│   └── modules/   # Feature services (auth, customer, loan, report)
├── composables/   # Reusable hooks (useAuth, usePermission, usePagination)
├── types/         # TypeScript definitions
├── utils/         # Helpers (formatCurrency, formatDate, validators)
└── router/        # Vue Router config + guards
```

### Data Flow
**Route → Layout → Page → Components** with side effects via:
- Pinia stores (global state)
- Composables (reusable logic)
- Services (API calls)
- Guards (route-level access control)

## Naming Conventions
| Type | Pattern | Example |
|------|---------|---------|
| Components | PascalCase | `DataTable.vue`, `AppButton.vue` |
| Pages | PascalCase + "Page" | `DashboardHome.vue`, `LoginPage.vue` |
| Stores | snake_case + "store" | `auth.store.ts`, `ui.store.ts` |
| Services | snake_case + "service" | `auth.service.ts`, `customer.service.ts` |
| Composables | camelCase + "use" | `useAuth()`, `usePagination()` |
| Types | snake_case + ".types" | `auth.types.ts`, `loan.types.ts` |

## Key Patterns

### Authentication & Authorization
- Session persisted in localStorage key `astra-auth`: `{ user, token, refreshToken }`
- Role enum: `UserRole.LOAN_OFFICER | MANAGER | ADMIN`
- Route meta: `{ layout: 'dashboard', requiresAuth: true, roles: [UserRole.ADMIN] }`
- Runtime check: `usePermission().hasRole([UserRole.MANAGER, UserRole.ADMIN])`

### Axios Interceptors
- Auto-injects `Authorization: Bearer <token>`
- Auto-redirects on `401`
- Response transformer returns `response.data` directly

### Component Development
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
```

### Route Meta (REQUIRED)
```typescript
{
  path: '/dashboard',
  component: DashboardHome,
  meta: {
    layout: 'dashboard',    // Required: 'dashboard' or 'auth'
    requiresAuth: true,     // Required: boolean
    roles: [UserRole.LOAN_OFFICER, UserRole.MANAGER]  // Optional
  }
}
```

### Route Guard Flow
1. `requiresAuth: false` + authenticated + login → redirect `/dashboard`
2. `requiresAuth: true` + not authenticated → redirect `/login`
3. `roles` defined + user lacks role → redirect `/403`
4. Otherwise → allow

### API Service Pattern
```typescript
import { api } from '@/services/api'

export async function fetchCustomers(): Promise<Customer[]> {
  const response = await api.get<Customer[]>('/customers')
  return response.data  // Already extracted by interceptor
}
```

## Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| Missing route meta | Always include `layout` + `requiresAuth` |
| Double data extraction | Use `response.data`, not `response.data.data` |
| Untyped props | Use `defineProps<T>()` with imported types |
| Auth guard loops | Check authenticated-before-login first in guards |

## File Locations
| Concern | Path |
|---------|------|
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

## Color Tokens
- Primary: `#4F1964` | Primary light: `#6B2385` | Primary dark: `#380F47`
- Secondary: `#F9DA82` | Secondary dark: `#F0C84A`
- Surface: `#FFFFFF` | Surface muted: `#F8F7FA` | Border: `#E5E0EA`
- Text: `#1A1A2E`
