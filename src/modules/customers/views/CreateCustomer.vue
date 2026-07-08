<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getBranches } from '@/services/modules/branch.service'
import type { BranchResponse } from '@/types/branch.types'
import { createCustomer } from '@/services/modules/customer.service'
import { MaritalStatus, HomeOwnership, type CreateCustomerPayload } from '@/types/customer.types'
import { Info, User, Building, Home, Users, Check, AlertCircle } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

// Form tabs
const tabs = [
  { id: 'primary', label: 'Primary Info', icon: User },
  { id: 'business', label: 'Business Info', icon: Building },
  { id: 'secondary', label: 'Secondary Info', icon: Home },
  { id: 'guarantors_referees', label: 'Guarantors & Referees', icon: Users }
]
const activeTab = ref('primary')

// Load branches
const branches = ref<BranchResponse[]>([])
const loadingBranches = ref(false)

onMounted(async () => {
  loadingBranches.value = true
  try {
    const res = await getBranches({ page: 1, pageSize: 100 })
    branches.value = res.items
  } catch (err) {
    console.error('Failed to load branches:', err)
  } finally {
    loadingBranches.value = false
  }
})

// Form state
const primaryForm = reactive({
  fullName: '',
  nationalId: '',
  phone: '',
  photoUrl: 'https://i.pravatar.cc/160', // Default placeholder
  physicalAddress: '',
  homeGeoLocation: '',
  town: '',
  county: '',
  postalAddress: '',
  branchId: ''
})

const businessForm = reactive({
  hasInfo: false,
  businessName: '',
  businessType: '',
  businessDirection: '',
  businessGeoLocation: '',
  currentStockValue: 0,
  weeklyGrossProfit: 0,
  weeklyNetProfit: 0,
  weeklyExpenses: 0,
  yearsInBusiness: 0,
  offersCredit: false,
  leadType: 'Walk-In',
  proposedLimit: 0,
  wouldLend: true
})

const secondaryForm = reactive({
  hasInfo: false,
  maritalStatus: MaritalStatus.SINGLE,
  dependents: 0,
  estate: '',
  houseNumber: '',
  ownership: HomeOwnership.RENTED,
  rentAmount: null as number | null,
  homeAssetValue: 0,
  nearestLandmark: '',
  geoLocation: '',
  heardVia: ''
})

interface GuarantorInput {
  name: string
  idNumber: string
  phone: string
  amountGuaranteed: number
  relationship: string
}

interface RefereeInput {
  name: string
  phone: string
  physicalAddress: string
  relationship: string
}

const guarantors = ref<GuarantorInput[]>([])
const referees = ref<RefereeInput[]>([])

const addGuarantor = () => {
  guarantors.value.push({
    name: '',
    idNumber: '',
    phone: '',
    amountGuaranteed: 0,
    relationship: ''
  })
}

const removeGuarantor = (index: number) => {
  guarantors.value.splice(index, 1)
}

const addReferee = () => {
  referees.value.push({
    name: '',
    phone: '',
    physicalAddress: '',
    relationship: ''
  })
}

const removeReferee = (index: number) => {
  referees.value.splice(index, 1)
}

// Errors and saving
const errors = ref<string[]>([])
const saving = ref(false)
const valErrors = reactive<Record<string, string>>({})

