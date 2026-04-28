<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Info,
  Phone,
  CreditCard,
  List,
  Users,
  Users2,
  Tag,
  Upload,
  Clock,
  MessageSquare,
  MessageCircle,
  Pencil,
  Plus,
  RefreshCcw,
  RotateCcw
} from 'lucide-vue-next'

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
}

const router = useRouter()
const route = useRoute()

// Tab state
const activeTab = ref('bio')

// Mock customer data keyed by id
const customerMap = ref<Record<number, CustomerDetail>>({
  2001: {
    id: 2001,
    photo: 'https://i.pravatar.cc/160?u=2001',
    fullName: 'Beatrice Wanjiru',
    nationalId: '12345678',
    phone: '254712345981',
    carrier: 'SAFARICOM KE',
    physicalAddress: 'Located two kilometres past the electric substation, on the left after the market hall near the red gate.',
    branch: 'Mumias',
    gender: 'F',
    dob: '1992-05-15',
    addedBy: 'Joseph Mwangi',
    pendingLimit: null,
    status: 'ACTIVE'
  },
  2002: {
    id: 2002,
    photo: 'https://i.pravatar.cc/160?u=2002',
    fullName: 'Isaac Njoroge',
    nationalId: '23456789',
    phone: '254700223344',
    carrier: 'SAFARICOM KE',
    physicalAddress: 'From the main Narok road, turn at the post office and continue to the second roundabout, house is opposite the small chapel.',
    branch: 'Narok',
    gender: 'M',
    dob: '1985-08-22',
    addedBy: 'Grace Achieng',
    pendingLimit: 50000,
    status: 'ACTIVE'
  },
  2003: {
    id: 2003,
    photo: 'https://i.pravatar.cc/160?u=2003',
    fullName: 'Mercy Kilonzo',
    nationalId: '34567890',
    phone: '254711889900',
    carrier: 'SAFARICOM KE',
    physicalAddress: 'Past the county hospital, head towards the lakeside road and take the first right after the blue gate; house is 50 metres down.',
    branch: 'Kisumu',
    gender: 'F',
    dob: '1990-11-08',
    addedBy: 'Peter Odhiambo',
    pendingLimit: null,
    status: 'LEAD'
  },
  2004: {
    id: 2004,
    photo: 'https://i.pravatar.cc/160?u=2004',
    fullName: 'Sharon Ouma',
    nationalId: '45678901',
    phone: '254798334455',
    carrier: 'SAFARICOM KE',
    physicalAddress: 'Near the old bus stage, behind the bakery and next to the public toilets; the compound has a white fence.',
    branch: 'Mombasa',
    gender: 'F',
    dob: '1988-03-30',
    addedBy: 'Alice Karanja',
    pendingLimit: null,
    status: 'ACTIVE'
  },
  2005: {
    id: 2005,
    photo: 'https://i.pravatar.cc/160?u=2005',
    fullName: 'Kenneth Otieno',
    nationalId: '56789012',
    phone: '254713667788',
    carrier: 'SAFARICOM KE',
    physicalAddress: 'Located at the end of the maize farm road, opposite the water tank and beside the green gate with a banana sign.',
    branch: 'Mumias',
    gender: 'M',
    dob: '1995-07-12',
    addedBy: 'Amanda Ndegwa',
    pendingLimit: 25000,
    status: 'ACTIVE'
  }
})

// Customer lookup
const customer = ref<CustomerDetail | null>(null)

onMounted(() => {
  const id = Number(route.params.id)
  customer.value = customerMap.value[id] || null
})

const customerInitials = computed(() => {
  if (!customer.value) return ''
  const parts = customer.value.fullName.split(' ')
  return parts.map(p => p[0]).join('').toUpperCase()
})

// Tab configuration
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

// Action handlers
const handleAction = (action: string) => {
  console.log(action)
}
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
        <div class="flex-1">
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
          <div v-if="activeTab === 'bio'" class="flex gap-6">
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
              </div>
            </div>
          </div>

          <!-- Other Tabs -->
          <div v-else class="py-16 text-center text-[#9CA3AF] text-sm">
            Content coming soon
          </div>
        </div>

        <!-- Right Action Panel -->
        <div class="w-72 shrink-0 sticky top-6 flex flex-col gap-3">
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