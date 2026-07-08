<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { createInteraction } from '@/services/modules/interaction.service'
import { getCustomers } from '@/services/modules/customer.service'
import type { Customer } from '@/types/customer.types'
import { Loader2, ArrowLeft, Save, AlertCircle } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const customers = ref<Customer[]>([])

const errors = ref<string[]>([])
const valErrors = reactive<Record<string, string>>({})

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
  if (route.query.customerId) {
    form.value.customerId = route.query.customerId as string
  }
})

const validateForm = (): boolean => {
  errors.value = []
  Object.keys(valErrors).forEach(key => delete valErrors[key])

  if (!form.value.customerId) valErrors.customerId = 'Customer is required.'
  if (!form.value.interactionAt) valErrors.interactionAt = 'Interaction date and time is required.'
  if (!form.value.mode.trim()) valErrors.mode = 'Mode is required.'
  if (!form.value.outcomeStatus.trim()) valErrors.outcomeStatus = 'Outcome status is required.'
  if (!form.value.tag.trim()) valErrors.tag = 'Tag is required.'
  if (!form.value.purpose.trim()) valErrors.purpose = 'Purpose is required.'
  if (!form.value.outcomeDetails.trim()) valErrors.outcomeDetails = 'Outcome details are required.'
  
  if (form.value.outcomeStatus === 'PromisedToPay') {
    if (form.value.promisedAmount === null || form.value.promisedAmount <= 0) {
      valErrors.promisedAmount = 'Promised amount must be a positive number.'
    }
  }

  errors.value = Object.values(valErrors)
  return errors.value.length === 0
}

watch(() => form.value.customerId, (val) => { if (val) delete valErrors.customerId })
watch(() => form.value.interactionAt, (val) => { if (val) delete valErrors.interactionAt })
watch(() => form.value.mode, (val) => { if (val.trim()) delete valErrors.mode })
watch(() => form.value.outcomeStatus, (val) => { if (val.trim()) delete valErrors.outcomeStatus })
watch(() => form.value.tag, (val) => { if (val.trim()) delete valErrors.tag })
watch(() => form.value.purpose, (val) => { if (val.trim()) delete valErrors.purpose })
watch(() => form.value.outcomeDetails, (val) => { if (val.trim()) delete valErrors.outcomeDetails })
watch(() => form.value.promisedAmount, (val) => { if (val !== null && val > 0) delete valErrors.promisedAmount })

