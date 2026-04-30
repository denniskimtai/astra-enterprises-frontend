<script setup lang="ts">
const props = defineProps<{
  label: string
  value: string | number
  variant?: 'primary' | 'secondary'
}>
</script>

<template>
  <div class="rounded-[24px] bg-white p-5 shadow-soft">
    <p class="text-sm font-medium text-[#4B4B6B]">{{ props.label }}</p>
    <p class="mt-3 text-3xl font-semibold text-[#1A1A2E]">{{ props.value }}</p>
  </div>
</template>
