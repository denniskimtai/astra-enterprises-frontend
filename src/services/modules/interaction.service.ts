import api from '@/services/api'
import type { PagedResult } from '@/types/customer.types'

export interface Interaction {
  id: string
  customerId: string
  agentId: string
  agentName: string
  mode: 'Call' | 'Visit' | 'Message' | string
  purpose: string
  outcomeDetails: string
  outcomeStatus: 'Contactable' | 'Promised to Pay' | 'Not Reachable' | string
  tag: string
  defaultReason: string | null
  nextSteps: string | null
  locationGeo: string | null
  interactionAt: string
  loanId: string | null
  promisedAmount: number | null
  nextInteractionDate: string | null
  createdAt: string
  updatedAt: string | null
}

export interface GetInteractionsParams {
  page?: number
  pageSize?: number
  customerId?: string | null
  agentId?: string | null
  tag?: string | null
  outcomeStatus?: string | null
}

export async function getInteractions(params?: GetInteractionsParams): Promise<PagedResult<Interaction>> {
  const response = await api.get<PagedResult<Interaction>>('/api/interactions', {
    params
  })
  return response.data
}

export async function createInteraction(payload: Omit<Interaction, 'id' | 'agentName' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const response = await api.post<string>('/api/interactions', payload)
  return response.data
}