const onSubmit = async () => {
  if (!validateForm()) {
    return
  }

  try {
    isLoading.value = true
    
    const payload = {
      ...form.value,
      interactionAt: new Date(form.value.interactionAt).toISOString(),
      nextInteractionDate: form.value.nextInteractionDate || null,
      loanId: null
    }

    await createInteraction(payload)
    if (route.query.customerId) {
      router.push(`/customers/${route.query.customerId}`)
    } else {
      router.push('/crm/interactions')
    }
  } catch (error) {
    console.error('Failed to create interaction:', error)
    alert('Error creating interaction')
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  if (route.query.customerId) {
    router.push(`/customers/${route.query.customerId}`)
  } else {
    router.push('/crm/interactions')
  }
}
</script>

<template>
  <div class="space-y-6 pb-6 max-w-4xl mx-auto">
    <!-- Page Header -->
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

    <!-- Error Alert Banner -->
    <div v-if="errors.length > 0" class="mx-6 bg-red-50 border-l-4 border-red-500 rounded-md p-4 flex gap-3">
      <AlertCircle class="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
      <div class="flex-1 text-sm text-red-700">
        <h3 class="font-bold mb-1">Please correct the following errors:</h3>
        <ul class="list-disc pl-5 space-y-1">
          <li v-for="err in errors" :key="err">{{ err }}</li>
        </ul>
      </div>
    </div>

    <div class="px-6">
      <form @submit.prevent="onSubmit" class="bg-white rounded-lg border border-[#E5E0EA] p-6 space-y-6">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-[#1A1A2E]">Customer *</label>
            <select 
              v-model="form.customerId" 
              required 
              :class="[
                'w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964] bg-white',
                valErrors.customerId ? 'border-red-500 focus:border-red-500' : 'border-[#E5E0EA]'
              ]"
            >
              <option value="" disabled>Select a customer</option>
              <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.fullName }} ({{ c.phone }})</option>
            </select>
            <p v-if="valErrors.customerId" class="text-xs text-red-500 mt-1">{{ valErrors.customerId }}</p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-[#1A1A2E]">Interaction Date & Time *</label>
            <input 
              type="datetime-local" 
              v-model="form.interactionAt" 
              required 
              :class="[
                'w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]',
                valErrors.interactionAt ? 'border-red-500 focus:border-red-500' : 'border-[#E5E0EA]'
              ]" 
            />
            <p v-if="valErrors.interactionAt" class="text-xs text-red-500 mt-1">{{ valErrors.interactionAt }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-[#1A1A2E]">Mode *</label>
            <input 
              type="text" 
              v-model="form.mode" 
              required 
              placeholder="e.g. Physical Visit, Call" 
              :class="[
                'w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]',
                valErrors.mode ? 'border-red-500 focus:border-red-500' : 'border-[#E5E0EA]'
              ]" 
            />
            <p v-if="valErrors.mode" class="text-xs text-red-500 mt-1">{{ valErrors.mode }}</p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-[#1A1A2E]">Outcome Status *</label>
            <input 
              type="text" 
              v-model="form.outcomeStatus" 
              required 
              placeholder="e.g. Contactable, PromisedToPay" 
              :class="[
                'w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]',
                valErrors.outcomeStatus ? 'border-red-500 focus:border-red-500' : 'border-[#E5E0EA]'
              ]" 
            />
            <p v-if="valErrors.outcomeStatus" class="text-xs text-red-500 mt-1">{{ valErrors.outcomeStatus }}</p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-[#1A1A2E]">Tag *</label>
            <input 
              type="text" 
              v-model="form.tag" 
              required 
              placeholder="e.g. Active Client, Lead" 
              :class="[
                'w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]',
                valErrors.tag ? 'border-red-500 focus:border-red-500' : 'border-[#E5E0EA]'
              ]" 
            />
            <p v-if="valErrors.tag" class="text-xs text-red-500 mt-1">{{ valErrors.tag }}</p>
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-[#1A1A2E]">Purpose *</label>
          <input 
            type="text" 
            v-model="form.purpose" 
            required 
            placeholder="e.g. Follow up on loan application" 
            :class="[
              'w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]',
              valErrors.purpose ? 'border-red-500 focus:border-red-500' : 'border-[#E5E0EA]'
            ]" 
          />
          <p v-if="valErrors.purpose" class="text-xs text-red-500 mt-1">{{ valErrors.purpose }}</p>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-[#1A1A2E]">Outcome Details *</label>
          <textarea 
            v-model="form.outcomeDetails" 
            required 
            rows="3" 
            placeholder="Detailed notes about the interaction..." 
            :class="[
              'w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964] resize-none',
              valErrors.outcomeDetails ? 'border-red-500 focus:border-red-500' : 'border-[#E5E0EA]'
            ]"
          ></textarea>
          <p v-if="valErrors.outcomeDetails" class="text-xs text-red-500 mt-1">{{ valErrors.outcomeDetails }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-[#1A1A2E]">Next Interaction Date</label>
            <input type="date" v-model="form.nextInteractionDate" class="w-full rounded-md border border-[#E5E0EA] px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964] bg-white" />
          </div>

          <div class="space-y-2" v-if="form.outcomeStatus === 'PromisedToPay'">
            <label class="block text-sm font-medium text-[#1A1A2E]">Promised Amount *</label>
            <input 
              type="number" 
              v-model="form.promisedAmount" 
              placeholder="Amount promised" 
              :class="[
                'w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]',
                valErrors.promisedAmount ? 'border-red-500 focus:border-red-500' : 'border-[#E5E0EA]'
              ]" 
            />
            <p v-if="valErrors.promisedAmount" class="text-xs text-red-500 mt-1">{{ valErrors.promisedAmount }}</p>
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
