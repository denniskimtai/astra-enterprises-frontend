<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Info, Phone, CreditCard, List, Users, Users2,
  Tag, Upload, Pencil, Plus, RefreshCcw, RotateCcw, ExternalLink,
  ThumbsUp, Eye, CheckCircle, MessageSquare, Flag, Trash2, X, AlertCircle
} from 'lucide-vue-next'
import {
  getCustomerById,
  addGuarantor,
  removeGuarantor,
  addReferee,
  removeReferee,
  deleteCustomer,
  payRegistrationFee
} from '@/services/modules/customer.service'
import { useAuthStore } from '@/stores/auth.store'
import { UserRole } from '@/types/auth.types'
import { getBranches } from '@/services/modules/branch.service'
import { getLoans } from '@/services/modules/loan.service'
import { getInteractions } from '@/services/modules/interaction.service'
import type { CustomerDetails } from '@/types/customer.types'
import type { Loan } from '@/types/loan.types'
import type { Interaction } from '@/services/modules/interaction.service'

const router = useRouter()
const route = useRoute()
const customerId = route.params.id as string

const authStore = useAuthStore()

// Pay Registration Fee Modal State
const showPayFeeModal = ref(false)
const payFeeSaving = ref(false)
const payFeeError = ref('')
const payFeeForm = reactive({
  amount: 500,
  transactionCode: '',
  mpesaRef: '',
  payMethod: 0 // 0 = MobilePayment, 1 = Cash, 2 = Bank
})

const canPayRegistrationFee = computed(() => {
  const allowedRoles = [UserRole.ADMIN, UserRole.MANAGER, UserRole.LOAN_OFFICER]
  return allowedRoles.includes(authStore.user?.role ?? UserRole.LOAN_OFFICER)
})

const handlePayRegistrationFee = async () => {
  payFeeError.value = ''
  if (!payFeeForm.transactionCode.trim()) {
    payFeeError.value = 'Please enter a transaction code / reference.'
    return
  }
  payFeeSaving.value = true
  try {
    await payRegistrationFee(customerId, {
      amount: 500,
      transactionCode: payFeeForm.transactionCode.trim(),
      mpesaRef: payFeeForm.transactionCode.trim(),
      payMethod: Number(payFeeForm.payMethod)
    })
    showPayFeeModal.value = false
    payFeeForm.transactionCode = ''
    payFeeForm.payMethod = 0
    await loadData()
  } catch (err: any) {
    payFeeError.value = err.response?.data?.error?.message || 'Failed to submit payment.'
  } finally {
    payFeeSaving.value = false
  }
}

const activeTab = ref('bio')
const customer = ref<CustomerDetails | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Associated data
const loans = ref<Loan[]>([])
const interactions = ref<Interaction[]>([])
const branchName = ref('')

// Add Guarantor Modal State
const showGuarantorModal = ref(false)
const guarantorSaving = ref(false)
const guarantorError = ref('')
const guarantorForm = reactive({
  name: '',
  idNumber: '',
  phone: '',
  amountGuaranteed: 0,
  relationship: ''
})

// Add Referee Modal State
const showRefereeModal = ref(false)
const refereeSaving = ref(false)
const refereeError = ref('')
const refereeForm = reactive({
  name: '',
  phone: '',
  physicalAddress: '',
  relationship: ''
})

const loadData = async () => {
  loading.value = true
  error.value = null
  try {
    // 1. Fetch customer details
    const data = await getCustomerById(customerId)
    customer.value = data

    // 2. Fetch branch name
    try {
      const branchesRes = await getBranches({ page: 1, pageSize: 100 })
      const branch = branchesRes.items.find(b => b.id === data.branchId)
      if (branch) {
        branchName.value = branch.name
      }
    } catch (e) {
      console.error('Failed to load branches:', e)
    }

    // 3. Fetch loans
    try {
      const loansRes = await getLoans({ customerId })
      loans.value = loansRes.items
    } catch (e) {
      console.error('Failed to load customer loans:', e)
    }

    // 4. Fetch interactions
    try {
      const interactionsRes = await getInteractions({ customerId })
      interactions.value = interactionsRes.items
    } catch (e) {
      console.error('Failed to load customer interactions:', e)
    }

  } catch (err: any) {
    console.error('Failed to load customer details:', err)
    error.value = err.response?.data?.error?.message || 'Failed to load customer details.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

const customerInitials = computed(() => {
  if (!customer.value) return ''
  return customer.value.fullName.split(' ').map(p => p[0]).join('').toUpperCase()
})

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 2 }).format(amount)
}

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const formatDateTime = (dateStr: string | null): string => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Actions
const handleAddGuarantor = async () => {
  guarantorError.value = ''
  if (!guarantorForm.name.trim() || !guarantorForm.idNumber.trim() || !guarantorForm.phone.trim() || !guarantorForm.relationship.trim()) {
    guarantorError.value = 'Please fill in all required fields.'
    return
  }
  guarantorSaving.value = true
  try {
    await addGuarantor(customerId, { ...guarantorForm })
    showGuarantorModal.value = false
    // Reset form
    guarantorForm.name = ''
    guarantorForm.idNumber = ''
    guarantorForm.phone = ''
    guarantorForm.amountGuaranteed = 0
    guarantorForm.relationship = ''
    await loadData()
  } catch (err: any) {
    guarantorError.value = err.response?.data?.error?.message || 'Failed to add guarantor.'
  } finally {
    guarantorSaving.value = false
  }
}

