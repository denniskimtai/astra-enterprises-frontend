<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Info, Phone, CreditCard, List, Users, Users2,
  Tag, Upload, Clock, MessageSquare, MessageCircle,
  Pencil, Plus, RefreshCcw, RotateCcw, ExternalLink,
  ThumbsUp, Eye, CheckCircle
} from 'lucide-vue-next'

interface CustomerLoan {
  uid: number
  principal: number
  repayableTotal: number
  totalRepaid: number
  totalBalance: number
  givenDate: string
  dueDate: string
  daysUntilDue: number
  loName: string
  coName: string
  status: 'Disbursed' | 'Pending' | 'Defaulted'
}

interface CustomerPayment {
  id: number
  transactionCode: string
  amount: number
  dateRepaid: string
  dateLabel: 'TODAY' | 'YESTERDAY' | '2 DAYS AGO'
  payerName: string
  payerPhone: string
  loanId: number
}

interface CustomerDetail {
  id: number
  photo: string
  fullName: string
  nationalId: string
  phone: string
  carrier: string
  physicalAddress: string
  branch: string
  gender: 'M' | 'F'
  dob: string
  addedBy: string
  pendingLimit: number | null
  status: 'ACTIVE' | 'LEAD' | 'INACTIVE' | 'BLACKLISTED'
  currentLO: string
  currentCO: string
  currentLimit: number
  dateAdded: string
  dateAddedLabel: 'TODAY' | 'YESTERDAY' | '2 DAYS AGO' | '3 DAYS AGO'
  dateAddedTime: string
  product: string
  totalLoans: number
  businessInfo: Record<string, string>
  operatorAssessment: Record<string, string>
  secondaryInfo: Record<string, string>
  loan: CustomerLoan | null
  payment: CustomerPayment | null
}

const router = useRouter()
const route = useRoute()
const activeTab = ref('bio')

