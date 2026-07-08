export enum CustomerStatus {
  ACTIVE = 'Active',
  LEAD = 'Lead',
  INACTIVE = 'Inactive',
  BLACKLISTED = 'Blacklisted'
}

export enum MaritalStatus {
  SINGLE = 'Single',
  MARRIED = 'Married',
  DIVORCED = 'Divorced',
  WIDOWED = 'Widowed'
}

export enum HomeOwnership {
  OWNED = 'Owned',
  RENTED = 'Rented'
}

export interface Customer {
  id: string
  fullName: string
  nationalId: string
  phone: string
  photoUrl: string
  status: CustomerStatus
  physicalAddress: string
  town: string
  county: string
  currentLimit: number
  branchId: string
  createdAt: string
  updatedAt: string | null
  registrationFeePaid: boolean
}

export interface CustomerBusinessInfo {
  id: string
  businessName: string
  businessType: string
  businessDirection: string
  businessGeoLocation: string
  currentStockValue: number
  weeklyGrossProfit: number
  weeklyNetProfit: number
  weeklyExpenses: number
  yearsInBusiness: number
  offersCredit: boolean
  leadType: string
  proposedLimit: number
  wouldLend: boolean
  createdAt: string
  updatedAt: string | null
}

export interface CustomerSecondaryInfo {
  id: string
  maritalStatus: MaritalStatus
  dependents: number
  estate: string
  houseNumber: string
  ownership: HomeOwnership
  rentAmount: number | null
  homeAssetValue: number
  nearestLandmark: string
  geoLocation: string
  heardVia: string
  createdAt: string
  updatedAt: string | null
}

export interface Guarantor {
  id: string
  name: string
  idNumber: string
  phone: string
  amountGuaranteed: number
  relationship: string
  createdAt: string
  updatedAt: string | null
}

export interface Referee {
  id: string
  name: string
  phone: string
  physicalAddress: string
  relationship: string
  createdAt: string
  updatedAt: string | null
}

export interface CustomerDetails extends Customer {
  homeGeoLocation: string
  postalAddress: string
  currentLoId: string | null
  currentCoId: string | null
  businessInfo: CustomerBusinessInfo | null
  secondaryInfo: CustomerSecondaryInfo | null
  guarantors: Guarantor[]
  referees: Referee[]
}

export interface CreateCustomerPayload {
  fullName: string
  nationalId: string
  phone: string
  photoUrl: string
  physicalAddress: string
  homeGeoLocation: string
  town: string
  county: string
  postalAddress: string
  branchId: string
  businessInfo?: Omit<CustomerBusinessInfo, 'id' | 'createdAt' | 'updatedAt'> | null
  secondaryInfo?: Omit<CustomerSecondaryInfo, 'id' | 'createdAt' | 'updatedAt'> | null
  guarantors?: Omit<Guarantor, 'id' | 'createdAt' | 'updatedAt'>[] | null
  referees?: Omit<Referee, 'id' | 'createdAt' | 'updatedAt'>[] | null
}

export interface PagedResult<T> {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
