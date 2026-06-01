export type LoanType = 'Manual' | 'Automatic'
export type LoanStage = 'Initiation' | 'BranchApproval' | 'FinalApproval'
export type LoanStatus = 'Created' | 'Approved' | 'Disbursed' | 'Defaulted' | 'Cleared' | 'Rejected'

export interface LoanProduct {
  id: string
  name: string
  minAmount: number
  maxAmount: number
  interestRate: number
  repaymentDays: number
}

export interface CreateLoanProductPayload {
  name: string
  minAmount: number
  maxAmount: number
  interestRate: number
  repaymentDays: number
}

export interface UpdateLoanProductPayload {
  name: string
  minAmount: number
  maxAmount: number
  interestRate: number
  repaymentDays: number
}

export interface LoanAddon {
  id: string
  name: string
  amount: number
  isApplied: boolean
  appliedAt: string | null
  appliedById: string | null
}

export interface LoanDeduction {
  id: string
  name: string
  amount: number
  isApplied: boolean
  appliedAt: string | null
  appliedById: string | null
}

export interface LoanSchedule {
  id: string
  loanId: string
  dueDate: string
  amountDue: number
  amountPaid: number
  balance: number
  status: string
}

export interface Loan {
  id: string
  code?: string
  customerId: string
  customerName: string
  productId?: string
  product: LoanProduct
  branchId: string
  loId: string
  coId: string
  createdById: string
  principal: number
  addOnsTotal: number
  deductionsTotal: number
  repayableTotal: number
  repaidTotal: number
  balance: number
  interestAmount: number
  penaltyAmount: number
  type: LoanType
  stage: LoanStage
  status: LoanStatus
  mpesaCode: string | null
  disbursedAt: string | null
  dueDate: string | null
  lastRepayDate: string | null
  clearedDate: string | null
  createdAt: string
  updatedAt: string | null
  addons: LoanAddon[]
  deductions: LoanDeduction[]
  paySchedules: LoanSchedule[]
}

export interface CreateLoanPayload {
  customerId: string
  productId: string
  loId: string
  coId: string
  principal: number
  interestAmount: number
  type: LoanType
  addons?: { name: string; amount: number }[]
  deductions?: { name: string; amount: number }[]
}

export interface UpdateLoanPayload {
  principal: number
  interestAmount: number
  productId: string
  loId: string
  coId: string
  type: LoanType
}

export interface DisburseLoanPayload {
  mpesaCode: string
  disbursedAt: string
}
