import api from '@/services/api'
import type { PagedResult } from '@/types/customer.types'

export interface Branch {
  id: string
  name: string
  location: string
  createdAt: string
  updatedAt: string | null
}

export async function getBranches(page = 1, pageSize = 100): Promise<PagedResult<Branch>> {
  const response = await api.get<PagedResult<Branch>>('/api/branches', {
    params: { page, pageSize }
  })
  return response.data
}
