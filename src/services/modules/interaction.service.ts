import api from '@/services/api'
import type { PagedResult } from '@/types/customer.types'

export interface Interaction {
  id: string
  customerId: string
  loanId: string | null
  agentId: string
  mode: string // 'Call' | 'Visit' | 'Message' | 'FaceToFace'
  purpose: string
  outcomeDetails: string
  outcomeStatus: string // 'Contactable' | 'PromisedToPay' | 'NotReachable'
  tag: string // 'Lead' | 'Active' | 'CreatedLoan'
  promisedAmount: number | null
  defaultReason: string | null
  nextSteps: string | null
  locationGeo: string | null
  nextInteractionDate: string | null
  interactionAt: string
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

export async function getInteractionById(id: string): Promise<Interaction> {
  const response = await api.get<Interaction>(`/api/interactions/${id}`)
  return response.data
}

export async function createInteraction(payload: Omit<Interaction, 'id' | 'agentId' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const response = await api.post<string>('/api/interactions', payload)
  return response.data
}

export async function updateInteraction(id: string, payload: Omit<Interaction, 'id' | 'customerId' | 'agentId' | 'createdAt' | 'updatedAt'>): Promise<void> {
  await api.put(`/api/interactions/${id}`, payload)
}

export async function deleteInteraction(id: string): Promise<void> {
  await api.delete(`/api/interactions/${id}`)
}
