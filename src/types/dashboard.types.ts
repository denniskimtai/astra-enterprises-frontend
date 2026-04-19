export interface StatCard {
  label: string
  value: string
  bg: string
  textColor: string
  iconColor: string
}

export interface ChartFilter {
  from: string
  to: string
  interval: 'DAILY' | 'WEEKLY' | 'MONTHLY'
}

export interface TimeSeriesDataPoint {
  label: string
  disbursements: number
  collections: number
}