const validateTab = (tabId: string): boolean => {
  if (tabId === 'primary') {
    delete valErrors.fullName
    delete valErrors.nationalId
    delete valErrors.phone
    delete valErrors.branchId
    delete valErrors.town
    delete valErrors.county
    delete valErrors.postalAddress
    delete valErrors.physicalAddress

    if (!primaryForm.fullName.trim()) valErrors.fullName = 'Full name is required.'
    if (!primaryForm.nationalId.trim()) valErrors.nationalId = 'National ID is required.'
    if (!primaryForm.phone.trim()) valErrors.phone = 'Phone number is required.'
    if (!primaryForm.branchId) valErrors.branchId = 'Please select a branch.'
    if (!primaryForm.town.trim()) valErrors.town = 'Town is required.'
    if (!primaryForm.county.trim()) valErrors.county = 'County is required.'
    if (!primaryForm.postalAddress.trim()) valErrors.postalAddress = 'Postal address is required.'
    if (!primaryForm.physicalAddress.trim()) valErrors.physicalAddress = 'Physical address description is required.'
  } else if (tabId === 'business') {
    delete valErrors.businessName
    delete valErrors.businessType
    if (businessForm.hasInfo) {
      if (!businessForm.businessName.trim()) valErrors.businessName = 'Business name is required.'
      if (!businessForm.businessType.trim()) valErrors.businessType = 'Business type is required.'
    }
  } else if (tabId === 'secondary') {
    delete valErrors.rentAmount
    if (secondaryForm.hasInfo && secondaryForm.ownership === HomeOwnership.RENTED) {
      if (secondaryForm.rentAmount === null || secondaryForm.rentAmount <= 0) {
        valErrors.rentAmount = 'Monthly rent amount must be a positive number.'
      }
    }
  } else if (tabId === 'guarantors_referees') {
    delete valErrors.guarantors
    delete valErrors.referees

    let guarantorErr = false
    guarantors.value.forEach(g => {
      if (!g.name.trim() || !g.idNumber.trim() || !g.phone.trim() || g.amountGuaranteed <= 0 || !g.relationship.trim()) {
        guarantorErr = true
      }
    })
    if (guarantorErr) {
      valErrors.guarantors = 'Please fill all fields for the added guarantors with valid information.'
    }

    let refereeErr = false
    referees.value.forEach(r => {
      if (!r.name.trim() || !r.phone.trim() || !r.physicalAddress.trim() || !r.relationship.trim()) {
        refereeErr = true
      }
    })
    if (refereeErr) {
      valErrors.referees = 'Please fill all fields for the added referees with valid information.'
    }
  }

  const tabFields = {
    primary: ['fullName', 'nationalId', 'phone', 'branchId', 'town', 'county', 'postalAddress', 'physicalAddress'],
    business: ['businessName', 'businessType'],
    secondary: ['rentAmount'],
    guarantors_referees: ['guarantors', 'referees']
  }[tabId] || []

  return !tabFields.some(field => !!valErrors[field])
}

const handleTabClick = (tabId: string) => {
  const currentIndex = tabs.findIndex(t => t.id === activeTab.value)
  const targetIndex = tabs.findIndex(t => t.id === tabId)
  
  if (targetIndex > currentIndex) {
    for (let i = currentIndex; i < targetIndex; i++) {
      const stepTabId = tabs[i].id
      if (!validateTab(stepTabId)) {
        activeTab.value = stepTabId
        errors.value = Object.values(valErrors)
        return
      }
    }
  }
  
  errors.value = []
  activeTab.value = tabId
}

const handleNextStep = () => {
  const currentIndex = tabs.findIndex(t => t.id === activeTab.value)
  if (currentIndex === -1 || currentIndex === tabs.length - 1) return
  
  if (validateTab(activeTab.value)) {
    activeTab.value = tabs[currentIndex + 1].id
    errors.value = []
  } else {
    errors.value = Object.values(valErrors)
  }
}

watch(() => primaryForm.fullName, (val) => { if (val.trim()) delete valErrors.fullName })
watch(() => primaryForm.nationalId, (val) => { if (val.trim()) delete valErrors.nationalId })
watch(() => primaryForm.phone, (val) => { if (val.trim()) delete valErrors.phone })
watch(() => primaryForm.branchId, (val) => { if (val) delete valErrors.branchId })
watch(() => primaryForm.town, (val) => { if (val.trim()) delete valErrors.town })
watch(() => primaryForm.county, (val) => { if (val.trim()) delete valErrors.county })
watch(() => primaryForm.postalAddress, (val) => { if (val.trim()) delete valErrors.postalAddress })
watch(() => primaryForm.physicalAddress, (val) => { if (val.trim()) delete valErrors.physicalAddress })
watch(() => businessForm.businessName, (val) => { if (val.trim()) delete valErrors.businessName })
watch(() => businessForm.businessType, (val) => { if (val.trim()) delete valErrors.businessType })
watch(() => secondaryForm.rentAmount, (val) => { if (val !== null && val > 0) delete valErrors.rentAmount })

