<script setup lang="ts">
const props = defineProps<{
  variant?: 'primary' | 'secondary' | 'muted'
}>()

const variants = {
  primary: 'bg-secondary text-secondary-foreground',
  secondary: 'bg-primary text-primary-foreground',
  muted: 'bg-surface-muted text-[#4B4B6B]'
}
</script>

<template>
  <span :class="['inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', variants[props.variant ?? 'secondary']]">
    <slot />
  </span>
</template>
