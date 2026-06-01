import api from '@/services/api'
import type { 
  Loan, 
  CreateLoanPayload, 
  UpdateLoanPayload, 
  DisburseLoanPayload 
} from '@/types/loan.types'
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

export async function createLoan(payload: CreateLoanPayload): Promise<string> {
  const response = await api.post<string>('/api/loans', payload)
  return response.data
}

export async function updateLoan(id: string, payload: UpdateLoanPayload): Promise<void> {
  await api.put(`/api/loans/${id}`, payload)
}

export async function deleteLoan(id: string): Promise<void> {
  await api.delete(`/api/loans/${id}`)
}

export async function approveLoan(id: string): Promise<void> {
  await api.post(`/api/loans/${id}/approve`)
}

export async function disburseLoan(id: string, payload: DisburseLoanPayload): Promise<void> {
  await api.post(`/api/loans/${id}/disburse`, payload)
}

export async function rejectLoan(id: string): Promise<void> {
  await api.post(`/api/loans/${id}/reject`)
}