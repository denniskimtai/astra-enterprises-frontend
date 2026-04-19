<script setup lang="ts">
const props = defineProps<{
  title: string
  description?: string
}>
</script>

<template>
  <div class="space-y-2">
    <h1 class="text-2xl font-semibold text-[#1A1A2E]">{{ props.title }}</h1>
    <p v-if="props.description" class="text-sm text-[#4B4B6B]">{{ props.description }}</p>
  </div>
</template>
