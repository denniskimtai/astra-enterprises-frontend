import api from '@/services/api'
import {
  CustomerStatus,
  type Customer,
  type CustomerDetails,
  type PagedResult,
  type CreateCustomerPayload,
  type CustomerBusinessInfo,
  type CustomerSecondaryInfo
} from '@/types/customer.types'

export interface GetCustomersParams {
  page?: number
  pageSize?: number
  searchTerm?: string | null
  status?: CustomerStatus | string | null
  branchId?: string | null
}

function mapStatus(status: any): CustomerStatus {
  if (typeof status === 'number') {
    switch (status) {
      case 0:
        return CustomerStatus.ACTIVE
      case 1:
        return CustomerStatus.LEAD
      case 2:
        return CustomerStatus.INACTIVE
      case 3:
        return CustomerStatus.BLACKLISTED
    }
  }
  if (typeof status === 'string') {
    const lower = status.toLowerCase()
    if (lower === 'active') return CustomerStatus.ACTIVE
    if (lower === 'lead') return CustomerStatus.LEAD
    if (lower === 'inactive') return CustomerStatus.INACTIVE
    if (lower === 'blacklisted') return CustomerStatus.BLACKLISTED
  }
  return status as CustomerStatus
}

export async function getCustomers(params?: GetCustomersParams): Promise<PagedResult<Customer>> {
  const response = await api.get<PagedResult<Customer>>('/api/customers', {
    params
  })
  const data = response.data
  if (data && Array.isArray(data.items)) {
    data.items = data.items.map(item => ({
      ...item,
      status: mapStatus(item.status)
    }))
  }
  return data
}

export async function getCustomerById(id: string): Promise<CustomerDetails> {
  const response = await api.get<CustomerDetails>(`/api/customers/${id}`)
  const data = response.data
  if (data) {
    data.status = mapStatus(data.status)
  }
  return data
}

export async function createCustomer(payload: CreateCustomerPayload): Promise<string> {
  const response = await api.post<string>('/api/customers', payload)
  return response.data
}

export async function updateCustomerBasicInfo(
  id: string,
  payload: Omit<CreateCustomerPayload, 'branchId' | 'businessInfo' | 'secondaryInfo' | 'guarantors' | 'referees'>
): Promise<void> {
  await api.put(`/api/customers/${id}`, payload)
}

export async function updateCustomerBusinessInfo(
  id: string,
  payload: Omit<CustomerBusinessInfo, 'id' | 'createdAt' | 'updatedAt'>
): Promise<void> {
  await api.put(`/api/customers/${id}/business-info`, payload)
}

export async function updateCustomerSecondaryInfo(
  id: string,
  payload: Omit<CustomerSecondaryInfo, 'id' | 'createdAt' | 'updatedAt'>
): Promise<void> {
  await api.put(`/api/customers/${id}/secondary-info`, payload)
}

export interface AddGuarantorPayload {
  name: string
  idNumber: string
  phone: string
  amountGuaranteed: number
  relationship: string
}

export async function addGuarantor(id: string, payload: AddGuarantorPayload): Promise<string> {
  const response = await api.post<string>(`/api/customers/${id}/guarantors`, payload)
  return response.data
}

export async function removeGuarantor(id: string, guarantorId: string): Promise<void> {
  await api.delete(`/api/customers/${id}/guarantors/${guarantorId}`)
}

export interface AddRefereePayload {
  name: string
  phone: string
  physicalAddress: string
  relationship: string
}

export async function addReferee(id: string, payload: AddRefereePayload): Promise<string> {
  const response = await api.post<string>(`/api/customers/${id}/referees`, payload)
  return response.data
}

export async function removeReferee(id: string, refereeId: string): Promise<void> {
  await api.delete(`/api/customers/${id}/referees/${refereeId}`)
}

export async function deleteCustomer(id: string): Promise<void> {
  await api.delete(`/api/customers/${id}`)
}