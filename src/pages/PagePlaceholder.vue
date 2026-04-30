<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = computed(() => route.meta.title as string || 'Page')
</script>

<template>
  <div class="grid min-h-[calc(100vh-96px)] place-items-center px-4 py-8">
    <div class="rounded-[28px] bg-white p-10 text-center shadow-soft">
      <h1 class="text-3xl font-semibold text-[#1A1A2E]">{{ title }}</h1>
    </div>
  </div>
</template>
