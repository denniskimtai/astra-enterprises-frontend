<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, Save, Loader2 } from 'lucide-vue-next'
import type { BranchResponse } from '@/types/branch.types'
import { createBranch, updateBranch } from '@/services/modules/branch.service'

const props = defineProps<{
  isOpen: boolean
  branchToEdit?: BranchResponse | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const isLoading = ref(false)
const form = ref({
  name: '',
  location: ''
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.branchToEdit) {
      form.value = {
        name: props.branchToEdit.name,
        location: props.branchToEdit.location
      }
    } else {
      form.value = {
        name: '',
        location: ''
      }
    }
  }
})

const onSubmit = async () => {
  try {
    isLoading.value = true
    if (props.branchToEdit) {
      await updateBranch(props.branchToEdit.id, form.value)
    } else {
      await createBranch(form.value)
    }
    emit('saved')
    emit('close')
  } catch (error) {
    console.error('Error saving branch:', error)
    alert('Failed to save branch. Ensure you have the required permissions.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        
        <div class="px-6 py-4 border-b border-[#E5E0EA] flex justify-between items-center bg-[#F8F7FA]">
          <h3 class="text-lg font-bold text-[#1A1A2E]">{{ branchToEdit ? 'Edit Branch' : 'Add Branch' }}</h3>
          <button @click="emit('close')" class="text-[#9CA3AF] hover:text-[#4F1964]">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="p-6 overflow-y-auto">
          <form id="branchForm" @submit.prevent="onSubmit" class="space-y-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-[#1A1A2E]">Branch Name *</label>
              <input 
                type="text" 
                v-model="form.name" 
                required 
                maxlength="100"
                placeholder="e.g. Nairobi HQ"
                class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]" 
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-[#1A1A2E]">Location *</label>
              <input 
                type="text" 
                v-model="form.location" 
                required 
                maxlength="200"
                placeholder="e.g. Upperhill, Nairobi"
                class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]" 
              />
            </div>
          </form>
        </div>

        <div class="px-6 py-4 border-t border-[#E5E0EA] flex justify-end gap-3 bg-gray-50">
          <button 
            type="button"
            @click="emit('close')" 
            class="px-4 py-2 text-sm font-medium text-[#4B4B6B] bg-white border border-[#E5E0EA] rounded-md hover:border-[#4F1964]"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="branchForm"
            :disabled="isLoading"
            class="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-[#4F1964] rounded-md hover:bg-[#380F47] disabled:opacity-50"
          >
            <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
            <Save v-else class="w-4 h-4" />
            Save Branch
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>
