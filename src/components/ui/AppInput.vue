<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
  type?: string
  placeholder?: string
  id?: string
}>

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const classes = computed(
  () =>
    'w-full rounded-3xl border border-surface-border bg-surface-muted px-4 py-3 text-sm text-[#1A1A2E] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10'
)
</script>

<template>
  <input
    :id="props.id"
    :type="props.type ?? 'text'"
    :placeholder="props.placeholder"
    :value="props.modelValue"
    :class="classes"
    @input="(event) => emit('update:modelValue', event.target.value)"
  />
</template>