const customerMap = ref<Record<number, CustomerDetail>>({
  2001: {
    id: 2001, photo: 'https://i.pravatar.cc/160?u=2001', fullName: 'Beatrice Wanjiru',
    nationalId: '12345678', phone: '254712345981', carrier: 'SAFARICOM KE',
    physicalAddress: 'Located two kilometres past the electric substation, on the left after the market hall near the red gate.',
    branch: 'Mumias', gender: 'F', dob: '1992-05-15', addedBy: 'Joseph Mwangi',
    pendingLimit: null, status: 'ACTIVE',
    currentLO: 'Joseph Mwangi', currentCO: 'Sarah Kemunto', currentLimit: 15000,
    dateAdded: '18 Apr 2026', dateAddedLabel: 'TODAY', dateAddedTime: '08:20 AM',
    product: 'Bizboost Loan', totalLoans: 1,
    businessInfo: {
      '16': 'Beatrice Boutique', '17': 'Retail', '19': 'From the main road, turn left after the church, third house on right with blue door.',
      '20': '3', '21': '25000', '22': '', '23': '8000', '24': '5000', '25': '1500', '26': '3500',
      '27': '5000', '28': '1500', '29': '2', '30': 'Registered', '31': 'Motorbike', '32': '2000',
      '33': '5', '34': '5000', '43': 'Retail', '46': '', '47': 'Clothing Shop', '48': 'NO',
      '50': 'https://www.google.com/maps?q=0.338785,34.4910588'
    },
    operatorAssessment: {
      '35': 'YES', '36': 'YES', '37': 'YES', '38': 'YES', '39': 'YES', '40': 'YES', '41': 'YES', '42': 'YES',
      '45': '10000', '49': 'YES', '51': 'HOT'
    },
    secondaryInfo: {
      '5': 'Single', '6': '2', '7': '', '8': '', '9': 'Rented', '10': '', '11': '', '12': '5000',
      '13': 'Mumias Primary School', '14': 'https://www.google.com/maps?q=0.338785,34.4910588',
      '15': 'Pembeni Person', '44': 'Mumias', '52': 'Kakamega County', '53': ''
    },
    loan: {
      uid: 1001, principal: 10000, repayableTotal: 11500, totalRepaid: 3500, totalBalance: 8000,
      givenDate: '01 Mar 2026', dueDate: '28 May 2026', daysUntilDue: 29,
      loName: 'Joseph Mwangi', coName: 'Sarah Kemunto', status: 'Disbursed'
    },
    payment: {
      id: 5001, transactionCode: 'TXN-2026-0351', amount: 3500,
      dateRepaid: '28 Apr 2026', dateLabel: 'YESTERDAY',
      payerName: 'Beatrice Wanjiru', payerPhone: '254712345981', loanId: 1001
    }
  },
  2002: {
    id: 2002, photo: 'https://i.pravatar.cc/160?u=2002', fullName: 'Isaac Njoroge',
    nationalId: '23456789', phone: '254700223344', carrier: 'SAFARICOM KE',
    physicalAddress: 'From the main Narok road, turn at the post office and continue to the second roundabout, house is opposite the small chapel.',
    branch: 'Narok', gender: 'M', dob: '1985-08-22', addedBy: 'Grace Achieng',
    pendingLimit: 50000, status: 'ACTIVE',
    currentLO: 'Grace Achieng', currentCO: 'David Maina', currentLimit: 25000,
    dateAdded: '17 Apr 2026', dateAddedLabel: 'YESTERDAY', dateAddedTime: '11:40 AM',
    product: 'Faida Loan', totalLoans: 1,
    businessInfo: {
      '16': 'Njoroge Hardware', '17': 'Retail', '19': 'Near the market square, opposite the bank.',
      '20': '7', '21': '150000', '22': '', '23': '45000', '24': '15000', '25': '8000', '26': '7000',
      '27': '15000', '28': '3000', '29': '4', '30': 'Registered', '31': 'Van', '32': '5000',
      '33': '8', '34': '10000', '43': 'Retail', '46': '', '47': 'Hardware Store', '48': 'YES',
      '50': 'https://www.google.com/maps?q=-1.0789,35.8604'
    },
    operatorAssessment: {
      '35': 'YES', '36': 'YES', '37': 'YES', '38': 'YES', '39': 'YES', '40': 'YES', '41': 'YES', '42': 'YES',
      '45': '30000', '49': 'YES', '51': 'HOT'
    },
    secondaryInfo: {
      '5': 'Married', '6': '4', '7': '', '8': '', '9': 'Owned', '10': '', '11': '', '12': '250000',
      '13': 'Narok Town Hall', '14': 'https://www.google.com/maps?q=-1.0789,35.8604',
      '15': 'Existing Customer', '44': 'Narok', '52': 'Narok County', '53': ''
    },
    loan: {
      uid: 1002, principal: 20000, repayableTotal: 23200, totalRepaid: 11600, totalBalance: 11600,
      givenDate: '15 Feb 2026', dueDate: '15 May 2026', daysUntilDue: 16,
      loName: 'Grace Achieng', coName: 'David Maina', status: 'Disbursed'
    },
    payment: {
      id: 5002, transactionCode: 'TXN-2026-0289', amount: 11600,
      dateRepaid: '29 Apr 2026', dateLabel: 'TODAY',
      payerName: 'Isaac Njoroge', payerPhone: '254700223344', loanId: 1002
    }
  },
  2003: {
    id: 2003, photo: 'https://i.pravatar.cc/160?u=2003', fullName: 'Mercy Kilonzo',
    nationalId: '34567890', phone: '254711889900', carrier: 'SAFARICOM KE',
    physicalAddress: 'Past the county hospital, head towards the lakeside road and take the first right after the blue gate; house is 50 metres down.',
    branch: 'Kisumu', gender: 'F', dob: '1990-11-08', addedBy: 'Peter Odhiambo',
    pendingLimit: null, status: 'LEAD',
    currentLO: 'Peter Odhiambo', currentCO: 'Mary Atieno', currentLimit: 0,
    dateAdded: '16 Apr 2026', dateAddedLabel: '2 DAYS AGO', dateAddedTime: '02:15 PM',
    product: '', totalLoans: 0,
    businessInfo: {
      '16': 'Mercy Catering Services', '17': 'Service', '19': 'Next to Kisumu Police Station, behind the telecom shop.',
      '20': '2', '21': '5000', '22': '', '23': '3000', '24': '2000', '25': '1000', '26': '1000',
      '27': '', '28': '', '29': '1', '30': 'Pending', '31': '', '32': '1000',
      '33': '3', '34': '2000', '43': 'Service', '46': '', '47': 'Catering', '48': 'NO',
      '50': 'https://www.google.com/maps?q=-0.1022,34.7617'
    },
    operatorAssessment: {
      '35': 'YES', '36': 'YES', '37': 'NO', '38': 'NO', '39': 'NO', '40': 'YES', '41': 'NO', '42': 'YES',
      '45': '5000', '49': 'NO', '51': 'COLD'
    },
    secondaryInfo: {
      '5': 'Single', '6': '1', '7': '', '8': '', '9': 'Rented', '10': '', '11': '8000', '12': '',
      '13': 'Kisumu County Hospital', '14': 'https://www.google.com/maps?q=-0.1022,34.7617',
      '15': 'Social Media', '44': 'Kisumu', '52': 'Kisumu County', '53': ''
    },
    loan: null,
    payment: null
  },
  2004: {
    id: 2004, photo: 'https://i.pravatar.cc/160?u=2004', fullName: 'Sharon Ouma',
    nationalId: '45678901', phone: '254798334455', carrier: 'SAFARICOM KE',
    physicalAddress: 'Near the old bus stage, behind the bakery and next to the public toilets; the compound has a white fence.',
    branch: 'Mombasa', gender: 'F', dob: '1988-03-30', addedBy: 'Alice Karanja',
    pendingLimit: null, status: 'ACTIVE',
    currentLO: 'Alice Karanja', currentCO: 'James Ochieng', currentLimit: 20000,
    dateAdded: '18 Apr 2026', dateAddedLabel: 'TODAY', dateAddedTime: '09:55 AM',
    product: 'Bizboost Loan', totalLoans: 1,
    businessInfo: {
      '16': 'Sharon Fashion House', '17': 'Retail', '19': 'Mombasa CBD, near the railway station, second floor above the phone shop.',
      '20': '4', '21': '80000', '22': '', '23': '25000', '24': '15000', '25': '5000', '26': '10000',
      '27': '20000', '28': '5000', '29': '3', '30': 'Registered', '31': 'Car', '32': '3000',
      '33': '6', '34': '8000', '43': 'Retail', '46': '', '47': 'Fashion Boutique', '48': 'YES',
      '50': 'https://www.google.com/maps?q=-4.0437,39.6689'
    },
    operatorAssessment: {
      '35': 'YES', '36': 'YES', '37': 'YES', '38': 'YES', '39': 'YES', '40': 'YES', '41': 'YES', '42': 'YES',
      '45': '25000', '49': 'YES', '51': 'HOT'
    },
    secondaryInfo: {
      '5': 'Married', '6': '3', '7': '', '8': '', '9': 'Rented', '10': '', '11': '15000', '12': '',
      '13': 'Mombasa Railway Station', '14': 'https://www.google.com/maps?q=-4.0437,39.6689',
      '15': 'Word of Mouth', '44': 'Mombasa', '52': 'Mombasa County', '53': ''
    },
    loan: {
      uid: 1004, principal: 15000, repayableTotal: 17250, totalRepaid: 5750, totalBalance: 11500,
      givenDate: '20 Mar 2026', dueDate: '20 Jun 2026', daysUntilDue: 52,
      loName: 'Alice Karanja', coName: 'James Ochieng', status: 'Disbursed'
    },
    payment: {
      id: 5004, transactionCode: 'TXN-2026-0378', amount: 5750,
      dateRepaid: '27 Apr 2026', dateLabel: '2 DAYS AGO',
      payerName: 'Sharon Ouma', payerPhone: '254798334455', loanId: 1004
    }
  },
  2005: {
    id: 2005, photo: 'https://i.pravatar.cc/160?u=2005', fullName: 'Kenneth Otieno',
    nationalId: '56789012', phone: '254713667788', carrier: 'SAFARICOM KE',
    physicalAddress: 'Located at the end of the maize farm road, opposite the water tank and beside the green gate with a banana sign.',
    branch: 'Mumias', gender: 'M', dob: '1995-07-12', addedBy: 'Amanda Ndegwa',
    pendingLimit: 25000, status: 'ACTIVE',
    currentLO: 'Amanda Ndegwa', currentCO: 'Robert Kiprotich', currentLimit: 10000,
    dateAdded: '17 Apr 2026', dateAddedLabel: 'YESTERDAY', dateAddedTime: '04:05 PM',
    product: 'Faida Loan', totalLoans: 1,
    businessInfo: {
      '16': 'Otieno General Shop', '17': 'Retail', '19': 'Mumias town center, next to the police station.',
      '20': '5', '21': '45000', '22': '', '23': '15000', '24': '8000', '25': '3000', '26': '5000',
      '27': '8000', '28': '2000', '29': '2', '30': 'Registered', '31': 'Motorbike', '32': '2500',
      '33': '4', '34': '4000', '43': 'Retail', '46': '', '47': 'General Shop', '48': 'YES',
      '50': 'https://www.google.com/maps?q=0.338785,34.4910588'
    },
    operatorAssessment: {
      '35': 'YES', '36': 'YES', '37': 'YES', '38': 'YES', '39': 'YES', '40': 'YES', '41': 'YES', '42': 'YES',
      '45': '15000', '49': 'YES', '51': 'HOT'
    },
    secondaryInfo: {
      '5': 'Single', '6': '2', '7': '', '8': '', '9': 'Owned', '10': '', '11': '', '12': '8000',
      '13': 'Mumias Police Station', '14': 'https://www.google.com/maps?q=0.338785,34.4910588',
      '15': 'Existing Customer', '44': 'Mumias', '52': 'Kakamega County', '53': ''
    },
    loan: {
      uid: 1005, principal: 8000, repayableTotal: 9200, totalRepaid: 2300, totalBalance: 6900,
      givenDate: '10 Apr 2026', dueDate: '10 Jul 2026', daysUntilDue: 72,
      loName: 'Amanda Ndegwa', coName: 'Robert Kiprotich', status: 'Disbursed'
    },
    payment: {
      id: 5005, transactionCode: 'TXN-2026-0412', amount: 2300,
      dateRepaid: '26 Apr 2026', dateLabel: '3 DAYS AGO',
      payerName: 'Kenneth Otieno', payerPhone: '254713667788', loanId: 1005
    }
  }
})

