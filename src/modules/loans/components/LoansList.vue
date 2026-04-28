<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  RefreshCw,
  ChevronRight,
  ExternalLink,
  User,
  Eye,
  MessageCircle,
  Flag,
  Search,
  ChevronLeft
} from 'lucide-vue-next'

const props = defineProps<{
  view: 'all' | 'defaulters' | 'installments' | 'failing-due' | 'approvals'
}>()

const viewTitleMap = {
  all: 'Loans',
  defaulters: 'Defaulters',
  installments: 'Installments',
  'failing-due': 'Failing Due',
  approvals: 'Approvals'
} as const

const title = computed(() => viewTitleMap[props.view] ?? 'Loans')

interface Loan {
  id: number
  code: string
  loanType: 'MANUAL'
  customerName: string
  phone: string
  branch: string
  principal: number
  addOns: number
  addOnCount: number
  deductions: number
  repaid: number
  balance: number
  disbursedDate: string
  disbursedTimeLabel: 'TODAY' | 'YESTERDAY' | '2 DAYS AGO' | '3 DAYS AGO'
  disbursedTime: string
  finalDueDate: string
  daysUntilDue: number
  loName: string
  coName: string
  status: 'Disbursed' | 'Pending' | 'Defaulted' | 'Approved'
  flagStatus: 'Contactable' | 'Promised to Pay' | 'Not Reachable'
}

