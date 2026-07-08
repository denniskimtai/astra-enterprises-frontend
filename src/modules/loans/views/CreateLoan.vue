<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { createLoan, getLoans } from '@/services/modules/loan.service'
import { getCustomers, getCustomerById } from '@/services/modules/customer.service'
import { getLoanProducts } from '@/services/modules/loanProduct.service'
import type { Customer } from '@/types/customer.types'
import type { CreateLoanPayload, LoanProduct } from '@/types/loan.types'
import { ArrowLeft, Save, Loader2, Plus, Trash2, AlertCircle } from 'lucide-vue-next'

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

const selectedCustomerDetail = ref<any>(null)
const selectedCustomerLoansCount = ref<number | null>(null)
const checkingCustomerFee = ref(false)

watch(() => form.value.customerId, async (newVal) => {
  if (!newVal) {
    selectedCustomerDetail.value = null
    selectedCustomerLoansCount.value = null
    return
  }
  try {
    checkingCustomerFee.value = true
    const detail = await getCustomerById(newVal)
    selectedCustomerDetail.value = detail
    
    const loansRes = await getLoans({ customerId: newVal })
    selectedCustomerLoansCount.value = loansRes.totalCount ?? loansRes.items.length
  } catch (err) {
    console.error('Error fetching customer fee status:', err)
  } finally {
    checkingCustomerFee.value = false
  }
})

const isRegistrationFeeRequired = computed(() => {
  if (!selectedCustomerDetail.value || selectedCustomerLoansCount.value === null) return false
  if (selectedCustomerDetail.value.status === 'Active') return false
  return selectedCustomerLoansCount.value === 0 && !selectedCustomerDetail.value.registrationFeePaid
})

const selectedProduct = computed(() => {
  return products.value.find(p => p.id === form.value.productId) || null
})

watch([() => form.value.principal, () => form.value.productId], () => {
  if (selectedProduct.value && form.value.principal > 0) {
    form.value.interestAmount = Number((form.value.principal * (selectedProduct.value.interestRate / 100)).toFixed(2))
  }
})

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
  if (isRegistrationFeeRequired.value) {
    alert('This customer must pay the member registration fee of 500 Ksh before applying for a loan.')
    return
  }
  try {
    isLoading.value = true
    
    const payload: CreateLoanPayload = {
      customerId: form.value.customerId,
      productId: form.value.productId,
      loId: form.value.loId,
      coId: form.value.coId,
      principal: form.value.principal,
      interestAmount: form.value.interestAmount,
      type: (form.value.type === 'Automatic' ? 1 : 0) as any,
      addons: form.value.addons.length > 0 ? form.value.addons : undefined,
      deductions: form.value.deductions.length > 0 ? form.value.deductions : undefined
    }

    const loanId = await createLoan(payload)
    router.push(`/loans/${loanId}`)
  } catch (error: any) {
    console.error('Failed to create loan:', error)
    const serverMessage = error.response?.data?.error?.message || error.response?.data?.message || error.message || 'Unknown error'
    alert(`Error creating loan: ${serverMessage}`)
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

        <!-- Warnings / Previews -->
        <div v-if="isRegistrationFeeRequired" class="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-center gap-3">
          <AlertCircle class="w-5 h-5 text-red-500 shrink-0" />
          <div class="text-sm font-medium">
            This customer must pay the member registration fee of 500 Ksh before applying for a loan.
          </div>
        </div>

        <div v-if="selectedProduct && form.principal > 0" class="p-4 rounded-lg bg-gray-50 border border-[#E5E0EA] space-y-2">
          <h3 class="text-sm font-bold text-[#1A1A2E] border-b pb-1.5 uppercase tracking-wide">Loan Summary Preview</h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <p class="text-[#9CA3AF]">Selected Product</p>
              <p class="font-bold text-[#1A1A2E]">{{ selectedProduct.name }}</p>
            </div>
            <div>
              <p class="text-[#9CA3AF]">Interest Rate</p>
              <p class="font-bold text-[#166534]">{{ selectedProduct.interestRate }}%</p>
            </div>
            <div>
              <p class="text-[#9CA3AF]">Calculated Interest</p>
              <p class="font-bold text-[#1A1A2E]">KES {{ form.interestAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</p>
            </div>
            <div>
              <p class="text-[#9CA3AF]">Total Repayable</p>
              <p class="font-extrabold text-[#4F1964] text-sm">KES {{ (form.principal + form.interestAmount).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end pt-4 border-t border-[#E5E0EA]">
          <div class="flex gap-3">
            <button type="button" @click="goBack" class="px-4 py-2 text-sm font-medium text-[#4B4B6B] bg-white border border-[#E5E0EA] rounded-md hover:border-[#4F1964] transition-colors">
              Cancel
            </button>
            <button type="submit" :disabled="isLoading || isRegistrationFeeRequired" class="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-[#4F1964] rounded-md hover:bg-[#380F47] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
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