const handleRemoveGuarantor = async (guarantorId: string) => {
  if (!confirm('Are you sure you want to remove this guarantor?')) return
  try {
    await removeGuarantor(customerId, guarantorId)
    await loadData()
  } catch (err: any) {
    alert(err.response?.data?.error?.message || 'Failed to remove guarantor.')
  }
}

const handleAddReferee = async () => {
  refereeError.value = ''
  if (!refereeForm.name.trim() || !refereeForm.phone.trim() || !refereeForm.physicalAddress.trim() || !refereeForm.relationship.trim()) {
    refereeError.value = 'Please fill in all required fields.'
    return
  }
  refereeSaving.value = true
  try {
    await addReferee(customerId, { ...refereeForm })
    showRefereeModal.value = false
    // Reset form
    refereeForm.name = ''
    refereeForm.phone = ''
    refereeForm.physicalAddress = ''
    refereeForm.relationship = ''
    await loadData()
  } catch (err: any) {
    refereeError.value = err.response?.data?.error?.message || 'Failed to add referee.'
  } finally {
    refereeSaving.value = false
  }
}

const handleRemoveReferee = async (refereeId: string) => {
  if (!confirm('Are you sure you want to remove this referee?')) return
  try {
    await removeReferee(customerId, refereeId)
    await loadData()
  } catch (err: any) {
    alert(err.response?.data?.error?.message || 'Failed to remove referee.')
  }
}

const handleDeleteCustomer = async () => {
  if (!confirm('Are you sure you want to delete this customer profile? This action soft-deletes the record.')) return
  try {
    await deleteCustomer(customerId)
    router.back()
  } catch (err: any) {
    alert(err.response?.data?.error?.message || 'Failed to delete customer.')
  }
}