const loans = ref<Loan[]>([
  {
    id: 3001,
    code: 'L-3001',
    loanType: 'MANUAL',
    customerName: 'Amina Mwende',
    phone: '254712345678',
    branch: 'Nairobi East',
    principal: 12000,
    addOns: 1450,
    addOnCount: 2,
    deductions: 600,
    repaid: 3200,
    balance: 8900,
    disbursedDate: '18 Apr 2026',
    disbursedTimeLabel: 'TODAY',
    disbursedTime: '08:20 AM',
    finalDueDate: '18 May 2026',
    daysUntilDue: 29,
    loName: 'Grace Achieng',
    coName: 'Peter Njoroge',
    status: 'Disbursed',
    flagStatus: 'Contactable'
  },
  {
    id: 3002,
    code: 'L-3002',
    loanType: 'MANUAL',
    customerName: 'Josephat Kamau',
    phone: '254700123456',
    branch: 'Mombasa Central',
    principal: 8000,
    addOns: 800,
    addOnCount: 1,
    deductions: 400,
    repaid: 2000,
    balance: 6400,
    disbursedDate: '17 Apr 2026',
    disbursedTimeLabel: 'YESTERDAY',
    disbursedTime: '10:15 AM',
    finalDueDate: '10 May 2026',
    daysUntilDue: 21,
    loName: 'Mercy Otieno',
    coName: 'Daniel Kipkoech',
    status: 'Approved',
    flagStatus: 'Promised to Pay'
  },
  {
    id: 3003,
    code: 'L-3003',
    loanType: 'MANUAL',
    customerName: 'Mercy Wambui',
    phone: '254711987654',
    branch: 'Kisumu South',
    principal: 15000,
    addOns: 1200,
    addOnCount: 3,
    deductions: 950,
    repaid: 0,
    balance: 15000,
    disbursedDate: '15 Apr 2026',
    disbursedTimeLabel: '2 DAYS AGO',
    disbursedTime: '02:45 PM',
    finalDueDate: '25 Apr 2026',
    daysUntilDue: 6,
    loName: 'Peter Karanja',
    coName: 'Alice Kamau',
    status: 'Pending',
    flagStatus: 'Not Reachable'
  },
  {
    id: 3004,
    code: 'L-3004',
    loanType: 'MANUAL',
    customerName: 'David Mutua',
    phone: '254798112233',
    branch: 'Nakuru East',
    principal: 9000,
    addOns: 600,
    addOnCount: 1,
    deductions: 500,
    repaid: 3500,
    balance: 6100,
    disbursedDate: '13 Apr 2026',
    disbursedTimeLabel: '3 DAYS AGO',
    disbursedTime: '11:10 AM',
    finalDueDate: '22 Apr 2026',
    daysUntilDue: 3,
    loName: 'Sarah Wairimu',
    coName: 'Samuel Ouma',
    status: 'Pending',
    flagStatus: 'Contactable'
  },
  {
    id: 3005,
    code: 'L-3005',
    loanType: 'MANUAL',
    customerName: 'Esther Ndegwa',
    phone: '254713667788',
    branch: 'Eldoret North',
    principal: 7000,
    addOns: 400,
    addOnCount: 1,
    deductions: 300,
    repaid: 2000,
    balance: 5000,
    disbursedDate: '14 Apr 2026',
    disbursedTimeLabel: 'TODAY',
    disbursedTime: '09:00 AM',
    finalDueDate: '12 May 2026',
    daysUntilDue: 23,
    loName: 'Angela Njeri',
    coName: 'Brian Mutiso',
    status: 'Disbursed',
    flagStatus: 'Contactable'
  },
  {
    id: 3006,
    code: 'L-3006',
    loanType: 'MANUAL',
    customerName: 'Kennedy Otieno',
    phone: '254714556677',
    branch: 'Nairobi West',
    principal: 11000,
    addOns: 1000,
    addOnCount: 4,
    deductions: 900,
    repaid: 0,
    balance: 11000,
    disbursedDate: '18 Apr 2026',
    disbursedTimeLabel: 'TODAY',
    disbursedTime: '03:20 PM',
    finalDueDate: '20 Apr 2026',
    daysUntilDue: 1,
    loName: 'Grace Wanjiru',
    coName: 'Peter Odhiambo',
    status: 'Approved',
    flagStatus: 'Contactable'
  },
  {
    id: 3007,
    code: 'L-3007',
    loanType: 'MANUAL',
    customerName: 'Rose Achieng',
    phone: '254716445566',
    branch: 'Mombasa South',
    principal: 13000,
    addOns: 1500,
    addOnCount: 2,
    deductions: 1200,
    repaid: 4500,
    balance: 8800,
    disbursedDate: '11 Apr 2026',
    disbursedTimeLabel: 'YESTERDAY',
    disbursedTime: '04:10 PM',
    finalDueDate: '08 Apr 2026',
    daysUntilDue: -11,
    loName: ' Brian Mutiso',
    coName: 'Grace Wairimu',
    status: 'Defaulted',
    flagStatus: 'Promised to Pay'
  },
  {
    id: 3008,
    code: 'L-3008',
    loanType: 'MANUAL',
    customerName: 'Jane Wanjiru',
    phone: '254712667788',
    branch: 'Kisumu North',
    principal: 10000,
    addOns: 950,
    addOnCount: 2,
    deductions: 650,
    repaid: 6000,
    balance: 3350,
    disbursedDate: '16 Apr 2026',
    disbursedTimeLabel: '2 DAYS AGO',
    disbursedTime: '03:40 PM',
    finalDueDate: '16 Apr 2026',
    daysUntilDue: -2,
    loName: 'Angela Kamau',
    coName: 'Samuel Njoroge',
    status: 'Defaulted',
    flagStatus: 'Not Reachable'
  },
  {
    id: 3009,
    code: 'L-3009',
    loanType: 'MANUAL',
    customerName: 'Philip Karanja',
    phone: '254715332211',
    branch: 'Nakuru West',
    principal: 5000,
    addOns: 300,
    addOnCount: 1,
    deductions: 200,
    repaid: 1000,
    balance: 4200,
    disbursedDate: '15 Apr 2026',
    disbursedTimeLabel: '3 DAYS AGO',
    disbursedTime: '10:30 AM',
    finalDueDate: '29 Apr 2026',
    daysUntilDue: 10,
    loName: 'Esther Ndegwa',
    coName: 'Brian Kiplagat',
    status: 'Disbursed',
    flagStatus: 'Contactable'
  },
  {
    id: 3010,
    code: 'L-3010',
    loanType: 'MANUAL',
    customerName: 'Dorothy Njeri',
    phone: '254714221100',
    branch: 'Nairobi Central',
    principal: 14500,
    addOns: 1800,
    addOnCount: 2,
    deductions: 1100,
    repaid: 5000,
    balance: 10400,
    disbursedDate: '18 Apr 2026',
    disbursedTimeLabel: 'TODAY',
    disbursedTime: '01:05 PM',
    finalDueDate: '23 Apr 2026',
    daysUntilDue: 5,
    loName: 'Alice Kamau',
    coName: 'Samuel Ouma',
    status: 'Approved',
    flagStatus: 'Contactable'
  }
])

