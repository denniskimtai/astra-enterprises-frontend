# AGENTS.md — Quick Reference

> For detailed instructions, see [.github/copilot-instructions.md](.github/copilot-instructions.md)

## Project
- **Name**: Astra Enterprise Loans System - Frontend
- **Stack**: Vue 3 + Vite + TypeScript + Tailwind + Pinia + Vue Router
- **Commands**: `npm run dev` | `npm run build` | `npm run preview`

## Build Commands
| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server (http://localhost:5173) |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build locally |

## Color Tokens
- Primary: `#4F1964` | Primary light: `#6B2385` | Primary dark: `#380F47`
- Secondary: `#F9DA82` | Secondary dark: `#F0C84A`
- Surface: `#FFFFFF` | Surface muted: `#F8F7FA` | Border: `#E5E0EA`
- Text: `#1A1A2E`

## Project Structure
| Directory | Purpose |
|-----------|----------|
| `src/pages/` | Route page views |
| `src/components/ui/` | Atomic primitives (AppButton, AppInput, AppCard, AppBadge) |
| `src/components/shared/` | Complex components (DataTable, PageHeader, StatCard) |
| `src/layouts/` | AuthLayout, DashboardLayout |
| `src/router/` | Route definitions + guards |
| `src/stores/` | Pinia stores (auth, ui) |
| `src/services/` | Axios client + feature services |
| `src/composables/` | Reusable hooks (useAuth, usePermission, usePagination) |
| `src/types/` | TypeScript type definitions |
| `src/utils/` | Helpers (formatCurrency, formatDate, validators) |

## Implemented Routes
| Path | Status |
|------|--------|
| `/login` | Done |
| `/dashboard` | Done |
| `/customers/active` | Done |
| `/customers/leads` | Done |
| `/crm/interactions` | Done |
| `/loans/*` | Placeholder |
| `/payments` | Placeholder |
| `/organization/*` | Placeholder |
| `/reports/*` | Placeholder |
| `/settings` | Placeholder |
| `/403` | Done |
| `*` catch-all | Done |

## Key Patterns
- **Auth**: localStorage key `astra-auth` with `{ user, token, refreshToken }`
- **Routes**: All routes MUST have `meta.layout` and `meta.requiresAuth`
- **API**: Centralized Axios with auto token injection and 401 redirect
- **Components**: Use `<script setup lang="ts">` with strict prop typing

## Common Pitfalls
1. Missing route meta properties (`layout`, `requiresAuth`)
2. Bypassing Axios interceptor (double data extraction)
3. Incorrect component prop typing (use `defineProps<T>()`)
