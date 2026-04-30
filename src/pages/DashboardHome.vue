<script setup lang="ts">
import { computed, ref } from 'vue'
import { TrendingUp } from 'lucide-vue-next'
import DashboardStatCard from '@/components/shared/DashboardStatCard.vue'
import TimeSeriesChart from '@/components/shared/TimeSeriesChart.vue'
import type { StatCard, ChartFilter, TimeSeriesDataPoint } from '@/types/dashboard.types'

// ========== STAT CARDS DATA ==========
const statCards: StatCard[] = [
  {
    label: 'Loans Today',
    value: '0.00',
    bg: '#4F1964',
    textColor: 'white',
    iconColor: 'white'
  },
  {
    label: 'Payments Today',
    value: '0.00',
    bg: '#6B2385',
    textColor: 'white',
    iconColor: 'white'
  },
  {
    label: 'Due Today',
    value: '0.00',
    bg: '#7C3A96',
    textColor: 'white',
    iconColor: 'white'
  },
  {
    label: 'B2C Balance',
    value: '0.00',
    bg: '#F9DA82',
    textColor: '#1A1A2E',
    iconColor: '#4F1964'
  },
  {
    label: 'C2B Balance',
    value: '0.00',
    bg: '#F0C84A',
    textColor: '#1A1A2E',
    iconColor: '#4F1964'
  },
  {
    label: 'SMS Balance',
    value: '5,819.67',
    bg: '#380F47',
    textColor: 'white',
    iconColor: 'white'
  }
]

// ========== FILTER STATE ==========
const filter = ref<ChartFilter>({
  from: '',
  to: '',
  interval: 'DAILY'
})

// ========== CHART MOCK DATA ==========
const generateMockChartData = (): TimeSeriesDataPoint[] => {
  const data: TimeSeriesDataPoint[] = []
  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() - 30)

  for (let i = 0; i < 30; i++) {
    const currentDate = new Date(baseDate)
    currentDate.setDate(currentDate.getDate() + i)

    // Generate realistic mock data: disbursements significantly higher than collections
    const disbursement = Math.floor(Math.random() * 50000) + 30000
    const collection = Math.floor(Math.random() * 15000) + 5000

    data.push({
      label: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      disbursements: disbursement,
      collections: collection
    })
  }

  return data
}

const chartData = ref<TimeSeriesDataPoint[]>(generateMockChartData())

const chartLabels = computed(() => chartData.value.map(d => d.label))

// ========== TOTALS COMPUTED ==========
const totals = computed(() => {
  const totalDisbursement = chartData.value.reduce((sum, d) => sum + d.disbursements, 0)
  const totalCollection = chartData.value.reduce((sum, d) => sum + d.collections, 0)

  return {
    disbursement: totalDisbursement.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }),
    collection: totalCollection.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }
})

// ========== HANDLERS ==========
const handleGenerate = () => {
  // Placeholder for future API integration
  // e.g., fetch data based on filter.value.from, filter.value.to, filter.value.interval
  console.log('Generate clicked with filters:', filter.value)
}
</script>

<template>
  <div class="space-y-6">
    <!-- ========== STAT CARDS ROW ========== -->
    <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      <div
        v-for="(card, index) in statCards"
        :key="index"
        :class="{ 'lg:border-r lg:border-surface-border': index === 2 }"
      >
        <DashboardStatCard
          :label="card.label"
          :value="card.value"
          :bg="card.bg"
          :text-color="card.textColor"
          :icon-color="card.iconColor"
        />
      </div>
    </div>

    <!-- ========== TIME PERFORMANCE SECTION ========== -->
    <div class="rounded-lg border border-surface-border bg-white p-6">
      <!-- Section Header -->
      <div class="mb-4 flex items-center gap-3">
        <div class="flex items-center gap-2">
          <TrendingUp :size="18" class="text-primary" />
          <h2 class="text-lg font-semibold text-[#1A1A2E]">Time Performance</h2>
        </div>
        <p class="ml-3 italic text-sm text-primary">Default shows MTD (Month-To-Date)</p>
      </div>

      <!-- Filter Row -->
      <div class="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <input
          v-model="filter.from"
          type="date"
          placeholder="From Date"
          class="h-10 rounded-md border border-surface-border px-3 focus:outline-none focus:ring-2"
          :style="{ '--tw-ring-color': '#4F1964' }"
        />
        <input
          v-model="filter.to"
          type="date"
          placeholder="To Date"
          class="h-10 rounded-md border border-surface-border px-3 focus:outline-none focus:ring-2"
          :style="{ '--tw-ring-color': '#4F1964' }"
        />
        <select
          v-model="filter.interval"
          class="h-10 rounded-md border border-surface-border px-3 focus:outline-none focus:ring-2"
          :style="{ '--tw-ring-color': '#4F1964' }"
        >
          <option value="DAILY">Daily</option>
          <option value="WEEKLY">Weekly</option>
          <option value="MONTHLY">Monthly</option>
        </select>
        <button
          @click="handleGenerate"
          class="h-10 rounded-md border-b-2 px-6 font-semibold text-white transition hover:brightness-110"
          :style="{
            backgroundColor: '#4F1964',
            borderBottomColor: '#F9DA82'
          }"
        >
          GENERATE
        </button>
      </div>

      <!-- Chart and Totals -->
      <div class="flex flex-col gap-6 lg:flex-row">
        <!-- Chart (73% width on desktop) -->
        <div class="flex-1 lg:w-[73%]">
          <TimeSeriesChart
            :data="chartData"
            :labels="chartLabels"
          />
        </div>

        <!-- Totals Panel (27% width on desktop) -->
        <div class="flex flex-col justify-center border-l border-surface-border pl-6 lg:w-[27%]">
          <h3 class="mb-6 text-xl font-bold text-[#1A1A2E]">Totals</h3>

          <!-- Total Disbursement -->
          <div class="flex items-center justify-between border-b border-surface-border py-3">
            <span class="text-sm text-[#4B4B6B]">Total Disbursement</span>
            <span class="text-lg font-bold text-primary">{{ totals.disbursement }}</span>
          </div>

          <!-- Total Collection -->
          <div class="flex items-center justify-between border-b border-surface-border py-3">
            <span class="text-sm text-[#4B4B6B]">Total Collection</span>
            <span class="text-lg font-bold text-primary">{{ totals.collection }}</span>
          </div>

          <!-- Legend -->
          <div class="mt-4 space-y-2">
            <div class="flex items-center gap-2">
              <div class="h-2 w-2 rounded-full" style="background-color: #4F1964"></div>
              <span class="text-xs text-[#4B4B6B]">Disbursements</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="h-2 w-2 rounded-full" style="background-color: #F9DA82"></div>
              <span class="text-xs text-[#4B4B6B]">Collections</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
