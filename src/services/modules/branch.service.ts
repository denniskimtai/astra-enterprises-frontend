import api from '@/services/api'
import type { BranchResponse, CreateBranchPayload, UpdateBranchPayload } from '@/types/branch.types'
import type { PagedResult } from '@/types/customer.types'

export interface GetBranchesParams {
  page?: number
  pageSize?: number
}

export async function getBranches(params?: GetBranchesParams): Promise<PagedResult<BranchResponse>> {
  const response = await api.get<PagedResult<BranchResponse>>('/api/branches', { params })
  return response.data
}

export async function getBranchById(id: string): Promise<BranchResponse> {
  const response = await api.get<BranchResponse>(`/api/branches/${id}`)
  return response.data
}

export async function createBranch(payload: CreateBranchPayload): Promise<string> {
  const response = await api.post<string>('/api/branches', payload)
  return response.data
}

export async function updateBranch(id: string, payload: UpdateBranchPayload): Promise<void> {
  await api.put(`/api/branches/${id}`, payload)
}

export async function deleteBranch(id: string): Promise<void> {
  await api.delete(`/api/branches/${id}`)
}
