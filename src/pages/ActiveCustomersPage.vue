<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown, Eye, Flag, MessageCircle, Plus, Search } from 'lucide-vue-next'

interface ActiveCustomer {
  id: number
  photo: string
  customer: string
  addedAt: string
  timeLabel: 'TODAY' | 'YESTERDAY' | '2 DAYS AGO' | '3 DAYS AGO'
  time: string
  agentName: string
  phone: string
  loanCount: number
  branch: string
  product: string
  loanBalance: number
  disbursedDate: string
  dueDate: string
  homeDirection: string
  contactStatus: 'Contactable' | 'Promised to Pay' | 'Not Reachable'
}

const router = useRouter()
const searchQuery = ref('')
const filterPills = ['Newest First', 'All Branches', 'All Types', 'All Agents']

const customers = ref<ActiveCustomer[]>([
  {
    id: 2001,
    photo: 'https://i.pravatar.cc/48?u=2001',
    customer: 'Beatrice Wanjiru',
    addedAt: '18 Apr 2026',
    timeLabel: 'TODAY',
    time: '08:20 AM',
    agentName: 'Joseph Mwangi',
    phone: '254712345981',
    loanCount: 1,
    branch: 'Mumias',
    product: 'Bizboost Loan',
    loanBalance: 16400,
    disbursedDate: '12 Apr 2026',
    dueDate: '18 May 2026',
    homeDirection: 'Located two kilometres past the electric substation, on the left after the market hall near the red gate.',
    contactStatus: 'Contactable'
  },
  {
    id: 2002,
    photo: 'https://i.pravatar.cc/48?u=2002',
    customer: 'Isaac Njoroge',
    addedAt: '17 Apr 2026',
    timeLabel: 'YESTERDAY',
    time: '11:40 AM',
    agentName: 'Grace Achieng',
    phone: '254700223344',
    loanCount: 1,
    branch: 'Narok',
    product: 'Faida Loan',
    loanBalance: 24800,
    disbursedDate: '10 Apr 2026',
    dueDate: '10 May 2026',
    homeDirection: 'From the main Narok road, turn at the post office and continue to the second roundabout, house is opposite the small chapel.',
    contactStatus: 'Promised to Pay'
  },
  {
    id: 2003,
    photo: 'https://i.pravatar.cc/48?u=2003',
    customer: 'Mercy Kilonzo',
    addedAt: '16 Apr 2026',
    timeLabel: '2 DAYS AGO',
    time: '02:15 PM',
    agentName: 'Peter Odhiambo',
    phone: '254711889900',
    loanCount: 1,
    branch: 'Kisumu',
    product: 'Mkopo Loan',
    loanBalance: 30200,
    disbursedDate: '09 Apr 2026',
    dueDate: '09 May 2026',
    homeDirection: 'Past the county hospital, head towards the lakeside road and take the first right after the blue gate; house is 50 metres down.',
    contactStatus: 'Not Reachable'
  },
  {
    id: 2004,
    photo: 'https://i.pravatar.cc/48?u=2004',
    customer: 'Sharon Ouma',
    addedAt: '18 Apr 2026',
    timeLabel: 'TODAY',
    time: '09:55 AM',
    agentName: 'Alice Karanja',
    phone: '254798334455',
    loanCount: 1,
    branch: 'Mombasa',
    product: 'Bizboost Loan',
    loanBalance: 19800,
    disbursedDate: '14 Apr 2026',
    dueDate: '14 May 2026',
    homeDirection: 'Near the old bus stage, behind the bakery and next to the public toilets; the compound has a white fence.',
    contactStatus: 'Contactable'
  },
  {
    id: 2005,
    photo: 'https://i.pravatar.cc/48?u=2005',
    customer: 'Kenneth Otieno',
    addedAt: '17 Apr 2026',
    timeLabel: 'YESTERDAY',
    time: '04:05 PM',
    agentName: 'Amanda Ndegwa',
    phone: '254713667788',
    loanCount: 1,
    branch: 'Mumias',
    product: 'Faida Loan',
    loanBalance: 10800,
    disbursedDate: '11 Apr 2026',
    dueDate: '11 May 2026',
    homeDirection: 'Located at the end of the maize farm road, opposite the water tank and beside the green gate with a banana sign.',
    contactStatus: 'Promised to Pay'
  },
  {
    id: 2006,
    photo: 'https://i.pravatar.cc/48?u=2006',
    customer: 'Eunice Wambui',
    addedAt: '15 Apr 2026',
    timeLabel: '3 DAYS AGO',
    time: '10:30 AM',
    agentName: 'Daniel Ouma',
    phone: '254716554433',
    loanCount: 1,
    branch: 'Kisumu',
    product: 'Mkopo Loan',
    loanBalance: 27100,
    disbursedDate: '08 Apr 2026',
    dueDate: '08 May 2026',
    homeDirection: 'Drive past the grain mill, take the gravel path towards the river and the house is the second one on the right with a red roof.',
    contactStatus: 'Contactable'
  },
  {
    id: 2007,
    photo: 'https://i.pravatar.cc/48?u=2007',
    customer: 'Wanjiru Kariuki',
    addedAt: '16 Apr 2026',
    timeLabel: '2 DAYS AGO',
    time: '07:50 AM',
    agentName: 'Samuel Njoroge',
    phone: '254714221100',
    loanCount: 1,
    branch: 'Narok',
    product: 'Bizboost Loan',
    loanBalance: 13900,
    disbursedDate: '10 Apr 2026',
    dueDate: '10 May 2026',
    homeDirection: 'From the market, walk past the kiosk and cross the footbridge; the house is on the left with a corrugated iron fence.',
    contactStatus: 'Not Reachable'
  },
  {
    id: 2008,
    photo: 'https://i.pravatar.cc/48?u=2008',
    customer: 'Lydia Muthoni',
    addedAt: '18 Apr 2026',
    timeLabel: 'TODAY',
    time: '03:20 PM',
    agentName: 'Victor Mwanzia',
    phone: '254715332211',
    loanCount: 1,
    branch: 'Mombasa',
    product: 'Faida Loan',
    loanBalance: 22300,
    disbursedDate: '13 Apr 2026',
    dueDate: '13 May 2026',
    homeDirection: 'Next to the fish market, in a two-storey blue house close to the main gate and opposite the second coffee stall.',
    contactStatus: 'Promised to Pay'
  }
])

