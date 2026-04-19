export enum LoanStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Loan {
  id: string
  customerId: string
  amount: number
  status: LoanStatus
  createdAt: string
  dueDate: string
}

export interface LoanFilter {
  status?: LoanStatus
  officerId?: string
}
