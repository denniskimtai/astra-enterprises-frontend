import api from '@/services/api'
import type { LoanProduct, CreateLoanProductPayload, UpdateLoanProductPayload } from '@/types/loan.types'
import type { PagedResult } from '@/types/customer.types'

export interface GetLoanProductsParams {
  page?: number
  pageSize?: number
  searchTerm?: string | null
}

export async function getLoanProducts(params?: GetLoanProductsParams): Promise<PagedResult<LoanProduct>> {
  const response = await api.get<PagedResult<LoanProduct>>('/api/loan-products', { params })
  return response.data
}

export async function getLoanProductById(id: string): Promise<LoanProduct> {
  const response = await api.get<LoanProduct>(`/api/loan-products/${id}`)
  return response.data
}

export async function createLoanProduct(payload: CreateLoanProductPayload): Promise<string> {
  const response = await api.post<string>('/api/loan-products', payload)
  return response.data
}

export async function updateLoanProduct(id: string, payload: UpdateLoanProductPayload): Promise<void> {
  await api.put(`/api/loan-products/${id}`, payload)
}

export async function deleteLoanProduct(id: string): Promise<void> {
  await api.delete(`/api/loan-products/${id}`)
}