const validateForm = (): boolean => {
  errors.value = []
  
  const isPrimaryValid = validateTab('primary')
  const isBusinessValid = validateTab('business')
  const isSecondaryValid = validateTab('secondary')
  const isGuarantorsRefereesValid = validateTab('guarantors_referees')
  
  if (!isPrimaryValid || !isBusinessValid || !isSecondaryValid || !isGuarantorsRefereesValid) {
    errors.value = Object.values(valErrors)
    
    // Switch to the first tab that has an error
    if (!isPrimaryValid) activeTab.value = 'primary'
    else if (!isBusinessValid) activeTab.value = 'business'
    else if (!isSecondaryValid) activeTab.value = 'secondary'
    else if (!isGuarantorsRefereesValid) activeTab.value = 'guarantors_referees'
    
    return false
  }
  
  return true
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  saving.value = true
  try {
    const payload: CreateCustomerPayload = {
      ...primaryForm
    }

    if (businessForm.hasInfo) {
      const bInfo = { ...businessForm }
      delete (bInfo as any).hasInfo
      payload.businessInfo = bInfo
    }

    if (secondaryForm.hasInfo) {
      const sInfo = { ...secondaryForm }
      delete (sInfo as any).hasInfo
      payload.secondaryInfo = sInfo
    }

    if (guarantors.value.length > 0) {
      payload.guarantors = guarantors.value
    }

    if (referees.value.length > 0) {
      payload.referees = referees.value
    }

    await createCustomer(payload)
    
    // Redirect back to referring page or default to active
    if (route.path.includes('/customers/leads')) {
      router.push('/customers/leads')
    } else {
      router.push('/customers/active')
    }
  } catch (err: any) {
    console.error('Create customer failed:', err)
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
    } else if (err.response?.data?.error?.message) {
      errors.value = [err.response.data.error.message]
    } else {
      errors.value = ['Something went wrong. Please try again.']
    }
    activeTab.value = 'primary'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-6 pb-12">
    <!-- Page Header -->
    <div class="rounded-[28px] bg-white p-8 shadow-soft flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-[#1A1A2E]">
          {{ route.path.includes('/customers/leads') ? 'Add New Lead' : 'Add New Active Customer' }}
        </h1>
        <p class="mt-2 text-sm text-[#4B4B6B]">Fill in the customer information tabs below to register a new profile.</p>
      </div>
      <button
        type="button"
        class="border border-[#E5E0EA] hover:bg-[#F8F7FA] text-[#1A1A2E] px-5 py-2 rounded-md text-sm font-medium transition-colors"
        @click="router.back()"
      >
        Cancel
      </button>
    </div>

    <!-- Error Alert Banner -->
    <div v-if="errors.length > 0" class="mx-auto max-w-4xl bg-red-50 border-l-4 border-red-500 rounded-md p-4 flex gap-3">
      <AlertCircle class="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
      <div class="flex-1 text-sm text-red-700">
        <h3 class="font-bold mb-1">Please correct the following errors:</h3>
        <ul class="list-disc pl-5 space-y-1">
          <li v-for="err in errors" :key="err">{{ err }}</li>
        </ul>
      </div>
    </div>

    <!-- Main Container -->
    <div class="mx-auto max-w-4xl bg-white border border-[#E5E0EA] rounded-[28px] overflow-hidden shadow-soft">
      <!-- Tabs -->
      <div class="border-b border-[#E5E0EA] bg-[#F8F7FA] flex">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          :class="[
            'flex-1 flex items-center justify-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors',
            activeTab === tab.id
              ? 'text-[#4F1964] border-[#4F1964] bg-white font-semibold'
              : 'text-[#4B4B6B] border-transparent hover:bg-white/50 hover:text-[#4F1964]'
          ]"
          @click="handleTabClick(tab.id)"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
        </button>
      </div>

      <!-- Form Content -->
      <form @submit.prevent="submitForm" class="p-8 space-y-6">
        <!-- 1. PRIMARY INFO -->
        <div v-show="activeTab === 'primary'" class="space-y-5">
          <h3 class="text-base font-semibold text-[#1A1A2E] border-b pb-2">Primary Profile Info</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">Full Name *</label>
              <input 
                v-model="primaryForm.fullName" 
                type="text" 
                required 
                :class="[
                  'w-full px-4 py-2 border rounded-md outline-none focus:border-[#4F1964]',
                  valErrors.fullName ? 'border-red-500 focus:border-red-500' : 'border-[#E5E0EA]'
                ]" 
              />
              <p v-if="valErrors.fullName" class="text-xs text-red-500 mt-1">{{ valErrors.fullName }}</p>
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">National ID / Passport Number *</label>
              <input 
                v-model="primaryForm.nationalId" 
                type="text" 
                required 
                :class="[
                  'w-full px-4 py-2 border rounded-md outline-none focus:border-[#4F1964]',
                  valErrors.nationalId ? 'border-red-500 focus:border-red-500' : 'border-[#E5E0EA]'
                ]" 
              />
              <p v-if="valErrors.nationalId" class="text-xs text-red-500 mt-1">{{ valErrors.nationalId }}</p>
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">Phone Number (Mobile) *</label>
              <input 
                v-model="primaryForm.phone" 
                type="tel" 
                placeholder="+254..." 
                required 
                :class="[
                  'w-full px-4 py-2 border rounded-md outline-none focus:border-[#4F1964]',
                  valErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-[#E5E0EA]'
                ]" 
              />
              <p v-if="valErrors.phone" class="text-xs text-red-500 mt-1">{{ valErrors.phone }}</p>
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">Branch *</label>
              <select 
                v-model="primaryForm.branchId" 
                required 
                :class="[
                  'w-full px-4 py-2 border rounded-md outline-none bg-white focus:border-[#4F1964]',
                  valErrors.branchId ? 'border-red-500 focus:border-red-500' : 'border-[#E5E0EA]'
                ]"
              >
                <option value="">Select branch...</option>
                <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }} ({{ b.location }})</option>
              </select>
              <p v-if="valErrors.branchId" class="text-xs text-red-500 mt-1">{{ valErrors.branchId }}</p>
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">Town *</label>
              <input 
                v-model="primaryForm.town" 
                type="text" 
                required 
                :class="[
                  'w-full px-4 py-2 border rounded-md outline-none focus:border-[#4F1964]',
                  valErrors.town ? 'border-red-500 focus:border-red-500' : 'border-[#E5E0EA]'
                ]" 
              />
              <p v-if="valErrors.town" class="text-xs text-red-500 mt-1">{{ valErrors.town }}</p>
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">County *</label>
              <input 
                v-model="primaryForm.county" 
                type="text" 
                required 
                :class="[
                  'w-full px-4 py-2 border rounded-md outline-none focus:border-[#4F1964]',
                  valErrors.county ? 'border-red-500 focus:border-red-500' : 'border-[#E5E0EA]'
                ]" 
              />
              <p v-if="valErrors.county" class="text-xs text-red-500 mt-1">{{ valErrors.county }}</p>
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">Postal Address *</label>
              <input 
                v-model="primaryForm.postalAddress" 
                type="text" 
                placeholder="P.O. Box 100-00100" 
                required 
                :class="[
                  'w-full px-4 py-2 border rounded-md outline-none focus:border-[#4F1964]',
                  valErrors.postalAddress ? 'border-red-500 focus:border-red-500' : 'border-[#E5E0EA]'
                ]" 
              />
              <p v-if="valErrors.postalAddress" class="text-xs text-red-500 mt-1">{{ valErrors.postalAddress }}</p>
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">Location Geo Coordinates</label>
              <input v-model="primaryForm.homeGeoLocation" type="text" placeholder="-1.3005, 36.7850" class="w-full px-4 py-2 border border-[#E5E0EA] rounded-md outline-none focus:border-[#4F1964]" />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-[#4B4B6B]">Physical Address Description *</label>
            <textarea 
              v-model="primaryForm.physicalAddress" 
              required 
              rows="3" 
              :class="[
                'w-full px-4 py-2 border rounded-md outline-none focus:border-[#4F1964]',
                valErrors.physicalAddress ? 'border-red-500 focus:border-red-500' : 'border-[#E5E0EA]'
              ]"
            ></textarea>
            <p v-if="valErrors.physicalAddress" class="text-xs text-red-500 mt-1">{{ valErrors.physicalAddress }}</p>
          </div>

          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-[#4B4B6B]">Photo URL</label>
            <input v-model="primaryForm.photoUrl" type="text" class="w-full px-4 py-2 border border-[#E5E0EA] rounded-md outline-none focus:border-[#4F1964]" />
          </div>
        </div>

        <!-- 2. BUSINESS INFO -->
        <div v-show="activeTab === 'business'" class="space-y-5">
          <div class="flex items-center gap-3 border-b pb-2">
            <input type="checkbox" id="hasBusiness" v-model="businessForm.hasInfo" class="w-4 h-4 rounded text-[#4F1964]" />
            <label for="hasBusiness" class="text-base font-semibold text-[#1A1A2E] cursor-pointer">Include Business Information</label>
          </div>

          <div v-if="businessForm.hasInfo" class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">Business Name *</label>
              <input 
                v-model="businessForm.businessName" 
                type="text" 
                :class="[
                  'w-full px-4 py-2 border rounded-md outline-none focus:border-[#4F1964]',
                  valErrors.businessName ? 'border-red-500 focus:border-red-500' : 'border-[#E5E0EA]'
                ]" 
              />
              <p v-if="valErrors.businessName" class="text-xs text-red-500 mt-1">{{ valErrors.businessName }}</p>
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">Business Type *</label>
              <input 
                v-model="businessForm.businessType" 
                type="text" 
                placeholder="e.g. Retail Shop" 
                :class="[
                  'w-full px-4 py-2 border rounded-md outline-none focus:border-[#4F1964]',
                  valErrors.businessType ? 'border-red-500 focus:border-red-500' : 'border-[#E5E0EA]'
                ]" 
              />
              <p v-if="valErrors.businessType" class="text-xs text-red-500 mt-1">{{ valErrors.businessType }}</p>
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">Years in Business</label>
              <input v-model.number="businessForm.yearsInBusiness" type="number" min="0" class="w-full px-4 py-2 border rounded-md" />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">Current Stock Value (KES)</label>
              <input v-model.number="businessForm.currentStockValue" type="number" min="0" class="w-full px-4 py-2 border rounded-md" />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">Weekly Gross Profit (KES)</label>
              <input v-model.number="businessForm.weeklyGrossProfit" type="number" min="0" class="w-full px-4 py-2 border rounded-md" />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">Weekly Expenses (KES)</label>
              <input v-model.number="businessForm.weeklyExpenses" type="number" min="0" class="w-full px-4 py-2 border rounded-md" />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">Weekly Net Profit (KES)</label>
              <input v-model.number="businessForm.weeklyNetProfit" type="number" min="0" class="w-full px-4 py-2 border rounded-md" />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">Proposed Limit (KES)</label>
              <input v-model.number="businessForm.proposedLimit" type="number" min="0" class="w-full px-4 py-2 border rounded-md font-bold" />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">Lead Source / Type</label>
              <select v-model="businessForm.leadType" class="w-full px-4 py-2 border rounded-md bg-white">
                <option value="Walk-In">Walk-In</option>
                <option value="Agent-Referred">Agent-Referred</option>
                <option value="Social Media">Social Media</option>
                <option value="Billboard">Billboard</option>
                <option value="Word of Mouth">Word of Mouth</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">Offers Credit?</label>
              <select v-model="businessForm.offersCredit" class="w-full px-4 py-2 border rounded-md bg-white">
                <option :value="false">No</option>
                <option :value="true">Yes</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">Would Lend?</label>
              <select v-model="businessForm.wouldLend" class="w-full px-4 py-2 border rounded-md bg-white">
                <option :value="true">Yes</option>
                <option :value="false">No</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">Business Geo Location</label>
              <input v-model="businessForm.businessGeoLocation" type="text" placeholder="-1.3006, 36.7851" class="w-full px-4 py-2 border rounded-md" />
            </div>
          </div>

          <div v-if="businessForm.hasInfo" class="space-y-1.5">
            <label class="block text-sm font-medium text-[#4B4B6B]">Business Directional Directions</label>
            <textarea v-model="businessForm.businessDirection" rows="2" placeholder="Describe landmarks to get to the business" class="w-full px-4 py-2 border rounded-md"></textarea>
          </div>
        </div>

        <!-- 3. SECONDARY INFO -->
        <div v-show="activeTab === 'secondary'" class="space-y-5">
          <div class="flex items-center gap-3 border-b pb-2">
            <input type="checkbox" id="hasSecondary" v-model="secondaryForm.hasInfo" class="w-4 h-4 rounded text-[#4F1964]" />
            <label for="hasSecondary" class="text-base font-semibold text-[#1A1A2E] cursor-pointer">Include Demographic & Secondary Info</label>
          </div>

          <div v-if="secondaryForm.hasInfo" class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">Marital Status</label>
              <select v-model="secondaryForm.maritalStatus" class="w-full px-4 py-2 border rounded-md bg-white">
                <option :value="MaritalStatus.SINGLE">Single</option>
                <option :value="MaritalStatus.MARRIED">Married</option>
                <option :value="MaritalStatus.DIVORCED">Divorced</option>
                <option :value="MaritalStatus.WIDOWED">Widowed</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">Number of Dependents</label>
              <input v-model.number="secondaryForm.dependents" type="number" min="0" class="w-full px-4 py-2 border rounded-md" />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">Estate</label>
              <input v-model="secondaryForm.estate" type="text" class="w-full px-4 py-2 border rounded-md" />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">House Number</label>
              <input v-model="secondaryForm.houseNumber" type="text" class="w-full px-4 py-2 border rounded-md" />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">Demographic Home Ownership</label>
              <select v-model="secondaryForm.ownership" class="w-full px-4 py-2 border rounded-md bg-white">
                <option :value="HomeOwnership.OWNED">Owned</option>
                <option :value="HomeOwnership.RENTED">Rented</option>
              </select>
            </div>

            <div class="space-y-1.5" v-if="secondaryForm.ownership === HomeOwnership.RENTED">
              <label class="block text-sm font-medium text-[#4B4B6B]">Monthly Rent Amount (KES) *</label>
              <input 
                v-model.number="secondaryForm.rentAmount" 
                type="number" 
                min="0" 
                :class="[
                  'w-full px-4 py-2 border rounded-md outline-none focus:border-[#4F1964]',
                  valErrors.rentAmount ? 'border-red-500 focus:border-red-500' : 'border-[#E5E0EA]'
                ]" 
              />
              <p v-if="valErrors.rentAmount" class="text-xs text-red-500 mt-1">{{ valErrors.rentAmount }}</p>
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">Estimated Home Asset Value (KES)</label>
              <input v-model.number="secondaryForm.homeAssetValue" type="number" min="0" class="w-full px-4 py-2 border rounded-md" />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">Nearest Landmark</label>
              <input v-model="secondaryForm.nearestLandmark" type="text" class="w-full px-4 py-2 border rounded-md" />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">Heard About Us Via</label>
              <input v-model="secondaryForm.heardVia" type="text" class="w-full px-4 py-2 border rounded-md" />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-[#4B4B6B]">Home Geo Coordinates</label>
              <input v-model="secondaryForm.geoLocation" type="text" placeholder="-1.3005, 36.7850" class="w-full px-4 py-2 border rounded-md" />
            </div>
          </div>
        </div>

        <!-- 4. GUARANTORS & REFEREES -->
        <div v-show="activeTab === 'guarantors_referees'" class="space-y-6">
          <!-- Guarantors Section -->
          <div class="space-y-4">
            <div class="flex items-center justify-between border-b pb-2">
              <h3 class="text-base font-semibold text-[#1A1A2E]">Guarantors</h3>
              <button
                type="button"
                class="bg-[#166534] hover:bg-[#14532D] text-white px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5"
                @click="addGuarantor"
              >
                + Add Guarantor
              </button>
            </div>

            <p v-if="valErrors.guarantors" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2.5 mb-2">{{ valErrors.guarantors }}</p>

            <div v-if="guarantors.length === 0" class="text-sm text-[#9CA3AF] text-center py-4 bg-[#F8F7FA] rounded-md border border-dashed">
              No guarantors added yet.
            </div>

            <div
              v-for="(guarantor, idx) in guarantors"
              :key="idx"
              class="border rounded-lg p-4 bg-[#F8F7FA] relative space-y-3"
            >
              <button
                type="button"
                class="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-medium"
                @click="removeGuarantor(idx)"
              >
                Remove
              </button>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div class="space-y-1">
                  <label class="text-xs font-medium text-[#4B4B6B]">Guarantor Name *</label>
                  <input 
                    v-model="guarantor.name" 
                    type="text" 
                    :class="[
                      'w-full px-3 py-1.5 text-xs border rounded-md outline-none focus:border-[#4F1964]',
                      !guarantor.name.trim() && valErrors.guarantors ? 'border-red-500' : 'border-[#E5E0EA]'
                    ]" 
                  />
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-medium text-[#4B4B6B]">Guarantor ID Number *</label>
                  <input 
                    v-model="guarantor.idNumber" 
                    type="text" 
                    :class="[
                      'w-full px-3 py-1.5 text-xs border rounded-md outline-none focus:border-[#4F1964]',
                      !guarantor.idNumber.trim() && valErrors.guarantors ? 'border-red-500' : 'border-[#E5E0EA]'
                    ]" 
                  />
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-medium text-[#4B4B6B]">Guarantor Phone *</label>
                  <input 
                    v-model="guarantor.phone" 
                    type="tel" 
                    :class="[
                      'w-full px-3 py-1.5 text-xs border rounded-md outline-none focus:border-[#4F1964]',
                      !guarantor.phone.trim() && valErrors.guarantors ? 'border-red-500' : 'border-[#E5E0EA]'
                    ]" 
                  />
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-medium text-[#4B4B6B]">Guaranteed Amount (KES) *</label>
                  <input 
                    v-model.number="guarantor.amountGuaranteed" 
                    type="number" 
                    min="0" 
                    :class="[
                      'w-full px-3 py-1.5 text-xs border rounded-md outline-none focus:border-[#4F1964]',
                      guarantor.amountGuaranteed <= 0 && valErrors.guarantors ? 'border-red-500' : 'border-[#E5E0EA]'
                    ]" 
                  />
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-medium text-[#4B4B6B]">Relationship *</label>
                  <input 
                    v-model="guarantor.relationship" 
                    type="text" 
                    :class="[
                      'w-full px-3 py-1.5 text-xs border rounded-md outline-none focus:border-[#4F1964]',
                      !guarantor.relationship.trim() && valErrors.guarantors ? 'border-red-500' : 'border-[#E5E0EA]'
                    ]" 
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Referees Section -->
          <div class="space-y-4">
            <div class="flex items-center justify-between border-b pb-2">
              <h3 class="text-base font-semibold text-[#1A1A2E]">Referees</h3>
              <button
                type="button"
                class="bg-[#166534] hover:bg-[#14532D] text-white px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5"
                @click="addReferee"
              >
                + Add Referee
              </button>
            </div>

            <p v-if="valErrors.referees" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2.5 mb-2">{{ valErrors.referees }}</p>

            <div v-if="referees.length === 0" class="text-sm text-[#9CA3AF] text-center py-4 bg-[#F8F7FA] rounded-md border border-dashed">
              No referees added yet.
            </div>

            <div
              v-for="(referee, idx) in referees"
              :key="idx"
              class="border rounded-lg p-4 bg-[#F8F7FA] relative space-y-3"
            >
              <button
                type="button"
                class="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-medium"
                @click="removeReferee(idx)"
              >
                Remove
              </button>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label class="text-xs font-medium text-[#4B4B6B]">Referee Name *</label>
                  <input 
                    v-model="referee.name" 
                    type="text" 
                    :class="[
                      'w-full px-3 py-1.5 text-xs border rounded-md outline-none focus:border-[#4F1964]',
                      !referee.name.trim() && valErrors.referees ? 'border-red-500' : 'border-[#E5E0EA]'
                    ]" 
                  />
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-medium text-[#4B4B6B]">Referee Phone *</label>
                  <input 
                    v-model="referee.phone" 
                    type="tel" 
                    :class="[
                      'w-full px-3 py-1.5 text-xs border rounded-md outline-none focus:border-[#4F1964]',
                      !referee.phone.trim() && valErrors.referees ? 'border-red-500' : 'border-[#E5E0EA]'
                    ]" 
                  />
                </div>
                <div class="space-y-1 md:col-span-2">
                  <label class="text-xs font-medium text-[#4B4B6B]">Referee Physical Address *</label>
                  <input 
                    v-model="referee.physicalAddress" 
                    type="text" 
                    :class="[
                      'w-full px-3 py-1.5 text-xs border rounded-md outline-none focus:border-[#4F1964]',
                      !referee.physicalAddress.trim() && valErrors.referees ? 'border-red-500' : 'border-[#E5E0EA]'
                    ]" 
                  />
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-medium text-[#4B4B6B]">Relationship *</label>
                  <input 
                    v-model="referee.relationship" 
                    type="text" 
                    :class="[
                      'w-full px-3 py-1.5 text-xs border rounded-md outline-none focus:border-[#4F1964]',
                      !referee.relationship.trim() && valErrors.referees ? 'border-red-500' : 'border-[#E5E0EA]'
                    ]" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Wizard Navigation / Submit -->
        <div class="border-t pt-6 flex justify-between">
          <button
            v-if="activeTab !== 'primary'"
            type="button"
            class="border border-[#E5E0EA] hover:bg-[#F8F7FA] px-5 py-2 rounded-md text-sm font-medium"
            @click="activeTab = tabs[tabs.findIndex(t => t.id === activeTab) - 1].id"
          >
            Back
          </button>
          <div v-else></div>

          <button
            v-if="activeTab !== 'guarantors_referees'"
            type="button"
            class="bg-[#4F1964] hover:bg-[#380F47] text-white px-5 py-2 rounded-md text-sm font-medium"
            @click="handleNextStep"
          >
            Next Step
          </button>
          
          <button
            v-else
            type="submit"
            :disabled="saving"
            class="bg-[#166534] hover:bg-[#14532D] text-white px-6 py-2.5 rounded-md text-sm font-semibold flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check v-if="!saving" class="w-4 h-4" />
            <span v-if="saving">Registering Customer...</span>
            <span v-else>Save & Submit Profile</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
