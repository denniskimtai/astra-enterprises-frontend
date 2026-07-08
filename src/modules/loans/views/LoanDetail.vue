<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Info,
  PlusCircle,
  MinusCircle,
  Calendar,
  Tag,
  RefreshCw,
  Clock,
  UserCircle,
  ExternalLink,
  ArrowRight,
  Loader2,
  CheckCircle,
  XCircle,
  Send,
  X,
  Trash2,
  AlertCircle
} from 'lucide-vue-next'
import { getLoanById, approveLoan, rejectLoan, disburseLoan, deleteLoan } from '@/services/modules/loan.service'
import type { Loan } from '@/types/loan.types'
import { useAuthStore } from '@/stores/auth.store'
import { UserRole } from '@/types/auth.types'

const route = useRoute()
const router = useRouter()

const loanId = computed(() => route.params.id as string)
const loan = ref<Loan | null>(null)
const isLoading = ref(true)

const activeTab = ref('loan-info')
const goToLoanId = ref('')

// Action states
const isApproving = ref(false)
const isRejecting = ref(false)
const isDisbursing = ref(false)
const isDeleting = ref(false)

const authStore = useAuthStore()
const currentRole = computed(() => authStore.user?.role ?? null)

const canApprove = computed(() => {
  if (!loan.value || loan.value.status !== 'Created') return false
  
  const role = currentRole.value
  const stage = loan.value.stage
  
  if (role === UserRole.ADMIN) return true
  if (role === UserRole.COLLECTION_OFFICER && stage === 'Initiation') return true
  if (role === UserRole.MANAGER && stage === 'BranchApproval') return true
  
  return false
})

const canReject = computed(() => {
  if (!loan.value || loan.value.status !== 'Created') return false
  
  const allowedRoles = [UserRole.ADMIN, UserRole.MANAGER, UserRole.COLLECTION_OFFICER]
  return allowedRoles.includes(currentRole.value ?? UserRole.LOAN_OFFICER)
})

const canDisburse = computed(() => {
  if (!loan.value || loan.value.status !== 'Approved') return false
  if (loan.value.stage !== 'FinalApproval') return false
  
  const allowedRoles = [UserRole.ADMIN, UserRole.MANAGER, UserRole.LOAN_OFFICER]
  return allowedRoles.includes(currentRole.value ?? UserRole.LOAN_OFFICER)
})

const canDelete = computed(() => {
  const allowedRoles = [UserRole.ADMIN, UserRole.MANAGER]
  return allowedRoles.includes(currentRole.value ?? UserRole.LOAN_OFFICER)
})

const handleDeleteLoan = async () => {
  if (!confirm('Are you sure you want to delete this loan application? This cannot be undone.')) return
  try {
    isDeleting.value = true
    await deleteLoan(loanId.value)
    router.push('/loans/all')
  } catch (e) {
    console.error(e)
    alert('Deletion failed.')
  } finally {
    isDeleting.value = false
  }
}

// Schedules pagination
const schedulePage = ref(1)
const schedulePageSize = ref(10)

const paginatedSchedules = computed(() => {
  if (!loan.value || !loan.value.paySchedules) return []
  const sorted = [...loan.value.paySchedules].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  
  const start = (schedulePage.value - 1) * schedulePageSize.value
  const end = start + schedulePageSize.value
  return sorted.slice(start, end)
})

const scheduleTotalPages = computed(() => {
  if (!loan.value || !loan.value.paySchedules) return 1
  return Math.ceil(loan.value.paySchedules.length / schedulePageSize.value) || 1
})

const scheduleBreakdown = computed(() => {
  if (!loan.value || !loan.value.paySchedules) return { paid: 0, unpaid: 0, overdue: 0 }
  let paid = 0
  let unpaid = 0
  let overdue = 0
  
  loan.value.paySchedules.forEach(s => {
    const status = s.status.toLowerCase()
    if (status === 'repaid' || status === 'paid') paid++
    else if (status === 'overdue') overdue++
    else unpaid++
  })
  
  return { paid, unpaid, overdue }
})

// Disburse Modal State
const showDisburseModal = ref(false)
const disburseForm = ref({
  mpesaCode: '',
  disbursedAt: new Date().toISOString().slice(0, 16)
})

