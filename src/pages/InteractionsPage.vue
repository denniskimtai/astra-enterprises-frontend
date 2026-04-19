<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  RefreshCw,
  User,
  ThumbsUp,
  Bell,
  CalendarX,
  Phone,
  ExternalLink,
  Flag,
  Eye,
  AlignJustify,
  Plus,
  ChevronDown,
  Search
} from 'lucide-vue-next'

interface Interaction {
  id: number
  customerName: string
  branch: string
  contactStatus: 'Contactable' | 'Promised to Pay' | 'Not Reachable'
  interactionMode: 'Call' | 'Visit' | 'Message'
  date: string
  timeLabel: 'TODAY' | 'YESTERDAY' | '2 DAYS AGO' | '3 DAYS AGO'
  time: string
  agent: string
  outcomeDetails: string
  outcomeType: 'CREATED(LOAN)' | 'ACTIVE(CLIENT)' | 'LEAD(CLIENT)'
  nextInteractionDate: string
  nextInteractionLabel: 'TODAY' | 'TOMORROW' | 'YESTERDAY'
  loanId: string | null
  balance: number
}

const router = useRouter()
const activeTab = ref<'all' | 'my' | 'ptps'>('all')
const searchQuery = ref('')
const interactionDate = ref('')
const nextDateToggle = ref(false)

const filterPills = ['All Outcomes', 'Customer Type', 'All Methods', 'All Branches']

const interactions = ref<Interaction[]>([
  {
    id: 3001,
    customerName: 'Grace Wanjiku',
    branch: 'Mumias',
    contactStatus: 'Contactable',
    interactionMode: 'Call',
    date: '18 Apr 2026',
    timeLabel: 'TODAY',
    time: '10:30 AM',
    agent: 'Samuel Ouma',
    outcomeDetails: 'Discussed loan application for small business expansion. Customer interested in Bizboost Loan with 12-month term.',
    outcomeType: 'CREATED(LOAN)',
    nextInteractionDate: '19 Apr 2026',
    nextInteractionLabel: 'TOMORROW',
    loanId: 'L-1001',
    balance: 15000
  },
  {
    id: 3002,
    customerName: 'Joseph Kiprop',
    branch: 'Kisumu',
    contactStatus: 'Promised to Pay',
    interactionMode: 'Call',
    date: '17 Apr 2026',
    timeLabel: 'YESTERDAY',
    time: '02:15 PM',
    agent: 'Mercy Otieno',
    outcomeDetails: 'Follow-up on existing loan. Customer confirmed payment schedule and requested extension for next installment.',
    outcomeType: 'ACTIVE(CLIENT)',
    nextInteractionDate: '18 Apr 2026',
    nextInteractionLabel: 'TODAY',
    loanId: 'L-1002',
    balance: 28500
  },
  {
    id: 3003,
    customerName: 'Ann Nyambura',
    branch: 'Narok',
    contactStatus: 'Not Reachable',
    interactionMode: 'Call',
    date: '16 Apr 2026',
    timeLabel: '2 DAYS AGO',
    time: '11:45 AM',
    agent: 'Peter Karanja',
    outcomeDetails: 'Attempted contact for loan review. Left voicemail requesting callback for loan restructuring discussion.',
    outcomeType: 'ACTIVE(CLIENT)',
    nextInteractionDate: '17 Apr 2026',
    nextInteractionLabel: 'YESTERDAY',
    loanId: 'L-1003',
    balance: 42000
  },
  {
    id: 3004,
    customerName: 'David Mutua',
    branch: 'Mombasa',
    contactStatus: 'Contactable',
    interactionMode: 'Call',
    date: '18 Apr 2026',
    timeLabel: 'TODAY',
    time: '09:20 AM',
    agent: 'Alice Kamau',
    outcomeDetails: 'New lead inquiry about Faida Loan. Customer owns small retail shop and needs working capital.',
    outcomeType: 'LEAD(CLIENT)',
    nextInteractionDate: '20 Apr 2026',
    nextInteractionLabel: 'TOMORROW',
    loanId: null,
    balance: 0
  },
  {
    id: 3005,
    customerName: 'Rose Achieng',
    branch: 'Kisumu',
    contactStatus: 'Promised to Pay',
    interactionMode: 'Call',
    date: '17 Apr 2026',
    timeLabel: 'YESTERDAY',
    time: '04:10 PM',
    agent: 'Brian Mutiso',
    outcomeDetails: 'Reviewed loan performance. Customer made partial payment and committed to full settlement by end of month.',
    outcomeType: 'ACTIVE(CLIENT)',
    nextInteractionDate: '18 Apr 2026',
    nextInteractionLabel: 'TODAY',
    loanId: 'L-1004',
    balance: 18700
  },
  {
    id: 3006,
    customerName: 'Michael Kipkoech',
    branch: 'Narok',
    contactStatus: 'Contactable',
    interactionMode: 'Call',
    date: '15 Apr 2026',
    timeLabel: '3 DAYS AGO',
    time: '01:55 PM',
    agent: 'Grace Wairimu',
    outcomeDetails: 'Field visit follow-up. Confirmed loan disbursement and discussed business growth plans.',
    outcomeType: 'CREATED(LOAN)',
    nextInteractionDate: '19 Apr 2026',
    nextInteractionLabel: 'TOMORROW',
    loanId: 'L-1005',
    balance: 32000
  },
  {
    id: 3007,
    customerName: 'Lucy Wambui',
    branch: 'Mumias',
    contactStatus: 'Not Reachable',
    interactionMode: 'Call',
    date: '16 Apr 2026',
    timeLabel: '2 DAYS AGO',
    time: '03:40 PM',
    agent: 'Esther Ndegwa',
    outcomeDetails: 'Attempted contact for loan renewal. Will retry tomorrow as customer was unavailable.',
    outcomeType: 'ACTIVE(CLIENT)',
    nextInteractionDate: '17 Apr 2026',
    nextInteractionLabel: 'YESTERDAY',
    loanId: 'L-1006',
    balance: 25600
  },
  {
    id: 3008,
    customerName: 'James Oduya',
    branch: 'Mombasa',
    contactStatus: 'Promised to Pay',
    interactionMode: 'Call',
    date: '18 Apr 2026',
    timeLabel: 'TODAY',
    time: '12:05 PM',
    agent: 'Angela Njeri',
    outcomeDetails: 'New client onboarding. Completed loan application and scheduled document collection.',
    outcomeType: 'CREATED(LOAN)',
    nextInteractionDate: '20 Apr 2026',
    nextInteractionLabel: 'TOMORROW',
    loanId: 'L-1007',
    balance: 0
  }
])

