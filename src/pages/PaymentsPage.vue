<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Plus,
  Search,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Eye,
  ChevronLeft,
  ChevronRight,
  Info,
  ChevronDown
} from 'lucide-vue-next'

interface Payment {
  id: number
  customerName: string
  accountNumber: string
  branch: string
  amountPaid: number
  payMethod: string
  recordType: string
  transactionCode: string
  loanId: number
  loanAccountNumber: string
  loanBalance: number
  nextDueDate: string
  payDate: string
  payTime: string
  payDateLabel: 'TODAY' | 'YESTERDAY' | '2 DAYS AGO'
  status: 'Successful' | 'Failed' | 'Pending'
}

const router = useRouter()

// Filter state
const activeFilter = ref<'all' | 'unallocated'>('all')
const searchQuery = ref('')
const perPage = ref(10)
const currentPage = ref(1)

// Filter pills
const filterPills = ['All Payments', 'Newest First', 'All Branches']

// Mock data - 12 realistic records
const payments = ref<Payment[]>([
  {
    id: 1001,
    customerName: 'Beatrice Wanjiru',
    accountNumber: 'AST-2024-0891',
    branch: 'Mumias',
    amountPaid: 8500,
    payMethod: 'Mobile Payment',
    recordType: 'API',
    transactionCode: 'UDSP2268MA',
    loanId: 5001,
    loanAccountNumber: 'LNM-2024-1567',
    loanBalance: 12400,
    nextDueDate: '15 May 2026',
    payDate: '28 Apr 2026',
    payTime: '09:15 AM',
    payDateLabel: 'TODAY',
    status: 'Successful'
  },
  {
    id: 1002,
    customerName: 'Isaac Njoroge',
    accountNumber: 'AST-2024-0756',
    branch: 'Kisumu',
    amountPaid: 3200,
    payMethod: 'Mobile Payment',
    recordType: 'API',
    transactionCode: 'KSM8923LP',
    loanId: 5002,
    loanAccountNumber: 'LNM-2024-1623',
    loanBalance: 0.00,
    nextDueDate: '20 May 2026',
    payDate: '27 Apr 2026',
    payTime: '02:45 PM',
    payDateLabel: 'YESTERDAY',
    status: 'Successful'
  },
  {
    id: 1003,
    customerName: 'Mercy Kilonzo',
    accountNumber: 'AST-2024-0912',
    branch: 'Narok',
    amountPaid: 15000,
    payMethod: 'Mobile Payment',
    recordType: 'API',
    transactionCode: 'NRK4456QZ',
    loanId: 5003,
    loanAccountNumber: 'LNM-2024-1701',
    loanBalance: 8500,
    nextDueDate: '10 May 2026',
    payDate: '26 Apr 2026',
    payTime: '11:30 AM',
    payDateLabel: '2 DAYS AGO',
    status: 'Successful'
  },
  {
    id: 1004,
    customerName: 'Sharon Ouma',
    accountNumber: 'AST-2024-0823',
    branch: 'Mumias',
    amountPaid: 2100,
    payMethod: 'Mobile Payment',
    recordType: 'API',
    transactionCode: 'MMS7789AB',
    loanId: 5004,
    loanAccountNumber: 'LNM-2024-1542',
    loanBalance: 15800,
    nextDueDate: '18 May 2026',
    payDate: '28 Apr 2026',
    payTime: '08:00 AM',
    payDateLabel: 'TODAY',
    status: 'Successful'
  },
  {
    id: 1005,
    customerName: 'Kenneth Otieno',
    accountNumber: 'AST-2024-0789',
    branch: 'Kisumu',
    amountPaid: 4500,
    payMethod: 'Mobile Payment',
    recordType: 'API',
    transactionCode: 'KSV2234CD',
    loanId: 5005,
    loanAccountNumber: 'LNM-2024-1678',
    loanBalance: 0.00,
    nextDueDate: '22 May 2026',
    payDate: '27 Apr 2026',
    payTime: '04:20 PM',
    payDateLabel: 'YESTERDAY',
    status: 'Failed'
  },
  {
    id: 1006,
    customerName: 'Eunice Wambui',
    accountNumber: 'AST-2024-0845',
    branch: 'Narok',
    amountPaid: 6800,
    payMethod: 'Mobile Payment',
    recordType: 'API',
    transactionCode: 'NRK9901EF',
    loanId: 5006,
    loanAccountNumber: 'LNM-2024-1734',
    loanBalance: 9200,
    nextDueDate: '12 May 2026',
    payDate: '28 Apr 2026',
    payTime: '10:45 AM',
    payDateLabel: 'TODAY',
    status: 'Successful'
  },
  {
    id: 1007,
    customerName: 'Wanjiru Kariuki',
    accountNumber: 'AST-2024-0767',
    branch: 'Mumias',
    amountPaid: 9200,
    payMethod: 'Mobile Payment',
    recordType: 'API',
    transactionCode: 'MMS5567GH',
    loanId: 5007,
    loanAccountNumber: 'LNM-2024-1590',
    loanBalance: 0.00,
    nextDueDate: '25 May 2026',
    payDate: '26 Apr 2026',
    payTime: '03:10 PM',
    payDateLabel: '2 DAYS AGO',
    status: 'Successful'
  },
  {
    id: 1008,
    customerName: 'Peter Odhiambo',
    accountNumber: 'AST-2024-0934',
    branch: 'Kisumu',
    amountPaid: 12500,
    payMethod: 'Mobile Payment',
    recordType: 'API',
    transactionCode: 'KSM3345IJ',
    loanId: 5008,
    loanAccountNumber: 'LNM-2024-1789',
    loanBalance: 2500,
    nextDueDate: '08 May 2026',
    payDate: '28 Apr 2026',
    payTime: '07:30 AM',
    payDateLabel: 'TODAY',
    status: 'Successful'
  },
  {
    id: 1009,
    customerName: 'Grace Achieng',
    accountNumber: 'AST-2024-0812',
    branch: 'Narok',
    amountPaid: 3800,
    payMethod: 'Mobile Payment',
    recordType: 'API',
    transactionCode: 'NRK6678KL',
    loanId: 5009,
    loanAccountNumber: 'LNM-2024-1656',
    loanBalance: 11200,
    nextDueDate: '14 May 2026',
    payDate: '27 Apr 2026',
    payTime: '01:55 PM',
    payDateLabel: 'YESTERDAY',
    status: 'Pending'
  },
  {
    id: 1010,
    customerName: 'Daniel Ouma',
    accountNumber: 'AST-2024-0878',
    branch: 'Mumias',
    amountPaid: 5600,
    payMethod: 'Mobile Payment',
    recordType: 'API',
    transactionCode: 'MMS1123MN',
    loanId: 5010,
    loanAccountNumber: 'LNM-2024-1823',
    loanBalance: 0.00,
    nextDueDate: '19 May 2026',
    payDate: '26 Apr 2026',
    payTime: '12:40 PM',
    payDateLabel: '2 DAYS AGO',
    status: 'Successful'
  },
  {
    id: 1011,
    customerName: 'Alice Karanja',
    accountNumber: 'AST-2024-0795',
    branch: 'Kisumu',
    amountPaid: 7400,
    payMethod: 'Mobile Payment',
    recordType: 'API',
    transactionCode: 'KSV8890OP',
    loanId: 5011,
    loanAccountNumber: 'LNM-2024-1690',
    loanBalance: 6600,
    nextDueDate: '11 May 2026',
    payDate: '28 Apr 2026',
    payTime: '11:05 AM',
    payDateLabel: 'TODAY',
    status: 'Successful'
  },
  {
    id: 1012,
    customerName: 'Samuel Njoroge',
    accountNumber: 'AST-2024-0901',
    branch: 'Narok',
    amountPaid: 200,
    payMethod: 'Mobile Payment',
    recordType: 'API',
    transactionCode: 'NRK4455QR',
    loanId: 5012,
    loanAccountNumber: 'LNM-2024-1756',
    loanBalance: 13800,
    nextDueDate: '16 May 2026',
    payDate: '27 Apr 2026',
    payTime: '05:30 PM',
    payDateLabel: 'YESTERDAY',
    status: 'Successful'
  }
])

