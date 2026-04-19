<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown, Eye, MessageCircle, Plus, Search } from 'lucide-vue-next'

interface Lead {
  id: number
  passport: string
  customer: string
  addedAt: string
  timeLabel: 'TODAY' | 'YESTERDAY'
  time: string
  agentName: string
  phone: string
  branch: string
  product: string
  latestLoan: string
  homeDirection: string
  status: 'LEAD' | 'ACTIVE'
}

const router = useRouter()
const searchQuery = ref('')
const filterPills = ['Newest First', 'All Branches', 'All Types', 'All Agents']

const leads = ref<Lead[]>([
  {
    id: 1001,
    passport: '',
    customer: 'Amina Njeri',
    addedAt: '18 Apr 2026',
    timeLabel: 'TODAY',
    time: '09:15 AM',
    agentName: 'David Mwangi',
    phone: '254712345678',
    branch: 'Nairobi East',
    product: 'Bizboost Loan',
    latestLoan: '',
    homeDirection: 'South',
    status: 'LEAD'
  },
  {
    id: 1002,
    passport: '',
    customer: 'Josephat Kamau',
    addedAt: '18 Apr 2026',
    timeLabel: 'TODAY',
    time: '10:20 AM',
    agentName: 'Mercy Otieno',
    phone: '254700123456',
    branch: 'Nairobi West',
    product: 'Faida Loan',
    latestLoan: '',
    homeDirection: 'North',
    status: 'LEAD'
  },
  {
    id: 1003,
    passport: '',
    customer: 'Fatuma Hassan',
    addedAt: '17 Apr 2026',
    timeLabel: 'YESTERDAY',
    time: '03:42 PM',
    agentName: 'Peter Karanja',
    phone: '254711987654',
    branch: 'Mombasa Central',
    product: 'Mkopo Loan',
    latestLoan: '',
    homeDirection: 'East',
    status: 'LEAD'
  },
  {
    id: 1004,
    passport: '',
    customer: 'Mercy Wanjiru',
    addedAt: '18 Apr 2026',
    timeLabel: 'TODAY',
    time: '11:00 AM',
    agentName: 'Brian Mutiso',
    phone: '254722334455',
    branch: 'Nairobi South',
    product: 'Bizboost Loan',
    latestLoan: '',
    homeDirection: 'West',
    status: 'LEAD'
  },
  {
    id: 1005,
    passport: '',
    customer: 'Kennedy Otieno',
    addedAt: '17 Apr 2026',
    timeLabel: 'YESTERDAY',
    time: '08:50 AM',
    agentName: 'Grace Wanjohi',
    phone: '254714556677',
    branch: 'Narok Town',
    product: 'Faida Loan',
    latestLoan: '',
    homeDirection: 'Southwest',
    status: 'LEAD'
  },
  {
    id: 1006,
    passport: '',
    customer: 'Daniel Njoroge',
    addedAt: '18 Apr 2026',
    timeLabel: 'TODAY',
    time: '02:30 PM',
    agentName: 'Sarah Wairimu',
    phone: '254798112233',
    branch: 'Mombasa North',
    product: 'Mkopo Loan',
    latestLoan: '',
    homeDirection: 'Northeast',
    status: 'LEAD'
  },
  {
    id: 1007,
    passport: '',
    customer: 'Catherine Njoki',
    addedAt: '17 Apr 2026',
    timeLabel: 'YESTERDAY',
    time: '05:10 PM',
    agentName: 'Samuel Ouma',
    phone: '254712667788',
    branch: 'Nairobi Central',
    product: 'Faida Loan',
    latestLoan: '',
    homeDirection: 'South',
    status: 'LEAD'
  },
  {
    id: 1008,
    passport: '',
    customer: 'Joyce Mwikali',
    addedAt: '18 Apr 2026',
    timeLabel: 'TODAY',
    time: '01:05 PM',
    agentName: 'Alice Kamau',
    phone: '254713998877',
    branch: 'Narok East',
    product: 'Bizboost Loan',
    latestLoan: '',
    homeDirection: 'Northwest',
    status: 'LEAD'
  },
  {
    id: 1009,
    passport: '',
    customer: 'Mohammed Ali',
    addedAt: '17 Apr 2026',
    timeLabel: 'YESTERDAY',
    time: '12:15 PM',
    agentName: 'Esther Ndegwa',
    phone: '254716445566',
    branch: 'Mombasa South',
    product: 'Mkopo Loan',
    latestLoan: '',
    homeDirection: 'East',
    status: 'LEAD'
  },
  {
    id: 1010,
    passport: '',
    customer: 'Brian Kiplagat',
    addedAt: '18 Apr 2026',
    timeLabel: 'TODAY',
    time: '04:40 PM',
    agentName: 'Angela Njeri',
    phone: '254715223344',
    branch: 'Nairobi North',
    product: 'Faida Loan',
    latestLoan: '',
    homeDirection: 'West',
    status: 'LEAD'
  }
])

