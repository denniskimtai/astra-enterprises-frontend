import type { Loan } from '@/types/loan.types'

const mockLoans: Loan[] = [
  {
    id: '1',
    customerId: '1',
    amount: 250000,
    interestRate: 4.5,
    term: 30,
    status: 'APPROVED',
    applicationDate: '2024-01-15',
    approvalDate: '2024-01-20',
    disbursementDate: '2024-01-25',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-25T14:30:00Z'
  },
  {
    id: '2',
    customerId: '2',
    amount: 150000,
    interestRate: 3.8,
    term: 20,
    status: 'PENDING',
    applicationDate: '2024-02-01',
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-01T09:15:00Z'
  },
  {
    id: '3',
    customerId: '3',
    amount: 500000,
    interestRate: 4.2,
    term: 25,
    status: 'UNDER_REVIEW',
    applicationDate: '2024-01-28',
    createdAt: '2024-01-28T16:45:00Z',
    updatedAt: '2024-02-05T11:20:00Z'
  },
  {
    id: '4',
    customerId: '4',
    amount: 75000,
    interestRate: 5.0,
    term: 15,
    status: 'REJECTED',
    applicationDate: '2024-01-10',
    createdAt: '2024-01-10T13:30:00Z',
    updatedAt: '2024-01-18T10:00:00Z'
  }
]

export async function getLoans(): Promise<Loan[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockLoans
}

export async function getLoanById(id: string): Promise<Loan | null> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockLoans.find(loan => loan.id === id) || null
}