const goToNewCustomer = (): void => {
  router.push('/customers/active/new')
}

const onSearch = (): void => {
  // Search UI is display-only as requested
}
</script>

<template>
  <div class="space-y-6 pb-6">
    <div class="px-6 py-6">
      <div class="flex items-baseline gap-2">
        <h1 class="text-2xl font-bold text-[#1A1A2E]">Customer</h1>
        <span class="text-sm text-[#9CA3AF]">List</span>
      </div>
    </div>

    <div class="bg-[#F8F7FA] border-b border-[#E5E0EA] px-6 py-3">
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex flex-wrap items-center gap-3">
          <button
            v-for="(pill, index) in filterPills"
            :key="index"
            type="button"
            class="inline-flex items-center gap-2 rounded-full border border-[#E5E0EA] bg-white px-4 py-1.5 text-sm text-[#4B4B6B] transition-colors duration-150 hover:border-[#4F1964] hover:text-[#4F1964]"
          >
            <span>{{ pill }}</span>
            <ChevronDown class="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          @click="goToNewCustomer"
          class="ml-auto inline-flex items-center gap-2 rounded-md border-b-2 border-[#F9DA82] bg-[#4F1964] px-5 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#380F47]"
        >
          <Plus class="w-4 h-4" />
          Add New
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center">
        <span class="rounded-full bg-[#4F1964] px-3 py-0.5 text-sm font-bold text-white">
          <span class="text-[#F9DA82]">{{ customers.length }}</span>
        </span>
        <span class="ml-2 text-sm text-[#4B4B6B]">Records Found</span>
      </div>

      <div class="flex w-full max-w-md items-center">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Enter text and hit search button"
          class="flex-1 rounded-l-md border border-[#E5E0EA] px-4 py-2 text-sm outline-none transition focus:border-[#4F1964] focus:ring-1 focus:ring-[#4F1964]"
        />
        <button
          type="button"
          @click="onSearch"
          class="rounded-r-md bg-[#4F1964] px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#380F47]"
        >
          <Search class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div class="mx-6 overflow-hidden rounded-lg border border-[#E5E0EA] bg-white">
      <div class="overflow-x-auto">
        <table class="min-w-full border-separate border-spacing-0">
          <thead class="bg-[#F8F7FA] border-b border-[#E5E0EA]">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">ID</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Photo</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Customer</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Added At</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Agent</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Phone</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Branch</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Latest Loan</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Home Direction</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Status</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4F1964]">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(customer, index) in customers"
              :key="customer.id"
              :class="[
                index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]',
                'border-b border-[#F3F4F6] hover:bg-[#F5F0F8] transition-colors duration-150'
              ]"
            >
              <td class="px-4 py-3 text-sm text-[#374151]">
                <span class="text-[#4B4B6B] font-mono text-xs">{{ customer.id }}</span>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="h-12 w-12 overflow-hidden rounded-lg ring-1 ring-[#E5E0EA]">
                  <img
                    v-if="customer.photo"
                    :src="customer.photo"
                    alt="Photo"
                    class="h-full w-full object-cover"
                  />
                  <div
                    v-else
                    class="flex h-full w-full items-center justify-center bg-[#EDE9F5] text-center text-xs font-bold text-[#4F1964]"
                  >
                    {{ customer.customer.split(' ').map(name => name[0]).join('') }}
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <span class="text-[#1A1A2E] font-medium text-sm">{{ customer.customer }}</span>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="space-y-2">
                  <div class="text-[#4B4B6B] text-xs">{{ customer.addedAt }}</div>
                  <div class="inline-flex items-center rounded-full bg-gradient-to-r from-[#4F1964] to-[#6B2385] px-2 py-0.5 text-[10px] font-bold text-white">{{ customer.timeLabel }}</div>
                  <div class="text-[#6B2385] text-xs font-medium">{{ customer.time }}</div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="space-y-1">
                  <div class="text-[#1A1A2E] text-xs font-medium">Name: {{ customer.agentName }}</div>
                  <div class="text-[#9CA3AF] text-xs">Role: LO</div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="space-y-1">
                  <span class="text-[#6B2385] text-xs underline cursor-pointer hover:text-[#4F1964]">{{ customer.phone }}</span>
                  <span class="inline-block rounded-full border border-[#4F1964] px-2 py-0.5 text-[10px] font-medium text-[#4F1964]">{{ customer.loanCount }} loan</span>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="space-y-1">
                  <div class="text-[#1A1A2E] text-xs font-medium">{{ customer.branch }}</div>
                  <div class="text-[#9CA3AF] text-xs">Prod: {{ customer.product }}</div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="space-y-1">
                  <div class="text-[#1A1A2E] text-xs font-semibold">Bal: KES {{ customer.loanBalance.toLocaleString() }}</div>
                  <div class="inline-block rounded-sm bg-[#DCFCE7] px-2 py-0.5 text-[10px] font-bold text-[#166534]">Disbursed</div>
                  <div class="text-[#9CA3AF] text-xs">DD: {{ customer.dueDate }}</div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="text-[#4B4B6B] text-xs leading-relaxed" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                  {{ customer.homeDirection }}
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="space-y-2">
                  <div class="inline-flex rounded-sm bg-[#4F1964] px-3 py-0.5 text-[10px] font-bold uppercase text-white">ACTIVE</div>
                  <div class="mt-1 flex items-center gap-1 text-[#6B2385] text-xs">
                    <Flag class="w-3 h-3 text-[#F9DA82]" />
                    <span>{{ customer.contactStatus }}</span>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-[#374151]">
                <div class="flex flex-col items-center">
                  <Eye class="w-4 h-4 cursor-pointer text-[#4F1964] hover:text-[#380F47]" />
                  <MessageCircle class="mt-1 w-4 h-4 cursor-pointer text-[#F0C84A] hover:text-[#F9DA82]" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