const customer = ref<CustomerDetail | null>(null)

onMounted(() => {
  const id = Number(route.params.id)
  customer.value = customerMap.value[id] || null
})

const customerInitials = computed(() => {
  if (!customer.value) return ''
  return customer.value.fullName.split(' ').map(p => p[0]).join('').toUpperCase()
})

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 2 }).format(amount)
}

const truncateUrl = (url: string, maxLen: number = 40): string => {
  if (!url) return ''
  return url.length > maxLen ? url.substring(0, maxLen) + '...' : url
}

const tabs = [
  { id: 'bio', label: 'Bio Info', icon: Info },
  { id: 'contact', label: 'Contact Info', icon: Phone },
  { id: 'account', label: 'Account Info', icon: CreditCard },
  { id: 'statement', label: 'Statement', icon: List },
  { id: 'guarantors', label: 'Guarantors', icon: Users },
  { id: 'referees', label: 'Referees', icon: Users2 },
  { id: 'collateral', label: 'Collateral', icon: Tag },
  { id: 'uploads', label: 'Uploads', icon: Upload },
  { id: 'events', label: 'Events', icon: Clock },
  { id: 'interactions', label: 'Interactions', icon: MessageSquare },
  { id: 'messages', label: 'Messages', icon: MessageCircle }
]

