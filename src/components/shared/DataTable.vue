<script setup lang="ts">
const props = defineProps<{
  columns: Array<{ key: string; label: string }>
  rows: Array<Record<string, string | number>>
}>
</script>

<template>
  <div class="overflow-hidden rounded-[24px] border border-surface-border bg-white shadow-soft">
    <table class="min-w-full divide-y divide-surface-border text-left text-sm">
      <thead class="bg-surface-muted">
        <tr>
          <th v-for="column in props.columns" :key="column.key" class="px-4 py-3 font-semibold text-[#4B4B6B]">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-surface-border">
        <tr v-for="(row, index) in props.rows" :key="index" class="hover:bg-surface-muted">
          <td v-for="column in props.columns" :key="column.key" class="px-4 py-3 text-[#1A1A2E]">
            {{ row[column.key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
