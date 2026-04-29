<script setup lang="ts">
import { X, Flag, MapPin } from 'lucide-vue-next'
import type { Interaction } from '@/pages/InteractionsPage.vue'

interface Props {
  interaction: Interaction | null
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
            <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ interaction.customerName }}</span>
          </div>

          <!-- Agent -->
          <div class="flex border-b border-[#F3F4F6] py-3">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">Agent</span>
            <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ interaction.agent }}</span>
          </div>

          <!-- Loan ID -->
          <div class="flex border-b border-[#F3F4F6] py-3">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">Loan ID</span>
            <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ interaction.loanId || 0 }}</span>
          </div>

          <!-- Details -->
          <div class="flex border-b border-[#F3F4F6] py-3">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">Details</span>
            <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ interaction.outcomeDetails }}</span>
          </div>

          <!-- Conversation Method -->
          <div class="flex border-b border-[#F3F4F6] py-3">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">Conversation Method</span>
            <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ interaction.interactionMode }}</span>
          </div>

          <!-- Conversation Purpose -->
          <div class="flex border-b border-[#F3F4F6] py-3">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">Conversation Purpose</span>
            <span class="flex-1 text-sm text-[#1A1A2E] font-medium">Customer Follow up</span>
          </div>

          <!-- Conversation Outcome -->
          <div class="flex border-b border-[#F3F4F6] py-3">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">Conversation Outcome</span>
            <div class="flex-1 flex items-center gap-2">
              <Flag class="w-3 h-3 text-[#F9DA82]" />
              <span class="text-sm text-[#6B2385] font-medium">{{ interaction.contactStatus }}</span>
            </div>
          </div>

          <!-- Tag -->
          <div class="flex border-b border-[#F3F4F6] py-3">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">Tag</span>
            <span class="flex-1">
              <span class="bg-[#EDE9F5] border border-[#C4B5D4] text-[#4F1964] text-[10px] font-bold px-2 rounded-sm">
                {{ interaction.outcomeType }}
              </span>
            </span>
          </div>

          <!-- Default Reason -->
          <div class="flex border-b border-[#F3F4F6] py-3">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">Default Reason</span>
            <span class="flex-1 text-sm text-[#1A1A2E] font-medium">N/A</span>
          </div>

          <!-- Promised Amount -->
          <div class="flex border-b border-[#F3F4F6] py-3">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">Promised Amount</span>
            <span class="flex-1 text-sm text-[#1A1A2E] font-medium">0.00</span>
          </div>

          <!-- Conversation Date -->
          <div class="flex border-b border-[#F3F4F6] py-3">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">Conversation Date</span>
            <div class="flex-1 flex items-center">
              <span class="text-sm text-[#1A1A2E] font-medium">{{ interaction.date }} {{ interaction.time }}</span>
              <span :class="['ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full', getDateBadgeClass(interaction.timeLabel)]">
                {{ interaction.timeLabel }}
              </span>
            </div>
          </div>

          <!-- Next Interaction -->
          <div class="flex border-b border-[#F3F4F6] py-3">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">Next Interaction</span>
            <div class="flex-1 flex items-center">
              <span class="text-sm text-[#1A1A2E] font-medium">{{ interaction.nextInteractionDate }}</span>
              <span :class="['ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full', getDateBadgeClass(interaction.nextInteractionLabel)]">
                {{ interaction.nextInteractionLabel }}
              </span>
            </div>
          </div>

          <!-- Next Steps -->
          <div class="flex border-b border-[#F3F4F6] py-3">
            <span class="w-48 shrink-0 text-sm text-[#4B4B6B]">Next Steps</span>
            <span class="flex-1 text-sm text-[#1A1A2E] font-medium">-</span>
          </div>

          <!-- Map Section -->
          <div class="mt-4 mb-2">
            <h3 class="text-base font-semibold text-[#1A1A2E]">Interaction Location Map</h3>
          </div>
          <div class="w-full h-40 bg-[#F8F7FA] rounded-lg border border-[#E5E0EA] flex items-center justify-center">
            <MapPin class="w-8 h-8 text-[#9CA3AF]" />
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end px-6 py-4 border-t border-[#E5E0EA]">
          <button
            class="bg-white border border-[#E5E0EA] text-[#4B4B6B] hover:border-[#4F1964] hover:text-[#4F1964] px-6 py-2 rounded-md text-sm"
            @click="emit('close')"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>