<script setup lang="ts">
import { X, Flag, MapPin } from 'lucide-vue-next'
import type { Interaction } from '@/services/modules/interaction.service'
import type { Customer } from '@/types/customer.types'

interface Props {
  interaction: Interaction | null
  customer?: Customer
  show: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ close: [] }>()

const getDateBadgeClass = (label: string) => {
  if (label === 'TODAY') return 'bg-[#6B2385] text-white'
  if (label === 'YESTERDAY') return 'bg-gradient-to-r from-[#4F1964] to-[#6B2385] text-white'
  if (label === 'TOMORROW') return 'bg-[#F9DA82] text-[#1A1A2E]'
  return 'bg-[#F8F7FA] text-[#4B4B6B]'
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
  <Teleport to="body">
    <div
      v-if="show && interaction"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      @click.self="emit('close')"
    >
      <div class="bg-white rounded-lg w-full max-w-lg mx-4 shadow-xl">
        <!-- Header -->
        <div class="flex justify-between items-center px-6 py-4 border-b border-[#E5E0EA]">
          <h2 class="text-lg font-semibold text-[#1A1A2E]">Interaction Details</h2>
          <X class="w-5 h-5 text-[#9CA3AF] cursor-pointer hover:text-[#4F1964]" @click="emit('close')" />
        </div>

        <!-- Body -->
        <div class="px-6 py-4 space-y-0 overflow-y-auto max-h-[70vh]">
          <!-- ID -->
          <div class="flex border-b border-[#F3F4F6] py-3">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">ID</span>
            <span class="flex-1 text-sm text-[#1A1A2E] font-medium font-mono">{{ interaction.id }}</span>
          </div>

          <!-- Customer -->
          <div class="flex border-b border-[#F3F4F6] py-3">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">Customer</span>
            <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ customer?.fullName || interaction.customerId }}</span>
          </div>

          <!-- Agent -->
          <div class="flex border-b border-[#F3F4F6] py-3">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">Agent ID</span>
            <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ interaction.agentId }}</span>
          </div>

          <!-- Loan ID -->
          <div class="flex border-b border-[#F3F4F6] py-3">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">Loan ID</span>
            <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ interaction.loanId || 'N/A' }}</span>
          </div>

          <!-- Details -->
          <div class="flex border-b border-[#F3F4F6] py-3">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">Details</span>
            <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ interaction.outcomeDetails }}</span>
          </div>

          <!-- Conversation Method -->
          <div class="flex border-b border-[#F3F4F6] py-3">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">Conversation Method</span>
            <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ interaction.mode }}</span>
          </div>

          <!-- Conversation Purpose -->
          <div class="flex border-b border-[#F3F4F6] py-3">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">Conversation Purpose</span>
            <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ interaction.purpose }}</span>
          </div>

          <!-- Conversation Outcome -->
          <div class="flex border-b border-[#F3F4F6] py-3">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">Outcome Status</span>
            <div class="flex-1 flex items-center gap-2">
              <Flag class="w-3 h-3 text-[#F9DA82]" />
              <span class="text-sm text-[#6B2385] font-medium">{{ interaction.outcomeStatus }}</span>
            </div>
          </div>

          <!-- Tag -->
          <div class="flex border-b border-[#F3F4F6] py-3">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">Tag</span>
            <span class="flex-1">
              <span class="bg-[#EDE9F5] border border-[#C4B5D4] text-[#4F1964] text-[10px] font-bold px-2 py-0.5 rounded-sm">
                {{ interaction.tag }}
              </span>
            </span>
          </div>

          <!-- Default Reason -->
          <div class="flex border-b border-[#F3F4F6] py-3">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">Default Reason</span>
            <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ interaction.defaultReason || 'N/A' }}</span>
          </div>

          <!-- Promised Amount -->
          <div class="flex border-b border-[#F3F4F6] py-3" v-if="interaction.outcomeStatus === 'PromisedToPay'">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">Promised Amount</span>
            <span class="flex-1 text-sm text-[#1A1A2E] font-medium">KES {{ interaction.promisedAmount?.toLocaleString() || '0' }}</span>
          </div>

          <!-- Conversation Date -->
          <div class="flex border-b border-[#F3F4F6] py-3">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">Interaction Date</span>
            <div class="flex-1 flex items-center">
              <span class="text-sm text-[#1A1A2E] font-medium">{{ formatDate(interaction.interactionAt) }} {{ formatTime(interaction.interactionAt) }}</span>
              <span :class="['ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full', getDateBadgeClass(getTimeLabel(interaction.interactionAt))]">
                {{ getTimeLabel(interaction.interactionAt) }}
              </span>
            </div>
          </div>

          <!-- Next Interaction -->
          <div class="flex border-b border-[#F3F4F6] py-3">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">Next Interaction</span>
            <div class="flex-1 flex items-center">
              <span class="text-sm text-[#1A1A2E] font-medium">{{ formatDate(interaction.nextInteractionDate) }}</span>
              <span v-if="interaction.nextInteractionDate" :class="['ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full', getDateBadgeClass(getTimeLabel(interaction.nextInteractionDate))]">
                {{ getTimeLabel(interaction.nextInteractionDate) }}
              </span>
            </div>
          </div>

          <!-- Next Steps -->
          <div class="flex border-b border-[#F3F4F6] py-3">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">Next Steps</span>
            <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ interaction.nextSteps || '-' }}</span>
          </div>

          <!-- Location Geo -->
          <div class="flex border-b border-[#F3F4F6] py-3">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">Location (Geo)</span>
            <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ interaction.locationGeo || 'N/A' }}</span>
          </div>

          <!-- Map Section -->
          <div v-if="interaction.locationGeo" class="mt-4 mb-2">
            <h3 class="text-base font-semibold text-[#1A1A2E]">Interaction Location</h3>
            <div class="w-full h-32 mt-2 bg-[#F8F7FA] rounded-lg border border-[#E5E0EA] flex flex-col items-center justify-center">
              <MapPin class="w-6 h-6 text-[#4F1964] mb-1" />
              <span class="text-xs text-[#9CA3AF]">{{ interaction.locationGeo }}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end px-6 py-4 border-t border-[#E5E0EA]">
          <button
            class="bg-white border border-[#E5E0EA] text-[#4B4B6B] hover:border-[#4F1964] hover:text-[#4F1964] px-6 py-2 rounded-md text-sm transition-colors"
            @click="emit('close')"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>