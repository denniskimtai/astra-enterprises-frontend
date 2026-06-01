<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { createLoan } from '@/services/modules/loan.service'
import { getCustomers } from '@/services/modules/customer.service'
import { getLoanProducts } from '@/services/modules/loanProduct.service'
import type { Customer } from '@/types/customer.types'
import type { CreateLoanPayload, LoanProduct } from '@/types/loan.types'
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(false)
const customers = ref<Customer[]>([])

const products = ref<LoanProduct[]>([])

const currentUserId = authStore.user?.id ?? '3fa85f64-5717-4562-b3fc-2c963f66afa6'
const currentUserName = authStore.user?.fullName ?? 'Current User'

const officers = [
  { id: currentUserId, name: currentUserName + ' (Me)' },
  { id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', name: 'Grace Achieng' },
  { id: '2ea85f64-5717-4562-b3fc-2c963f66afa5', name: 'Peter Njoroge' },
  { id: '1da85f64-5717-4562-b3fc-2c963f66afa4', name: 'Sarah Wairimu' }
]

const form = ref({
  customerId: '',
  productId: '',
  loId: currentUserId,
  coId: currentUserId,
  principal: 0,
  interestAmount: 0,
  type: 'Manual' as 'Manual' | 'Automatic',
  addons: [] as { name: string; amount: number }[],
  deductions: [] as { name: string; amount: number }[]
})

const fetchCustomers = async () => {
  try {
    const res = await getCustomers({ pageSize: 50 })
    if (res && res.items) {
      customers.value = res.items
    }
  } catch (error) {
    console.error('Failed to load customers:', error)
  }
}

const fetchProducts = async () => {
  try {
    const res = await getLoanProducts({ pageSize: 50 })
    if (res && res.items) {
      products.value = res.items
    }
  } catch (error) {
    console.error('Failed to load loan products:', error)
  }
}

onMounted(() => {
  fetchCustomers()
  fetchProducts()
})

const addAddon = () => {
  form.value.addons.push({ name: '', amount: 0 })
}

const removeAddon = (index: number) => {
  form.value.addons.splice(index, 1)
}

const addDeduction = () => {
  form.value.deductions.push({ name: '', amount: 0 })
}

const removeDeduction = (index: number) => {
  form.value.deductions.splice(index, 1)
}

const onSubmit = async () => {
  try {
    isLoading.value = true
    
    const payload: CreateLoanPayload = {
      customerId: form.value.customerId,
      productId: form.value.productId,
      loId: form.value.loId,
      coId: form.value.coId,
      principal: form.value.principal,
      interestAmount: form.value.interestAmount,
      type: form.value.type,
      addons: form.value.addons.length > 0 ? form.value.addons : undefined,
      deductions: form.value.deductions.length > 0 ? form.value.deductions : undefined
    }

    const loanId = await createLoan(payload)
    router.push(`/loans/${loanId}`)
  } catch (error) {
    console.error('Failed to create loan:', error)
    alert('Error creating loan')
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push('/loans/all')
}
</script>

<template>
  <div class="space-y-6 pb-6 max-w-4xl mx-auto">
    <div class="px-6 py-6 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button @click="goBack" class="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft class="w-5 h-5 text-[#4B4B6B]" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-[#1A1A2E]">New Loan</h1>
          <p class="text-sm text-[#9CA3AF]">Create a new loan application</p>
        </div>
      </div>
    </div>

    <div class="px-6">
      <form @submit.prevent="onSubmit" class="bg-white rounded-lg border border-[#E5E0EA] p-6 space-y-8">
        
        <!-- Core Details -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-[#1A1A2E] border-b border-[#E5E0EA] pb-2">Core Details</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-[#1A1A2E]">Customer *</label>
              <select v-model="form.customerId" required class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964] bg-white">
                <option value="" disabled>Select a customer</option>
                <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.fullName }} ({{ c.phone }})</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-[#1A1A2E]">Loan Type *</label>
              <select v-model="form.type" required class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964] bg-white">
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-[#1A1A2E]">Principal Amount *</label>
              <input type="number" v-model="form.principal" required min="1" step="0.01" class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]" />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-[#1A1A2E]">Interest Amount *</label>
              <input type="number" v-model="form.interestAmount" required min="0" step="0.01" class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]" />
            </div>
            
            <div class="space-y-2 md:col-span-2">
              <label class="block text-sm font-medium text-[#1A1A2E]">Product *</label>
              <select v-model="form.productId" required class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964] bg-white">
                <option value="" disabled>Select a product</option>
                <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-[#1A1A2E]">Loan Officer (LO) *</label>
              <select v-model="form.loId" required class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964] bg-white">
                <option value="" disabled>Select Loan Officer</option>
                <option v-for="o in officers" :key="o.id" :value="o.id">{{ o.name }}</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-[#1A1A2E]">Collection Officer (CO) *</label>
              <select v-model="form.coId" required class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964] bg-white">
                <option value="" disabled>Select Collection Officer</option>
                <option v-for="o in officers" :key="o.id" :value="o.id">{{ o.name }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Addons -->
        <div class="space-y-4">
          <div class="flex items-center justify-between border-b border-[#E5E0EA] pb-2">
            <h2 class="text-lg font-semibold text-[#1A1A2E]">Add-Ons</h2>
            <button type="button" @click="addAddon" class="text-[#4F1964] hover:text-[#380F47] flex items-center gap-1 text-sm font-medium">
              <Plus class="w-4 h-4" /> Add
            </button>
          </div>
          
          <div v-for="(addon, index) in form.addons" :key="index" class="flex gap-4 items-end">
            <div class="flex-1 space-y-2">
              <label class="block text-xs font-medium text-[#4B4B6B]">Addon Name</label>
              <input type="text" v-model="addon.name" required class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]" />
            </div>
            <div class="flex-1 space-y-2">
              <label class="block text-xs font-medium text-[#4B4B6B]">Amount</label>
              <input type="number" v-model="addon.amount" required min="0.01" step="0.01" class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]" />
            </div>
            <button type="button" @click="removeAddon(index)" class="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors mb-0.5">
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
          <p v-if="form.addons.length === 0" class="text-sm text-[#9CA3AF] italic">No addons added.</p>
        </div>

        <!-- Deductions -->
        <div class="space-y-4">
          <div class="flex items-center justify-between border-b border-[#E5E0EA] pb-2">
            <h2 class="text-lg font-semibold text-[#1A1A2E]">Deductions</h2>
            <button type="button" @click="addDeduction" class="text-[#4F1964] hover:text-[#380F47] flex items-center gap-1 text-sm font-medium">
              <Plus class="w-4 h-4" /> Add
            </button>
          </div>
          
          <div v-for="(deduction, index) in form.deductions" :key="index" class="flex gap-4 items-end">
            <div class="flex-1 space-y-2">
              <label class="block text-xs font-medium text-[#4B4B6B]">Deduction Name</label>
              <input type="text" v-model="deduction.name" required class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]" />
            </div>
            <div class="flex-1 space-y-2">
              <label class="block text-xs font-medium text-[#4B4B6B]">Amount</label>
              <input type="number" v-model="deduction.amount" required min="0.01" step="0.01" class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]" />
            </div>
            <button type="button" @click="removeDeduction(index)" class="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors mb-0.5">
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
          <p v-if="form.deductions.length === 0" class="text-sm text-[#9CA3AF] italic">No deductions added.</p>
        </div>

        <!-- Actions -->
        <div class="flex justify-end pt-4 border-t border-[#E5E0EA]">
          <div class="flex gap-3">
            <button type="button" @click="goBack" class="px-4 py-2 text-sm font-medium text-[#4B4B6B] bg-white border border-[#E5E0EA] rounded-md hover:border-[#4F1964] transition-colors">
              Cancel
            </button>
            <button type="submit" :disabled="isLoading" class="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-[#4F1964] rounded-md hover:bg-[#380F47] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
              <Save v-else class="w-4 h-4" />
              {{ isLoading ? 'Creating...' : 'Create Loan' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