const handleAction = (action: string) => console.log(action)
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Not Found State -->
    <div v-if="!customer" class="flex flex-col items-center justify-center py-32">
      <div class="text-[#4B4B6B] text-lg mb-4">Customer not found</div>
      <button
        class="bg-[#4F1964] text-white px-6 py-2 rounded-md text-sm font-medium"
        @click="router.back()"
      >
        Go Back
      </button>
    </div>

    <!-- Customer Detail View -->
    <div v-else>
      <!-- Page Header -->
      <div class="px-6 pt-6 pb-2">
        <h1 class="text-2xl font-bold text-[#1A1A2E]">
          Customer Details
          <span class="text-[#9CA3AF] text-sm ml-2 font-normal">{{ customer.fullName }}</span>
        </h1>
      </div>

      <!-- Tab Navigation -->
      <div class="border-b border-[#E5E0EA] mb-6">
        <div class="flex gap-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="[
              'flex items-center gap-2 px-4 py-3 border-b-2 transition-colors text-sm',
              activeTab === tab.id
                ? 'text-[#4F1964] font-semibold border-[#4F1964]'
                : 'text-[#4B4B6B] border-transparent hover:text-[#4F1964] hover:border-[#C4B5D4]'
            ]"
            @click="activeTab = tab.id"
          >
            <component :is="tab.icon" class="w-4 h-4" />
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="px-6 py-4 flex gap-6 items-start">
        <!-- Main Content -->
        <div :class="activeTab === 'bio' ? 'flex-1' : 'w-full'">
          <!-- Alert Banner -->
          <div
            v-if="customer.pendingLimit"
            class="bg-[#EDE9F5] border-l-4 border-[#4F1964] rounded-md px-4 py-3 flex items-center gap-2 mb-4"
          >
            <Info class="w-4 h-4 text-[#4F1964]" />
            <span class="text-[#1A1A2E] text-sm">
              Customer has a new limit of
              <span class="font-bold text-[#4F1964]">KES {{ customer.pendingLimit.toLocaleString() }}</span>
              with comments '' awaiting approval
            </span>
          </div>

          <!-- Bio Info Tab Content -->
          <div v-if="activeTab === 'bio'" class="flex gap-6 overflow-y-auto max-h-[calc(100vh-280px)]">
            <!-- Customer Photo -->
            <div class="w-40 shrink-0">
              <img
                v-if="customer.photo"
                :src="customer.photo"
                :alt="customer.fullName"
                class="w-40 h-40 rounded-lg object-cover ring-2 ring-[#E5E0EA]"
              />
              <div
                v-else
                class="w-40 h-40 rounded-lg bg-[#EDE9F5] flex items-center justify-center"
              >
                <span class="text-[#4F1964] text-2xl font-bold">{{ customerInitials }}</span>
              </div>
            </div>

            <!-- Primary Information -->
            <div class="flex-1">
              <h2 class="text-lg font-semibold text-[#1A1A2E] mb-3">Primary Information</h2>
              
              <div class="space-y-0">
                <!-- UID -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">UID</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">{{ customer.id }}</span>
                </div>
                
                <!-- Full Name -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">Full Name</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">{{ customer.fullName }}</span>
                </div>
                
                <!-- National ID -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">National ID</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">{{ customer.nationalId }}</span>
                </div>
                
                <!-- Primary Mobile -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">Primary Mobile</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">
                    <span class="text-[#9CA3AF]">({{ customer.carrier }})</span>
                    <span class="text-[#4F1964] underline ml-1">{{ customer.phone }}</span>
                  </span>
                </div>
                
                <!-- Physical Address -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">Physical Address</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">{{ customer.physicalAddress }}</span>
                </div>
                
                <!-- Location Map -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">Location Map</span>
                  <div class="flex-1">
                    <iframe
                      :src="`https://maps.google.com/maps?q=${encodeURIComponent(customer.branch)}&output=embed`"
                      width="100%"
                      height="200"
                      class="rounded-lg overflow-hidden border border-[#E5E0EA]"
                      frameborder="0"
                      loading="lazy"
                    />
                  </div>
                </div>
                
                <!-- Gender -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">Gender</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">{{ customer.gender }}</span>
                </div>
                
                <!-- DOB -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">DOB</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">{{ customer.dob }}</span>
                </div>
                
                <!-- Added By -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">Added By</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">{{ customer.addedBy }}</span>
                </div>

                <!-- Current LO -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">Current LO</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">{{ customer.currentLO }}</span>
                </div>

                <!-- Current CO -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">Current CO</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">{{ customer.currentCO }}</span>
                </div>

                <!-- Current Limit -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">Current Limit</span>
                  <span class="text-[#1A1A2E] text-sm font-bold flex-1">{{ formatCurrency(customer.currentLimit) }}</span>
                </div>

                <!-- Date Added -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">Date Added</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1 flex items-center gap-2">
                    {{ customer.dateAdded }}
                    <span
                      class="px-2 py-0.5 rounded-full text-xs font-medium text-white bg-gradient-to-r from-[#4F1964] to-[#6B2385]"
                    >
                      {{ customer.dateAddedLabel }}
                    </span>
                    <span class="text-[#9CA3AF] text-xs">{{ customer.dateAddedTime }}</span>
                  </span>
                </div>

                <!-- Branch -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">Branch</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">{{ customer.branch }}</span>
                </div>

                <!-- Product -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">Product</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">{{ customer.product }}</span>
                </div>

                <!-- Total Loans -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">Total Loans</span>
                  <span class="text-[#1A1A2E] text-sm font-semibold flex-1">{{ customer.totalLoans }}</span>
                </div>

                <!-- Status -->
                <div class="flex py-2 border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white rounded px-3">
                  <span class="w-40 shrink-0 text-[#4B4B6B] text-sm font-medium">Status</span>
                  <span class="flex-1">
                    <span
                      :class="[
                        'px-2 py-0.5 rounded-full text-xs font-medium',
                        customer.status === 'ACTIVE' ? 'bg-[#4F1964] text-white' :
                        customer.status === 'LEAD' ? 'bg-[#F9DA82] text-[#1A1A2E]' :
                        customer.status === 'INACTIVE' ? 'bg-[#9CA3AF] text-white' :
                        'bg-[#E8604A] text-white'
                      ]"
                    >
                      {{ customer.status }}
                    </span>
                  </span>
                </div>
              </div>

              <!-- Other Information Section -->
              <div class="mt-8">
                <h2 class="text-lg font-semibold text-[#1A1A2E] mb-4">Other Information</h2>

                <!-- BUSINESS INFO -->
                <div class="border-y border-[#E5E0EA]">
                  <div class="py-2 px-3 bg-[#F8F7FA]">
                    <span class="text-[#4F1964] text-xs font-bold uppercase tracking-widest">Business Info</span>
                  </div>
                  <div class="space-y-0">
                    <template v-for="(value, key) in customer.businessInfo" :key="key">
                      <div
                        v-if="value"
                        class="flex border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white"
                      >
                        <div class="w-64 shrink-0 py-2 px-3">
                          <span class="text-[#9CA3AF] text-xs mr-1">{{ key }}</span>
                          <span class="text-[#4B4B6B] text-xs font-semibold">
                            {{ { '16': 'Name of Business', '17': 'Type of Business', '19': 'Business Direction', '20': 'Years in Business', '21': 'Current Stock Value', '22': 'Weekly Pembeni', '23': 'Weekly Spend on Stock', '24': 'Weekly Gross Profit', '25': 'Weekly Expenses', '26': 'Weekly Net Profit', '27': 'Rent', '28': 'Utilities', '29': 'Employees', '30': 'Licensing', '31': 'Transport', '32': 'Weekly Chama Contribution', '33': 'No. of Chama Members', '34': 'Chama Payout', '43': 'Business Category', '46': 'Referred By', '47': 'Business Type', '48': 'Offers Credit', '50': 'Business Geo Location' }[key] || key }}
                          </span>
                        </div>
                        <div class="flex-1 py-2 px-3">
                          <a
                            v-if="key === '50' && value.startsWith('http')"
                            :href="value"
                            target="_blank"
                            class="text-[#4F1964] underline text-xs"
                          >
                            {{ truncateUrl(value, 40) }}
                          </a>
                          <span v-else class="text-[#4B4B6B] text-xs">{{ value }}</span>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>

                <!-- OPERATOR ASSESSMENT -->
                <div class="border-y border-[#E5E0EA]">
                  <div class="py-2 px-3 bg-[#F8F7FA]">
                    <span class="text-[#4F1964] text-xs font-bold uppercase tracking-widest">Operator Assessment</span>
                  </div>
                  <div class="space-y-0">
                    <template v-for="(value, key) in customer.operatorAssessment" :key="key">
                      <div
                        v-if="value"
                        class="flex border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white"
                      >
                        <div class="w-64 shrink-0 py-2 px-3">
                          <span class="text-[#9CA3AF] text-xs mr-1">{{ key }}</span>
                          <span class="text-[#4B4B6B] text-xs font-semibold">
                            {{ { '35': 'Stock Neat', '36': 'Accurate Ledger Book', '37': 'Pembeni Activity', '38': 'Permanent', '39': 'Proof of Ownership', '40': 'Forthcoming', '41': 'Known to Market Authorities', '42': 'Of Sound Mind', '45': 'Proposed Limit', '49': 'Would you lend to this customer', '51': 'Lead Type' }[key] || key }}
                          </span>
                        </div>
                        <div class="flex-1 py-2 px-3">
                          <span class="text-[#4B4B6B] text-xs">{{ value }}</span>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>

                <!-- SECONDARY INFO -->
                <div class="border-y border-[#E5E0EA]">
                  <div class="py-2 px-3 bg-[#F8F7FA]">
                    <span class="text-[#4F1964] text-xs font-bold uppercase tracking-widest">Secondary Info</span>
                  </div>
                  <div class="space-y-0">
                    <template v-for="(value, key) in customer.secondaryInfo" :key="key">
                      <div
                        class="flex border-b border-[#F3F4F6] odd:bg-[#F8F7FA] even:bg-white"
                      >
                        <div class="w-64 shrink-0 py-2 px-3">
                          <span class="text-[#9CA3AF] text-xs mr-1">{{ key }}</span>
                          <span class="text-[#4B4B6B] text-xs font-semibold">
                            {{ { '5': 'Marital Status', '6': 'Number of Dependents', '7': 'Estate', '8': 'House Number', '9': 'Ownership', '10': 'Since', '11': 'Rent Amount', '12': 'Home Asset Value', '13': 'Nearest LandMark', '14': 'Geo Location', '15': 'How did you hear about Pembeni?', '44': 'Town/Centre', '52': 'County/State', '53': 'Postal Address' }[key] || key }}
                          </span>
                        </div>
                        <div class="flex-1 py-2 px-3">
                          <a
                            v-if="(key === '14' || key === '50') && value.startsWith('http')"
                            :href="value"
                            target="_blank"
                            class="text-[#4F1964] underline text-xs"
                          >
                            {{ truncateUrl(value, 40) }}
                          </a>
                          <span v-else class="text-[#4B4B6B] text-xs">{{ value || '-' }}</span>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Info Tab -->
          <div v-if="activeTab === 'contact'" class="flex items-center gap-6 p-6 bg-white rounded-lg border border-[#E5E0EA]">
            <div class="w-16 h-16 bg-[#F3F4F6] rounded flex items-center justify-center">
              <Phone class="w-8 h-8 text-[#9CA3AF]" />
            </div>
            <div>
              <span class="text-sm font-bold text-[#1A1A2E]">Primary Phone</span>
              <div class="text-sm text-[#4B4B6B]">{{ customer.phone }}</div>
            </div>
            <div class="ml-12">
              <span class="text-sm font-bold text-[#1A1A2E]">Last Update</span>
              <div class="text-[#9CA3AF] text-xs">-</div>
            </div>
            <button class="ml-auto bg-[#166534] hover:bg-[#14532D] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
              <Plus class="w-4 h-4" />
              Add/Edit Contact
            </button>
          </div>

          <!-- Account Info Tab -->
          <div v-if="activeTab === 'account'" class="flex gap-6 p-6">
            <!-- Left Column -->
            <div class="flex-1">
              <h3 class="text-sm font-bold text-[#F9DA82] uppercase tracking-widest mb-3">Summary</h3>
              
              <div class="white card border border-[#E5E0EA] rounded-lg overflow-hidden mb-4">
                <div class="bg-[#F8F7FA] px-4 py-2">
                  <span class="text-sm font-semibold text-[#1A1A2E]">Account Number</span>
                </div>
                <div class="bg-[#1A1A2E] text-white grid grid-cols-2">
                  <div class="px-4 py-3 border border-[#374151]">
                    <span class="text-sm">Total Loans</span>
                  </div>
                  <div class="px-4 py-3 border border-[#374151] text-right">
                    <span class="text-sm font-bold">{{ customer.totalLoans }}</span>
                  </div>
                  <div class="px-4 py-3 border border-[#374151]">
                    <span class="text-sm">Amount Borrowed</span>
                  </div>
                  <div class="px-4 py-3 border border-[#374151] text-right">
                    <span class="text-sm font-bold">{{ customer.loan ? formatCurrency(customer.loan.principal) : 'KES 0.00' }}</span>
                  </div>
                  <div class="px-4 py-3 border border-[#374151]">
                    <span class="text-sm">Repayable Total</span>
                  </div>
                  <div class="px-4 py-3 border border-[#374151] text-right">
                    <span class="text-sm font-bold">{{ customer.loan ? formatCurrency(customer.loan.repayableTotal) : 'KES 0.00' }}</span>
                  </div>
                  <div class="px-4 py-3 border border-[#374151]">
                    <span class="text-sm">Total Repaid</span>
                  </div>
                  <div class="px-4 py-3 border border-[#374151] text-right">
                    <span class="text-sm font-bold">{{ customer.loan ? formatCurrency(customer.loan.totalRepaid) : 'KES 0.00' }}</span>
                  </div>
                  <div class="px-4 py-3 border border-[#374151]">
                    <span class="text-sm">Total Balance</span>
                  </div>
                  <div class="px-4 py-3 border border-[#374151] text-right">
                    <span class="text-sm font-bold">{{ customer.loan ? formatCurrency(customer.loan.totalBalance) : 'KES 0.00' }}</span>
                  </div>
                  <div class="px-4 py-3 border border-[#374151]">
                    <span class="text-sm">Money Made</span>
                  </div>
                  <div class="px-4 py-3 border border-[#374151] text-right">
                    <span class="text-sm font-bold">KES 0.00</span>
                  </div>
                </div>
              </div>

              <h3 class="text-sm font-bold text-[#F9DA82] uppercase tracking-widest mt-6 mb-3">All Loans</h3>
              
              <div class="white card border border-[#E5E0EA] rounded-lg overflow-hidden">
                <div class="grid grid-cols-9 bg-[#F8F7FA] px-3 py-2">
                  <span class="text-[#4F1964] text-xs font-semibold uppercase">UID</span>
                  <span class="text-[#4F1964] text-xs font-semibold uppercase">Loan Amount</span>
                  <span class="text-[#4F1964] text-xs font-semibold uppercase">Total Repayable</span>
                  <span class="text-[#4F1964] text-xs font-semibold uppercase">Paid</span>
                  <span class="text-[#4F1964] text-xs font-semibold uppercase">Balance</span>
                  <span class="text-[#4F1964] text-xs font-semibold uppercase col-span-2">Dates</span>
                  <span class="text-[#4F1964] text-xs font-semibold uppercase">BDO</span>
                  <span class="text-[#4F1964] text-xs font-semibold uppercase">Status</span>
                </div>
                <div v-if="customer.loan" class="grid grid-cols-9 items-center px-3 py-3 border-b border-[#F3F4F6]">
                  <span class="font-mono text-xs text-[#4B4B6B]">{{ customer.loan.uid }}</span>
                  <span class="text-xs text-[#1A1A2E] font-medium">{{ formatCurrency(customer.loan.principal) }}</span>
                  <span class="text-xs text-[#1A1A2E] font-medium">{{ formatCurrency(customer.loan.repayableTotal) }}</span>
                  <span class="text-xs text-[#1A1A2E] font-medium">{{ formatCurrency(customer.loan.totalRepaid) }}</span>
                  <span class="text-xs text-[#1A1A2E] font-medium">{{ formatCurrency(customer.loan.totalBalance) }}</span>
                  <div class="col-span-2 text-xs">
                    <div class="text-[#4B4B6B]">Given: {{ customer.loan.givenDate }}</div>
                    <div class="text-[#4B4B6B]">Due: {{ customer.loan.dueDate }}</div>
                    <span
                      :class="[
                        'inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full',
                        customer.loan.daysUntilDue > 0 ? 'bg-[#1A1A2E] text-white' : 'bg-[#E8604A] text-white'
                      ]"
                    >
                      {{ customer.loan.daysUntilDue > 0 ? `IN ${customer.loan.daysUntilDue} DAYS` : `${Math.abs(customer.loan.daysUntilDue)} DAYS OVERDUE` }}
                    </span>
                  </div>
                  <div class="text-xs">
                    <div><span class="text-[#9CA3AF]">LO:</span> <span class="text-[#1A1A2E] font-semibold">{{ customer.loan.loName }}</span></div>
                    <div><span class="text-[#9CA3AF]">CO:</span> <span class="text-[#1A1A2E] font-semibold">{{ customer.loan.coName }}</span></div>
                  </div>
                  <span
                    :class="[
                      'text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase w-fit',
                      customer.loan.status === 'Disbursed' ? 'bg-[#4F1964] text-white' :
                      customer.loan.status === 'Pending' ? 'bg-[#F9DA82] text-[#1A1A2E]' :
                      'bg-[#E8604A] text-white'
                    ]"
                  >
                    {{ customer.loan.status }}
                  </span>
                  <div class="flex gap-2">
                    <ExternalLink class="w-4 h-4 text-[#6B2385] cursor-pointer" />
                    <ThumbsUp class="w-4 h-4 text-[#9CA3AF] hover:text-[#4F1964] cursor-pointer" />
                  </div>
                </div>
                <div v-else class="px-3 py-6 text-center text-[#9CA3AF] text-sm">
                  No loans found
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="flex-1">
              <h3 class="text-sm font-bold text-[#F9DA82] uppercase tracking-widest mb-3">Payments</h3>
              
              <div class="white card border border-[#E5E0EA] rounded-lg overflow-hidden">
                <div class="grid grid-cols-8 bg-[#F8F7FA] px-3 py-2">
                  <span class="text-[#4F1964] text-xs font-semibold uppercase">ID</span>
                  <span class="text-[#4F1964] text-xs font-semibold uppercase col-span-2">Transaction Code</span>
                  <span class="text-[#4F1964] text-xs font-semibold uppercase">Amount</span>
                  <span class="text-[#4F1964] text-xs font-semibold uppercase col-span-2">Date Repaid</span>
                  <span class="text-[#4F1964] text-xs font-semibold uppercase col-span-2">Payer Details</span>
                  <span class="text-[#4F1964] text-xs font-semibold uppercase">Status</span>
                  <span class="text-[#4F1964] text-xs font-semibold uppercase">Action</span>
                </div>
                <div v-if="customer.payment" class="grid grid-cols-8 items-center px-3 py-3 border-b border-[#F3F4F6]">
                  <span class="font-mono text-xs text-[#4B4B6B]">{{ customer.payment.id }}</span>
                  <span class="col-span-2 text-xs font-mono text-[#1A1A2E]">{{ customer.payment.transactionCode }}</span>
                  <span class="text-xs font-semibold text-[#1A1A2E]">{{ formatCurrency(customer.payment.amount) }}</span>
                  <div class="col-span-2 text-xs">
                    <div class="text-[#4B4B6B]">{{ customer.payment.dateRepaid }}</div>
                    <span
                      :class="[
                        'inline-block mt-1 text-[10px] rounded-full px-2 py-0.5',
                        customer.payment.dateLabel === 'TODAY' ? 'bg-[#6B2385] text-white' :
                        'bg-gradient-to-r from-[#4F1964] to-[#6B2385] text-white'
                      ]"
                    >
                      {{ customer.payment.dateLabel }}
                    </span>
                  </div>
                  <div class="col-span-2 text-xs">
                    <div class="text-[#1A1A2E] font-medium">{{ customer.payment.payerName }}</div>
                    <div class="text-[#9CA3AF]">{{ customer.payment.payerPhone }}</div>
                  </div>
                  <div class="flex items-center gap-1">
                    <CheckCircle class="w-3 h-3 text-[#166534]" />
                    <span class="text-[#166534] text-xs font-semibold">Added</span>
                  </div>
                  <Eye class="w-4 h-4 text-[#4F1964] cursor-pointer" />
                </div>
                <div v-else class="px-3 py-6 text-center text-[#9CA3AF] text-sm">
                  No payments found
                </div>
              </div>
              <div v-if="customer.payment" class="mt-3 px-1">
                <span class="text-sm font-bold text-[#1A1A2E]">Total: {{ formatCurrency(customer.payment.amount) }}</span>
              </div>
            </div>
          </div>

          <!-- Other Tabs -->
        </div>

        <!-- Right Action Panel -->
        <div v-if="activeTab === 'bio'" class="w-72 shrink-0 sticky top-6 flex flex-col gap-3">
          <!-- Update Profile -->
          <button
            class="w-full h-11 rounded-md text-sm font-medium flex items-center justify-center gap-2 bg-[#4F1964] hover:bg-[#380F47] text-white"
            @click="handleAction('update-profile')"
          >
            <Pencil class="w-4 h-4" />
            Update Profile
          </button>

          <!-- Give a Loan -->
          <button
            class="w-full h-11 rounded-md text-sm font-medium flex items-center justify-center gap-2 bg-[#166534] hover:bg-[#14532D] text-white"
            @click="handleAction('give-loan')"
          >
            <Plus class="w-4 h-4" />
            Give a Loan
          </button>

          <!-- Update Limit -->
          <button
            class="w-full h-11 rounded-md text-sm font-medium flex items-center justify-center gap-2 bg-[#1A1A2E] hover:bg-[#374151] text-white"
            @click="handleAction('update-limit')"
          >
            <RefreshCcw class="w-4 h-4" />
            Update Limit
          </button>

          <!-- Interactions -->
          <button
            class="w-full h-11 rounded-md text-sm font-medium flex items-center justify-center gap-2 bg-[#F9DA82] hover:bg-[#F0C84A] text-[#1A1A2E]"
            @click="handleAction('interactions')"
          >
            <MessageSquare class="w-4 h-4" />
            Interactions
          </button>

          <!-- Status Dropdown -->
          <select
            :value="customer.status"
            class="w-full h-11 rounded-md border-2 border-[#4F1964] text-[#4F1964] font-semibold bg-white px-3 text-sm outline-none"
            @change="handleAction('status-change')"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="LEAD">LEAD</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="BLACKLISTED">BLACKLISTED</option>
          </select>

          <!-- Add Customer Tag -->
          <button
            class="w-full h-11 rounded-md text-sm font-medium flex items-center justify-center gap-2 bg-[#6B2385] hover:bg-[#4F1964] text-white"
            @click="handleAction('add-tag')"
          >
            <Tag class="w-4 h-4" />
            Add Customer Tag
          </button>

          <!-- Reset PIN -->
          <button
            class="w-full h-11 rounded-md text-sm font-medium flex items-center justify-center gap-2 bg-[#380F47] hover:bg-[#1A1A2E] text-white"
            @click="handleAction('reset-pin')"
          >
            <RotateCcw class="w-4 h-4" />
            Reset PIN
          </button>
        </div>
      </div>
    </div>
  </div>
</template>