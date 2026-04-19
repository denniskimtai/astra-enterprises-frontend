<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { getDashboardStats } from '@/services/modules/report.service'
import type { ReportData } from '@/services/modules/report.service'

const authStore = useAuthStore()
const stats = ref<ReportData | null>(null)

const greeting = computed(() => {
  if (!authStore.user) {
    return 'Welcome back'
  }

  switch (authStore.user.role) {
    case 'MANAGER':
      return 'Manager dashboard'
    case 'ADMIN':
      return 'Administrator dashboard'
    default:
      return 'Loan officer dashboard'
  }
})

onMounted(async () => {
  try {
    stats.value = await getDashboardStats()
  } catch (error) {
    console.error('Failed to load dashboard stats:', error)
  }
})
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-[28px] bg-white p-8 shadow-soft">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-[#1A1A2E]">{{ greeting }}</h1>
          <p class="mt-2 text-sm text-[#4B4B6B]">Quick access to your active loans, customer pipeline, and role-specific actions.</p>
        </div>
        <div class="rounded-3xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground">Role: {{ authStore.user?.role ?? 'Unknown' }}</div>
      </div>
    </section>

    <section v-if="stats" class="grid gap-4 md:grid-cols-4">
      <div class="rounded-[28px] bg-white p-6 shadow-soft">
        <h2 class="text-lg font-semibold text-[#1A1A2E]">Total Loans</h2>
        <p class="mt-2 text-2xl font-bold text-primary">{{ stats.totalLoans }}</p>
      </div>
      <div class="rounded-[28px] bg-white p-6 shadow-soft">
        <h2 class="text-lg font-semibold text-[#1A1A2E]">Total Amount</h2>
        <p class="mt-2 text-2xl font-bold text-primary">${{ stats.totalLoanAmount.toLocaleString() }}</p>
      </div>
      <div class="rounded-[28px] bg-white p-6 shadow-soft">
        <h2 class="text-lg font-semibold text-[#1A1A2E]">Approved</h2>
        <p class="mt-2 text-2xl font-bold text-green-600">{{ stats.approvedLoans }}</p>
      </div>
      <div class="rounded-[28px] bg-white p-6 shadow-soft">
        <h2 class="text-lg font-semibold text-[#1A1A2E]">Pending</h2>
        <p class="mt-2 text-2xl font-bold text-yellow-600">{{ stats.pendingLoans }}</p>
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-3">
      <div class="rounded-[28px] bg-white p-6 shadow-soft">
        <h2 class="text-lg font-semibold text-[#1A1A2E]">Pipeline health</h2>
        <p class="mt-2 text-sm text-[#4B4B6B]">Review new loan applications and activity by priority.</p>
      </div>
      <div class="rounded-[28px] bg-white p-6 shadow-soft">
        <h2 class="text-lg font-semibold text-[#1A1A2E]">Customer activity</h2>
        <p class="mt-2 text-sm text-[#4B4B6B]">Monitor outreach, approvals, and outstanding requests.</p>
      </div>
      <div class="rounded-[28px] bg-white p-6 shadow-soft">
        <h2 class="text-lg font-semibold text-[#1A1A2E]">System alerts</h2>
        <p class="mt-2 text-sm text-[#4B4B6B]">Critical approvals and compliance reminders are surfaced here.</p>
      </div>
    </section>
  </div>
</template>
