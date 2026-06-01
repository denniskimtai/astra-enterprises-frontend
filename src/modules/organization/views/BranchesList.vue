<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Edit, Trash2, Loader2, RefreshCw } from 'lucide-vue-next'
import { getBranches, deleteBranch } from '@/services/modules/branch.service'
import type { BranchResponse } from '@/types/branch.types'
import BranchModal from '../components/BranchModal.vue'

const branches = ref<BranchResponse[]>([])
const isLoading = ref(false)
const currentPage = ref(1)
const perPage = ref(10)
const totalRecords = ref(0)
const totalPages = ref(1)

const isModalOpen = ref(false)
const selectedBranch = ref<BranchResponse | null>(null)

const fetchBranches = async () => {
  try {
    isLoading.value = true
    const result = await getBranches({
      page: currentPage.value,
      pageSize: perPage.value
    })
    
    branches.value = result.items || []
    totalRecords.value = result.totalCount || 0
    totalPages.value = Math.ceil(totalRecords.value / perPage.value) || 1
  } catch (error) {
    console.error('Failed to fetch branches:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchBranches()
})

const openAddModal = () => {
  selectedBranch.value = null
  isModalOpen.value = true
}

const openEditModal = (branch: BranchResponse) => {
  selectedBranch.value = branch
  isModalOpen.value = true
}

const handleDelete = async (id: string) => {
  if (!confirm('Are you sure you want to delete this branch?')) return
  try {
    await deleteBranch(id)
    fetchBranches()
  } catch (error) {
    console.error('Failed to delete branch:', error)
    alert('Deletion failed. You may lack permissions.')
  }
}

const formatDate = (isoString: string | null) => {
  if (!isoString) return 'N/A'
  const d = new Date(isoString)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="space-y-6 pb-6">
    <div class="px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-[#1A1A2E]">Branches</h1>
        <p class="text-sm text-[#9CA3AF]">Manage organization branches and locations</p>
      </div>
      
      <button
        type="button"
        @click="openAddModal"
        class="inline-flex items-center gap-2 rounded-md bg-[#4F1964] px-4 py-2 text-sm font-medium text-white hover:bg-[#380F47] transition-colors"
      >
        <Plus class="w-4 h-4" />
        Add Branch
      </button>
    </div>

    <div class="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between bg-white border-y border-[#E5E0EA]">
      <div class="inline-flex items-center gap-2">
        <span class="text-sm font-medium text-[#4B4B6B]">Total Branches:</span>
        <span class="inline-flex items-center justify-center rounded-full bg-[#F3F4F6] px-3 py-1 text-sm font-bold text-[#1A1A2E]">{{ totalRecords }}</span>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="fetchBranches"
          class="inline-flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-[#4B4B6B] hover:bg-gray-200 transition-colors"
          title="Refresh"
        >
          <RefreshCw class="w-4 h-4" />
          Refresh
        </button>
      </div>
    </div>

    <div class="mx-6 overflow-x-auto rounded-lg border border-[#E5E0EA] bg-white">
      <table class="min-w-full">
        <thead class="bg-[#F8F7FA]">
          <tr>
            <th class="px-4 py-3 text-left text-[#4F1964] font-semibold text-xs uppercase tracking-wider">Branch Name</th>
            <th class="px-4 py-3 text-left text-[#4F1964] font-semibold text-xs uppercase tracking-wider">Location</th>
            <th class="px-4 py-3 text-left text-[#4F1964] font-semibold text-xs uppercase tracking-wider">Created At</th>
            <th class="px-4 py-3 text-right text-[#4F1964] font-semibold text-xs uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="4" class="px-4 py-8 text-center text-sm text-[#9CA3AF]">
              <div class="flex items-center justify-center gap-2">
                <Loader2 class="w-5 h-5 animate-spin text-[#4F1964]" />
                <span>Loading branches...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="branches.length === 0">
            <td colspan="4" class="px-4 py-8 text-center text-sm text-[#9CA3AF]">
              No branches found.
            </td>
          </tr>
          <tr
            v-else
            v-for="branch in branches"
            :key="branch.id"
            class="border-b border-[#F3F4F6] hover:bg-[#F5F0F8] transition-colors"
          >
            <td class="px-4 py-4 font-bold text-[#1A1A2E] text-sm">{{ branch.name }}</td>
            <td class="px-4 py-4 text-[#4B4B6B] text-sm">{{ branch.location }}</td>
            <td class="px-4 py-4 text-[#4B4B6B] text-sm">{{ formatDate(branch.createdAt) }}</td>
            <td class="px-4 py-4 text-right">
              <div class="flex items-center justify-end gap-3">
                <button @click="openEditModal(branch)" class="text-[#4B4B6B] hover:text-[#4F1964] transition-colors">
                  <Edit class="w-4 h-4" />
                </button>
                <button @click="handleDelete(branch.id)" class="text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls (simple) -->
    <div v-if="totalPages > 1" class="flex items-center justify-end px-6 py-4 gap-2">
      <button 
        @click="currentPage > 1 && (currentPage--, fetchBranches())"
        :disabled="currentPage === 1"
        class="px-3 py-1 rounded border border-[#E5E0EA] text-sm disabled:opacity-50"
      >
        Prev
      </button>
      <span class="text-sm text-[#4B4B6B]">Page {{ currentPage }} of {{ totalPages }}</span>
      <button 
        @click="currentPage < totalPages && (currentPage++, fetchBranches())"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 rounded border border-[#E5E0EA] text-sm disabled:opacity-50"
      >
        Next
      </button>
    </div>

    <BranchModal 
      :is-open="isModalOpen" 
      :branch-to-edit="selectedBranch" 
      @close="isModalOpen = false" 
      @saved="fetchBranches"
    />

  </div>
</template>
