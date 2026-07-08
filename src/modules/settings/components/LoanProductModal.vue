<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, Save, Loader2 } from 'lucide-vue-next'
import type { LoanProduct } from '@/types/loan.types'
import { createLoanProduct, updateLoanProduct } from '@/services/modules/loanProduct.service'

const props = defineProps<{
  isOpen: boolean
  productToEdit?: LoanProduct | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const isLoading = ref(false)
const form = ref({
  name: '',
  minAmount: 0,
  maxAmount: 0,
  interestRate: 0,
  repaymentDays: 0
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.productToEdit) {
      form.value = {
        name: props.productToEdit.name,
        minAmount: props.productToEdit.minAmount,
        maxAmount: props.productToEdit.maxAmount,
        interestRate: props.productToEdit.interestRate,
        repaymentDays: props.productToEdit.repaymentDays
      }
    } else {
      form.value = {
        name: '',
        minAmount: 3000,
        maxAmount: 0,
        interestRate: 0,
        repaymentDays: 30
      }
    }
  }
})

const onSubmit = async () => {
  if (form.value.minAmount < 3000) {
    alert('Minimum loan limit must be 3000 Ksh onwards.')
    return
  }

  if (form.value.maxAmount <= form.value.minAmount) {
    alert('Maximum Amount must be greater than Minimum Amount')
    return
  }

  const allowedDays = [30, 60, 90]
  if (!allowedDays.includes(form.value.repaymentDays)) {
    alert('Repayment term must be exactly 30, 60, or 90 days.')
    return
  }

  try {
    isLoading.value = true
    if (props.productToEdit) {
      await updateLoanProduct(props.productToEdit.id, form.value)
    } else {
      await createLoanProduct(form.value)
    }
    emit('saved')
    emit('close')
  } catch (error: any) {
    console.error('Error saving loan product:', error)
    const serverMessage = error.response?.data?.error?.message || error.response?.data?.message || error.message || ''
    const status = error.response?.status
    let alertMsg = 'Failed to save loan product.'
    if (status === 403) {
      alertMsg += '\n\nBackend Error: You lack permissions to manage loan products (403 Forbidden).'
    } else if (serverMessage) {
      alertMsg += `\n\nBackend Error: ${serverMessage}`
    } else {
      alertMsg += '\n\nYou may lack sufficient permissions or a server error occurred.'
    }
    alert(alertMsg)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        <div class="px-6 py-4 border-b border-[#E5E0EA] flex justify-between items-center bg-[#F8F7FA]">
          <h3 class="text-lg font-bold text-[#1A1A2E]">{{ productToEdit ? 'Edit Loan Product' : 'Add Loan Product' }}</h3>
          <button @click="emit('close')" class="text-[#9CA3AF] hover:text-[#4F1964]">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="p-6 overflow-y-auto">
          <form id="productForm" @submit.prevent="onSubmit" class="space-y-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-[#1A1A2E]">Product Name *</label>
              <input 
                type="text" 
                v-model="form.name" 
                required 
                maxlength="100"
                class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]" 
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-[#1A1A2E]">Min Amount *</label>
                <input 
                  type="number" 
                  v-model="form.minAmount" 
                  required 
                  min="3000"
                  step="0.01"
                  class="w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]" 
                  :class="form.minAmount < 3000 && form.minAmount > 0 ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-[#E5E0EA]'"
                />
                <p v-if="form.minAmount < 3000 && form.minAmount > 0" class="text-xs text-red-500">
                  Minimum loan limit must be 3000 Ksh onwards.
                </p>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-[#1A1A2E]">Max Amount *</label>
                <input 
                  type="number" 
                  v-model="form.maxAmount" 
                  required 
                  min="1"
                  step="0.01"
                  class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]" 
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-[#1A1A2E]">Interest Rate (%) *</label>
                <input 
                  type="number" 
                  v-model="form.interestRate" 
                  required 
                  min="0"
                  step="0.01"
                  class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]" 
                />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-[#1A1A2E]">Repayment Days *</label>
                <select 
                  v-model.number="form.repaymentDays" 
                  required 
                  class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964] bg-white"
                >
                  <option :value="30">30 Days</option>
                  <option :value="60">60 Days</option>
                  <option :value="90">90 Days</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <div class="px-6 py-4 border-t border-[#E5E0EA] flex justify-end gap-3 bg-gray-50 mt-auto">
          <button 
            type="button"
            @click="emit('close')" 
            class="px-4 py-2 text-sm font-medium text-[#4B4B6B] bg-white border border-[#E5E0EA] rounded-md hover:border-[#4F1964]"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="productForm"
            :disabled="isLoading"
            class="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-[#4F1964] rounded-md hover:bg-[#380F47] disabled:opacity-50"
          >
            <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
            <Save v-else class="w-4 h-4" />
            Save Product
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>
