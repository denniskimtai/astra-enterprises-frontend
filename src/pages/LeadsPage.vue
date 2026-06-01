<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown, Eye, Flag, MessageCircle, Plus, Search } from 'lucide-vue-next'
import { getCustomers } from '@/services/modules/customer.service'
import { getBranches } from '@/services/modules/branch.service'
import { type Customer, CustomerStatus } from '@/types/customer.types'

const router = useRouter()
const leads = ref<Customer[]>([])
const loading = ref(true)

// Pagination & Search
const page = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const hasNextPage = ref(false)
const hasPreviousPage = ref(false)
const searchQuery = ref('')

const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value) || 1)

// Branch mapping
const branchesMap = ref<Record<string, string>>({})

const loadBranches = async () => {
  try {
    const res = await getBranches(1, 100)
    res.items.forEach(b => {
      branchesMap.value[b.id] = b.name
    })
  } catch (err) {
    console.error('Failed to load branches map:', err)
  }
}

const fetchLeads = async () => {
  loading.value = true
  try {
    const res = await getCustomers({
      page: page.value,
      pageSize: pageSize.value,
      searchTerm: searchQuery.value || null,
      status: CustomerStatus.LEAD
    })
    leads.value = res.items
    totalCount.value = res.totalCount
    hasNextPage.value = res.hasNextPage
    hasPreviousPage.value = res.hasPreviousPage
  } catch (err) {
    console.error('Failed to fetch leads:', err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadBranches()
  await fetchLeads()
})

const onSearch = () => {
  page.value = 1
  fetchLeads()
}

const prevPage = () => {
  if (page.value > 1) {
    page.value--
    fetchLeads()
  }
}

const nextPage = () => {
  if (hasNextPage.value) {
    page.value++
    fetchLeads()
  }
}

const goToNewLead = (): void => {
  router.push('/customers/leads/new')
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 2 }).format(amount)
}

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="space-y-6 pb-6">
    <div class="px-6 py-6">
      <div class="flex items-baseline gap-2">
        <h1 class="text-2xl font-bold text-[#1A1A2E]">Customer Leads</h1>
        <span class="text-sm text-[#9CA3AF]">List</span>
      </div>
    </div>

    <!-- Top Action Bar -->
    <div class="bg-[#F8F7FA] border-b border-[#E5E0EA] px-6 py-3">
      <div class="flex flex-wrap items-center gap-3">
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

    <!-- Search and Counts -->
    <div class="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center">
        <span class="rounded-full bg-[#4F1964] px-3 py-0.5 text-sm font-bold text-white">
          <span class="text-[#F9DA82]">{{ totalCount }}</span>
        </span>
        <span class="ml-2 text-sm text-[#4B4B6B]">Records Found</span>
      </div>

      <div class="flex w-full max-w-md items-center">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search leads by name or national ID..."
          @keyup.enter="onSearch"
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

    <!-- Loading State -->
    <div v-if="loading" class="mx-6 py-12 flex justify-center items-center bg-white border border-[#E5E0EA] rounded-lg">
      <div class="flex flex-col items-center gap-3">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4F1964]"></div>
        <p class="text-sm text-[#4B4B6B]">Loading customer leads...</p>
      </div>
    </div>

    <!-- Table -->
    <div v-else class="mx-6 overflow-hidden rounded-lg border border-[#E5E0EA] bg-white">
      <div class="overflow-x-auto">
        <table class="min-w-full border-separate border-spacing-0">
          <thead class="bg-[#F8F7FA] border-b border-[#E5E0EA]">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Photo</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Customer</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">National ID</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Phone</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Branch</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Location</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Added At</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Status</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="leads.length === 0">
              <td colspan="9" class="px-4 py-8 text-center text-sm text-[#9CA3AF]">No customer leads found.</td>
            </tr>
            <tr
              v-for="(lead, index) in leads"
              :key="lead.id"
              :class="[
                index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]',
                'border-b border-[#F3F4F6] hover:bg-[#F5F0F8] transition-colors duration-150'
              ]"
            >
              <!-- Photo -->
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="h-10 w-10 overflow-hidden rounded-full ring-1 ring-[#E5E0EA]">
                  <img
                    v-if="lead.photoUrl"
                    :src="lead.photoUrl"
                    alt="Photo"
                    class="h-full w-full object-cover"
                  />
                  <div
                    v-else
                    class="flex h-full w-full items-center justify-center bg-[#EDE9F5] text-center text-xs font-bold text-[#4F1964]"
                  >
                    {{ lead.fullName.split(' ').map(name => name[0]).join('') }}
                  </div>
                </div>
              </td>
              <!-- Name -->
              <td class="px-4 py-3 text-sm text-[#374151]">
                <span class="text-[#1A1A2E] font-semibold text-sm">{{ lead.fullName }}</span>
              </td>
              <!-- National ID -->
              <td class="px-4 py-3 text-sm text-[#374151] font-mono text-xs text-[#4B4B6B]">
                {{ lead.nationalId }}
              </td>
              <!-- Phone -->
              <td class="px-4 py-3 text-sm text-[#374151]">
                <span class="text-[#6B2385] text-xs underline cursor-pointer hover:text-[#4F1964] font-medium">{{ lead.phone }}</span>
              </td>
              <!-- Branch -->
              <td class="px-4 py-3 text-sm text-[#374151] text-xs">
                {{ branchesMap[lead.branchId] || 'Branch (' + lead.branchId.slice(0, 4) + ')' }}
              </td>
              <!-- Location -->
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="text-[#4B4B6B] text-xs leading-relaxed max-w-xs truncate" :title="lead.physicalAddress">
                  {{ lead.physicalAddress }}
                </div>
              </td>
              <!-- Added At -->
              <td class="px-4 py-3 text-sm text-[#374151] text-xs text-[#4B4B6B]">
                {{ formatDate(lead.createdAt) }}
              </td>
              <!-- Status -->
              <td class="px-4 py-3 text-sm text-[#374151]">
                <span class="inline-flex rounded-sm bg-[#F9DA82] px-2 py-0.5 text-[10px] font-bold uppercase text-[#1A1A2E]">
                  {{ lead.status.toUpperCase() }}
                </span>
              </td>
              <!-- Action -->
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="flex items-center gap-2">
                  <button
                    class="cursor-pointer text-[#4F1964] hover:text-[#380F47]"
                    @click="router.push(`/customers/${lead.id}`)"
                    title="View details"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 flex items-center justify-between border-t border-[#E5E0EA] bg-[#F8F7FA]">
        <div class="flex items-center gap-2">
          <span class="text-xs text-[#4B4B6B]">Per page:</span>
          <select v-model="pageSize" @change="onSearch" class="px-2 py-1 text-xs border border-[#E5E0EA] rounded-md bg-white">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <button :disabled="page === 1" @click="prevPage" class="px-3 py-1 text-xs border border-[#E5E0EA] rounded-md bg-white text-[#4B4B6B] disabled:opacity-50">Previous</button>
          <span class="px-3 py-1 text-xs font-medium text-[#4F1964]">{{ page }} / {{ totalPages }}</span>
          <button :disabled="!hasNextPage" @click="nextPage" class="px-3 py-1 text-xs border border-[#E5E0EA] rounded-md bg-white text-[#4B4B6B] disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>
