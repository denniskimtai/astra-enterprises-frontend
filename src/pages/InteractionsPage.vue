<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
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
  Search,
  Loader2
} from 'lucide-vue-next'
import InteractionDetailModal from '@/modules/crm/components/InteractionDetailModal.vue'
import { getInteractions, type Interaction } from '@/services/modules/interaction.service'
import { getCustomers } from '@/services/modules/customer.service'
import type { Customer } from '@/types/customer.types'

const router = useRouter()
const activeTab = ref<'all' | 'my' | 'ptps'>('all')
const searchQuery = ref('')
const interactionDate = ref('')
const nextDateToggle = ref(false)
const selectedInteraction = ref<Interaction | null>(null)
const showModal = ref(false)
const isLoading = ref(false)

const filterPills = ['All Outcomes', 'Customer Type', 'All Methods', 'All Branches']

const interactions = ref<Interaction[]>([])
const customerMap = ref<Record<string, Customer>>({})

const loadCustomers = async () => {
  try {
    const res = await getCustomers({ pageSize: 100 })
    if (res && res.items) {
      res.items.forEach(c => {
        customerMap.value[c.id] = c
      })
    }
  } catch (error) {
    console.error('Failed to load customers:', error)
  }
}

const loadInteractions = async () => {
  try {
    isLoading.value = true
    let outcomeStatus = undefined
    if (activeTab.value === 'ptps') outcomeStatus = 'PromisedToPay'
    
    const res = await getInteractions({ page: 1, pageSize: 50, outcomeStatus })
    if (res && res.items) {
      interactions.value = res.items
    } else {
      interactions.value = []
    }
  } catch (error) {
    console.error('Failed to load interactions:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadCustomers()
  loadInteractions()
})

watch(activeTab, () => {
  loadInteractions()
})

const goToNewInteraction = (): void => {
  router.push('/crm/interactions/new')
}

const onSearch = (): void => {
  loadInteractions()
}

const getNextInteractionBadgeColor = (label: string) => {
  if (label === 'TODAY') return 'bg-[#6B2385] text-white'
  if (label === 'YESTERDAY') return 'bg-gradient-to-r from-[#4F1964] to-[#6B2385] text-white'
  if (label === 'TOMORROW') return 'bg-[#F9DA82] text-[#1A1A2E]'
  return 'bg-gray-200 text-gray-600'
}

const formatDate = (isoString: string | null) => {
  if (!isoString) return 'N/A'
  const d = new Date(isoString)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatTime = (isoString: string | null) => {
  if (!isoString) return ''
  const d = new Date(isoString)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const getTimeLabel = (isoString: string | null) => {
  if (!isoString) return ''
  const d = new Date(isoString)
  const today = new Date()
  const diffTime = d.getTime() - today.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'TODAY'
  if (diffDays === -1) return 'YESTERDAY'
  if (diffDays === 1) return 'TOMORROW'
  if (diffDays < 0) return `${Math.abs(diffDays)} DAYS AGO`
  return `IN ${diffDays} DAYS`
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
            <tr v-if="isLoading">
              <td colspan="9" class="px-4 py-8 text-center text-sm text-[#9CA3AF]">
                <div class="flex items-center justify-center gap-2">
                  <Loader2 class="w-5 h-5 animate-spin text-[#4F1964]" />
                  <span>Loading interactions...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="interactions.length === 0">
              <td colspan="9" class="px-4 py-8 text-center text-sm text-[#9CA3AF]">
                No interactions found.
              </td>
            </tr>
            <tr
              v-else
              v-for="(interaction, index) in interactions"
              :key="interaction.id"
              :class="[
                index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]',
                'border-b border-[#F3F4F6] hover:bg-[#F5F0F8] transition-colors duration-150'
              ]"
            >
              <td class="px-4 py-3 text-sm text-[#374151]">
                <span class="text-[#4B4B6B] font-mono text-xs">{{ interaction.id.slice(0, 8) }}</span>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="space-y-1">
                  <div class="flex items-center">
                    <span class="text-[#1A1A2E] font-medium text-sm">{{ customerMap[interaction.customerId]?.fullName || 'Loading...' }}</span>
                    <ExternalLink class="w-3 h-3 text-[#6B2385] ml-1 cursor-pointer" />
                  </div>
                  <div class="text-[#9CA3AF] text-xs">Branch: {{ customerMap[interaction.customerId]?.branchId?.slice(0, 8) || 'N/A' }}</div>
                  <div class="flex items-center gap-1 mt-1">
                    <Flag class="w-3 h-3 text-[#F9DA82]" />
                    <span class="text-[#6B2385] text-xs font-medium">{{ interaction.outcomeStatus }}</span>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="flex flex-col items-center">
                  <Phone class="w-4 h-4 text-[#4F1964]" />
                  <span class="text-[#4B4B6B] text-xs mt-0.5">{{ interaction.mode }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="space-y-2">
                  <div class="text-[#4B4B6B] text-xs">{{ formatDate(interaction.interactionAt) }}</div>
                  <div class="inline-flex items-center rounded-full bg-gradient-to-r from-[#4F1964] to-[#6B2385] px-2 py-0.5 text-[10px] font-bold text-white">{{ getTimeLabel(interaction.interactionAt) }}</div>
                  <div class="text-[#6B2385] text-xs font-medium">{{ formatTime(interaction.interactionAt) }}</div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <span class="text-[#1A1A2E] text-xs font-medium">{{ interaction.agentId?.slice(0, 8) || 'Unknown' }}</span>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="space-y-1">
                  <div class="text-[#4B4B6B] text-xs leading-relaxed max-w-md" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;" :title="interaction.outcomeDetails">
                    {{ interaction.outcomeDetails }}
                  </div>
                  <div class="inline-flex rounded-sm bg-[#EDE9F5] border border-[#C4B5D4] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#4F1964] mt-1">
                    {{ interaction.tag }}
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="space-y-2">
                  <div class="text-[#4B4B6B] text-xs">{{ formatDate(interaction.nextInteractionDate) }}</div>
                  <div v-if="interaction.nextInteractionDate" :class="['inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold', getNextInteractionBadgeColor(getTimeLabel(interaction.nextInteractionDate))]">
                    {{ getTimeLabel(interaction.nextInteractionDate) }}
                  </div>
                  <div v-else class="text-xs text-[#9CA3AF]">-</div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="space-y-1">
                  <div class="text-[#9CA3AF] text-xs">Loan ID:</div>
                  <div class="text-[#1A1A2E] text-xs font-semibold">{{ interaction.loanId ? interaction.loanId.slice(0,8) : 'Null' }}</div>
                  <div class="text-[#9CA3AF] text-xs" v-if="interaction.outcomeStatus === 'PromisedToPay'">Promised:</div>
                  <div class="text-[#E8604A] text-xs font-bold" v-if="interaction.outcomeStatus === 'PromisedToPay'">KES {{ interaction.promisedAmount?.toLocaleString() || '0' }}</div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="flex flex-col items-center">
                  <Eye class="w-4 h-4 cursor-pointer text-[#4F1964] hover:text-[#380F47]" @click="selectedInteraction = interaction; showModal = true" />
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

    <!-- Interaction Detail Modal -->
    <InteractionDetailModal
      :interaction="selectedInteraction"
      :customer="customerMap[selectedInteraction?.customerId || '']"
      :show="showModal"
      @close="showModal = false; selectedInteraction = null"
    />
  </div>
</template>