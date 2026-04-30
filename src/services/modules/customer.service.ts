import type { Customer } from '@/types/customer.types'

const mockCustomers: Customer[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1-555-0123',
    dateOfBirth: '1985-03-15',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    },
    creditScore: 750,
    employmentStatus: 'EMPLOYED',
    annualIncome: 85000,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@email.com',
    phone: '+1-555-0456',
    dateOfBirth: '1990-07-22',
    address: {
      street: '456 Oak Ave',
      city: 'Somewhere',
      state: 'NY',
      zipCode: '67890',
      country: 'USA'
    },
    creditScore: 680,
    employmentStatus: 'SELF_EMPLOYED',
    annualIncome: 95000,
    createdAt: '2024-02-01T14:20:00Z',
    updatedAt: '2024-02-01T14:20:00Z'
  },
  {
    id: '3',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@email.com',
    phone: '+1-555-0789',
    dateOfBirth: '1978-11-08',
    address: {
      street: '789 Pine Rd',
      city: 'Elsewhere',
      state: 'TX',
      zipCode: '54321',
      country: 'USA'
    },
    creditScore: 720,
    employmentStatus: 'EMPLOYED',
    annualIncome: 120000,
    createdAt: '2024-01-28T11:45:00Z',
    updatedAt: '2024-02-05T09:10:00Z'
  },
  {
    id: '4',
    firstName: 'Alice',
    lastName: 'Williams',
    email: 'alice.williams@email.com',
    phone: '+1-555-0321',
    dateOfBirth: '1982-05-30',
    address: {
      street: '321 Elm St',
      city: 'Nowhere',
      state: 'FL',
      zipCode: '09876',
      country: 'USA'
    },
    creditScore: 650,
    employmentStatus: 'UNEMPLOYED',
    annualIncome: 0,
    createdAt: '2024-01-10T15:30:00Z',
    updatedAt: '2024-01-18T13:45:00Z'
  }
]

export async function getCustomers(): Promise<Customer[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockCustomers
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockCustomers.find(customer => customer.id === id) || null
}