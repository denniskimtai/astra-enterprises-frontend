export interface ReportData {
  totalLoans: number
  totalLoanAmount: number
  approvedLoans: number
  pendingLoans: number
  rejectedLoans: number
  averageLoanAmount: number
  monthlyApplications: { month: string; count: number }[]
  loanStatusDistribution: { status: string; count: number }[]
}

const mockReportData: ReportData = {
  totalLoans: 4,
  totalLoanAmount: 975000,
  approvedLoans: 1,
  pendingLoans: 1,
  rejectedLoans: 1,
  averageLoanAmount: 243750,
  monthlyApplications: [
    { month: 'Jan 2024', count: 3 },
    { month: 'Feb 2024', count: 1 }
  ],
  loanStatusDistribution: [
    { status: 'Approved', count: 1 },
    { status: 'Pending', count: 1 },
    { status: 'Under Review', count: 1 },
    { status: 'Rejected', count: 1 }
  ]
}

export async function getDashboardStats(): Promise<ReportData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400))
  return mockReportData
}