const goToNewLead = (): void => {
  router.push('/customers/leads/new')
}

const onSearch = (): void => {
  // Search UI is display-only as requested
}
</script>

<template>
  <div class="space-y-6 pb-6">
    <div class="px-6 py-6">
      <div class="flex items-baseline gap-2">
        <h1 class="text-2xl font-bold text-[#1A1A2E]">Leads</h1>
        <span class="text-sm text-[#9CA3AF]">List</span>
      </div>
    </div>

    <div class="bg-[#F8F7FA] border-b border-[#E5E0EA] px-6 py-3">
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex flex-wrap items-center gap-3">
          <button
            v-for="(pill, index) in filterPills"
            :key="index"
            type="button"
            class="inline-flex items-center gap-2 rounded-full border border-[#E5E0EA] bg-white px-4 py-1.5 text-sm text-[#4B4B6B] transition-colors duration-150 hover:border-[#4F1964] hover:text-[#4F1964]"
          >
            <span>{{ pill }}</span>
            <ChevronDown class="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          @click="goToNewLead"
          class="ml-auto inline-flex items-center gap-2 rounded-md border-b-2 border-[#F9DA82] bg-[#4F1964] px-5 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#380F47]"
        >
          <Plus class="w-4 h-4" />
          Add New
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center">
        <span class="rounded-full bg-[#4F1964] px-3 py-0.5 text-sm font-bold text-white">
          <span class="text-[#F9DA82]">{{ leads.length }}</span>
        </span>
        <span class="ml-2 text-sm text-[#4B4B6B]">Records Found</span>
      </div>

      <div class="flex w-full max-w-md items-center">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Enter text and hit search button"
          class="flex-1 rounded-l-md border border-[#E5E0EA] px-4 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]"
        />
        <button
          type="button"
          @click="onSearch"
          class="rounded-r-md bg-[#4F1964] px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#380F47]"
        >
          <Search class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div class="mx-6 overflow-hidden rounded-lg border border-[#E5E0EA] bg-white">
      <div class="overflow-x-auto">
        <table class="min-w-full border-separate border-spacing-0">
          <thead class="bg-[#F8F7FA] border-b border-[#E5E0EA]">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">ID</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Passport</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Customer</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Added At</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Agent</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Phone</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Branch</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Latest Loan</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Home Direction</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Status</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(lead, index) in leads"
              :key="lead.id"
              :class="[
                index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]',
                'border-b border-[#F3F4F6] hover:bg-[#F5F0F8] transition-colors duration-150'
              ]"
            >
              <td class="px-4 py-3 text-sm text-[#374151]">
                <span class="text-[#4B4B6B] font-mono text-xs">{{ lead.id }}</span>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <span class="text-[#4B4B6B] text-xs">{{ lead.passport }}</span>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <span class="text-[#1A1A2E] font-medium">{{ lead.customer }}</span>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="space-y-2">
                  <div class="text-[#4B4B6B] text-xs">{{ lead.addedAt }}</div>
                  <div class="flex items-center gap-1">
                    <span class="rounded-full bg-[#F9DA82] px-2 py-0.5 text-[10px] font-bold text-[#1A1A2E]">{{ lead.timeLabel }}</span>
                    <span class="text-[#6B2385] text-xs font-medium">{{ lead.time }}</span>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="space-y-1">
                  <div class="text-[#1A1A2E] text-xs font-medium">Name: {{ lead.agentName }}</div>
                  <div class="text-[#9CA3AF] text-xs">Role: LO</div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <span class="text-[#6B2385] text-xs underline cursor-pointer hover:text-[#4F1964]">{{ lead.phone }}</span>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="space-y-1">
                  <div class="text-[#1A1A2E] text-xs font-medium">{{ lead.branch }}</div>
                  <div class="text-[#9CA3AF] text-xs">Prod: {{ lead.product }}</div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <span class="text-[#4B4B6B] text-xs">{{ lead.latestLoan }}</span>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <span class="text-[#4B4B6B] text-xs">{{ lead.homeDirection }}</span>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <span class="inline-flex rounded-sm border border-[#4F1964] bg-[#EDE9F5] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#4F1964]">{{ lead.status }}</span>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="flex flex-col items-center">
                  <Eye class="w-4 h-4 cursor-pointer text-[#4F1964] hover:text-[#380F47]" />
                  <MessageCircle class="mt-1 w-4 h-4 cursor-pointer text-[#F0C84A] hover:text-[#F9DA82]" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