const activeSort = ref<string | null>(null)
const sortOptions = ['Newest First', 'Oldest', 'Maximum Amount', 'Minimum Amount', 'Uncommitted']
const ageMonths = ref(1)
const searchQuery = ref('')
const perPage = ref(10)
const currentPage = ref(1)

const filteredData = computed(() => {
  switch (props.view) {
    case 'defaulters':
      return loans.value.filter((loan) => loan.status === 'Defaulted')
    case 'failing-due':
      return loans.value.filter((loan) => loan.daysUntilDue <= 7 && loan.status !== 'Defaulted')
    case 'approvals':
      return loans.value.filter((loan) => loan.status === 'Approved' || loan.status === 'Pending')
    case 'installments':
      return loans.value.filter((loan) => loan.repaid > 0)
    default:
      return loans.value
  }
})

const pageCount = computed(() => Math.max(1, Math.ceil(filteredData.value.length / perPage.value)))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return filteredData.value.slice(start, start + perPage.value)
})

const resetSort = () => {
  activeSort.value = null
}

const onSearch = () => {
  // UI only; search is not wired to real filtering
}

watch([filteredData, perPage], () => {
  if (currentPage.value > pageCount.value) {
    currentPage.value = pageCount.value
  }
})
</script>

<template>
  <div class="space-y-6 pb-6">
    <div class="px-6 py-6">
      <div class="flex items-baseline gap-2">
        <h1 class="text-2xl font-bold text-[#1A1A2E]">{{ title }}</h1>
        <span class="text-sm text-[#9CA3AF]">List</span>
      </div>
    </div>

    <div class="bg-[#F8F7FA] border-b border-[#E5E0EA] px-6 py-3">
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          @click="resetSort"
          class="inline-flex items-center gap-2 rounded-md bg-[#4F1964] px-4 py-1.5 text-sm font-medium text-white"
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
          class="inline-flex items-center gap-2 rounded-full border border-[#E5E0EA] bg-white px-4 py-1.5 text-sm text-[#4B4B6B]"
        >
          All Agents
          <ChevronRight class="w-3 h-3" />
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-[#E5E0EA] bg-white px-4 py-1.5 text-sm text-[#4B4B6B]"
        >
          All Branches
          <ChevronRight class="w-3 h-3" />
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
      <div class="inline-flex items-center gap-2 rounded-full bg-[#4F1964] px-3 py-1.5 text-sm font-medium text-white">
        <span class="font-semibold text-[#F9DA82]">{{ filteredData.length }}</span>
        <span>Records</span>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search loans..."
          class="h-10 rounded-md border border-[#E5E0EA] px-3 text-sm text-[#1A1A2E] focus:outline-none focus:ring-1 focus:ring-[#4F1964]"
        />
        <button
          type="button"
          @click="onSearch"
          class="inline-flex items-center gap-2 rounded-md bg-[#4F1964] px-4 py-2 text-sm font-medium text-white"
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
            <th class="px-4 py-3 text-left text-[#4F1964] font-semibold text-xs uppercase tracking-wider">Disbursed Date</th>
            <th class="px-4 py-3 text-left text-[#4F1964] font-semibold text-xs uppercase tracking-wider">Due Date</th>
            <th class="px-4 py-3 text-left text-[#4F1964] font-semibold text-xs uppercase tracking-wider">BDO</th>
            <th class="px-4 py-3 text-left text-[#4F1964] font-semibold text-xs uppercase tracking-wider">Status</th>
            <th class="px-4 py-3 text-left text-[#4F1964] font-semibold text-xs uppercase tracking-wider">Flag</th>
            <th class="px-4 py-3 text-left text-[#4F1964] font-semibold text-xs uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="loan in paginatedData"
            :key="loan.id"
            class="border-b border-[#F3F4F6] transition-colors duration-150 odd:bg-white even:bg-[#FAFAFA] hover:bg-[#F5F0F8]"
          >
            <td class="px-4 py-3">
              <div class="text-xs font-mono font-semibold text-[#1A1A2E]">{{ loan.code }}</div>
              <div class="text-[10px] font-bold uppercase text-[#E8604A]">MANUAL</div>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-1 text-sm font-medium text-[#1A1A2E]">
                {{ loan.customerName }}
                <ExternalLink class="w-3 h-3 text-[#6B2385]" />
              </div>
              <div class="text-xs text-[#2563EB] underline hover:text-[#4F1964] cursor-pointer">{{ loan.phone }}</div>
              <div class="text-xs text-[#9CA3AF]">{{ loan.branch }}</div>
            </td>
            <td class="px-4 py-3 text-sm font-bold text-[#2563EB]">{{ loan.principal.toLocaleString('en-US') }}</td>
            <td class="px-4 py-3">
              <div class="text-xs text-[#4B4B6B]">Ksh {{ loan.addOns.toLocaleString('en-US') }}</div>
              <div class="mt-1 inline-block rounded-full bg-[#F9DA82] px-1.5 py-0.5 text-[10px] font-bold text-[#1A1A2E]">{{ loan.addOnCount }} items</div>
            </td>
            <td class="px-4 py-3 text-xs text-[#4B4B6B]">Ksh {{ loan.deductions.toLocaleString('en-US') }}</td>
            <td class="px-4 py-3 text-sm font-bold text-[#166534]">Ksh {{ loan.repaid.toLocaleString('en-US') }}</td>
            <td class="px-4 py-3 text-sm font-bold text-[#E8604A]">Ksh {{ loan.balance.toLocaleString('en-US') }}</td>
            <td class="px-4 py-3">
              <div class="text-xs text-[#4B4B6B]">{{ loan.disbursedDate }}</div>
              <div class="mt-1 inline-flex items-center rounded-full bg-gradient-to-r from-[#4F1964] to-[#6B2385] px-2 py-0.5 text-[10px] font-bold text-white">
                {{ loan.disbursedTimeLabel }}
              </div>
              <div class="mt-1 text-xs font-medium text-[#6B2385]">{{ loan.disbursedTime }}</div>
            </td>
            <td class="px-4 py-3">
              <div class="text-xs text-[#4B4B6B]">Final: {{ loan.finalDueDate }}</div>
              <div
                class="mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                :class="loan.daysUntilDue < 0 ? 'bg-[#E8604A]' : 'bg-[#1A1A2E]'"
              >
                {{ loan.daysUntilDue < 0 ? 'OVERDUE' : `IN ${loan.daysUntilDue} DAYS` }}
              </div>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-1 text-xs text-[#9CA3AF]">
                <User class="w-3 h-3 text-[#6B2385]" />
                <span>LO:</span>
                <span class="font-semibold text-[#1A1A2E]">{{ loan.loName }}</span>
              </div>
              <div class="mt-1 flex items-center gap-1 text-xs text-[#9CA3AF]">
                <User class="w-3 h-3 text-[#6B2385]" />
                <span>CO:</span>
                <span class="font-semibold text-[#1A1A2E]">{{ loan.coName }}</span>
              </div>
            </td>
            <td class="px-4 py-3">
              <span
                class="inline-flex rounded-sm px-3 py-0.5 text-[10px] font-bold"
                :class="{
                  'bg-[#4F1964] text-white': loan.status === 'Disbursed',
                  'bg-[#F9DA82] text-[#1A1A2E]': loan.status === 'Pending',
                  'bg-[#E8604A] text-white': loan.status === 'Defaulted',
                  'bg-[#166534] text-white': loan.status === 'Approved'
                }"
              >
                {{ loan.status }}
              </span>
            </td>
            <td class="px-4 py-3 flex items-center gap-1 text-xs text-[#6B2385]">
              <Flag class="w-3 h-3 text-[#F9DA82]" />
              {{ loan.flagStatus }}
            </td>
            <td class="px-4 py-3 flex flex-col">
              <button type="button" class="text-[#4F1965] hover:text-[#380F47]">
                <Eye class="w-4 h-4" />
              </button>
              <button type="button" class="mt-1 text-[#F0C84A] hover:text-[#F9DA82]">
                <MessageCircle class="w-4 h-4" />
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

        <span class="mx-3 text-sm text-[#4B4B6B]">Page {{ currentPage }}</span>

        <button
          type="button"
          @click="currentPage < pageCount && currentPage++"
          :disabled="currentPage === pageCount"
          class="inline-flex items-center gap-1 rounded-full bg-[#4F1964] px-4 py-1.5 text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#380F47]"
        >
          Next
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
