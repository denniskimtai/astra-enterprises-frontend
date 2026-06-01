<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  RefreshCw,
  ChevronRight,
  ExternalLink,
  User,
  Eye,
  MessageCircle,
  Flag,
  Search,
  ChevronLeft,
  Loader2,
  Plus
} from 'lucide-vue-next'
import { getLoans } from '@/services/modules/loan.service'
import type { Loan } from '@/types/loan.types'

const props = defineProps<{
  view: 'all' | 'defaulters' | 'installments' | 'failing-due' | 'approvals'
}>()

const router = useRouter()

const viewTitleMap = {
  all: 'Loans',
  defaulters: 'Defaulters',
  installments: 'Installments',
  'failing-due': 'Failing Due',
  approvals: 'Approvals'
} as const

const title = computed(() => viewTitleMap[props.view] ?? 'Loans')

const loans = ref<Loan[]>([])
const isLoading = ref(false)

const activeSort = ref<string | null>(null)
const sortOptions = ['Newest First', 'Oldest', 'Maximum Amount', 'Minimum Amount', 'Uncommitted']
const ageMonths = ref(1)
const searchQuery = ref('')

const perPage = ref(10)
const currentPage = ref(1)
const totalRecords = ref(0)
const totalPages = ref(1)

const fetchLoans = async () => {
  try {
    isLoading.value = true
    let statusFilter: string | undefined = undefined

    if (props.view === 'defaulters') {
      statusFilter = 'Defaulted'
    } else if (props.view === 'approvals') {
      statusFilter = 'Created' // Typically created loans need approval
    }

    const result = await getLoans({
      page: currentPage.value,
      pageSize: perPage.value,
      searchTerm: searchQuery.value || undefined,
      status: statusFilter
    })

    if (result) {
      loans.value = result.items || []
      totalRecords.value = result.totalCount || 0
      totalPages.value = Math.ceil(totalRecords.value / perPage.value) || 1
    }
  } catch (error) {
    console.error('Failed to fetch loans:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchLoans()
})

watch([currentPage, perPage], () => {
  fetchLoans()
})

const onSearch = () => {
  currentPage.value = 1
  fetchLoans()
}

const resetSort = () => {
  activeSort.value = null
  fetchLoans()
}

const getStatusClass = (status: string) => {
  if (status === 'Disbursed') return 'bg-[#4F1964] text-white'
  if (status === 'Created' || status === 'Pending') return 'bg-[#F9DA82] text-[#1A1A2E]'
  if (status === 'Defaulted' || status === 'Rejected') return 'bg-[#E8604A] text-white'
  if (status === 'Approved' || status === 'Cleared') return 'bg-[#166534] text-white'
  return 'bg-gray-200 text-gray-800'
}

const formatDate = (isoString: string | null) => {
  if (!isoString) return 'N/A'
  const d = new Date(isoString)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="space-y-6 pb-6">
    <div class="px-6 py-6 flex items-center justify-between">
      <div class="flex items-baseline gap-2">
        <h1 class="text-2xl font-bold text-[#1A1A2E]">{{ title }}</h1>
        <span class="text-sm text-[#9CA3AF]">List</span>
      </div>
      
      <!-- New Loan Button -->
      <button
        type="button"
        @click="router.push('/loans/new')"
        class="inline-flex items-center gap-2 rounded-md bg-[#4F1964] px-4 py-2 text-sm font-medium text-white hover:bg-[#380F47] transition-colors"
      >
        <Plus class="w-4 h-4" />
        New Loan
      </button>
    </div>

    <div class="bg-[#F8F7FA] border-b border-[#E5E0EA] px-6 py-3">
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          @click="resetSort"
          class="inline-flex items-center gap-2 rounded-md bg-[#4F1964] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#380F47]"
        >
          <RefreshCw class="w-4 h-4" />
          Show All
        </button>

        <button
          v-for="option in sortOptions"
          :key="option"
          type="button"
          @click="activeSort = option"
          :class="[
            'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm cursor-pointer transition',
            activeSort === option
              ? 'bg-[#4F1964] text-white border-transparent'
              : 'bg-white border border-[#E5E0EA] text-[#4B4B6B] hover:border-[#4F1964]'
          ]"
        >
          <ChevronRight class="w-4 h-4" />
          {{ option }}
        </button>

        <select
          v-model.number="ageMonths"
          class="rounded-md border border-[#E5E0EA] bg-white px-3 py-1.5 text-sm text-[#4B4B6B] focus:outline-none"
        >
          <option v-for="month in 12" :key="month" :value="month">{{ month }} month{{ month === 1 ? '' : 's' }}</option>
        </select>

        <input
          type="text"
          placeholder="Filter with a date range"
          class="rounded-md border border-[#E5E0EA] px-3 py-1.5 text-sm text-[#4B4B6B] focus:outline-none focus:ring-1 focus:ring-[#4F1964]"
        />
      </div>

      <div class="flex flex-wrap gap-3 mt-2">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-[#E5E0EA] bg-white px-4 py-1.5 text-sm text-[#4B4B6B] hover:border-[#4F1964]"
        >
          All Agents
          <ChevronRight class="w-3 h-3" />
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-[#E5E0EA] bg-white px-4 py-1.5 text-sm text-[#4B4B6B] hover:border-[#4F1964]"
        >
          All Branches
          <ChevronRight class="w-3 h-3" />
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
      <div class="inline-flex items-center gap-2 rounded-full bg-[#4F1964] px-3 py-1.5 text-sm font-medium text-white">
        <span class="font-semibold text-[#F9DA82]">{{ totalRecords }}</span>
        <span>Records</span>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <input
          v-model="searchQuery"
          @keyup.enter="onSearch"
          type="text"
          placeholder="Search loans..."
          class="h-10 rounded-md border border-[#E5E0EA] px-3 text-sm text-[#1A1A2E] focus:outline-none focus:ring-1 focus:ring-[#4F1964]"
        />
        <button
          type="button"
          @click="onSearch"
          class="inline-flex items-center gap-2 rounded-md bg-[#4F1964] px-4 py-2 text-sm font-medium text-white hover:bg-[#380F47] transition-colors"
        >
          <Search class="w-4 h-4" />
          Search
        </button>
      </div>
    </div>

    <div class="mx-6 overflow-x-auto rounded-lg border border-[#E5E0EA] bg-white">
      <table class="min-w-full">
        <thead class="bg-[#F8F7FA]">
          <tr>
            <th class="px-4 py-3 text-left text-[#4F1964] font-semibold text-xs uppercase tracking-wider">CODE</th>
            <th class="px-4 py-3 text-left text-[#4F1964] font-semibold text-xs uppercase tracking-wider">Customer</th>
            <th class="px-4 py-3 text-left text-[#4F1964] font-semibold text-xs uppercase tracking-wider">Principal</th>
            <th class="px-4 py-3 text-left text-[#4F1964] font-semibold text-xs uppercase tracking-wider">AddOns</th>
            <th class="px-4 py-3 text-left text-[#4F1964] font-semibold text-xs uppercase tracking-wider">Deductions</th>
            <th class="px-4 py-3 text-left text-[#4F1964] font-semibold text-xs uppercase tracking-wider">Repaid</th>
            <th class="px-4 py-3 text-left text-[#4F1964] font-semibold text-xs uppercase tracking-wider">Balance</th>
            <th class="px-4 py-3 text-left text-[#4F1964] font-semibold text-xs uppercase tracking-wider">Disbursed</th>
            <th class="px-4 py-3 text-left text-[#4F1964] font-semibold text-xs uppercase tracking-wider">Due Date</th>
            <th class="px-4 py-3 text-left text-[#4F1964] font-semibold text-xs uppercase tracking-wider">Stage</th>
            <th class="px-4 py-3 text-left text-[#4F1964] font-semibold text-xs uppercase tracking-wider">Status</th>
            <th class="px-4 py-3 text-left text-[#4F1964] font-semibold text-xs uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="12" class="px-4 py-8 text-center text-sm text-[#9CA3AF]">
              <div class="flex items-center justify-center gap-2">
                <Loader2 class="w-5 h-5 animate-spin text-[#4F1964]" />
                <span>Loading loans...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="loans.length === 0">
            <td colspan="12" class="px-4 py-8 text-center text-sm text-[#9CA3AF]">
              No loans found.
            </td>
          </tr>
          <tr
            v-else
            v-for="loan in loans"
            :key="loan.id"
            class="border-b border-[#F3F4F6] transition-colors duration-150 odd:bg-white even:bg-[#FAFAFA] hover:bg-[#F5F0F8]"
          >
            <td class="px-4 py-3">
              <div class="text-xs font-mono font-semibold text-[#1A1A2E]">{{ loan.code || loan.id.slice(0, 8) }}</div>
              <div class="text-[10px] font-bold uppercase text-[#E8604A]">{{ loan.type }}</div>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-1 text-sm font-medium text-[#1A1A2E]">
                {{ loan.customerName }}
                <ExternalLink class="w-3 h-3 text-[#6B2385]" />
              </div>
            </td>
            <td class="px-4 py-3 text-sm font-bold text-[#2563EB]">Ksh {{ loan.principal?.toLocaleString('en-US') }}</td>
            <td class="px-4 py-3 text-xs text-[#4B4B6B]">Ksh {{ loan.addOnsTotal?.toLocaleString('en-US') }}</td>
            <td class="px-4 py-3 text-xs text-[#4B4B6B]">Ksh {{ loan.deductionsTotal?.toLocaleString('en-US') }}</td>
            <td class="px-4 py-3 text-sm font-bold text-[#166534]">Ksh {{ loan.repaidTotal?.toLocaleString('en-US') }}</td>
            <td class="px-4 py-3 text-sm font-bold text-[#E8604A]">Ksh {{ loan.balance?.toLocaleString('en-US') }}</td>
            <td class="px-4 py-3 text-xs text-[#4B4B6B]">{{ formatDate(loan.disbursedAt) }}</td>
            <td class="px-4 py-3 text-xs text-[#4B4B6B]">{{ formatDate(loan.dueDate) }}</td>
            <td class="px-4 py-3 text-xs text-[#1A1A2E] font-medium">{{ loan.stage }}</td>
            <td class="px-4 py-3">
              <span
                class="inline-flex rounded-sm px-3 py-0.5 text-[10px] font-bold"
                :class="getStatusClass(loan.status)"
              >
                {{ loan.status }}
              </span>
            </td>
            <td class="px-4 py-3 flex flex-col">
              <button type="button" class="text-[#4F1965] hover:text-[#380F47]" @click="router.push(`/loans/${loan.id}`)">
                <Eye class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between px-6 py-4">
      <div class="flex items-center gap-2">
        <label class="text-sm text-[#4B4B6B]">Per page</label>
        <select
          v-model.number="perPage"
          class="rounded-md border border-[#E5E0EA] bg-white px-2 py-1 text-sm"
        >
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>
      <div class="flex items-center">
        <button
          type="button"
          @click="currentPage > 1 && currentPage--"
          :disabled="currentPage === 1"
          class="inline-flex items-center gap-1 rounded-full bg-[#4F1964] px-4 py-1.5 text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#380F47]"
        >
          <ChevronLeft class="w-4 h-4" />
          Previous
        </button>

        <span class="mx-3 text-sm text-[#4B4B6B]">Page {{ currentPage }} of {{ totalPages }}</span>

        <button
          type="button"
          @click="currentPage < totalPages && currentPage++"
          :disabled="currentPage >= totalPages"
          class="inline-flex items-center gap-1 rounded-full bg-[#4F1964] px-4 py-1.5 text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#380F47]"
        >
          Next
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
