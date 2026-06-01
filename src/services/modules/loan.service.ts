import api from '@/services/api'
import type { Loan } from '@/types/loan.types'
import type { PagedResult } from '@/types/customer.types'

export interface GetLoansParams {
  page?: number
  pageSize?: number
  searchTerm?: string | null
  status?: string | null
  stage?: string | null
  customerId?: string | null
  branchId?: string | null
}

export async function getLoans(params?: GetLoansParams): Promise<PagedResult<Loan>> {
  const response = await api.get<PagedResult<Loan>>('/api/loans', {
    params
  })
  return response.data
}

export async function getLoanById(id: string): Promise<Loan> {
  const response = await api.get<Loan>(`/api/loans/${id}`)
  return response.data
}