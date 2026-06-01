<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Search, Edit, Trash2, Loader2, RefreshCw } from 'lucide-vue-next'
import { getLoanProducts, deleteLoanProduct } from '@/services/modules/loanProduct.service'
import type { LoanProduct } from '@/types/loan.types'
import LoanProductModal from '../components/LoanProductModal.vue'

const products = ref<LoanProduct[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const perPage = ref(10)
const totalRecords = ref(0)
const totalPages = ref(1)

const isModalOpen = ref(false)
const selectedProduct = ref<LoanProduct | null>(null)

const fetchProducts = async () => {
  try {
    isLoading.value = true
    const result = await getLoanProducts({
      page: currentPage.value,
      pageSize: perPage.value,
      searchTerm: searchQuery.value || undefined
    })
    
    products.value = result.items || []
    totalRecords.value = result.totalCount || 0
    totalPages.value = Math.ceil(totalRecords.value / perPage.value) || 1
  } catch (error) {
    console.error('Failed to fetch loan products:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})

const onSearch = () => {
  currentPage.value = 1
  fetchProducts()
}

const openAddModal = () => {
  selectedProduct.value = null
  isModalOpen.value = true
}

const openEditModal = (product: LoanProduct) => {
  selectedProduct.value = product
  isModalOpen.value = true
}

const handleDelete = async (id: string) => {
  if (!confirm('Are you sure you want to delete this loan product?')) return
  try {
    await deleteLoanProduct(id)
    fetchProducts()
  } catch (error) {
    console.error('Failed to delete loan product:', error)
    alert('Deletion failed. You may lack permissions.')
  }
}

const formatCurrency = (value: number) => {
  return `Ksh ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
</script>

<template>
  <div class="space-y-6 pb-6">
    <div class="px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-[#1A1A2E]">Loan Products</h1>
        <p class="text-sm text-[#9CA3AF]">Manage system loan configurations and parameters</p>
      </div>
      
      <button
        type="button"
        @click="openAddModal"
        class="inline-flex items-center gap-2 rounded-md bg-[#4F1964] px-4 py-2 text-sm font-medium text-white hover:bg-[#380F47] transition-colors"
      >
        <Plus class="w-4 h-4" />
        Add Product
      </button>
    </div>

    <div class="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between bg-white border-y border-[#E5E0EA]">
      <div class="inline-flex items-center gap-2">
        <span class="text-sm font-medium text-[#4B4B6B]">Total Records:</span>
        <span class="inline-flex items-center justify-center rounded-full bg-[#F3F4F6] px-3 py-1 text-sm font-bold text-[#1A1A2E]">{{ totalRecords }}</span>
      </div>

      <div class="flex items-center gap-2">
        <input
          v-model="searchQuery"
          @keyup.enter="onSearch"
          type="text"
          placeholder="Search product name..."
          class="h-10 rounded-md border border-[#E5E0EA] px-3 text-sm text-[#1A1A2E] focus:outline-none focus:ring-1 focus:ring-[#4F1964] min-w-[250px]"
        />
        <button
          type="button"
          @click="onSearch"
          class="inline-flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-[#4B4B6B] hover:bg-gray-200 transition-colors"
        >
          <Search class="w-4 h-4" />
        </button>
        <button
          type="button"
          @click="fetchProducts"
          class="inline-flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-[#4B4B6B] hover:bg-gray-200 transition-colors ml-2"
          title="Refresh"
        >
          <RefreshCw class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div class="mx-6 overflow-x-auto rounded-lg border border-[#E5E0EA] bg-white">
      <table class="min-w-full">
        <thead class="bg-[#F8F7FA]">
          <tr>
            <th class="px-4 py-3 text-left text-[#4F1964] font-semibold text-xs uppercase tracking-wider">Product Name</th>
            <th class="px-4 py-3 text-left text-[#4F1964] font-semibold text-xs uppercase tracking-wider">Min Amount</th>
            <th class="px-4 py-3 text-left text-[#4F1964] font-semibold text-xs uppercase tracking-wider">Max Amount</th>
            <th class="px-4 py-3 text-left text-[#4F1964] font-semibold text-xs uppercase tracking-wider">Interest Rate</th>
            <th class="px-4 py-3 text-left text-[#4F1964] font-semibold text-xs uppercase tracking-wider">Repayment Days</th>
            <th class="px-4 py-3 text-right text-[#4F1964] font-semibold text-xs uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="6" class="px-4 py-8 text-center text-sm text-[#9CA3AF]">
              <div class="flex items-center justify-center gap-2">
                <Loader2 class="w-5 h-5 animate-spin text-[#4F1964]" />
                <span>Loading products...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="products.length === 0">
            <td colspan="6" class="px-4 py-8 text-center text-sm text-[#9CA3AF]">
              No loan products found.
            </td>
          </tr>
          <tr
            v-else
            v-for="product in products"
            :key="product.id"
            class="border-b border-[#F3F4F6] hover:bg-[#F5F0F8] transition-colors"
          >
            <td class="px-4 py-4 font-bold text-[#1A1A2E] text-sm">{{ product.name }}</td>
            <td class="px-4 py-4 text-[#4B4B6B] text-sm font-medium">{{ formatCurrency(product.minAmount) }}</td>
            <td class="px-4 py-4 text-[#4B4B6B] text-sm font-medium">{{ formatCurrency(product.maxAmount) }}</td>
            <td class="px-4 py-4 text-[#166534] text-sm font-bold">{{ product.interestRate }}%</td>
            <td class="px-4 py-4 text-[#1A1A2E] text-sm">{{ product.repaymentDays }} Days</td>
            <td class="px-4 py-4 text-right">
              <div class="flex items-center justify-end gap-3">
                <button @click="openEditModal(product)" class="text-[#4B4B6B] hover:text-[#4F1964] transition-colors">
                  <Edit class="w-4 h-4" />
                </button>
                <button @click="handleDelete(product.id)" class="text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Component -->
    <LoanProductModal 
      :is-open="isModalOpen" 
      :product-to-edit="selectedProduct" 
      @close="isModalOpen = false" 
      @saved="fetchProducts"
    />

  </div>
</template>