const goToNewInteraction = (): void => {
  router.push('/crm/interactions/new')
}

const onSearch = (): void => {
  // Search UI is display-only as requested
}

const getNextInteractionBadgeColor = (label: string) => {
  switch (label) {
    case 'YESTERDAY':
      return 'bg-gradient-to-r from-[#4F1964] to-[#6B2385] text-white'
    case 'TODAY':
      return 'bg-[#6B2385] text-white'
    case 'TOMORROW':
      return 'bg-[#F9DA82] text-[#1A1A2E]'
    default:
      return 'bg-gray-200 text-gray-600'
  }
}
</script>

<template>
  <div class="space-y-6 pb-6">
    <div class="px-6 py-6">
      <div class="flex items-baseline gap-2">
        <h1 class="text-2xl font-bold text-[#1A1A2E]">Interactions</h1>
        <span class="text-sm text-[#9CA3AF]">List</span>
      </div>
    </div>

    <div class="bg-[#F8F7FA] border-b border-[#E5E0EA] px-6 py-3">
      <div class="flex flex-wrap items-center gap-2">
        <div class="flex gap-1">
          <button
            :class="[
              'inline-flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
              activeTab === 'all'
                ? 'bg-[#4F1964] text-white'
                : 'bg-white border border-[#E5E0EA] text-[#4B4B6B] hover:border-[#4F1964]'
            ]"
            @click="activeTab = 'all'"
          >
            <RefreshCw class="w-4 h-4" />
            All
          </button>
          <button
            :class="[
              'inline-flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
              activeTab === 'my'
                ? 'bg-[#4F1964] text-white'
                : 'bg-white border border-[#E5E0EA] text-[#4B4B6B] hover:border-[#4F1964]'
            ]"
            @click="activeTab = 'my'"
          >
            <User class="w-4 h-4" />
            My
          </button>
          <button
            :class="[
              'inline-flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
              activeTab === 'ptps'
                ? 'bg-[#4F1964] text-white'
                : 'bg-white border border-[#E5E0EA] text-[#4B4B6B] hover:border-[#4F1964]'
            ]"
            @click="activeTab = 'ptps'"
          >
            <ThumbsUp class="w-4 h-4" />
            PTPs
          </button>
        </div>

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
          class="inline-flex items-center gap-2 rounded-full bg-[#4F1964] px-4 py-1.5 text-sm text-white transition-colors duration-150 hover:bg-[#380F47] cursor-pointer"
        >
          <Bell class="w-4 h-4" />
          Due Today
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full bg-[#F9DA82] px-4 py-1.5 text-sm font-medium text-[#1A1A2E] transition-colors duration-150 hover:bg-[#F0C84A] cursor-pointer"
        >
          <CalendarX class="w-4 h-4" />
          Overdue
        </button>

        <input
          v-model="interactionDate"
          type="date"
          placeholder="Interaction date"
          class="ml-auto border border-[#E5E0EA] rounded-md px-3 py-1.5 text-sm outline-none transition focus:ring-1 focus:ring-[#4F1964]"
        />
      </div>

      <div class="mt-2">
        <button
          :class="[
            'inline-flex items-center rounded-md px-4 py-1.5 text-sm transition-colors',
            nextDateToggle
              ? 'bg-[#4F1964] text-white'
              : 'bg-white border border-[#E5E0EA] text-[#4B4B6B] hover:border-[#4F1964]'
          ]"
          @click="nextDateToggle = !nextDateToggle"
        >
          Next date
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center">
        <span class="rounded-full bg-[#4F1964] px-3 py-0.5 text-sm font-bold text-white">
          <span class="text-[#F9DA82]">{{ interactions.length }}</span>
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
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Customer Name</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Interaction Mode</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Date</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Agent</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Outcome Details</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Next Interaction</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Account</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(interaction, index) in interactions"
              :key="interaction.id"
              :class="[
                index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]',
                'border-b border-[#F3F4F6] hover:bg-[#F5F0F8] transition-colors duration-150'
              ]"
            >
              <td class="px-4 py-3 text-sm text-[#374151]">
                <span class="text-[#4B4B6B] font-mono text-xs">{{ interaction.id }}</span>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="space-y-1">
                  <div class="flex items-center">
                    <span class="text-[#1A1A2E] font-medium text-sm">{{ interaction.customerName }}</span>
                    <ExternalLink class="w-3 h-3 text-[#6B2385] ml-1 cursor-pointer" />
                  </div>
                  <div class="text-[#9CA3AF] text-xs">{{ interaction.branch }}</div>
                  <div class="flex items-center gap-1 mt-1">
                    <Flag class="w-3 h-3 text-[#F9DA82]" />
                    <span class="text-[#6B2385] text-xs font-medium">{{ interaction.contactStatus }}</span>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="flex flex-col items-center">
                  <Phone class="w-4 h-4 text-[#4F1964]" />
                  <span class="text-[#4B4B6B] text-xs mt-0.5">{{ interaction.interactionMode }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="space-y-2">
                  <div class="text-[#4B4B6B] text-xs">{{ interaction.date }}</div>
                  <div class="inline-flex items-center rounded-full bg-gradient-to-r from-[#4F1964] to-[#6B2385] px-2 py-0.5 text-[10px] font-bold text-white">{{ interaction.timeLabel }}</div>
                  <div class="text-[#6B2385] text-xs font-medium">{{ interaction.time }}</div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <span class="text-[#1A1A2E] text-xs font-medium">{{ interaction.agent }}</span>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="space-y-1">
                  <div class="text-[#4B4B6B] text-xs leading-relaxed max-w-md" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                    {{ interaction.outcomeDetails }}
                  </div>
                  <div class="inline-flex rounded-sm bg-[#EDE9F5] border border-[#C4B5D4] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#4F1964] mt-1">
                    {{ interaction.outcomeType }}
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="space-y-2">
                  <div class="text-[#4B4B6B] text-xs">{{ interaction.nextInteractionDate }}</div>
                  <div :class="['inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold', getNextInteractionBadgeColor(interaction.nextInteractionLabel)]">
                    {{ interaction.nextInteractionLabel }}
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="space-y-1">
                  <div class="text-[#9CA3AF] text-xs">Loan ID:</div>
                  <div class="text-[#1A1A2E] text-xs font-semibold">{{ interaction.loanId || 'Null' }}</div>
                  <div class="text-[#9CA3AF] text-xs">Balance:</div>
                  <div class="text-[#E8604A] text-xs font-bold">KES {{ interaction.balance.toLocaleString() }}</div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="flex flex-col items-center">
                  <Eye class="w-4 h-4 cursor-pointer text-[#4F1964] hover:text-[#380F47]" />
                  <AlignJustify class="mt-1 w-4 h-4 cursor-pointer text-[#9CA3AF] hover:text-[#4F1964]" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="fixed bottom-6 right-6 z-50">
      <button
        @click="goToNewInteraction"
        class="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-[#4F1964] hover:bg-[#380F47] shadow-lg transition-colors duration-150 cursor-pointer"
      >
        <Plus class="w-6 h-6 text-[#F9DA82]" />
        <span class="text-[#F9DA82] text-[10px] font-bold mt-0.5">NEW</span>
      </button>
    </div>
  </div>
</template>