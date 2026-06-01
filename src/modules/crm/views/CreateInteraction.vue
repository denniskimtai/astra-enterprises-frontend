<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { createInteraction } from '@/services/modules/interaction.service'
import { getCustomers } from '@/services/modules/customer.service'
import type { Customer } from '@/types/customer.types'
import { Loader2, ArrowLeft, Save } from 'lucide-vue-next'

const router = useRouter()
const isLoading = ref(false)
const customers = ref<Customer[]>([])

const form = ref({
  customerId: '',
  mode: 'Physical Visit',
  purpose: '',
  outcomeDetails: '',
  outcomeStatus: 'Contactable',
  tag: 'Active Client',
  promisedAmount: null as number | null,
  defaultReason: 'N/A',
  nextSteps: '',
  locationGeo: '',
  interactionAt: new Date().toISOString().slice(0, 16),
  nextInteractionDate: ''
})

const fetchCustomers = async () => {
  try {
    const res = await getCustomers({ pageSize: 50 })
    if (res && res.items) {
      customers.value = res.items
    }
  } catch (error) {
    console.error('Failed to load customers:', error)
  }
}

onMounted(() => {
  fetchCustomers()
})

const onSubmit = async () => {
  try {
    isLoading.value = true
    
    const payload = {
      ...form.value,
      interactionAt: new Date(form.value.interactionAt).toISOString(),
      nextInteractionDate: form.value.nextInteractionDate || null,
      loanId: null
    }

    await createInteraction(payload)
    router.push('/crm/interactions')
  } catch (error) {
    console.error('Failed to create interaction:', error)
    alert('Error creating interaction')
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push('/crm/interactions')
}
</script>

<template>
  <div class="space-y-6 pb-6 max-w-4xl mx-auto">
    <div class="px-6 py-6 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button @click="goBack" class="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft class="w-5 h-5 text-[#4B4B6B]" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-[#1A1A2E]">New Interaction</h1>
          <p class="text-sm text-[#9CA3AF]">Record a new customer interaction</p>
        </div>
      </div>
    </div>

    <div class="px-6">
      <form @submit.prevent="onSubmit" class="bg-white rounded-lg border border-[#E5E0EA] p-6 space-y-6">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-[#1A1A2E]">Customer *</label>
            <select v-model="form.customerId" required class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964] bg-white">
              <option value="" disabled>Select a customer</option>
              <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.fullName }} ({{ c.phone }})</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-[#1A1A2E]">Interaction Date & Time *</label>
            <input type="datetime-local" v-model="form.interactionAt" required class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-[#1A1A2E]">Mode *</label>
            <input type="text" v-model="form.mode" required placeholder="e.g. Physical Visit, Call" class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]" />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-[#1A1A2E]">Outcome Status *</label>
            <input type="text" v-model="form.outcomeStatus" required placeholder="e.g. Contactable, PromisedToPay" class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]" />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-[#1A1A2E]">Tag *</label>
            <input type="text" v-model="form.tag" required placeholder="e.g. Active Client, Lead" class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]" />
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-[#1A1A2E]">Purpose *</label>
          <input type="text" v-model="form.purpose" required placeholder="e.g. Follow up on loan application" class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]" />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-[#1A1A2E]">Outcome Details *</label>
          <textarea v-model="form.outcomeDetails" required rows="3" placeholder="Detailed notes about the interaction..." class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964] resize-none"></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-[#1A1A2E]">Next Interaction Date</label>
            <input type="date" v-model="form.nextInteractionDate" class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]" />
          </div>

          <div class="space-y-2" v-if="form.outcomeStatus === 'PromisedToPay'">
            <label class="block text-sm font-medium text-[#1A1A2E]">Promised Amount</label>
            <input type="number" v-model="form.promisedAmount" placeholder="Amount promised" class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]" />
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-[#1A1A2E]">Next Steps</label>
          <input type="text" v-model="form.nextSteps" placeholder="What needs to happen next?" class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-[#1A1A2E]">Location Coordinates (Geo)</label>
            <input type="text" v-model="form.locationGeo" placeholder="e.g. 1.2921, 36.8219" class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]" />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-[#1A1A2E]">Default Reason</label>
            <input type="text" v-model="form.defaultReason" placeholder="If applicable" class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]" />
          </div>
        </div>

        <div class="flex justify-end pt-4 border-t border-[#E5E0EA]">
          <div class="flex gap-3">
            <button type="button" @click="goBack" class="px-4 py-2 text-sm font-medium text-[#4B4B6B] bg-white border border-[#E5E0EA] rounded-md hover:border-[#4F1964] transition-colors">
              Cancel
            </button>
            <button type="submit" :disabled="isLoading" class="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-[#4F1964] rounded-md hover:bg-[#380F47] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
              <Save v-else class="w-4 h-4" />
              {{ isLoading ? 'Saving...' : 'Save Interaction' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