const tabs = [
  { key: 'loan-info', label: 'Loan Info', icon: Info },
  { key: 'addons', label: 'AddOns', icon: PlusCircle },
  { key: 'deductions', label: 'Deductions', icon: MinusCircle },
  { key: 'pay-schedule', label: 'Pay Schedule', icon: Calendar },
  { key: 'collateral', label: 'Collateral', icon: Tag },
  { key: 'repayments', label: 'Repayments', icon: RefreshCw },
  { key: 'events', label: 'Events', icon: Clock }
]

const fetchLoan = async () => {
  try {
    isLoading.value = true
    loan.value = await getLoanById(loanId.value)
  } catch (error) {
    console.error('Error fetching loan:', error)
    alert('Failed to load loan details.')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchLoan()
})

const formatCurrency = (value: number | undefined) => {
  if (value === undefined || value === null) return 'Ksh 0.00'
  return `Ksh ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const formatDate = (isoString: string | null | undefined) => {
  if (!isoString) return 'N/A'
  const d = new Date(isoString)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const goToLoan = () => {
  if (goToLoanId.value) {
    router.push(`/loans/${goToLoanId.value}`)
  }
}

// Actions
const handleApprove = async () => {
  if (!confirm('Are you sure you want to approve this loan?')) return
  try {
    isApproving.value = true
    await approveLoan(loanId.value)
    await fetchLoan()
  } catch (e) {
    console.error(e)
    alert('Approval failed.')
  } finally {
    isApproving.value = false
  }
}

const handleReject = async () => {
  if (!confirm('Are you sure you want to reject this loan?')) return
  try {
    isRejecting.value = true
    await rejectLoan(loanId.value)
    await fetchLoan()
  } catch (e) {
    console.error(e)
    alert('Rejection failed.')
  } finally {
    isRejecting.value = false
  }
}

const handleDisburse = async () => {
  try {
    isDisbursing.value = true
    await disburseLoan(loanId.value, {
      mpesaCode: disburseForm.value.mpesaCode,
      disbursedAt: new Date(disburseForm.value.disbursedAt).toISOString()
    })
    showDisburseModal.value = false
    await fetchLoan()
  } catch (e) {
    console.error(e)
    alert('Disbursement failed.')
  } finally {
    isDisbursing.value = false
  }
}

</script>

<template>
  <div class="min-h-screen bg-white pb-10">
    <div v-if="isLoading" class="flex flex-col items-center justify-center pt-32">
      <Loader2 class="w-8 h-8 animate-spin text-[#4F1964]" />
      <span class="mt-4 text-[#4B4B6B]">Loading loan details...</span>
    </div>

    <div v-else-if="loan">
      <!-- Page Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-[#E5E0EA] flex-wrap gap-4">
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold text-[#1A1A2E]">Loan Details</h1>
          <span class="text-sm text-[#9CA3AF] px-2 py-0.5 bg-gray-100 rounded border border-gray-200">{{ loan.code || loan.id.slice(0, 8) }}</span>
          <span 
            class="text-xs font-bold px-2 py-0.5 rounded-full uppercase"
            :class="{
              'bg-[#F9DA82] text-[#1A1A2E]': loan.status === 'Created' || loan.status === 'Pending',
              'bg-[#166534] text-white': loan.status === 'Approved' || loan.status === 'Cleared',
              'bg-[#4F1964] text-white': loan.status === 'Disbursed',
              'bg-[#E8604A] text-white': loan.status === 'Defaulted' || loan.status === 'Rejected'
            }"
          >
            {{ loan.status }}
          </span>
        </div>
        
        <div class="flex gap-2 items-center flex-wrap">
          <!-- Action Buttons based on state -->
          <button
            v-if="canApprove"
            @click="handleApprove"
            :disabled="isApproving"
            class="inline-flex items-center gap-2 bg-[#166534] hover:bg-[#14532d] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
          >
            <Loader2 v-if="isApproving" class="w-4 h-4 animate-spin" />
            <CheckCircle v-else class="w-4 h-4" /> Approve
          </button>
          
          <button
            v-if="canReject"
            @click="handleReject"
            :disabled="isRejecting"
            class="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
          >
            <Loader2 v-if="isRejecting" class="w-4 h-4 animate-spin" />
            <XCircle v-else class="w-4 h-4" /> Reject
          </button>
          
          <button
            v-if="canDisburse"
            @click="showDisburseModal = true"
            class="inline-flex items-center gap-2 bg-[#4F1964] hover:bg-[#380F47] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
          >
            <Send class="w-4 h-4" /> Disburse
          </button>

          <button
            v-if="canDelete"
            @click="handleDeleteLoan"
            :disabled="isDeleting"
            class="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-1.5 rounded-md text-sm font-medium transition-colors border border-red-200"
          >
            <Loader2 v-if="isDeleting" class="w-4 h-4 animate-spin" />
            <Trash2 v-else class="w-4 h-4" /> Delete Loan
          </button>

          <div class="h-6 w-px bg-[#E5E0EA] mx-2"></div>

          <button
            type="button"
            @click="router.push('/loans/all')"
            class="bg-white border border-[#E5E0EA] text-[#4B4B6B] hover:border-[#4F1964] px-3 py-1.5 rounded-md text-sm transition-colors"
          >
            « Back to List
          </button>
          <input
            v-model="goToLoanId"
            type="text"
            placeholder="Go to Loan ID"
            class="border border-[#E5E0EA] rounded-md px-3 py-1.5 text-sm w-48 outline-none focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]"
            @keyup.enter="goToLoan"
          />
          <button
            type="button"
            @click="goToLoan"
            class="bg-[#4F1964] text-white px-3 py-1.5 rounded-md hover:bg-[#380F47] transition-colors"
          >
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Stepper / Status Bar -->
      <div class="mx-6 my-4 p-4 rounded-lg bg-gray-50 border border-[#E5E0EA]">
        <h3 class="text-xs uppercase tracking-widest text-[#4B4B6B] font-semibold mb-3">Approval Progress Tracker</h3>
        <div class="flex items-center w-full max-w-3xl mx-auto flex-col sm:flex-row gap-4 sm:gap-2">
          <!-- Step 1: Initiation -->
          <div class="flex-1 flex items-center justify-between w-full">
            <div class="flex items-center gap-2">
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors"
                :class="loan.stage === 'Initiation' 
                  ? 'bg-[#4F1964] text-white ring-4 ring-[#EDE9F5]' 
                  : 'bg-green-600 text-white'"
              >
                <span v-if="loan.stage === 'Initiation'">1</span>
                <span v-else>✓</span>
              </div>
              <div>
                <p class="text-sm font-semibold text-[#1A1A2E]">Initiation</p>
                <p class="text-xs text-[#9CA3AF]">Loan Entered</p>
              </div>
            </div>
            <div class="hidden sm:block flex-1 h-0.5 bg-gray-200 mx-4" :class="loan.stage !== 'Initiation' ? 'bg-green-600' : ''"></div>
          </div>

          <!-- Step 2: Branch Approval -->
          <div class="flex-1 flex items-center justify-between w-full">
            <div class="flex items-center gap-2">
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors"
                :class="loan.stage === 'BranchApproval' 
                  ? 'bg-[#4F1964] text-white ring-4 ring-[#EDE9F5]' 
                  : (loan.stage === 'FinalApproval' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500')"
              >
                <span v-if="loan.stage === 'FinalApproval'">✓</span>
                <span v-else>2</span>
              </div>
              <div>
                <p class="text-sm font-semibold text-[#1A1A2E]">Branch Approval</p>
                <p class="text-xs text-[#9CA3AF]">Branch Manager Review</p>
              </div>
            </div>
            <div class="hidden sm:block flex-1 h-0.5 bg-gray-200 mx-4" :class="loan.stage === 'FinalApproval' ? 'bg-green-600' : ''"></div>
          </div>

          <!-- Step 3: Final Approval -->
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors"
              :class="loan.stage === 'FinalApproval' 
                ? 'bg-[#4F1964] text-white ring-4 ring-[#EDE9F5]' 
                : 'bg-gray-200 text-gray-500'"
            >
              <span>3</span>
            </div>
            <div>
              <p class="text-sm font-semibold text-[#1A1A2E]">Final Approval</p>
              <p class="text-xs text-[#9CA3AF]">Direct Admin Release</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-[#E5E0EA] px-6 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          @click="activeTab = tab.key"
          class="flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-colors whitespace-nowrap"
          :class="activeTab === tab.key 
            ? 'border-[#4F1964] text-[#4F1964] font-semibold' 
            : 'border-transparent text-[#4B4B6B] hover:text-[#4F1964]'"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="p-6 max-w-5xl">
        <!-- Loan Info Tab -->
        <div v-if="activeTab === 'loan-info'" class="flex flex-col md:flex-row gap-6 items-start">
          <div class="w-20 h-20 bg-[#F3F4F6] rounded-lg flex items-center justify-center shrink-0 hidden md:flex">
            <Info class="w-10 h-10 text-[#9CA3AF]" />
          </div>

          <div class="flex-1 w-full border border-[#F3F4F6] rounded-lg overflow-hidden">
            <!-- Table Rows -->
            <div class="flex flex-col sm:flex-row border-b border-[#F3F4F6] py-2.5 px-4 bg-white">
              <span class="w-full sm:w-56 shrink-0 text-sm text-[#4B4B6B]">ID</span>
              <span class="flex-1 text-sm text-[#1A1A2E] font-mono font-medium">{{ loan.id }}</span>
            </div>

            <div class="flex flex-col sm:flex-row border-b border-[#F3F4F6] py-2.5 px-4 bg-[#F8F7FA]">
              <span class="w-full sm:w-56 shrink-0 text-sm text-[#4B4B6B]">Customer</span>
              <div class="flex-1 flex items-center gap-1 text-sm text-[#1A1A2E] font-medium">
                {{ loan.customerName }}
                <ExternalLink class="w-3 h-3 text-[#6B2385] cursor-pointer" @click="router.push(`/customers/${loan.customerId}`)" />
              </div>
            </div>

            <div class="flex flex-col sm:flex-row border-b border-[#F3F4F6] py-2.5 px-4 bg-white">
              <span class="w-full sm:w-56 shrink-0 text-sm text-[#4B4B6B]">Product</span>
              <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ loan.product?.name || 'N/A' }}</span>
            </div>

            <div class="flex flex-col sm:flex-row border-b border-[#F3F4F6] py-2.5 px-4 bg-[#F8F7FA]">
              <span class="w-full sm:w-56 shrink-0 text-sm text-[#4B4B6B]">Stage</span>
              <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ loan.stage }}</span>
            </div>

            <div class="flex flex-col sm:flex-row border-b border-[#F3F4F6] py-2.5 px-4 bg-white">
              <span class="w-full sm:w-56 shrink-0 text-sm text-[#4B4B6B]">Type</span>
              <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ loan.type }}</span>
            </div>

            <!-- Financials -->
            <div class="flex flex-col sm:flex-row border-b border-[#F3F4F6] py-2.5 px-4 bg-[#F8F7FA]">
              <span class="w-full sm:w-56 shrink-0 text-sm text-[#4B4B6B]">Principal</span>
              <span class="flex-1 text-base text-[#1A1A2E] font-bold">{{ formatCurrency(loan.principal) }}</span>
            </div>

            <div class="flex flex-col sm:flex-row border-b border-[#F3F4F6] py-2.5 px-4 bg-white">
              <span class="w-full sm:w-56 shrink-0 text-sm text-[#4B4B6B]">Interest Amount</span>
              <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ formatCurrency(loan.interestAmount) }}</span>
            </div>

            <div class="flex flex-col sm:flex-row border-b border-[#F3F4F6] py-2.5 px-4 bg-[#F8F7FA]">
              <span class="w-full sm:w-56 shrink-0 text-sm text-[#4B4B6B]">AddOns Total</span>
              <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ formatCurrency(loan.addOnsTotal) }}</span>
            </div>

            <div class="flex flex-col sm:flex-row border-b border-[#F3F4F6] py-2.5 px-4 bg-white">
              <span class="w-full sm:w-56 shrink-0 text-sm text-[#4B4B6B]">Deductions Total</span>
              <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ formatCurrency(loan.deductionsTotal) }}</span>
            </div>

            <div class="flex flex-col sm:flex-row border-b border-[#F3F4F6] py-2.5 px-4 bg-[#F8F7FA]">
              <span class="w-full sm:w-56 shrink-0 text-sm text-[#4B4B6B]">Penalty Amount</span>
              <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ formatCurrency(loan.penaltyAmount) }}</span>
            </div>

            <div class="flex flex-col sm:flex-row border-b border-[#F3F4F6] py-2.5 px-4 bg-[#E5E0EA]">
              <span class="w-full sm:w-56 shrink-0 text-sm font-bold text-[#1A1A2E] uppercase">Repayable Total</span>
              <span class="flex-1 text-base text-[#1A1A2E] font-bold">{{ formatCurrency(loan.repayableTotal) }}</span>
            </div>

            <div class="flex flex-col sm:flex-row border-b border-[#F3F4F6] py-2.5 px-4 bg-white">
              <span class="w-full sm:w-56 shrink-0 text-sm text-[#4B4B6B]">Repaid Total</span>
              <span class="flex-1 text-sm text-[#166534] font-medium">{{ formatCurrency(loan.repaidTotal) }}</span>
            </div>

            <div class="flex flex-col sm:flex-row border-b border-[#F3F4F6] py-2.5 px-4 bg-[#FDF2F2]">
              <span class="w-full sm:w-56 shrink-0 text-sm font-bold text-[#E8604A] uppercase">Balance</span>
              <span class="flex-1 text-base text-[#E8604A] font-bold">{{ formatCurrency(loan.balance) }}</span>
            </div>

            <!-- Dates -->
            <div class="flex flex-col sm:flex-row border-b border-[#F3F4F6] py-2.5 px-4 bg-white">
              <span class="w-full sm:w-56 shrink-0 text-sm text-[#4B4B6B]">Created At</span>
              <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ formatDate(loan.createdAt) }}</span>
            </div>

            <div class="flex flex-col sm:flex-row border-b border-[#F3F4F6] py-2.5 px-4 bg-[#F8F7FA]">
              <span class="w-full sm:w-56 shrink-0 text-sm text-[#4B4B6B]">Disbursed At</span>
              <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ formatDate(loan.disbursedAt) }}</span>
            </div>

            <div class="flex flex-col sm:flex-row border-b border-[#F3F4F6] py-2.5 px-4 bg-white">
              <span class="w-full sm:w-56 shrink-0 text-sm text-[#4B4B6B]">Due Date</span>
              <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ formatDate(loan.dueDate) }}</span>
            </div>
            
            <div class="flex flex-col sm:flex-row border-b border-[#F3F4F6] py-2.5 px-4 bg-[#F8F7FA]">
              <span class="w-full sm:w-56 shrink-0 text-sm text-[#4B4B6B]">Mpesa Code</span>
              <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ loan.mpesaCode || '-' }}</span>
            </div>

          </div>
        </div>

        <!-- AddOns Tab -->
        <div v-else-if="activeTab === 'addons'" class="space-y-4">
          <div v-if="loan.addons && loan.addons.length > 0" class="overflow-x-auto rounded-lg border border-[#E5E0EA]">
            <table class="min-w-full text-sm">
              <thead class="bg-[#F8F7FA]">
                <tr>
                  <th class="px-4 py-3 text-left font-semibold text-[#4B4B6B]">Name</th>
                  <th class="px-4 py-3 text-left font-semibold text-[#4B4B6B]">Amount</th>
                  <th class="px-4 py-3 text-left font-semibold text-[#4B4B6B]">Applied</th>
                  <th class="px-4 py-3 text-left font-semibold text-[#4B4B6B]">Applied At</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="addon in loan.addons" :key="addon.id" class="border-t border-[#E5E0EA] bg-white">
                  <td class="px-4 py-3 font-medium text-[#1A1A2E]">{{ addon.name }}</td>
                  <td class="px-4 py-3 text-[#1A1A2E]">{{ formatCurrency(addon.amount) }}</td>
                  <td class="px-4 py-3">
                    <span v-if="addon.isApplied" class="px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs font-bold">Yes</span>
                    <span v-else class="px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-xs font-bold">No</span>
                  </td>
                  <td class="px-4 py-3 text-[#4B4B6B]">{{ formatDate(addon.appliedAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="text-sm text-[#9CA3AF] italic p-6 text-center border border-[#E5E0EA] rounded-lg bg-gray-50">No AddOns available for this loan.</p>
        </div>

        <!-- Deductions Tab -->
        <div v-else-if="activeTab === 'deductions'" class="space-y-4">
          <div v-if="loan.deductions && loan.deductions.length > 0" class="overflow-x-auto rounded-lg border border-[#E5E0EA]">
            <table class="min-w-full text-sm">
              <thead class="bg-[#F8F7FA]">
                <tr>
                  <th class="px-4 py-3 text-left font-semibold text-[#4B4B6B]">Name</th>
                  <th class="px-4 py-3 text-left font-semibold text-[#4B4B6B]">Amount</th>
                  <th class="px-4 py-3 text-left font-semibold text-[#4B4B6B]">Applied</th>
                  <th class="px-4 py-3 text-left font-semibold text-[#4B4B6B]">Applied At</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ded in loan.deductions" :key="ded.id" class="border-t border-[#E5E0EA] bg-white">
                  <td class="px-4 py-3 font-medium text-[#1A1A2E]">{{ ded.name }}</td>
                  <td class="px-4 py-3 text-[#1A1A2E]">{{ formatCurrency(ded.amount) }}</td>
                  <td class="px-4 py-3">
                    <span v-if="ded.isApplied" class="px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs font-bold">Yes</span>
                    <span v-else class="px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-xs font-bold">No</span>
                  </td>
                  <td class="px-4 py-3 text-[#4B4B6B]">{{ formatDate(ded.appliedAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="text-sm text-[#9CA3AF] italic p-6 text-center border border-[#E5E0EA] rounded-lg bg-gray-50">No Deductions available for this loan.</p>
        </div>

        <!-- Pay Schedule Tab -->
        <div v-else-if="activeTab === 'pay-schedule'" class="space-y-6">
          <!-- Schedules Breakdown Card -->
          <div class="grid grid-cols-3 gap-4">
            <div class="p-4 rounded-lg bg-green-50 border border-green-100">
              <span class="text-xs text-green-800 font-semibold uppercase">Paid</span>
              <p class="text-2xl font-bold text-green-900 mt-1">{{ scheduleBreakdown.paid }}</p>
            </div>
            <div class="p-4 rounded-lg bg-yellow-50 border border-yellow-100">
              <span class="text-xs text-yellow-800 font-semibold uppercase">Unpaid</span>
              <p class="text-2xl font-bold text-yellow-900 mt-1">{{ scheduleBreakdown.unpaid }}</p>
            </div>
            <div class="p-4 rounded-lg bg-red-50 border border-red-100">
              <span class="text-xs text-red-800 font-semibold uppercase">Overdue</span>
              <p class="text-2xl font-bold text-red-900 mt-1">{{ scheduleBreakdown.overdue }}</p>
            </div>
          </div>

          <div v-if="paginatedSchedules.length > 0" class="space-y-4">
            <div class="overflow-x-auto rounded-lg border border-[#E5E0EA]">
              <table class="min-w-full text-sm">
                <thead class="bg-[#F8F7FA]">
                  <tr>
                    <th class="px-4 py-3 text-left font-semibold text-[#4B4B6B]">Installment #</th>
                    <th class="px-4 py-3 text-left font-semibold text-[#4B4B6B]">Due Date</th>
                    <th class="px-4 py-3 text-left font-semibold text-[#4B4B6B]">Amount Due</th>
                    <th class="px-4 py-3 text-left font-semibold text-[#4B4B6B]">Amount Paid</th>
                    <th class="px-4 py-3 text-left font-semibold text-[#4B4B6B]">Balance</th>
                    <th class="px-4 py-3 text-left font-semibold text-[#4B4B6B]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(sched, index) in paginatedSchedules" :key="sched.id" class="border-t border-[#E5E0EA] bg-white">
                    <td class="px-4 py-3 font-semibold text-[#1A1A2E]">
                      Installment #{{ (schedulePage - 1) * schedulePageSize + index + 1 }}
                    </td>
                    <td class="px-4 py-3 text-[#1A1A2E]">{{ formatDate(sched.dueDate) }}</td>
                    <td class="px-4 py-3 font-bold text-[#1A1A2E]">{{ formatCurrency(sched.amountDue) }}</td>
                    <td class="px-4 py-3 text-[#166534] font-medium">{{ formatCurrency(sched.amountPaid) }}</td>
                    <td class="px-4 py-3 text-[#E8604A] font-semibold">{{ formatCurrency(sched.balance) }}</td>
                    <td class="px-4 py-3">
                      <span 
                        class="px-2 py-0.5 rounded-sm text-xs font-bold" 
                        :class="sched.status.toLowerCase() === 'repaid' || sched.status.toLowerCase() === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : (sched.status.toLowerCase() === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800')"
                      >
                        {{ sched.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Schedules Pagination Controls -->
            <div class="flex items-center justify-between border border-[#E5E0EA] rounded-lg p-3 bg-[#F8F7FA]">
              <span class="text-xs text-[#4B4B6B]">
                Page {{ schedulePage }} of {{ scheduleTotalPages }} (Total {{ loan.paySchedules.length }} installments)
              </span>
              <div class="flex gap-2">
                <button 
                  type="button"
                  :disabled="schedulePage === 1"
                  @click="schedulePage--"
                  class="px-3 py-1 text-xs border border-[#E5E0EA] rounded-md bg-white disabled:opacity-40 hover:border-primary transition-colors text-[#4B4B6B]"
                >
                  Previous
                </button>
                <button 
                  type="button"
                  :disabled="schedulePage >= scheduleTotalPages"
                  @click="schedulePage++"
                  class="px-3 py-1 text-xs border border-[#E5E0EA] rounded-md bg-white disabled:opacity-40 hover:border-primary transition-colors text-[#4B4B6B]"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          <p v-else class="text-sm text-[#9CA3AF] italic p-6 text-center border border-[#E5E0EA] rounded-lg bg-gray-50">No Pay Schedule generated yet.</p>
        </div>

        <!-- Placeholders for other tabs -->
        <div v-else class="p-10 flex flex-col items-center justify-center border border-dashed border-[#E5E0EA] rounded-lg bg-gray-50">
          <Info class="w-8 h-8 text-[#9CA3AF] mb-3" />
          <h3 class="text-lg font-medium text-[#1A1A2E]">Data Not Available</h3>
          <p class="text-sm text-[#9CA3AF] text-center max-w-sm mt-1">
            This module currently lacks detailed records for {{ activeTab.replace('-', ' ') }}. 
          </p>
        </div>

      </div>
    </div>
    
    <div v-else class="flex flex-col items-center justify-center pt-32">
      <XCircle class="w-8 h-8 text-[#E8604A]" />
      <span class="mt-4 text-[#4B4B6B]">Loan not found.</span>
    </div>

    <!-- Disburse Modal -->
    <Teleport to="body">
      <div v-if="showDisburseModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
          <div class="px-6 py-4 border-b border-[#E5E0EA] flex justify-between items-center bg-[#F8F7FA]">
            <h3 class="text-lg font-bold text-[#1A1A2E]">Disburse Loan</h3>
            <button @click="showDisburseModal = false" class="text-[#9CA3AF] hover:text-[#4F1964]">
              <X class="w-5 h-5" />
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-[#1A1A2E]">M-Pesa Transaction Code *</label>
              <input 
                type="text" 
                v-model="disburseForm.mpesaCode" 
                placeholder="e.g. SDF98S7DF9S" 
                class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]" 
              />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-[#1A1A2E]">Disbursement Date & Time *</label>
              <input 
                type="datetime-local" 
                v-model="disburseForm.disbursedAt" 
                class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]" 
              />
            </div>
          </div>
          <div class="px-6 py-4 border-t border-[#E5E0EA] flex justify-end gap-3 bg-gray-50">
            <button 
              @click="showDisburseModal = false" 
              class="px-4 py-2 text-sm font-medium text-[#4B4B6B] bg-white border border-[#E5E0EA] rounded-md hover:border-[#4F1964]"
            >
              Cancel
            </button>
            <button 
              @click="handleDisburse" 
              :disabled="!disburseForm.mpesaCode || isDisbursing"
              class="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-[#4F1964] rounded-md hover:bg-[#380F47] disabled:opacity-50"
            >
              <Loader2 v-if="isDisbursing" class="w-4 h-4 animate-spin" />
              Confirm Disbursement
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>