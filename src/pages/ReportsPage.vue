<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getDashboardStats } from '@/services/modules/report.service'
import type { ReportData } from '@/services/modules/report.service'
import { formatCurrency } from '@/utils/formatCurrency'

const stats = ref<ReportData | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    stats.value = await getDashboardStats()
  } catch (error) {
    console.error('Failed to load reports:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-[28px] bg-white p-8 shadow-soft">
      <h1 class="text-2xl font-semibold text-[#1A1A2E]">Reports & Analytics</h1>
      <p class="mt-2 text-sm text-[#4B4B6B]">Comprehensive insights into loan performance and business metrics.</p>
    </div>

    <div v-if="loading" class="rounded-[28px] bg-white p-8 shadow-soft">
      <div class="animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div class="space-y-3">
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>

    <div v-else-if="stats" class="grid gap-6 md:grid-cols-2">
      <div class="rounded-[28px] bg-white p-8 shadow-soft">
        <h2 class="text-xl font-semibold text-[#1A1A2E] mb-6">Loan Overview</h2>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-[#4B4B6B]">Total Loans</span>
            <span class="font-semibold text-[#1A1A2E]">{{ stats.totalLoans }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-[#4B4B6B]">Total Amount</span>
            <span class="font-semibold text-[#1A1A2E]">{{ formatCurrency(stats.totalLoanAmount) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-[#4B4B6B]">Average Amount</span>
            <span class="font-semibold text-[#1A1A2E]">{{ formatCurrency(stats.averageLoanAmount) }}</span>
          </div>
        </div>
      </div>

      <div class="rounded-[28px] bg-white p-8 shadow-soft">
        <h2 class="text-xl font-semibold text-[#1A1A2E] mb-6">Loan Status Distribution</h2>
        <div class="space-y-3">
          <div v-for="item in stats.loanStatusDistribution" :key="item.status" class="flex justify-between items-center">
            <span class="text-[#4B4B6B]">{{ item.status }}</span>
            <span class="font-semibold text-[#1A1A2E]">{{ item.count }}</span>
          </div>
        </div>
      </div>

      <div class="rounded-[28px] bg-white p-8 shadow-soft md:col-span-2">
        <h2 class="text-xl font-semibold text-[#1A1A2E] mb-6">Monthly Applications</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="month in stats.monthlyApplications" :key="month.month" class="text-center">
            <div class="text-2xl font-bold text-primary">{{ month.count }}</div>
            <div class="text-sm text-[#4B4B6B]">{{ month.month }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
