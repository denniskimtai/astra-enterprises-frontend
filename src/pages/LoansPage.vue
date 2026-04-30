<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getLoans } from '@/services/modules/loan.service'
import type { Loan } from '@/types/loan.types'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'

const loans = ref<Loan[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    loans.value = await getLoans()
  } catch (error) {
    console.error('Failed to load loans:', error)
  } finally {
    loading.value = false
  }
})

const getStatusColor = (status: string) => {
  switch (status) {
    case 'APPROVED': return 'text-green-600 bg-green-50'
    case 'PENDING': return 'text-yellow-600 bg-yellow-50'
    case 'UNDER_REVIEW': return 'text-blue-600 bg-blue-50'
    case 'REJECTED': return 'text-red-600 bg-red-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-[28px] bg-white p-8 shadow-soft">
      <h1 class="text-2xl font-semibold text-[#1A1A2E]">Loan Pipeline</h1>
      <p class="mt-2 text-sm text-[#4B4B6B]">Manage loan applications, approvals, and disbursements.</p>
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

    <div v-else class="rounded-[28px] bg-white shadow-soft overflow-hidden">
      <div class="px-8 py-6 border-b border-gray-100">
        <h2 class="text-lg font-semibold text-[#1A1A2E]">All Loans</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th class="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest Rate</th>
              <th class="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>
              <th class="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application Date</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="loan in loans" :key="loan.id">
              <td class="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ loan.id }}</td>
              <td class="px-8 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(loan.amount) }}</td>
              <td class="px-8 py-4 whitespace-nowrap text-sm text-gray-900">{{ loan.interestRate }}%</td>
              <td class="px-8 py-4 whitespace-nowrap text-sm text-gray-900">{{ loan.term }} years</td>
              <td class="px-8 py-4 whitespace-nowrap">
                <span :class="['inline-flex px-2 py-1 text-xs font-semibold rounded-full', getStatusColor(loan.status)]">
                  {{ loan.status.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-8 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(loan.applicationDate) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
