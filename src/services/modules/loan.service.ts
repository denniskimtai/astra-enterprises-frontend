import api from '@/services/api'
import type { 
  Loan, 
  CreateLoanPayload, 
  UpdateLoanPayload, 
  DisburseLoanPayload 
} from '@/types/loan.types'
import type { PagedResult } from '@/types/customer.types'
import type { LoanStage, LoanStatus } from '@/types/loan.types'

export interface GetLoansParams {
  page?: number
  pageSize?: number
  searchTerm?: string | null
  status?: string | null
  stage?: string | null
  customerId?: string | null
  branchId?: string | null
}

function mapStage(stage: any): LoanStage {
  if (typeof stage === 'number') {
    switch (stage) {
      case 0: return 'Initiation'
      case 1: return 'BranchApproval'
      case 2: return 'FinalApproval'
    }
  }
  if (typeof stage === 'string') {
    const s = stage.trim()
    if (s === '0' || s.toLowerCase() === 'initiation') return 'Initiation'
    if (s === '1' || s.toLowerCase() === 'branchapproval' || s.toLowerCase() === 'branch_approval') return 'BranchApproval'
    if (s === '2' || s.toLowerCase() === 'finalapproval' || s.toLowerCase() === 'final_approval') return 'FinalApproval'
  }
  return stage as LoanStage
}

function mapStatus(status: any): LoanStatus {
  if (typeof status === 'number') {
    switch (status) {
      case 0: return 'Created'
      case 1: return 'Approved'
      case 2: return 'Disbursed'
      case 3: return 'Defaulted'
      case 4: return 'Cleared'
      case 5: return 'Rejected'
    }
  }
  if (typeof status === 'string') {
    const s = status.trim()
    if (s === '0' || s.toLowerCase() === 'created') return 'Created'
    if (s === '1' || s.toLowerCase() === 'approved') return 'Approved'
    if (s === '2' || s.toLowerCase() === 'disbursed') return 'Disbursed'
    if (s === '3' || s.toLowerCase() === 'defaulted') return 'Defaulted'
    if (s === '4' || s.toLowerCase() === 'cleared') return 'Cleared'
    if (s === '5' || s.toLowerCase() === 'rejected') return 'Rejected'
  }
  return status as LoanStatus
}

function mapType(type: any): LoanType {
  if (type === 0 || type === '0' || String(type).toLowerCase() === 'manual') return 'Manual'
  if (type === 1 || type === '1' || String(type).toLowerCase() === 'automatic') return 'Automatic'
  return type as LoanType
}

function mapLoan(loan: any): Loan {
  if (!loan) return loan
  return {
    ...loan,
    stage: mapStage(loan.stage),
    status: mapStatus(loan.status),
    type: mapType(loan.type)
  }
}

export async function getLoans(params?: GetLoansParams): Promise<PagedResult<Loan>> {
  const response = await api.get<PagedResult<Loan>>('/api/loans', {
    params
  })
  const data = response.data
  if (data && Array.isArray(data.items)) {
    data.items = data.items.map(mapLoan)
  }
  return data
}

export async function getLoanById(id: string): Promise<Loan> {
  const response = await api.get<Loan>(`/api/loans/${id}`)
  return mapLoan(response.data)
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