const tabs = [
  { id: 'bio', label: 'Bio Info', icon: Info },
  { id: 'contact', label: 'Contact Info', icon: Phone },
  { id: 'account', label: 'Account Info', icon: CreditCard },
  { id: 'guarantors', label: 'Guarantors', icon: Users },
  { id: 'referees', label: 'Referees', icon: Users2 },
  { id: 'interactions', label: 'Interactions', icon: MessageSquare }
]
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-48">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F1964]"></div>
      <p class="mt-4 text-sm text-[#4B4B6B]">Loading customer details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !customer" class="flex flex-col items-center justify-center py-32">
      <div class="text-red-500 mb-4 flex items-center gap-2 font-semibold">
        <AlertCircle class="w-6 h-6" />
        <span>{{ error || 'Customer not found' }}</span>
      </div>
      <button
        class="bg-[#4F1964] hover:bg-[#380F47] text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
        @click="router.back()"
      >
        Go Back
      </button>
    </div>

    <!-- Customer Detail View -->
    <div v-else>
      <!-- Page Header -->
      <div class="px-6 pt-6 pb-2 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-[#1A1A2E]">
          Customer Details
          <span class="text-[#9CA3AF] text-sm ml-2 font-normal">{{ customer.fullName }}</span>
        </h1>
        <button
          @click="handleDeleteCustomer"
          class="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors border border-red-200"
        >
          <Trash2 class="w-3.5 h-3.5" />
          Delete Customer
        </button>
      </div>

      <!-- Tab Navigation -->
      <div class="border-b border-[#E5E0EA] mb-6">
        <div class="flex gap-1 overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="[
              'flex items-center gap-2 px-4 py-3 border-b-2 transition-colors text-sm whitespace-nowrap',
              activeTab === tab.id
                ? 'text-[#4F1964] font-semibold border-[#4F1964]'
                : 'text-[#4B4B6B] border-transparent hover:text-[#4F1964] hover:border-[#C4B5D4]'
            ]"
            @click="activeTab = tab.id"
          >
            <component :is="tab.icon" class="w-4 h-4" />
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="px-6 py-4 flex gap-6 flex-col md:flex-row items-start">
        <!-- Main Content -->
        <div class="flex-1 w-full">
          <!-- Bio Info Tab Content -->
          <div v-if="activeTab === 'bio'" class="space-y-8">
            <!-- Registration Fee Warning Banner -->
            <div 
              v-if="customer && !customer.registrationFeePaid && customer.status !== 'Active' && loans.length === 0"
              class="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div class="flex items-center gap-2">
                <AlertCircle class="w-5 h-5 text-red-500 shrink-0" />
                <div class="text-sm font-medium">
                  This new customer must pay the member registration fee of 500 Ksh before applying for or receiving loans.
                </div>
              </div>
              <button
                v-if="canPayRegistrationFee"
                type="button"
                @click="showPayFeeModal = true"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-xs font-bold transition-colors shrink-0"
              >
                Pay Registration Fee (500 Ksh)
              </button>
            </div>
            <div class="flex flex-col sm:flex-row gap-6">
              <!-- Customer Photo -->
              <div class="w-40 shrink-0 mx-auto sm:mx-0">
                <img
                  v-if="customer.photoUrl"
                  :src="customer.photoUrl"
                  :alt="customer.fullName"
                  class="w-40 h-40 rounded-lg object-cover ring-2 ring-[#E5E0EA]"
                />
                <div
                  v-else
                  class="w-40 h-40 rounded-lg bg-[#EDE9F5] flex items-center justify-center"
                >
                  <span class="text-[#4F1964] text-2xl font-bold">{{ customerInitials }}</span>
                </div>
              </div>

              <!-- Primary Information -->
              <div class="flex-1 space-y-0.5">
                <h2 class="text-lg font-semibold text-[#1A1A2E] mb-3">Primary Information</h2>
                
                <!-- UID -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">UID</span>
                  <span class="text-[#1A1A2E] text-sm font-mono text-xs flex-1">{{ customer.id }}</span>
                </div>
                
                <!-- Full Name -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">Full Name</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">{{ customer.fullName }}</span>
                </div>
                
                <!-- National ID -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">National ID</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">{{ customer.nationalId }}</span>
                </div>
                
                <!-- Primary Mobile -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">Primary Mobile</span>
                  <span class="text-[#4F1964] underline text-sm font-semibold flex-1">{{ customer.phone }}</span>
                </div>
                
                <!-- Physical Address -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">Physical Address</span>
                  <span class="text-[#1A1A2E] text-sm font-medium flex-1">{{ customer.physicalAddress }}</span>
                </div>

                <!-- Town & County -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">Town / County</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">{{ customer.town }}, {{ customer.county }}</span>
                </div>

                <!-- Branch -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">Branch</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">{{ branchName || 'Loading...' }}</span>
                </div>

                <!-- Current Limit -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">Current Limit</span>
                  <span class="text-primary text-sm font-bold flex-1">{{ formatCurrency(customer.currentLimit) }}</span>
                </div>

                <!-- Status -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">Status</span>
                  <span class="flex-1">
                    <span
                      :class="[
                        'px-2 py-0.5 rounded text-xs font-bold uppercase',
                        customer.status === 'Active' ? 'bg-[#DCFCE7] text-[#166534]' :
                        customer.status === 'Lead' ? 'bg-[#FEF9C3] text-[#713F12]' :
                        'bg-gray-100 text-gray-700'
                      ]"
                    >
                      {{ customer.status }}
                    </span>
                  </span>
                </div>

                <!-- Registration Fee Status -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3 items-center">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">Registration Fee</span>
                  <span class="flex-1 flex items-center justify-between gap-4">
                    <span
                      :class="[
                        'px-2 py-0.5 rounded text-xs font-bold uppercase',
                        (customer.registrationFeePaid || customer.status === 'Active') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      ]"
                    >
                      {{ (customer.registrationFeePaid || customer.status === 'Active') ? 'Paid' : 'Unpaid' }}
                    </span>
                    <button
                      v-if="!customer.registrationFeePaid && customer.status !== 'Active' && loans.length === 0 && canPayRegistrationFee"
                      type="button"
                      @click="showPayFeeModal = true"
                      class="bg-[#4F1964] hover:bg-[#380F47] text-white px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors border border-transparent"
                    >
                      <CreditCard class="w-3.5 h-3.5" />
                      Pay Registration Fee (500 Ksh)
                    </button>
                  </span>
                </div>

                <!-- Date Registered -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">Registered At</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">{{ formatDateTime(customer.createdAt) }}</span>
                </div>
              </div>
            </div>

            <!-- Business Information -->
            <div class="space-y-3">
              <h3 class="text-lg font-semibold text-[#1A1A2E] border-b pb-2">Business Information</h3>
              <div v-if="!customer.businessInfo" class="text-sm text-[#9CA3AF] italic px-3 py-1">
                No business information registered for this profile.
              </div>
              <div v-else class="space-y-0.5">
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-64 shrink-0 text-[#4B4B6B] text-sm font-medium">Business Name</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">{{ customer.businessInfo.businessName }}</span>
                </div>
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-64 shrink-0 text-[#4B4B6B] text-sm font-medium">Business Type / Category</span>
                  <span class="text-[#1A1A2E] text-sm font-medium flex-1">{{ customer.businessInfo.businessType }}</span>
                </div>
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-64 shrink-0 text-[#4B4B6B] text-sm font-medium">Years in Business</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">{{ customer.businessInfo.yearsInBusiness }} years</span>
                </div>
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-64 shrink-0 text-[#4B4B6B] text-sm font-medium">Stock Value</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">{{ formatCurrency(customer.businessInfo.currentStockValue) }}</span>
                </div>
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-64 shrink-0 text-[#4B4B6B] text-sm font-medium">Weekly Net Profit</span>
                  <span class="text-[#1A1A2E] text-sm font-bold text-[#166534] flex-1">{{ formatCurrency(customer.businessInfo.weeklyNetProfit) }}</span>
                </div>
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-64 shrink-0 text-[#4B4B6B] text-sm font-medium">Weekly Gross Profit / Expenses</span>
                  <span class="text-[#1A1A2E] text-sm font-medium flex-1">
                    {{ formatCurrency(customer.businessInfo.weeklyGrossProfit) }} / {{ formatCurrency(customer.businessInfo.weeklyExpenses) }}
                  </span>
                </div>
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-64 shrink-0 text-[#4B4B6B] text-sm font-medium">Offers Credit?</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">{{ customer.businessInfo.offersCredit ? 'Yes' : 'No' }}</span>
                </div>
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-64 shrink-0 text-[#4B4B6B] text-sm font-medium">Lead Source / Type</span>
                  <span class="text-[#1A1A2E] text-sm font-medium flex-1">{{ customer.businessInfo.leadType }}</span>
                </div>
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-64 shrink-0 text-[#4B4B6B] text-sm font-medium">Proposed Limit</span>
                  <span class="text-[#1A1A2E] text-sm font-bold flex-1">{{ formatCurrency(customer.businessInfo.proposedLimit) }}</span>
                </div>
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-64 shrink-0 text-[#4B4B6B] text-sm font-medium">Recommended for Lending?</span>
                  <span class="text-sm font-semibold flex-1" :class="customer.businessInfo.wouldLend ? 'text-green-600' : 'text-red-500'">
                    {{ customer.businessInfo.wouldLend ? 'Yes' : 'No' }}
                  </span>
                </div>
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-64 shrink-0 text-[#4B4B6B] text-sm font-medium">Business Direction</span>
                  <span class="text-[#1A1A2E] text-sm font-medium flex-1 leading-relaxed">{{ customer.businessInfo.businessDirection }}</span>
                </div>
              </div>
            </div>

            <!-- Secondary Information -->
            <div class="space-y-3">
              <h3 class="text-lg font-semibold text-[#1A1A2E] border-b pb-2">Secondary Demographic Info</h3>
              <div v-if="!customer.secondaryInfo" class="text-sm text-[#9CA3AF] italic px-3 py-1">
                No secondary demographic info registered.
              </div>
              <div v-else class="space-y-0.5">
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-64 shrink-0 text-[#4B4B6B] text-sm font-medium">Marital Status</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">{{ customer.secondaryInfo.maritalStatus }}</span>
                </div>
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-64 shrink-0 text-[#4B4B6B] text-sm font-medium">Dependents</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">{{ customer.secondaryInfo.dependents }} dependents</span>
                </div>
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-64 shrink-0 text-[#4B4B6B] text-sm font-medium">Home Location (Estate/House)</span>
                  <span class="text-[#1A1A2E] text-sm font-medium flex-1">
                    {{ customer.secondaryInfo.estate || '-' }} (Hse: {{ customer.secondaryInfo.houseNumber || '-' }})
                  </span>
                </div>
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-64 shrink-0 text-[#4B4B6B] text-sm font-medium">Home Ownership</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">{{ customer.secondaryInfo.ownership }}</span>
                </div>
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3" v-if="customer.secondaryInfo.rentAmount">
                  <span class="w-64 shrink-0 text-[#4B4B6B] text-sm font-medium">Monthly Rent Amount</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">{{ formatCurrency(customer.secondaryInfo.rentAmount) }}</span>
                </div>
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-64 shrink-0 text-[#4B4B6B] text-sm font-medium">Estimated Home Asset Value</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">{{ formatCurrency(customer.secondaryInfo.homeAssetValue) }}</span>
                </div>
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-64 shrink-0 text-[#4B4B6B] text-sm font-medium">Nearest Landmark</span>
                  <span class="text-[#1A1A2E] text-sm font-medium flex-1">{{ customer.secondaryInfo.nearestLandmark }}</span>
                </div>
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-64 shrink-0 text-[#4B4B6B] text-sm font-medium">Heard Via</span>
                  <span class="text-[#1A1A2E] text-sm font-medium flex-1">{{ customer.secondaryInfo.heardVia }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Tab -->
          <div v-if="activeTab === 'contact'" class="flex items-center gap-6 p-6 bg-white rounded-lg border border-[#E5E0EA]">
            <div class="w-16 h-16 bg-[#F3F4F6] rounded flex items-center justify-center">
              <Phone class="w-8 h-8 text-[#9CA3AF]" />
            </div>
            <div>
              <span class="text-sm font-bold text-[#1A1A2E]">Primary Phone</span>
              <div class="text-sm text-[#4B4B6B]">{{ customer.phone }}</div>
            </div>
            <div class="ml-12">
              <span class="text-sm font-bold text-[#1A1A2E]">Last Update</span>
              <div class="text-[#9CA3AF] text-xs">{{ formatDate(customer.updatedAt) }}</div>
            </div>
          </div>

          <!-- Account Info Tab -->
          <div v-if="activeTab === 'account'" class="space-y-6">
            <h3 class="text-sm font-bold text-[#4B4B6B] uppercase tracking-widest border-b pb-2">Loans Summary</h3>
            <div v-if="loans.length === 0" class="text-sm text-[#9CA3AF] bg-[#F8F7FA] border border-dashed rounded-lg p-6 text-center">
              No loans found for this customer.
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="loan in loans" :key="loan.id" class="border rounded-lg p-4 shadow-sm bg-white border-[#E5E0EA] space-y-2">
                <div class="flex justify-between items-center border-b pb-2">
                  <span class="text-xs font-mono text-[#9CA3AF]">Loan ID: {{ loan.id.slice(0, 8) }}...</span>
                  <span
                    :class="[
                      'text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase',
                      loan.status === 'APPROVED' ? 'bg-[#DCFCE7] text-[#166534]' :
                      loan.status === 'PENDING' ? 'bg-[#FEF9C3] text-[#713F12]' :
                      'bg-red-100 text-red-700'
                    ]"
                  >
                    {{ loan.status }}
                  </span>
                </div>
                <div class="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p class="text-[#9CA3AF]">Loan Amount</p>
                    <p class="font-bold text-[#1A1A2E] text-sm">{{ formatCurrency(loan.amount) }}</p>
                  </div>
                  <div>
                    <p class="text-[#9CA3AF]">Disbursement Date</p>
                    <p class="font-medium text-[#1A1A2E]">{{ formatDate((loan as any).disbursementDate || loan.createdAt) }}</p>
                  </div>
                  <div>
                    <p class="text-[#9CA3AF]">Due Date</p>
                    <p class="font-medium text-[#1A1A2E]">{{ formatDate(loan.dueDate) }}</p>
                  </div>
                  <div>
                    <p class="text-[#9CA3AF]">Created Date</p>
                    <p class="font-medium text-[#1A1A2E]">{{ formatDate(loan.createdAt) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Guarantors Tab -->
          <div v-if="activeTab === 'guarantors'" class="flex gap-6 p-6 bg-white rounded-lg border border-[#E5E0EA] flex-col sm:flex-row">
            <!-- Left Icon -->
            <div class="w-20 h-20 shrink-0 bg-[#F3F4F6] rounded-lg flex items-center justify-center mx-auto sm:mx-0">
              <Users class="w-10 h-10 text-[#9CA3AF]" />
            </div>
            <!-- Right Content -->
            <div class="flex-1 relative overflow-x-auto">
              <button
                @click="showGuarantorModal = true"
                class="sm:absolute sm:top-0 sm:right-0 mb-4 sm:mb-0 bg-[#166534] hover:bg-[#14532D] text-white px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ml-auto"
              >
                <Plus class="w-4 h-4" />
                Add Guarantor
              </button>
              <table class="w-full mt-2 min-w-[500px]">
                <thead>
                  <tr class="border-b">
                    <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2">Name</th>
                    <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2">ID No.</th>
                    <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2">Mobile No.</th>
                    <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2">Guaranteed</th>
                    <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2">Relationship</th>
                    <th class="text-right text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="customer.guarantors.length === 0">
                    <td colspan="6" class="py-6 text-center text-sm text-[#9CA3AF] italic">No guarantors assigned to this customer.</td>
                  </tr>
                  <tr
                    v-for="(guarantor, index) in customer.guarantors"
                    :key="guarantor.id"
                    :class="['border-b border-[#F3F4F6] text-sm text-[#4B4B6B]', index % 2 === 0 ? 'bg-white' : 'bg-[#F8F7FA]']"
                  >
                    <td class="py-3 px-1">{{ guarantor.name }}</td>
                    <td class="py-3 px-1">{{ guarantor.idNumber }}</td>
                    <td class="py-3 px-1">
                      <span class="text-[#4F1964] underline text-xs cursor-pointer font-medium">{{ guarantor.phone }}</span>
                    </td>
                    <td class="py-3 px-1 text-[#1A1A2E] text-xs font-bold">{{ formatCurrency(guarantor.amountGuaranteed) }}</td>
                    <td class="py-3 px-1">{{ guarantor.relationship }}</td>
                    <td class="py-3 px-1 text-right">
                      <button
                        @click="handleRemoveGuarantor(guarantor.id)"
                        class="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                        title="Remove guarantor"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Referees Tab -->
          <div v-if="activeTab === 'referees'" class="flex gap-6 p-6 bg-white rounded-lg border border-[#E5E0EA] flex-col sm:flex-row">
            <!-- Left Icon -->
            <div class="w-20 h-20 shrink-0 bg-[#F3F4F6] rounded-lg flex items-center justify-center mx-auto sm:mx-0">
              <Users2 class="w-10 h-10 text-[#9CA3AF]" />
            </div>
            <!-- Right Content -->
            <div class="flex-1 relative overflow-x-auto">
              <button
                @click="showRefereeModal = true"
                class="sm:absolute sm:top-0 sm:right-0 mb-4 sm:mb-0 bg-[#166534] hover:bg-[#14532D] text-white px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ml-auto"
              >
                <Plus class="w-4 h-4" />
                Add Referee
              </button>
              <table class="w-full mt-2 min-w-[500px]">
                <thead>
                  <tr class="border-b">
                    <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2">Name</th>
                    <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2">Mobile No.</th>
                    <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2">Physical Address</th>
                    <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2">Relationship</th>
                    <th class="text-right text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="customer.referees.length === 0">
                    <td colspan="5" class="py-6 text-center text-sm text-[#9CA3AF] italic">No referees registered for this customer.</td>
                  </tr>
                  <tr
                    v-for="(referee, index) in customer.referees"
                    :key="referee.id"
                    :class="['border-b border-[#F3F4F6] text-sm text-[#4B4B6B]', index % 2 === 0 ? 'bg-white' : 'bg-[#F8F7FA]']"
                  >
                    <td class="py-3 px-1">{{ referee.name }}</td>
                    <td class="py-3 px-1">
                      <span class="text-[#4F1964] underline text-xs cursor-pointer font-medium">{{ referee.phone }}</span>
                    </td>
                    <td class="py-3 px-1 max-w-xs truncate" :title="referee.physicalAddress">{{ referee.physicalAddress }}</td>
                    <td class="py-3 px-1">{{ referee.relationship }}</td>
                    <td class="py-3 px-1 text-right">
                      <button
                        @click="handleRemoveReferee(referee.id)"
                        class="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                        title="Remove referee"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Interactions Tab -->
          <div v-if="activeTab === 'interactions'" class="flex gap-6 p-6 bg-white rounded-lg border border-[#E5E0EA] flex-col sm:flex-row">
            <!-- Left Icon -->
            <div class="w-20 h-20 shrink-0 bg-[#F3F4F6] rounded-lg flex items-center justify-center mx-auto sm:mx-0">
              <MessageSquare class="w-10 h-10 text-[#9CA3AF]" />
            </div>
            <!-- Right Content -->
            <div class="flex-1 w-full relative overflow-x-auto">
              <button
                @click="router.push(`/crm/interactions/new?customerId=${customerId}`)"
                class="sm:absolute sm:top-0 sm:right-0 mb-4 sm:mb-0 bg-[#166534] hover:bg-[#14532D] text-white px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ml-auto"
              >
                <Plus class="w-4 h-4" />
                Add Interaction
              </button>
              <table class="w-full mt-2 min-w-[600px]">
                <thead>
                  <tr class="border-b">
                    <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2">Mode</th>
                    <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2">Date / Agent</th>
                    <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2">Purpose</th>
                    <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2">Outcome Status / Details</th>
                    <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2">Next Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="interactions.length === 0">
                    <td colspan="5" class="py-6 text-center text-sm text-[#9CA3AF] italic">No interactions recorded yet.</td>
                  </tr>
                  <tr
                    v-for="(interaction, index) in interactions"
                    :key="interaction.id"
                    :class="['border-b border-[#F3F4F6] text-sm text-[#4B4B6B]', index % 2 === 0 ? 'bg-white' : 'bg-[#F8F7FA]']"
                  >
                    <td class="py-3 px-1 font-semibold">{{ interaction.mode }}</td>
                    <td class="py-3 px-1 text-xs">
                      <div>{{ formatDateTime(interaction.interactionAt) }}</div>
                      <div class="text-[#9CA3AF] mt-0.5">By: {{ interaction.agentName }}</div>
                    </td>
                    <td class="py-3 px-1 text-xs">{{ interaction.purpose }}</td>
                    <td class="py-3 px-1 max-w-sm">
                      <div class="inline-flex rounded bg-[#EDE9F5] text-[#4F1964] text-[10px] px-1.5 py-0.5 font-bold mb-1 uppercase">
                        {{ interaction.outcomeStatus }}
                      </div>
                      <div class="text-xs text-[#4B4B6B] leading-relaxed">{{ interaction.outcomeDetails }}</div>
                    </td>
                    <td class="py-3 px-1 text-xs text-[#4B4B6B]">{{ formatDate(interaction.nextInteractionDate) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->

    <!-- Pay Registration Fee Modal -->
    <div v-if="showPayFeeModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full border border-[#E5E0EA] overflow-hidden">
        <div class="bg-[#F8F7FA] px-6 py-4 border-b flex justify-between items-center">
          <h3 class="font-bold text-[#1A1A2E] text-base">Pay Member Registration Fee</h3>
          <button @click="showPayFeeModal = false" class="text-gray-500 hover:text-gray-700">
            <X class="w-5 h-5" />
          </button>
        </div>
        <form @submit.prevent="handlePayRegistrationFee" class="p-6 space-y-4">
          <p v-if="payFeeError" class="text-red-600 bg-red-50 border border-red-200 rounded p-2 text-xs flex items-center gap-1.5">
            <AlertCircle class="w-4 h-4 shrink-0" />
            <span>{{ payFeeError }}</span>
          </p>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-[#4B4B6B]">Amount (KES)</label>
            <input type="text" value="500.00" disabled class="w-full px-3 py-2 border rounded-md text-sm bg-gray-100 text-gray-500 font-bold" />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-[#4B4B6B]">Payment Method *</label>
            <select v-model.number="payFeeForm.payMethod" required class="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#4F1964] bg-white">
              <option :value="0">MobilePayment (MPESA)</option>
              <option :value="1">Cash</option>
              <option :value="2">Bank Transfer</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-[#4B4B6B]">Transaction Code / MPESA Reference *</label>
            <input v-model="payFeeForm.transactionCode" type="text" placeholder="e.g. M123XYZ" required class="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#4F1964]" />
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button type="button" @click="showPayFeeModal = false" class="px-4 py-2 border rounded text-sm text-[#4B4B6B] hover:bg-gray-50">Cancel</button>
            <button type="submit" :disabled="payFeeSaving" class="bg-[#4F1964] hover:bg-[#380F47] text-white px-4 py-2 rounded text-sm font-semibold disabled:opacity-50">
              {{ payFeeSaving ? 'Processing...' : 'Confirm Payment' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Guarantor Modal -->
    <div v-if="showGuarantorModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full border border-[#E5E0EA] overflow-hidden">
        <div class="bg-[#F8F7FA] px-6 py-4 border-b flex justify-between items-center">
          <h3 class="font-bold text-[#1A1A2E] text-base">Add Guarantor</h3>
          <button @click="showGuarantorModal = false" class="text-gray-500 hover:text-gray-700">
            <X class="w-5 h-5" />
          </button>
        </div>
        <form @submit.prevent="handleAddGuarantor" class="p-6 space-y-4">
          <p v-if="guarantorError" class="text-red-600 bg-red-50 border border-red-200 rounded p-2 text-xs flex items-center gap-1.5">
            <AlertCircle class="w-4 h-4 shrink-0" />
            <span>{{ guarantorError }}</span>
          </p>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-[#4B4B6B]">Name *</label>
            <input v-model="guarantorForm.name" type="text" required class="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#4F1964]" />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-[#4B4B6B]">National ID *</label>
            <input v-model="guarantorForm.idNumber" type="text" required class="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#4F1964]" />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-[#4B4B6B]">Phone Number *</label>
            <input v-model="guarantorForm.phone" type="tel" required class="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#4F1964]" />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-[#4B4B6B]">Amount Guaranteed (KES)</label>
            <input v-model.number="guarantorForm.amountGuaranteed" type="number" min="0" class="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#4F1964]" />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-[#4B4B6B]">Relationship *</label>
            <input v-model="guarantorForm.relationship" type="text" placeholder="e.g. Sibling" required class="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#4F1964]" />
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button type="button" @click="showGuarantorModal = false" class="px-4 py-2 border rounded text-sm text-[#4B4B6B] hover:bg-gray-50">Cancel</button>
            <button type="submit" :disabled="guarantorSaving" class="bg-[#166534] hover:bg-[#14532D] text-white px-4 py-2 rounded text-sm font-semibold disabled:opacity-50">
              {{ guarantorSaving ? 'Adding...' : 'Add Guarantor' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Referee Modal -->
    <div v-if="showRefereeModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full border border-[#E5E0EA] overflow-hidden">
        <div class="bg-[#F8F7FA] px-6 py-4 border-b flex justify-between items-center">
          <h3 class="font-bold text-[#1A1A2E] text-base">Add Referee</h3>
          <button @click="showRefereeModal = false" class="text-gray-500 hover:text-gray-700">
            <X class="w-5 h-5" />
          </button>
        </div>
        <form @submit.prevent="handleAddReferee" class="p-6 space-y-4">
          <p v-if="refereeError" class="text-red-600 bg-red-50 border border-red-200 rounded p-2 text-xs flex items-center gap-1.5">
            <AlertCircle class="w-4 h-4 shrink-0" />
            <span>{{ refereeError }}</span>
          </p>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-[#4B4B6B]">Name *</label>
            <input v-model="refereeForm.name" type="text" required class="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#4F1964]" />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-[#4B4B6B]">Phone Number *</label>
            <input v-model="refereeForm.phone" type="tel" required class="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#4F1964]" />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-[#4B4B6B]">Physical Address *</label>
            <input v-model="refereeForm.physicalAddress" type="text" required class="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#4F1964]" />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-[#4B4B6B]">Relationship *</label>
            <input v-model="refereeForm.relationship" type="text" placeholder="e.g. Neighbor" required class="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#4F1964]" />
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button type="button" @click="showRefereeModal = false" class="px-4 py-2 border rounded text-sm text-[#4B4B6B] hover:bg-gray-50">Cancel</button>
            <button type="submit" :disabled="refereeSaving" class="bg-[#166534] hover:bg-[#14532D] text-white px-4 py-2 rounded text-sm font-semibold disabled:opacity-50">
              {{ refereeSaving ? 'Adding...' : 'Add Referee' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>