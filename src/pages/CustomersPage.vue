<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getCustomers } from '@/services/modules/customer.service'
import type { Customer } from '@/types/customer.types'
import { formatCurrency } from '@/utils/formatCurrency'

const customers = ref<Customer[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    customers.value = await getCustomers()
  } catch (error) {
    console.error('Failed to load customers:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-[28px] bg-white p-8 shadow-soft">
      <h1 class="text-2xl font-semibold text-[#1A1A2E]">Customer Management</h1>
      <p class="mt-2 text-sm text-[#4B4B6B]">View and manage customer profiles and loan histories.</p>
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

    <div v-else class="grid gap-6 md:grid-cols-2">
      <div v-for="customer in customers" :key="customer.id" class="rounded-[28px] bg-white p-6 shadow-soft">
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-lg font-semibold text-[#1A1A2E]">{{ customer.firstName }} {{ customer.lastName }}</h3>
            <p class="text-sm text-[#4B4B6B]">{{ customer.email }}</p>
            <p class="text-sm text-[#4B4B6B]">{{ customer.phone }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-[#1A1A2E]">Credit Score</p>
            <p class="text-lg font-bold text-primary">{{ customer.creditScore }}</p>
          </div>
        </div>
        <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="font-medium text-[#4B4B6B]">Annual Income</p>
            <p class="text-[#1A1A2E]">{{ formatCurrency(customer.annualIncome) }}</p>
          </div>
          <div>
            <p class="font-medium text-[#4B4B6B]">Employment</p>
            <p class="text-[#1A1A2E]">{{ customer.employmentStatus.replace('_', ' ') }}</p>
          </div>
        </div>
        <div class="mt-4">
          <p class="font-medium text-[#4B4B6B] text-sm">Address</p>
          <p class="text-[#1A1A2E] text-sm">
            {{ customer.address.street }}, {{ customer.address.city }}, {{ customer.address.state }} {{ customer.address.zipCode }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
