<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'
import { UserRole } from '@/types/auth.types'
import {
  Menu,
  Users,
  MessageSquare,
  CreditCard,
  Wallet,
  Building2,
  BarChart2,
  Settings,
  Search,
  Bell,
  Coins,
  ChevronDown,
  ChevronRight
} from 'lucide-vue-next'

const route = useRoute()
const authStore = useAuthStore()
const uiStore = useUiStore()
const openSection = ref<string | null>(null)

const navItems = [
  {
    label: 'Customers',
    icon: Users,
    children: [
      { label: 'Active Customers', path: '/customers/active' },
      { label: 'Leads', path: '/customers/leads' }
    ],
    roles: [UserRole.LOAN_OFFICER, UserRole.MANAGER, UserRole.ADMIN]
  },
  {
    label: 'CRM',
    icon: MessageSquare,
    children: [{ label: 'Interactions', path: '/crm/interactions' }],
    roles: [UserRole.LOAN_OFFICER, UserRole.MANAGER, UserRole.ADMIN]
  },
  {
    label: 'Loans',
    icon: CreditCard,
    children: [
      { label: 'All Loans', path: '/loans/all' },
      { label: 'Defaulters', path: '/loans/defaulters' },
      { label: 'Installments', path: '/loans/installments' },
      { label: 'Failing Due', path: '/loans/failing-due' },
      { label: 'Approvals', path: '/loans/approvals' }
    ],
    roles: [UserRole.LOAN_OFFICER, UserRole.MANAGER, UserRole.ADMIN]
  },
  {
    label: 'Payments',
    icon: Wallet,
    path: '/payments',
    children: [],
    roles: [UserRole.LOAN_OFFICER, UserRole.MANAGER, UserRole.ADMIN]
  },
  {
    label: 'Organization',
    icon: Building2,
    children: [
      { label: 'Staff', path: '/organization/staff' },
      { label: 'Branches', path: '/organization/branches' }
    ],
    roles: [UserRole.LOAN_OFFICER, UserRole.MANAGER, UserRole.ADMIN]
  },
  {
    label: 'Reports',
    icon: BarChart2,
    children: [
      { label: 'All Reports', path: '/reports/all' },
      { label: 'All Locations', path: '/reports/locations' }
    ],
    roles: [UserRole.LOAN_OFFICER, UserRole.MANAGER, UserRole.ADMIN]
  },
  {
    label: 'Settings',
    icon: Settings,
    children: [
      { label: 'Loan Products', path: '/settings/loan-products' }
    ],
    roles: [UserRole.LOAN_OFFICER, UserRole.MANAGER, UserRole.ADMIN]
  }
]

const availableNavigation = computed(() =>
  navItems.filter((item) => item.roles.includes(authStore.user?.role ?? UserRole.LOAN_OFFICER))
)

const logout = async () => {
  await authStore.logout()
}

const isSectionOpen = (item: typeof navItems[number]) => {
  if (item.children.length === 0) return false
  if (openSection.value === item.label) return true
  return item.children.some((child) => child.path === route.path)
}

const toggleSection = (item: typeof navItems[number]) => {
  if (item.children.length === 0) return
  
  // If sidebar is collapsed, expand it first
  if (!uiStore.sidebarOpen) {
    uiStore.setSidebarOpen(true)
    // Set the section to open after the sidebar expands
    setTimeout(() => {
      openSection.value = openSection.value === item.label ? null : item.label
    }, 50)
    return
  }

  // Toggle section
  openSection.value = openSection.value === item.label ? null : item.label
}

const handleNavClick = (item: typeof navItems[number]) => {
  // If sidebar is collapsed, expand it
  if (!uiStore.sidebarOpen && item.children.length > 0) {
    uiStore.setSidebarOpen(true)
    setTimeout(() => {
      openSection.value = item.label
    }, 50)
  }
}