// Computed pagination
const totalPages = computed(() => Math.ceil(payments.value.length / perPage.value))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return payments.value.slice(start, end)
})

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2
  }).format(amount)
}

const handleRecordPayment = () => {
  router.push('/payments/new')
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Page Header -->
    <div class="px-6 pt-6 pb-2">
      <h1 class="text-2xl font-bold text-[#1A1A2E]">
        Incoming Payments
        <span class="text-[#9CA3AF] text-sm ml-2 font-normal">List</span>
      </h1>
    </div>

    <!-- Filter Bar -->
    <div class="bg-[#F8F7FA] border-b border-[#E5E0EA] px-6 py-3">
      <div class="flex items-center gap-2 flex-wrap justify-between">
        <!-- Left side: Filter pills -->
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="pill in filterPills"
            :key="pill"
            class="flex items-center gap-1 px-3 py-1.5 bg-white border border-[#E5E0EA] rounded-md text-sm font-medium text-[#4B4B6B] hover:bg-[#F8F7FA] transition-colors"
          >
            {{ pill }}
            <ChevronDown class="w-3 h-3" />
          </button>
        </div>

        <!-- Toggle group -->
        <div class="flex gap-1">
          <button
            :class="[
              'flex items-center gap-1 rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
              activeFilter === 'all'
                ? 'bg-[#4F1964] text-white'
                : 'bg-white border border-[#E5E0EA] text-[#4B4B6B] hover:bg-[#F8F7FA]'
            ]"
            @click="activeFilter = 'all'"
          >
            <CheckCircle class="w-4 h-4" />
            All
          </button>
          <button
            :class="[
              'flex items-center gap-1 rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
              activeFilter === 'unallocated'
                ? 'bg-[#F9DA82] text-[#1A1A2E] border-transparent'
                : 'bg-white border border-[#E5E0EA] text-[#4B4B6B] hover:bg-[#F8F7FA]'
            ]"
            @click="activeFilter = 'unallocated'"
          >
            <AlertCircle class="w-4 h-4" />
            Not Allocated
          </button>
        </div>

        <!-- Date range input -->
        <input
          type="text"
          placeholder="Filter with a date range"
          class="border border-[#E5E0EA] rounded-md px-3 py-1.5 text-sm focus:ring-1 focus:ring-[#4F1964] outline-none w-48"
        />

        <!-- Right side: Record Payment button -->
        <button
          class="ml-auto flex items-center gap-1 bg-[#4F1964] hover:bg-[#380F47] text-white px-5 py-2 rounded-md text-sm font-medium border-b-2 border-[#F9DA82]"
          @click="handleRecordPayment"
        >
          <Plus class="w-4 h-4" />
          RECORD PAYMENT
        </button>
      </div>
    </div>

    <!-- Records Bar -->
    <div class="px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="bg-[#4F1964] text-[#F9DA82] px-3 py-1 rounded-full text-sm font-semibold">
          {{ payments.length }}
        </span>
        <span class="text-sm text-[#4B4B6B]">records</span>
      </div>
      <div class="flex items-center gap-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search"
          class="border border-[#E5E0EA] rounded-md px-3 py-1.5 text-sm focus:ring-1 focus:ring-[#4F1964] outline-none w-48"
        />
        <button class="bg-[#4F1964] text-white px-4 py-1.5 rounded-md text-sm font-medium">
          <Search class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-lg border border-[#E5E0EA] mx-6 overflow-x-auto">
      <table class="w-full min-w-[1200px]">
        <!-- Top Header -->
        <thead>
          <tr class="bg-[#F8F7FA] border-b border-[#E5E0EA]">
            <th class="text-[#4F1964] font-semibold text-xs uppercase tracking-wider px-4 py-3 text-left">ID</th>
            <th class="text-[#4F1964] font-semibold text-xs uppercase tracking-wider px-4 py-3 text-left">Customer</th>
            <th class="text-[#4F1964] font-semibold text-xs uppercase tracking-wider px-4 py-3 text-left">Amount Paid</th>
            <th class="text-[#4F1964] font-semibold text-xs uppercase tracking-wider px-4 py-3 text-left">Pay Method</th>
            <th class="text-[#4F1964] font-semibold text-xs uppercase tracking-wider px-4 py-3 text-left">Record Type</th>
            <th class="text-[#4F1964] font-semibold text-xs uppercase tracking-wider px-4 py-3 text-left">Transaction Code</th>
            <th class="text-[#4F1964] font-semibold text-xs uppercase tracking-wider px-4 py-3 text-left">Loan ID</th>
            <th class="text-[#4F1964] font-semibold text-xs uppercase tracking-wider px-4 py-3 text-left">Loan Balance</th>
            <th class="text-[#4F1964] font-semibold text-xs uppercase tracking-wider px-4 py-3 text-left">Pay Date</th>
            <th class="text-[#4F1964] font-semibold text-xs uppercase tracking-wider px-4 py-3 text-left">Status</th>
            <th class="text-[#4F1964] font-semibold text-xs uppercase tracking-wider px-4 py-3 text-left">Action</th>
          </tr>
        </thead>

        <!-- Body -->
        <tbody>
          <tr
            v-for="(payment, index) in paginatedData"
            :key="payment.id"
            :class="['border-b border-[#F3F4F6] px-4 py-3 transition-colors duration-150', index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]']"
            class="hover:bg-[#F5F0F8]"
          >
            <td class="px-4 py-3">
              <span class="text-[#4B4B6B] font-mono text-xs font-semibold">#{{ payment.id }}</span>
            </td>
            <td class="px-4 py-3">
              <div>
                <div class="text-[#4F1964] text-sm font-medium underline hover:text-[#380F47] cursor-pointer">
                  {{ payment.customerName }}
                </div>
                <div class="text-[#9CA3AF] text-xs mt-0.5">{{ payment.accountNumber }}</div>
                <div class="text-[#9CA3AF] text-xs">{{ payment.branch }}</div>
              </div>
            </td>
            <td class="px-4 py-3">
              <span class="text-[#2563EB] text-sm font-bold">{{ formatCurrency(payment.amountPaid) }}</span>
            </td>
            <td class="px-4 py-3">
              <div>
                <div class="text-[#1A1A2E] text-xs font-medium">{{ payment.payMethod }}</div>
                <div class="flex items-center gap-1 mt-1">
                  <span class="bg-[#DCFCE7] text-[#166534] text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center">
                    <CheckCircle class="w-3 h-3 inline mr-1" />
                    Loan Repayment
                  </span>
                </div>
              </div>
            </td>
            <td class="px-4 py-3">
              <span class="text-[#4B4B6B] text-xs font-medium uppercase">{{ payment.recordType }}</span>
            </td>
            <td class="px-4 py-3">
              <span class="text-[#1A1A2E] text-xs font-mono tracking-wide">{{ payment.transactionCode }}</span>
            </td>
            <td class="px-4 py-3">
              <div>
                <div class="text-[#1A1A2E] text-xs font-semibold cursor-pointer">
                  {{ payment.loanId }}
                  <ExternalLink class="w-3 h-3 text-[#6B2385] inline ml-1" />
                </div>
                <div class="text-[#9CA3AF] text-xs mt-0.5">Acc: {{ payment.loanAccountNumber }}</div>
              </div>
            </td>
            <td class="px-4 py-3">
              <div>
                <div :class="['text-xs font-semibold', payment.loanBalance === 0 ? 'text-[#9CA3AF]' : 'text-[#1A1A2E]']">
                  {{ formatCurrency(payment.loanBalance) }}
                </div>
                <div class="text-[#9CA3AF] text-xs mt-0.5">Next Due: {{ payment.nextDueDate }}</div>
              </div>
            </td>
            <td class="px-4 py-3">
              <div>
                <div>
                  <span class="text-[#4B4B6B] text-xs">{{ payment.payDate }}</span>
                  <span class="text-[#2563EB] text-xs font-medium ml-1">{{ payment.payTime }}</span>
                  <Info class="w-3 h-3 text-[#9CA3AF] inline ml-1 cursor-pointer" />
                </div>
                <div
                  v-if="payment.payDateLabel === 'TODAY'"
                  class="mt-1 bg-[#6B2385] text-white text-[10px] font-bold px-2 py-0.5 rounded-full inline-block"
                >
                  TODAY
                </div>
                <div
                  v-else-if="payment.payDateLabel === 'YESTERDAY'"
                  class="mt-1 bg-gradient-to-r from-[#4F1964] to-[#6B2385] text-white text-[10px] font-bold px-2 py-0.5 rounded-full inline-block"
                >
                  YESTERDAY
                </div>
                <div
                  v-else
                  class="mt-1 bg-gradient-to-r from-[#4F1964] to-[#6B2385] text-white text-[10px] font-bold px-2 py-0.5 rounded-full inline-block"
                >
                  {{ payment.payDateLabel }}
                </div>
              </div>
            </td>
            <td class="px-4 py-3">
              <span
                :class="[
                  'font-semibold text-xs',
                  payment.status === 'Successful' ? 'text-[#166534]' :
                  payment.status === 'Failed' ? 'text-[#E8604A]' : 'text-[#F0C84A]'
                ]"
              >
                {{ payment.status }}
              </span>
            </td>
            <td class="px-4 py-3">
              <Eye class="w-4 h-4 text-[#4F1964] hover:text-[#380F47] cursor-pointer" />
            </td>
          </tr>
        </tbody>

        <!-- Bottom Header (repeated) -->
        <thead>
          <tr class="bg-[#F8F7FA] border-b border-[#E5E0EA]">
            <th class="text-[#4F1964] font-semibold text-xs uppercase tracking-wider px-4 py-3 text-left">ID</th>
            <th class="text-[#4F1964] font-semibold text-xs uppercase tracking-wider px-4 py-3 text-left">Customer</th>
            <th class="text-[#4F1964] font-semibold text-xs uppercase tracking-wider px-4 py-3 text-left">Amount Paid</th>
            <th class="text-[#4F1964] font-semibold text-xs uppercase tracking-wider px-4 py-3 text-left">Pay Method</th>
            <th class="text-[#4F1964] font-semibold text-xs uppercase tracking-wider px-4 py-3 text-left">Record Type</th>
            <th class="text-[#4F1964] font-semibold text-xs uppercase tracking-wider px-4 py-3 text-left">Transaction Code</th>
            <th class="text-[#4F1964] font-semibold text-xs uppercase tracking-wider px-4 py-3 text-left">Loan ID</th>
            <th class="text-[#4F1964] font-semibold text-xs uppercase tracking-wider px-4 py-3 text-left">Loan Balance</th>
            <th class="text-[#4F1964] font-semibold text-xs uppercase tracking-wider px-4 py-3 text-left">Pay Date</th>
            <th class="text-[#4F1964] font-semibold text-xs uppercase tracking-wider px-4 py-3 text-left">Status</th>
            <th class="text-[#4F1964] font-semibold text-xs uppercase tracking-wider px-4 py-3 text-left">Action</th>
          </tr>
        </thead>
      </table>
    </div>

    <!-- Pagination -->
    <div class="px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-sm text-[#4B4B6B]">Per page:</span>
        <select
          v-model="perPage"
          class="border border-[#E5E0EA] rounded-md px-2 py-1 text-sm outline-none"
        >
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>

      <div class="flex items-center gap-3">
        <button
          :disabled="currentPage === 1"
          :class="['flex items-center gap-1 rounded-full px-4 py-1.5 text-sm transition-colors', currentPage === 1 ? 'bg-[#4F1964] opacity-40 cursor-not-allowed' : 'bg-[#4F1964] hover:bg-[#380F47] text-white']"
          @click="currentPage--"
        >
          <ChevronLeft class="w-4 h-4" />
          Previous
        </button>
        <span class="text-[#4B4B6B] text-sm mx-3">Page {{ currentPage }}</span>
        <button
          :disabled="currentPage >= totalPages"
          :class="['flex items-center gap-1 rounded-full px-4 py-1.5 text-sm transition-colors', currentPage >= totalPages ? 'bg-[#4F1964] opacity-40 cursor-not-allowed' : 'bg-[#4F1964] hover:bg-[#380F47] text-white']"
          @click="currentPage++"
        >
          Next
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>