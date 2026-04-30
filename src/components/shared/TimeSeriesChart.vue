<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'vue-chartjs'
import type { TimeSeriesDataPoint } from '@/types/dashboard.types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface Props {
  data: TimeSeriesDataPoint[]
  labels: string[]
  yAxisLabel?: string
  responsive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  yAxisLabel: 'Amount',
  responsive: true
})

const chartRef = ref()
const chartData = ref({
  labels: props.labels,
  datasets: [
    {
      label: 'Disbursements',
      data: props.data.map(d => d.disbursements),
      borderColor: '#4F1964',
      backgroundColor: 'rgba(79, 25, 100, 0)',
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: '#4F1964',
      pointBorderColor: '#FFFFFF',
      pointBorderWidth: 2,
      tension: 0.4,
      fill: false
    },
    {
      label: 'Collections',
      data: props.data.map(d => d.collections),
      borderColor: '#F9DA82',
      backgroundColor: 'rgba(249, 218, 130, 0)',
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: '#F0C84A',
      pointBorderColor: '#FFFFFF',
      pointBorderWidth: 2,
      tension: 0.4,
      fill: false
    }
  ]
})

const chartOptions = {
  responsive: props.responsive,
  maintainAspectRatio: true,
  aspectRatio: 2.2,
  plugins: {
    legend: {
      position: 'top' as const,
      align: 'center' as const,
      labels: {
        boxWidth: 12,
        padding: 15,
        usePointStyle: true,
        pointStyle: 'circle',
        font: {
          size: 13,
          weight: 500
        },
        color: '#4B4B6B'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(26, 26, 46, 0.8)',
      padding: 12,
      titleFont: { size: 12 },
      bodyFont: { size: 12 },
      borderColor: ' #E5E0EA',
      borderWidth: 1,
      callbacks: {
        label: function (context: any) {
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(context.parsed.y)
          }
          return label
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: '#F3F4F6',
        drawBorder: false
      },
      ticks: {
        color: '#9CA3AF',
        font: {
          size: 11
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: '#F3F4F6',
        drawBorder: false
      },
      ticks: {
        color: '#9CA3AF',
        font: {
          size: 11
        },
        callback: function (value: any) {
          return new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value)
        }
      }
    }
  }
}
</script>

<template>
  <div class="w-full">
    <Line
      ref="chartRef"
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>