watch(
  () => route.path,
  (newPath) => {
    const activeSection = navItems.find((item) => item.children.some((child) => child.path === newPath))
    if (activeSection) {
      openSection.value = activeSection.label
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-surface-muted text-[#1A1A2E]">
    <!-- Topbar -->
    <div class="fixed top-0 left-0 right-0 h-[52px] bg-[#1e2a38] z-40 flex items-center px-4 shadow-sm">
      <div class="flex items-center justify-between w-full max-w-full gap-4">
        <!-- Left: Hamburger + Logo -->
        <div class="flex items-center gap-4 min-w-0">
          <button
            @click="uiStore.toggleSidebar()"
            class="inline-flex h-10 w-10 items-center justify-center rounded text-white hover:bg-white/10 flex-shrink-0"
            title="Toggle sidebar"
          >
            <Menu :size="20" />
          </button>
          <div class="hidden sm:block text-white font-semibold text-sm tracking-wide flex-shrink-0">
            ASTRA LOANS
          </div>
        </div>

        <!-- Right: Search, Icons, Avatar -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <!-- Search Input -->
          <div class="hidden md:flex items-center gap-2 bg-white/10 rounded-full px-3 py-2">
            <input
              type="text"
              placeholder="Search..."
              class="bg-transparent text-white text-sm outline-none w-40 placeholder-white/50"
            />
            <button class="text-white/70 hover:text-white">
              <Search :size="18" />
            </button>
          </div>

          <!-- Mobile search button -->
          <button class="md:hidden text-white hover:bg-white/10 p-2 rounded">
            <Search :size="18" />
          </button>

          <!-- Notification Bell -->
          <button class="text-white hover:bg-white/10 p-2 rounded relative">
            <Bell :size="18" />
          </button>

          <!-- User Avatar -->
          <div class="flex items-center gap-2">
            <div class="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
              {{ authStore.user?.fullName?.charAt(0) ?? 'A' }}
            </div>
          </div>

          <!-- Wallet/Coin Icon -->
          <button class="text-white hover:bg-white/10 p-2 rounded">
            <Coins :size="18" />
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Area with Sidebar -->
    <div class="flex flex-1 mt-[52px]">
      <!-- Sidebar -->
      <aside
        :class="[
          'bg-[#2c3e50] text-white overflow-y-auto flex-shrink-0',
          'transition-all duration-300 ease-in-out',
          'border-r border-white/5',
          uiStore.sidebarOpen ? 'w-[220px]' : 'w-[60px]'
        ]"
      >
        <div class="flex flex-col h-full px-3 py-4">
          <!-- Navigation Label (only show when expanded) -->
          <div v-show="uiStore.sidebarOpen" class="mb-6 px-2">
            <p class="text-xs uppercase tracking-widest text-white/50 font-semibold">Main Navigation</p>
          </div>

          <!-- Nav Items -->
          <nav class="flex-1 space-y-1">
            <div v-for="item in availableNavigation" :key="item.label" class="space-y-1">
              <!-- Parent Item or Standalone Item -->
              <button
                v-if="item.children.length > 0"
                @click="toggleSection(item)"
                @mouseenter="handleNavClick(item)"
                :class="[
                  'w-full flex items-center justify-between gap-2 px-3 py-2 rounded transition-colors',
                  'hover:bg-white/10 group',
                  isSectionOpen(item) ? 'bg-white/5' : ''
                ]"
                :title="uiStore.sidebarOpen ? '' : item.label"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <component :is="item.icon" :size="18" class="flex-shrink-0" />
                  <span v-show="uiStore.sidebarOpen" class="text-sm font-medium text-white whitespace-nowrap">
                    {{ item.label }}
                  </span>
                </div>
                <component
                  v-show="uiStore.sidebarOpen"
                  :is="isSectionOpen(item) ? ChevronDown : ChevronRight"
                  :size="16"
                  class="flex-shrink-0"
                />
              </button>

              <!-- Standalone Item (no children) -->
              <RouterLink
                v-if="item.children.length === 0 && item.path"
                :to="item.path"
                :class="[
                  'flex items-center gap-3 px-3 py-2 rounded transition-colors',
                  'hover:bg-white/10 group',
                  route.path === item.path ? 'bg-primary/20 border-l-2 border-primary' : ''
                ]"
                :title="uiStore.sidebarOpen ? '' : item.label"
              >
                <component :is="item.icon" :size="18" class="flex-shrink-0" />
                <span v-show="uiStore.sidebarOpen" class="text-sm font-medium text-white whitespace-nowrap">
                  {{ item.label }}
                </span>
              </RouterLink>

              <!-- Children Items -->
              <div v-show="uiStore.sidebarOpen && isSectionOpen(item)" class="ml-6 space-y-1">
                <RouterLink
                  v-for="child in item.children"
                  :key="child.path"
                  :to="child.path"
                  :class="[
                    'block px-3 py-2 rounded text-sm transition-colors',
                    'hover:bg-white/10',
                    route.path === child.path ? 'text-primary font-semibold border-l-2 border-primary' : 'text-white/70'
                  ]"
                >
                  {{ child.label }}
                </RouterLink>
              </div>
            </div>
          </nav>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto">
        <div class="p-6 bg-surface-muted min-h-full">
          <div class="mx-auto max-w-screen-2xl">
            <slot />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
