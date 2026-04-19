<script setup lang="ts">
import { ExternalLink } from 'lucide-vue-next'
import type { StatCard } from '@/types/dashboard.types'

const props = defineProps<StatCard>()

// Helper function to darken a hex color by approximately 10%
function darkenHex(hex: string, percent: number = 10): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.max(0, (num >> 16) - amt)
  const G = Math.max(0, (num >> 8) & 0x00ff - amt)
  const B = Math.max(0, (num & 0x0000ff) - amt)
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}

const borderColor = darkenHex(props.bg, 15)
</script>

<template>
  <div
    :style="{
      backgroundColor: props.bg,
      borderBottomColor: borderColor,
      height: '100px'
    }"
    class="flex flex-col justify-between rounded-lg border-b-[3px] p-4"
  >
    <!-- Header: Title + Icon -->
    <div class="flex items-start justify-between">
      <p class="text-sm text-white/80">
        {{ props.label }}
      </p>
      <ExternalLink
        :size="16"
        :style="{ color: props.iconColor }"
        :stroke-width="2"
      />
    </div>

    <!-- Footer: Value -->
    <p
      class="text-lg font-bold"
      :style="{ color: props.textColor }"
    >
      {{ props.value }}
    </p>
  </div>
</template>
