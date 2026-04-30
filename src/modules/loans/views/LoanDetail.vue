<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Info,
  PlusCircle,
  MinusCircle,
  Calendar,
  Tag,
  RefreshCw,
  Clock,
  UserCircle,
  ExternalLink,
  Flag,
  ChevronDown,
  Check,
  X,
  Zap,
  MessageSquare,
  Plus,
  ArrowRight,
  ChevronLeft,
  Edit2,
  Minus,
  Car,
  Printer,
  Download,
  Eye
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

interface LoanDetail {
  id: number
  mpesaCode: string
  customerName: string
  customerAccount: string
  phone: string
  principal: number
  addOns: number
  deductions: number
  disbursedAmount: number
  repayableAmount: number
  repaid: number
  balance: number
  product: string
  disbursedDate: string
  disbursedDateLabel: 'TODAY' | 'YESTERDAY' | '2 DAYS AGO'
  disbursedTime: string
  dueDate: string
  daysUntilDue: number
  lastRepayDate: string
  clearedDate: string
  nextRepayDate: string
  nextRepayLabel: 'TODAY' | 'TOMORROW' | 'YESTERDAY'
  currentInstalment: number
  currentInstalmentAmount: number
  currentLO: string
  currentCO: string
  currentCollector: string
  createdBy: string
  penaltyAmount: number
  interestAmount: number
  stage: string
  status: 'CREATED' | 'DISBURSED' | 'DEFAULTED'
  appliedAddons: AppliedAddon[]
  notAppliedAddons: NotAppliedAddon[]
  appliedDeductions: DeductionItem[]
  paySchedule: ScheduleRow[]
  loanCollateral: LoanCollateral[]
  repayments: Repayment[]
}

interface AppliedAddon {
  name: string
  amount: number
  dateApplied: string
  timeApplied: string
  dateLabel: 'TODAY' | 'YESTERDAY'
}

interface NotAppliedAddon {
  name: string
  amount: number
  status: 'Not Added' | 'Added'
}

interface DeductionItem {
  name: string
  amount: number
  dateApplied: string
  timeApplied: string
  dateLabel: 'TODAY' | 'YESTERDAY'
}

interface ScheduleRow {
  date: string
  amount: number
  balance: number
  status: 'Repaid' | 'Unpaid'
}

interface LoanCollateral {
  name: string
  type: string
  status: 'Not Used' | 'In Use'
}

interface Repayment {
  id: number
  transactionCode: string
  amount: number
  dateRepaid: string
  dateLabel: 'TODAY' | 'YESTERDAY'
  payerName: string
  payerPhone: string
  paymentMethod: string
  status: 'Added'
}

const mockLoans: LoanDetail[] = [
  {
    id: 3001,
    mpesaCode: '',
    customerName: 'Amina Mwende',
    customerAccount: 'ACC-78234',
    phone: '254712345678',
    principal: 12000,
    addOns: 1450,
    deductions: 600,
    disbursedAmount: 12000,
    repayableAmount: 15850,
    repaid: 3200,
    balance: 12650,
    product: 'Personal Loan',
    disbursedDate: '18 Apr 2026',
    disbursedDateLabel: 'TODAY',
    disbursedTime: '08:20 AM',
    dueDate: '18 May 2026',
    daysUntilDue: 29,
    lastRepayDate: '',
    clearedDate: '',
    nextRepayDate: '29 Apr 2026',
    nextRepayLabel: 'TOMORROW',
    currentInstalment: 1,
    currentInstalmentAmount: 3170,
    currentLO: 'Grace Achieng',
    currentCO: 'Peter Njoroge',
    currentCollector: '',
    createdBy: 'Sarah Wairimu',
    penaltyAmount: 0,
    interestAmount: 3850,
    stage: 'Initiation',
    status: 'DISBURSED',
    appliedAddons: [
      { name: 'Initial Interest', amount: 240.00, dateApplied: '2026-04-29', timeApplied: '17:34:50', dateLabel: 'TODAY' },
      { name: 'Main Interest', amount: 1680.00, dateApplied: '2026-04-29', timeApplied: '17:34:50', dateLabel: 'TODAY' },
      { name: 'Registration Fees', amount: 500.00, dateApplied: '2026-04-29', timeApplied: '17:34:50', dateLabel: 'TODAY' }
    ],
    notAppliedAddons: [
      { name: 'Late Interest', amount: 1.00, status: 'Not Added' },
      { name: 'Block Addon', amount: 24.00, status: 'Not Added' },
      { name: 'Initial Interest', amount: 3.00, status: 'Added' },
      { name: 'Main Interest', amount: 21.00, status: 'Added' },
      { name: 'Registration Fees', amount: 500.00, status: 'Added' }
    ],
    appliedDeductions: [],
    paySchedule: [
      { date: '2026-04-30', amount: 348.00, balance: 0.00, status: 'Repaid' },
      { date: '2026-05-01', amount: 348.00, balance: 0.00, status: 'Repaid' },
      { date: '2026-05-02', amount: 348.00, balance: 348.00, status: 'Unpaid' },
      { date: '2026-05-03', amount: 348.00, balance: 696.00, status: 'Unpaid' },
      { date: '2026-05-04', amount: 348.00, balance: 1044.00, status: 'Unpaid' },
      { date: '2026-05-05', amount: 348.00, balance: 1392.00, status: 'Unpaid' },
      { date: '2026-05-06', amount: 348.00, balance: 1740.00, status: 'Unpaid' },
      { date: '2026-05-07', amount: 348.00, balance: 2088.00, status: 'Unpaid' },
      { date: '2026-05-08', amount: 348.00, balance: 2436.00, status: 'Unpaid' },
      { date: '2026-05-09', amount: 348.00, balance: 2784.00, status: 'Unpaid' },
      { date: '2026-05-10', amount: 348.00, balance: 3132.00, status: 'Unpaid' },
      { date: '2026-05-11', amount: 348.00, balance: 3480.00, status: 'Unpaid' },
      { date: '2026-05-12', amount: 348.00, balance: 3828.00, status: 'Unpaid' },
      { date: '2026-05-13', amount: 348.00, balance: 4176.00, status: 'Unpaid' },
      { date: '2026-05-14', amount: 348.00, balance: 4524.00, status: 'Unpaid' }
    ],
    loanCollateral: [
      { name: 'Gas', type: '', status: 'Not Used' },
      { name: 'Sofa set', type: '', status: 'Not Used' },
      { name: 'Woofer', type: '', status: 'Not Used' },
      { name: 'Television', type: '', status: 'Not Used' }
    ],
    repayments: [
      { id: 1437842, transactionCode: 'UDT822HDSK', amount: 740.00, dateRepaid: '2026-04-29', dateLabel: 'TODAY', payerName: 'Faridah Anyanga Wesonga', payerPhone: '254795056307', paymentMethod: 'Mobile Payment', status: 'Added' }
    ]
  },
  {
    id: 3002,
    mpesaCode: '',
    customerName: 'Josephat Kamau',
    customerAccount: 'ACC-65123',
    phone: '254700123456',
    principal: 8000,
    addOns: 800,
    deductions: 400,
    disbursedAmount: 8000,
    repayableAmount: 10400,
    repaid: 2000,
    balance: 8400,
    product: 'Business Loan',
    disbursedDate: '17 Apr 2026',
    disbursedDateLabel: 'YESTERDAY',
    disbursedTime: '10:15 AM',
    dueDate: '10 May 2026',
    daysUntilDue: 21,
    lastRepayDate: '',
    clearedDate: '',
    nextRepayDate: '29 Apr 2026',
    nextRepayLabel: 'TOMORROW',
    currentInstalment: 1,
    currentInstalmentAmount: 2600,
    currentLO: 'Mercy Otieno',
    currentCO: 'Daniel Kipkoech',
    currentCollector: '',
    createdBy: 'Alice Kamau',
    penaltyAmount: 0,
    interestAmount: 2400,
    stage: 'Initiation',
    status: 'DISBURSED',
    appliedAddons: [
      { name: 'Initial Interest', amount: 240.00, dateApplied: '2026-04-29', timeApplied: '17:34:50', dateLabel: 'TODAY' },
      { name: 'Main Interest', amount: 1680.00, dateApplied: '2026-04-29', timeApplied: '17:34:50', dateLabel: 'TODAY' },
      { name: 'Registration Fees', amount: 500.00, dateApplied: '2026-04-29', timeApplied: '17:34:50', dateLabel: 'TODAY' }
    ],
    notAppliedAddons: [
      { name: 'Late Interest', amount: 1.00, status: 'Not Added' },
      { name: 'Block Addon', amount: 24.00, status: 'Not Added' },
      { name: 'Initial Interest', amount: 3.00, status: 'Added' },
      { name: 'Main Interest', amount: 21.00, status: 'Added' },
      { name: 'Registration Fees', amount: 500.00, status: 'Added' }
    ]
  },
  {
    id: 3003,
    mpesaCode: '',
    customerName: 'Mercy Wambui',
    customerAccount: 'ACC-89012',
    phone: '254711987654',
    principal: 15000,
    addOns: 1200,
    deductions: 950,
    disbursedAmount: 15000,
    repayableAmount: 19650,
    repaid: 0,
    balance: 19650,
    product: 'Emergency Loan',
    disbursedDate: '15 Apr 2026',
    disbursedDateLabel: '2 DAYS AGO',
    disbursedTime: '02:45 PM',
    dueDate: '25 Apr 2026',
    daysUntilDue: 6,
    lastRepayDate: '',
    clearedDate: '',
    nextRepayDate: '29 Apr 2026',
    nextRepayLabel: 'TOMORROW',
    currentInstalment: 1,
    currentInstalmentAmount: 4912,
    currentLO: 'Peter Karanja',
    currentCO: 'Alice Kamau',
    currentCollector: '',
    createdBy: 'Angela Njeri',
    penaltyAmount: 0,
    interestAmount: 4650,
    stage: 'Initiation',
    status: 'CREATED',
    appliedAddons: [
      { name: 'Initial Interest', amount: 240.00, dateApplied: '2026-04-29', timeApplied: '17:34:50', dateLabel: 'TODAY' },
      { name: 'Main Interest', amount: 1680.00, dateApplied: '2026-04-29', timeApplied: '17:34:50', dateLabel: 'TODAY' },
      { name: 'Registration Fees', amount: 500.00, dateApplied: '2026-04-29', timeApplied: '17:34:50', dateLabel: 'TODAY' }
    ],
    notAppliedAddons: [
      { name: 'Late Interest', amount: 1.00, status: 'Not Added' },
      { name: 'Block Addon', amount: 24.00, status: 'Not Added' },
      { name: 'Initial Interest', amount: 3.00, status: 'Added' },
      { name: 'Main Interest', amount: 21.00, status: 'Added' },
      { name: 'Registration Fees', amount: 500.00, status: 'Added' }
    ],
    appliedDeductions: [],
    paySchedule: [
      { date: '2026-04-30', amount: 348.00, balance: 0.00, status: 'Repaid' },
      { date: '2026-05-01', amount: 348.00, balance: 0.00, status: 'Repaid' },
      { date: '2026-05-02', amount: 348.00, balance: 348.00, status: 'Unpaid' },
      { date: '2026-05-03', amount: 348.00, balance: 696.00, status: 'Unpaid' },
      { date: '2026-05-04', amount: 348.00, balance: 1044.00, status: 'Unpaid' },
      { date: '2026-05-05', amount: 348.00, balance: 1392.00, status: 'Unpaid' },
      { date: '2026-05-06', amount: 348.00, balance: 1740.00, status: 'Unpaid' },
      { date: '2026-05-07', amount: 348.00, balance: 2088.00, status: 'Unpaid' },
      { date: '2026-05-08', amount: 348.00, balance: 2436.00, status: 'Unpaid' },
      { date: '2026-05-09', amount: 348.00, balance: 2784.00, status: 'Unpaid' },
      { date: '2026-05-10', amount: 348.00, balance: 3132.00, status: 'Unpaid' },
      { date: '2026-05-11', amount: 348.00, balance: 3480.00, status: 'Unpaid' },
      { date: '2026-05-12', amount: 348.00, balance: 3828.00, status: 'Unpaid' },
      { date: '2026-05-13', amount: 348.00, balance: 4176.00, status: 'Unpaid' },
      { date: '2026-05-14', amount: 348.00, balance: 4524.00, status: 'Unpaid' }
    ],
    loanCollateral: [
      { name: 'Gas', type: '', status: 'Not Used' },
      { name: 'Sofa set', type: '', status: 'Not Used' },
      { name: 'Woofer', type: '', status: 'Not Used' },
      { name: 'Television', type: '', status: 'Not Used' }
    ],
    repayments: [
      { id: 1437842, transactionCode: 'UDT822HDSK', amount: 740.00, dateRepaid: '2026-04-29', dateLabel: 'TODAY', payerName: 'Faridah Anyanga Wesonga', payerPhone: '254795056307', paymentMethod: 'Mobile Payment', status: 'Added' }
    ]
  },
  {
    id: 3004,
    mpesaCode: '',
    customerName: 'David Mutua',
    customerAccount: 'ACC-45098',
    phone: '254798112233',
    principal: 9000,
    addOns: 600,
    deductions: 500,
    disbursedAmount: 9000,
    repayableAmount: 11800,
    repaid: 3500,
    balance: 8300,
    product: 'Personal Loan',
    disbursedDate: '13 Apr 2026',
    disbursedDateLabel: '3 DAYS AGO',
    disbursedTime: '11:10 AM',
    dueDate: '22 Apr 2026',
    daysUntilDue: 3,
    lastRepayDate: '',
    clearedDate: '',
    nextRepayDate: '29 Apr 2026',
    nextRepayLabel: 'TOMORROW',
    currentInstalment: 2,
    currentInstalmentAmount: 2950,
    currentLO: 'Sarah Wairimu',
    currentCO: 'Samuel Ouma',
    currentCollector: '',
    createdBy: 'Brian Mutiso',
    penaltyAmount: 0,
    interestAmount: 2800,
    stage: 'Initiation',
    status: 'CREATED',
    appliedAddons: [
      { name: 'Initial Interest', amount: 240.00, dateApplied: '2026-04-29', timeApplied: '17:34:50', dateLabel: 'TODAY' },
      { name: 'Main Interest', amount: 1680.00, dateApplied: '2026-04-29', timeApplied: '17:34:50', dateLabel: 'TODAY' },
      { name: 'Registration Fees', amount: 500.00, dateApplied: '2026-04-29', timeApplied: '17:34:50', dateLabel: 'TODAY' }
    ],
    notAppliedAddons: [
      { name: 'Late Interest', amount: 1.00, status: 'Not Added' },
      { name: 'Block Addon', amount: 24.00, status: 'Not Added' },
      { name: 'Initial Interest', amount: 3.00, status: 'Added' },
      { name: 'Main Interest', amount: 21.00, status: 'Added' },
      { name: 'Registration Fees', amount: 500.00, status: 'Added' }
    ],
    appliedDeductions: [],
    paySchedule: [
      { date: '2026-04-30', amount: 348.00, balance: 0.00, status: 'Repaid' },
      { date: '2026-05-01', amount: 348.00, balance: 0.00, status: 'Repaid' },
      { date: '2026-05-02', amount: 348.00, balance: 348.00, status: 'Unpaid' },
      { date: '2026-05-03', amount: 348.00, balance: 696.00, status: 'Unpaid' },
      { date: '2026-05-04', amount: 348.00, balance: 1044.00, status: 'Unpaid' },
      { date: '2026-05-05', amount: 348.00, balance: 1392.00, status: 'Unpaid' },
      { date: '2026-05-06', amount: 348.00, balance: 1740.00, status: 'Unpaid' },
      { date: '2026-05-07', amount: 348.00, balance: 2088.00, status: 'Unpaid' },
      { date: '2026-05-08', amount: 348.00, balance: 2436.00, status: 'Unpaid' },
      { date: '2026-05-09', amount: 348.00, balance: 2784.00, status: 'Unpaid' },
      { date: '2026-05-10', amount: 348.00, balance: 3132.00, status: 'Unpaid' },
      { date: '2026-05-11', amount: 348.00, balance: 3480.00, status: 'Unpaid' },
      { date: '2026-05-12', amount: 348.00, balance: 3828.00, status: 'Unpaid' },
      { date: '2026-05-13', amount: 348.00, balance: 4176.00, status: 'Unpaid' },
      { date: '2026-05-14', amount: 348.00, balance: 4524.00, status: 'Unpaid' }
    ],
    loanCollateral: [
      { name: 'Gas', type: '', status: 'Not Used' },
      { name: 'Sofa set', type: '', status: 'Not Used' },
      { name: 'Woofer', type: '', status: 'Not Used' },
      { name: 'Television', type: '', status: 'Not Used' }
    ],
    repayments: [
      { id: 1437842, transactionCode: 'UDT822HDSK', amount: 740.00, dateRepaid: '2026-04-29', dateLabel: 'TODAY', payerName: 'Faridah Anyanga Wesonga', payerPhone: '254795056307', paymentMethod: 'Mobile Payment', status: 'Added' }
    ]
  },
  {
    id: 3005,
    mpesaCode: '',
    customerName: 'Esther Ndegwa',
    customerAccount: 'ACC-32087',
    phone: '254713667788',
    principal: 7000,
    addOns: 400,
    deductions: 300,
    disbursedAmount: 7000,
    repayableAmount: 9100,
    repaid: 2000,
    balance: 7100,
    product: 'Personal Loan',
    disbursedDate: '14 Apr 2026',
    disbursedDateLabel: '3 DAYS AGO',
    disbursedTime: '09:00 AM',
    dueDate: '12 May 2026',
    daysUntilDue: 23,
    lastRepayDate: '',
    clearedDate: '',
    nextRepayDate: '29 Apr 2026',
    nextRepayLabel: 'TOMORROW',
    currentInstalment: 1,
    currentInstalmentAmount: 2275,
    currentLO: 'Angela Njeri',
    currentCO: 'Brian Mutiso',
    currentCollector: '',
    createdBy: 'Grace Wanjiru',
    penaltyAmount: 0,
    interestAmount: 2100,
    stage: 'Initiation',
    status: 'DISBURSED',
    appliedAddons: [
      { name: 'Initial Interest', amount: 240.00, dateApplied: '2026-04-29', timeApplied: '17:34:50', dateLabel: 'TODAY' },
      { name: 'Main Interest', amount: 1680.00, dateApplied: '2026-04-29', timeApplied: '17:34:50', dateLabel: 'TODAY' },
      { name: 'Registration Fees', amount: 500.00, dateApplied: '2026-04-29', timeApplied: '17:34:50', dateLabel: 'TODAY' }
    ],
    notAppliedAddons: [
      { name: 'Late Interest', amount: 1.00, status: 'Not Added' },
      { name: 'Block Addon', amount: 24.00, status: 'Not Added' },
      { name: 'Initial Interest', amount: 3.00, status: 'Added' },
      { name: 'Main Interest', amount: 21.00, status: 'Added' },
      { name: 'Registration Fees', amount: 500.00, status: 'Added' }
    ],
    appliedDeductions: [],
    paySchedule: [
      { date: '2026-04-30', amount: 348.00, balance: 0.00, status: 'Repaid' },
      { date: '2026-05-01', amount: 348.00, balance: 0.00, status: 'Repaid' },
      { date: '2026-05-02', amount: 348.00, balance: 348.00, status: 'Unpaid' },
      { date: '2026-05-03', amount: 348.00, balance: 696.00, status: 'Unpaid' },
      { date: '2026-05-04', amount: 348.00, balance: 1044.00, status: 'Unpaid' },
      { date: '2026-05-05', amount: 348.00, balance: 1392.00, status: 'Unpaid' },
      { date: '2026-05-06', amount: 348.00, balance: 1740.00, status: 'Unpaid' },
      { date: '2026-05-07', amount: 348.00, balance: 2088.00, status: 'Unpaid' },
      { date: '2026-05-08', amount: 348.00, balance: 2436.00, status: 'Unpaid' },
      { date: '2026-05-09', amount: 348.00, balance: 2784.00, status: 'Unpaid' },
      { date: '2026-05-10', amount: 348.00, balance: 3132.00, status: 'Unpaid' },
      { date: '2026-05-11', amount: 348.00, balance: 3480.00, status: 'Unpaid' },
      { date: '2026-05-12', amount: 348.00, balance: 3828.00, status: 'Unpaid' },
      { date: '2026-05-13', amount: 348.00, balance: 4176.00, status: 'Unpaid' },
      { date: '2026-05-14', amount: 348.00, balance: 4524.00, status: 'Unpaid' }
    ],
    loanCollateral: [
      { name: 'Gas', type: '', status: 'Not Used' },
      { name: 'Sofa set', type: '', status: 'Not Used' },
      { name: 'Woofer', type: '', status: 'Not Used' },
      { name: 'Television', type: '', status: 'Not Used' }
    ],
    repayments: [
      { id: 1437842, transactionCode: 'UDT822HDSK', amount: 740.00, dateRepaid: '2026-04-29', dateLabel: 'TODAY', payerName: 'Faridah Anyanga Wesonga', payerPhone: '254795056307', paymentMethod: 'Mobile Payment', status: 'Added' }
    ]
  }
]

const loanId = computed(() => Number(route.params.id))
const loan = computed(() => mockLoans.find(l => l.id === loanId.value))

const activeTab = ref('loan-info')
const goToLoanId = ref('')

const tabs = [
  { key: 'loan-info', label: 'Loan Info', icon: Info },
  { key: 'addons', label: 'AddOns', icon: PlusCircle },
  { key: 'deductions', label: 'Deductions', icon: MinusCircle },
  { key: 'pay-schedule', label: 'Pay Schedule', icon: Calendar },
  { key: 'collateral', label: 'Collateral', icon: Tag },
  { key: 'repayments', label: 'Repayments', icon: RefreshCw },
  { key: 'events', label: 'Events', icon: Clock }
]

const formatCurrency = (value: number) => {
  return `Ksh ${value.toLocaleString('en-US')}`
}

const navigatePrev = () => {
  const currentIndex = mockLoans.findIndex(l => l.id === loanId.value)
  if (currentIndex > 0) {
    router.push(`/loans/${mockLoans[currentIndex - 1].id}`)
  }
}

const navigateNext = () => {
  const currentIndex = mockLoans.findIndex(l => l.id === loanId.value)
  if (currentIndex < mockLoans.length - 1) {
    router.push(`/loans/${mockLoans[currentIndex + 1].id}`)
  }
}

const goToLoan = () => {
  const targetId = parseInt(goToLoanId.value)
  if (targetId && mockLoans.some(l => l.id === targetId)) {
    router.push(`/loans/${targetId}`)
  }
}

const handleApprove = () => {
  console.log('approve')
}

const handleReject = () => {
  console.log('reject')
}

const handleFlag = () => {
  console.log('flag')
}

const appliedAddonsTotal = computed(() => {
  if (!loan.value) return 0
  return loan.value.appliedAddons.reduce((sum, addon) => sum + addon.amount, 0)
})

const handleAddAddon = (name: string) => {
  console.log('add', name)
}

const handleRemoveAddon = (name: string) => {
  console.log('remove', name)
}
</script>

<template>
  <div v-if="loan" class="min-h-screen bg-white">
    <!-- Page Header -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#E5E0EA]">
      <div class="flex items-center">
        <h1 class="text-2xl font-bold text-[#1A1A2E]">Loan Details</h1>
        <span class="text-sm text-[#9CA3AF] ml-2">Loan #{{ loan.id }}</span>
      </div>
      <div class="flex gap-2 items-center">
        <button
          type="button"
          @click="navigatePrev"
          class="bg-white border border-[#E5E0EA] text-[#4B4B6B] hover:border-[#4F1964] px-3 py-1.5 rounded-md text-sm"
        >
          « Prev
        </button>
        <button
          type="button"
          @click="navigateNext"
          class="bg-white border border-[#E5E0EA] text-[#4B4B6B] hover:border-[#4F1964] px-3 py-1.5 rounded-md text-sm"
        >
          » Next
        </button>
        <button
          type="button"
          @click="router.push('/loans/all')"
          class="bg-white border border-[#E5E0EA] text-[#4B4B6B] hover:border-[#4F1964] px-3 py-1.5 rounded-md text-sm"
        >
          » All
        </button>
        <input
          v-model="goToLoanId"
          type="text"
          placeholder="Go to another loan #id"
          class="border border-[#E5E0EA] rounded-md px-3 py-1.5 text-sm w-48"
          @keyup.enter="goToLoan"
        />
        <button
          type="button"
          @click="goToLoan"
          class="bg-[#4F1964] text-white px-3 py-1.5 rounded-md"
        >
          <ArrowRight class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-[#E5E0EA] px-6">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        @click="activeTab = tab.key"
        class="flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-colors"
        :class="activeTab === tab.key 
          ? 'border-[#4F1964] text-[#4F1964] font-semibold' 
          : 'border-transparent text-[#4B4B6B] hover:text-[#4F1964]'"
      >
        <component :is="tab.icon" class="w-4 h-4" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="p-6">
      <!-- Loan Info Tab -->
      <div v-if="activeTab === 'loan-info'" class="flex gap-6 p-6 items-start">
        <!-- Left: Icon + Definition Table -->
        <div class="flex-1">
          <div class="flex gap-6">
            <!-- Icon Placeholder -->
            <div class="w-20 h-20 bg-[#F3F4F6] rounded-lg flex items-center justify-center shrink-0">
              <Info class="w-10 h-10 text-[#9CA3AF]" />
            </div>

            <!-- Definition Table -->
            <div class="flex-1">
              <!-- CODE -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-white rounded">
                <span class="w-56 shrink-0 text-sm text-[#4B4B6B]">CODE</span>
                <span class="flex-1 text-sm text-[#1A1A2E] font-mono font-medium">{{ loan.id }}</span>
              </div>

              <!-- Mpesa Code -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-[#F8F7FA] rounded">
                <span class="w-56 shrink-0 text-sm text-[#4B4B6B]">Mpesa Code</span>
                <span class="flex-1 text-sm text-[#1A1A2E] font-medium"></span>
              </div>

              <!-- Customer -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-white rounded">
                <span class="w-56 shrink-0 text-sm text-[#4B4B6B]">Customer</span>
                <div class="flex-1">
                  <div class="flex items-center gap-1 text-sm text-[#1A1A2E] font-medium">
                    {{ loan.customerName }}
                    <ExternalLink class="w-3 h-3 text-[#6B2385]" />
                  </div>
                  <div class="text-xs text-[#9CA3AF]">{{ loan.customerAccount }}</div>
                </div>
              </div>

              <!-- Mobile -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-[#F8F7FA] rounded">
                <span class="w-56 shrink-0 text-sm text-[#4B4B6B]">Mobile</span>
                <div class="flex-1">
                  <span class="text-sm text-[#4F1964] underline">{{ loan.phone }}</span>
                  <span class="text-[#9CA3AF]"> (Mpesa)</span>
                </div>
              </div>

              <!-- Principal -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-white rounded">
                <span class="w-56 shrink-0 text-sm text-[#4B4B6B]">Principal</span>
                <span class="flex-1 text-sm text-[#1A1A2E] font-bold text-base">{{ formatCurrency(loan.principal) }}</span>
              </div>

              <!-- AddOns -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-[#F8F7FA] rounded">
                <span class="w-56 shrink-0 text-sm text-[#4B4B6B]">AddOns</span>
                <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ formatCurrency(loan.addOns) }}</span>
              </div>

              <!-- Deductions -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-white rounded">
                <span class="w-56 shrink-0 text-sm text-[#4B4B6B]">Deductions</span>
                <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ formatCurrency(loan.deductions) }}</span>
              </div>

              <!-- Disbursed Amount -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-[#F8F7FA] rounded">
                <span class="w-56 shrink-0 text-sm text-[#4B4B6B]">Disbursed Amount</span>
                <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ formatCurrency(loan.disbursedAmount) }}</span>
              </div>

              <!-- Repayable Amount -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-white rounded">
                <span class="w-56 shrink-0 text-sm text-[#4B4B6B]">Repayable Amount</span>
                <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ formatCurrency(loan.repayableAmount) }}</span>
              </div>

              <!-- Repaid -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-[#F8F7FA] rounded">
                <span class="w-56 shrink-0 text-sm text-[#4B4B6B]">Repaid.</span>
                <span class="flex-1 text-sm text-[#166534] font-medium">{{ formatCurrency(loan.repaid) }}</span>
              </div>

              <!-- Balance -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-white rounded">
                <span class="w-56 shrink-0 text-sm text-[#4B4B6B]">Balance</span>
                <span class="flex-1 text-sm text-[#E8604A] font-bold text-base">{{ formatCurrency(loan.balance) }}</span>
              </div>

              <!-- Product -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-[#F8F7FA] rounded">
                <span class="w-56 shrink-0 text-sm text-[#4B4B6B]">Product</span>
                <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ loan.product }}</span>
              </div>

              <!-- Disbursed Date -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-white rounded">
                <span class="w-56 shrink-0 text-sm text-[#4B4B6B]">Disbursed Date</span>
                <div class="flex-1 flex items-center gap-2">
                  <span class="text-sm text-[#1A1A2E] font-medium">{{ loan.disbursedDate }}</span>
                  <span class="bg-[#6B2385] text-white text-[10px] px-2 py-0.5 rounded-sm font-bold">{{ loan.disbursedDateLabel }}</span>
                  <span class="text-xs text-[#6B2385]">{{ loan.disbursedTime }}</span>
                </div>
              </div>

              <!-- Due Date -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-[#F8F7FA] rounded">
                <span class="w-56 shrink-0 text-sm text-[#4B4B6B]">Due Date</span>
                <div class="flex-1 flex items-center gap-2">
                  <span class="text-sm text-[#1A1A2E] font-medium">{{ loan.dueDate }}</span>
                  <span 
                    class="px-2 py-0.5 rounded-sm text-white text-[10px] font-bold"
                    :class="loan.daysUntilDue < 0 ? 'bg-[#E8604A]' : 'bg-[#1A1A2E]'"
                  >
                    {{ loan.daysUntilDue < 0 ? 'OVERDUE' : `IN ${loan.daysUntilDue} DAYS` }}
                  </span>
                </div>
              </div>

              <!-- Last Repay Date -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-white rounded">
                <span class="w-56 shrink-0 text-sm text-[#4B4B6B]">Last Repay Date</span>
                <span class="flex-1 text-sm text-[#1A1A2E] font-medium"></span>
              </div>

              <!-- Cleared Date -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-[#F8F7FA] rounded">
                <span class="w-56 shrink-0 text-sm text-[#4B4B6B]">Cleared Date</span>
                <span class="flex-1 text-sm text-[#1A1A2E] font-medium"></span>
              </div>

              <!-- Next Repay Date -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-white rounded">
                <span class="w-56 shrink-0 text-sm text-[#4B4B6B]">Next Repay Date</span>
                <div class="flex-1 flex items-center gap-2">
                  <span class="text-sm text-[#1A1A2E] font-medium">{{ loan.nextRepayDate }}</span>
                  <span class="bg-[#F9DA82] text-[#1A1A2E] text-[10px] px-2 py-0.5 rounded-sm font-bold">{{ loan.nextRepayLabel }}</span>
                </div>
              </div>

              <!-- Current Instalment -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-[#F8F7FA] rounded">
                <span class="w-56 shrink-0 text-sm text-[#4B4B6B]">Current Instalment</span>
                <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ loan.currentInstalment }}</span>
              </div>

              <!-- Current Instalment Amount -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-white rounded">
                <span class="w-56 shrink-0 text-sm text-[#4B4B6B]">Current Instalment Amount</span>
                <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ formatCurrency(loan.currentInstalmentAmount) }}</span>
              </div>

              <!-- Current LO -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-[#F8F7FA] rounded">
                <span class="w-56 shrink-0 text-sm text-[#4B4B6B]">Current LO</span>
                <div class="flex-1 flex items-center gap-2">
                  <UserCircle class="w-5 h-5 text-[#6B2385]" />
                  <span class="text-sm text-[#1A1A2E] font-medium">{{ loan.currentLO }}</span>
                </div>
              </div>

              <!-- Current CO -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-white rounded">
                <span class="w-56 shrink-0 text-sm text-[#4B4B6B]">Current CO</span>
                <div class="flex-1 flex items-center gap-2">
                  <UserCircle class="w-5 h-5 text-[#6B2385]" />
                  <span class="text-sm text-[#1A1A2E] font-medium">{{ loan.currentCO }}</span>
                </div>
              </div>

              <!-- Current Collector -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-[#F8F7FA] rounded">
                <span class="w-56 shrink-0 text-sm text-[#4B4B6B]">Current Collector</span>
                <div class="flex-1 flex items-center gap-2">
                  <UserCircle class="w-5 h-5 text-[#6B2385]" />
                  <span class="text-sm text-[#1A1A2E] font-medium">(0)</span>
                </div>
              </div>

              <!-- Created By -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-white rounded">
                <span class="w-56 shrink-0 text-sm text-[#4B4B6B]">Created By</span>
                <div class="flex-1 flex items-center gap-2">
                  <UserCircle class="w-5 h-5 text-[#6B2385]" />
                  <span class="text-sm text-[#1A1A2E] font-medium">{{ loan.createdBy }} (0)</span>
                </div>
              </div>

              <!-- PENALTY_AMOUNT -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-[#F3F4F6] rounded">
                <span class="w-56 shrink-0 text-xs font-bold uppercase text-[#1A1A2E]">PENALTY_AMOUNT</span>
                <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ formatCurrency(loan.penaltyAmount) }}</span>
              </div>

              <!-- INTEREST_AMOUNT -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-[#F3F4F6] rounded">
                <span class="w-56 shrink-0 text-xs font-bold uppercase text-[#1A1A2E]">INTEREST_AMOUNT</span>
                <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ formatCurrency(loan.interestAmount) }}</span>
              </div>

              <!-- Stage -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-white rounded">
                <span class="w-56 shrink-0 text-sm text-[#4B4B6B]">Stage</span>
                <span class="flex-1 text-sm text-[#1A1A2E] font-medium">{{ loan.stage }}</span>
              </div>

              <!-- Status -->
              <div class="flex border-b border-[#F3F4F6] py-2.5 px-3 bg-[#F8F7FA] rounded">
                <span class="w-56 shrink-0 text-sm text-[#4B4B6B]">Status</span>
                <span 
                  class="px-3 py-0.5 rounded-sm text-white text-[10px] font-bold uppercase"
                  :class="{
                    'bg-[#2563EB]': loan.status === 'CREATED',
                    'bg-[#4F1964]': loan.status === 'DISBURSED',
                    'bg-[#E8604A]': loan.status === 'DEFAULTED'
                  }"
                >
                  {{ loan.status }}
                </span>
              </div>

              <!-- Flag Button -->
              <button
                type="button"
                @click="handleFlag"
                class="mt-4 bg-[#F9DA82] text-[#1A1A2E] px-4 py-2 rounded-md text-sm font-medium flex items-center gap-1"
              >
                <Flag class="w-4 h-4" />
                Flag
              </button>
            </div>
          </div>
        </div>

        <!-- Right Panel -->
        <div class="w-80 shrink-0">
          <!-- Loan Stages -->
          <div class="border border-[#E5E0EA] rounded-lg p-4 mb-4">
            <h3 class="text-base font-bold text-[#1A1A2E] mb-4">Loan Stages</h3>

            <!-- Stage 1 -->
            <div class="text-center">
              <div class="flex items-center justify-center">
                <span class="bg-[#166534] text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold inline mr-2">
                  1
                </span>
                <span class="text-[#166834] font-bold text-sm">Initiation</span>
                <span class="text-[#9CA3AF] text-xs ml-1">(Current)</span>
              </div>
              <div class="flex gap-2 mt-2 justify-center">
                <button
                  type="button"
                  @click="handleApprove"
                  class="bg-[#166534] hover:bg-[#14532D] text-white px-4 py-1.5 rounded-md text-sm flex items-center gap-1"
                >
                  <Check class="w-4 h-4" />
                  Approve
                </button>
                <button
                  type="button"
                  @click="handleReject"
                  class="bg-[#E8604A] hover:bg-[#DC2626] text-white px-4 py-1.5 rounded-md text-sm flex items-center gap-1"
                >
                  <X class="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>

            <!-- Divider -->
            <div class="flex items-center justify-center my-2">
              <ChevronDown class="w-5 h-5 text-[#9CA3AF]" />
            </div>

            <!-- Stage 2 -->
            <div class="text-center">
              <div class="flex items-center justify-center">
                <span class="bg-[#9CA3AF] text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold inline mr-2">
                  2
                </span>
                <span class="text-[#9CA3AF] text-sm">Branch Manager Approval</span>
              </div>
            </div>

            <!-- Divider -->
            <div class="flex items-center justify-center my-2">
              <ChevronDown class="w-5 h-5 text-[#9CA3AF]" />
            </div>

            <!-- Stage 3 -->
            <div class="text-center">
              <div class="flex items-center justify-center">
                <span class="bg-[#9CA3AF] text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold inline mr-2">
                  3
                </span>
                <span class="text-[#9CA3AF] text-sm">Final Approval</span>
                <Zap class="w-4 h-4 text-[#F9DA82] inline ml-1" />
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col gap-3">
            <button
              type="button"
              class="bg-[#F9DA82] hover:bg-[#F0C84A] text-[#1A1A2E] w-full py-2.5 rounded-md text-sm font-medium flex items-center justify-center gap-2"
            >
              <MessageSquare class="w-4 h-4" />
              Interactions
            </button>
            <button
              type="button"
              class="bg-[#6B2385] hover:bg-[#4F1964] text-white w-full py-2.5 rounded-md text-sm font-medium flex items-center justify-center gap-2"
            >
              <Plus class="w-4 h-4" />
              Add NPL Tag
            </button>
          </div>
        </div>
      </div>

      <!-- AddOns Tab -->
      <div v-else-if="activeTab === 'addons'" class="flex gap-6 p-6 items-start">
        <!-- Left: Icon Placeholder -->
        <div class="w-20 h-20 bg-[#F3F4F6] rounded-lg flex items-center justify-center shrink-0">
          <PlusCircle class="w-10 h-10 text-[#9CA3AF]" />
        </div>

        <!-- Right: Content -->
        <div class="flex-1">
          <!-- Section 1: APPLIED -->
          <div>
            <h3 class="text-sm font-bold text-[#1A1A2E] uppercase tracking-wider mb-3">APPLIED</h3>
            <table class="w-full">
              <thead>
                <tr>
                  <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2 border-b border-[#E5E0EA]">Name</th>
                  <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2 border-b border-[#E5E0EA]">Amount</th>
                  <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2 border-b border-[#E5E0EA]">Date Applied</th>
                  <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2 border-b border-[#E5E0EA]">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(addon, index) in loan.appliedAddons"
                  :key="index"
                  class="border-b border-[#F3F4F6] py-3"
                  :class="index % 2 === 0 ? 'bg-white' : 'bg-[#F8F7FA]'"
                >
                  <td class="text-sm text-[#1A1A2E] py-3">{{ addon.name }}</td>
                  <td class="text-sm text-[#1A1A2E] font-medium py-3">{{ formatCurrency(addon.amount) }}</td>
                  <td class="py-3">
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-[#4B4B6B]">{{ addon.dateApplied }} {{ addon.timeApplied }}</span>
                      <span
                        v-if="addon.dateLabel === 'TODAY'"
                        class="bg-[#6B2385] text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
                      >
                        {{ addon.dateLabel }}
                      </span>
                      <span
                        v-else-if="addon.dateLabel === 'YESTERDAY'"
                        class="bg-gradient-to-r from-[#4F1964] to-[#6B2385] text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
                      >
                        {{ addon.dateLabel }}
                      </span>
                    </div>
                  </td>
                  <td class="py-3">
                    <button type="button" class="text-[#F9DA82] hover:text-[#F0C84A] cursor-pointer">
                      <Edit2 class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="mt-3">
              <span class="text-sm text-[#4B4B6B]">Total: </span>
              <span class="text-sm font-bold text-[#1A1A2E]">{{ formatCurrency(appliedAddonsTotal) }}</span>
            </div>
          </div>

          <!-- Section 2: NOT APPLIED -->
          <div class="mt-8">
            <h3 class="text-sm font-bold text-[#1A1A2E] uppercase tracking-wider mb-1">NOT APPLIED</h3>
            <div class="flex items-center gap-1 mb-3">
              <Info class="w-4 h-4 text-[#F9DA82]" />
              <span class="text-sm text-[#F9DA82] font-medium">Most AddOns are Applied automatically. Add them manually if they were missed</span>
            </div>
            <table class="w-full">
              <tbody>
                <tr
                  v-for="(addon, index) in loan.notAppliedAddons"
                  :key="index"
                  class="border-b border-[#F3F4F6] py-3"
                  :class="index % 2 === 0 ? 'bg-white' : 'bg-[#F8F7FA]'"
                >
                  <td class="text-sm text-[#1A1A2E] py-3 w-1/4">{{ addon.name }}</td>
                  <td class="text-sm text-[#1A1A2E] font-medium py-3 w-1/4">{{ formatCurrency(addon.amount) }}</td>
                  <td class="py-3 w-1/4">
                    <div v-if="addon.status === 'Not Added'" class="flex items-center gap-1">
                      <X class="w-3 h-3 text-[#E8604A]" />
                      <span class="text-[#E8604A] text-sm">Not Added</span>
                    </div>
                    <div v-else class="flex items-center gap-1">
                      <Check class="w-3 h-3 text-[#166534]" />
                      <span class="text-[#166534] text-sm">Added</span>
                    </div>
                  </td>
                  <td class="py-3 w-1/4">
                    <button
                      v-if="addon.status === 'Not Added'"
                      type="button"
                      @click="handleAddAddon(addon.name)"
                      class="bg-[#166534] hover:bg-[#14532D] text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1"
                    >
                      <Plus class="w-3 h-3" />
                      Add
                    </button>
                    <button
                      v-else
                      type="button"
                      @click="handleRemoveAddon(addon.name)"
                      class="bg-[#E8604A] hover:bg-[#DC2626] text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1"
                    >
                      <Minus class="w-3 h-3" />
                      Remove
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Deductions Tab -->
      <div v-else-if="activeTab === 'deductions'" class="flex gap-6 p-6 items-start">
        <!-- Left: Icon Placeholder -->
        <div class="w-20 h-20 bg-[#F3F4F6] rounded-lg flex items-center justify-center shrink-0">
          <MinusCircle class="w-10 h-10 text-[#9CA3AF]" />
        </div>

        <!-- Right: Content -->
        <div class="flex-1">
          <!-- Section 1: APPLIED -->
          <div>
            <h3 class="text-sm font-bold text-[#1A1A2E] uppercase tracking-wider mb-3">APPLIED</h3>
            <table class="w-full">
              <thead>
                <tr>
                  <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2 border-b border-[#E5E0EA]">Name</th>
                  <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2 border-b border-[#E5E0EA]">Amount</th>
                  <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2 border-b border-[#E5E0EA]">Date Applied</th>
                  <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2 border-b border-[#E5E0EA]">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loan.appliedDeductions.length === 0">
                  <td colspan="4" class="text-sm text-[#9CA3AF] py-3">No applied deductions</td>
                </tr>
              </tbody>
            </table>
            <div class="mt-3">
              <span class="text-sm text-[#4B4B6B]">Total: </span>
              <span class="text-sm font-bold text-[#1A1A2E]">Ksh 0.00</span>
            </div>
          </div>

          <!-- Section 2: NOT APPLIED -->
          <div class="mt-8">
            <h3 class="text-sm font-bold text-[#1A1A2E] uppercase tracking-wider mb-1">NOT APPLIED</h3>
            <div class="flex items-center gap-1 mb-3">
              <Info class="w-4 h-4 text-[#F9DA82]" />
              <span class="text-sm text-[#F9DA82] font-medium">Most Deductions are Applied automatically. Add them manually if they were missed</span>
            </div>
            <div class="border border-[#E5E0EA] rounded-md px-4 py-3 bg-white text-[#9CA3AF] text-sm">
              No Additional Deductions specified in settings
            </div>
          </div>
        </div>
      </div>

      <!-- Pay Schedule Tab -->
      <div v-else-if="activeTab === 'pay-schedule'" class="flex gap-6 p-6 items-start">
        <!-- Left: Icon Placeholder -->
        <div class="w-20 h-20 bg-[#F3F4F6] rounded-lg flex items-center justify-center shrink-0">
          <Calendar class="w-10 h-10 text-[#9CA3AF]" />
        </div>

        <!-- Right: Content -->
        <div class="flex-1">
          <div class="flex justify-end mb-4">
            <button
              type="button"
              @click="window.print()"
              class="bg-white border border-[#E5E0EA] text-[#4B4B6B] hover:border-[#4F1964] px-4 py-2 rounded-md text-sm flex items-center gap-2"
            >
              <Printer class="w-4 h-4" />
              Print Schedule
            </button>
          </div>
          <table class="w-full">
            <thead>
              <tr>
                <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2 border-b border-[#E5E0EA]">Date</th>
                <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2 border-b border-[#E5E0EA]">Amount</th>
                <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2 border-b border-[#E5E0EA]">Balance</th>
                <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2 border-b border-[#E5E0EA]">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in loan.paySchedule"
                :key="index"
                class="border-b border-[#F3F4F6] py-3"
                :class="index % 2 === 0 ? 'bg-white' : 'bg-[#F8F7FA]'"
              >
                <td class="text-sm text-[#4B4B6B] py-3">{{ row.date }}</td>
                <td class="text-sm text-[#1A1A2E] font-medium py-3">{{ formatCurrency(row.amount) }}</td>
                <td class="text-sm text-[#1A1A2E] py-3">{{ formatCurrency(row.balance) }}</td>
                <td class="py-3">
                  <div v-if="row.status === 'Repaid'" class="flex items-center gap-1">
                    <Check class="w-3 h-3 text-[#166534]" />
                    <span class="text-[#166534] text-sm font-medium">Repaid</span>
                  </div>
                  <div v-else class="flex items-center gap-1">
                    <X class="w-3 h-3 text-[#E8604A]" />
                    <span class="text-[#E8604A] text-sm font-medium">Unpaid</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Collateral Tab -->
      <div v-else-if="activeTab === 'collateral'" class="flex gap-6 p-6 items-start">
        <!-- Left: Icon Placeholder -->
        <div class="w-20 h-20 bg-[#F3F4F6] rounded-lg flex items-center justify-center shrink-0">
          <Car class="w-10 h-10 text-[#9CA3AF]" />
        </div>

        <!-- Right: Content -->
        <div class="flex-1">
          <div class="flex justify-end mb-4">
            <button
              type="button"
              @click="console.log('add collateral')"
              class="bg-[#4F1964] hover:bg-[#380F47] text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
            >
              <Edit2 class="w-4 h-4" />
              Add/Edit Collateral
            </button>
          </div>
          <table class="w-full">
            <thead>
              <tr>
                <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2 border-b border-[#E5E0EA]">Name</th>
                <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2 border-b border-[#E5E0EA]">Type</th>
                <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2 border-b border-[#E5E0EA]">Status</th>
                <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2 border-b border-[#E5E0EA]">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(col, index) in loan.loanCollateral"
                :key="index"
                class="border-b border-[#F3F4F6] py-3"
                :class="index % 2 === 0 ? 'bg-white' : 'bg-[#F8F7FA]'"
              >
                <td class="text-sm text-[#1A1A2E] py-3">{{ col.name }}</td>
                <td class="text-sm text-[#4B4B6B] py-3">{{ col.type }}</td>
                <td class="py-3">
                  <div class="flex items-center gap-1">
                    <Info class="w-3 h-3 text-[#F9DA82]" />
                    <span class="text-[#F9DA82] text-sm">Not Used</span>
                  </div>
                </td>
                <td class="py-3">
                  <button
                    type="button"
                    @click="console.log('apply', col.name)"
                    class="bg-[#166534] hover:bg-[#14532D] text-white px-4 py-1.5 rounded-md text-sm flex items-center gap-1"
                  >
                    <Check class="w-3 h-3" />
                    Apply
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Repayments Tab -->
      <div v-else-if="activeTab === 'repayments'" class="flex gap-6 p-6 items-start">
        <!-- Left: Icon Placeholder -->
        <div class="w-20 h-20 bg-[#F3F4F6] rounded-lg flex items-center justify-center shrink-0">
          <Download class="w-10 h-10 text-[#9CA3AF]" />
        </div>

        <!-- Right: Content -->
        <div class="flex-1">
          <div class="flex justify-end mb-4">
            <button
              type="button"
              @click="console.log('record payment')"
              class="bg-[#4F1964] hover:bg-[#380F47] text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
            >
              <Plus class="w-4 h-4" />
              + Record Payment
            </button>
          </div>
          <table class="w-full">
            <thead>
              <tr>
                <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2 border-b border-[#E5E0EA]">ID</th>
                <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2 border-b border-[#E5E0EA]">Transaction Code</th>
                <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2 border-b border-[#E5E0EA]">Amount</th>
                <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2 border-b border-[#E5E0EA]">Date Repaid</th>
                <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2 border-b border-[#E5E0EA]">Payer Details</th>
                <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2 border-b border-[#E5E0EA]">Payment Method</th>
                <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2 border-b border-[#E5E0EA]">Status</th>
                <th class="text-left text-[#4F1964] text-xs font-semibold uppercase tracking-wider pb-2 border-b border-[#E5E0EA]">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(rep, index) in loan.repayments"
                :key="index"
                class="border-b border-[#F3F4F6] py-3"
                :class="index % 2 === 0 ? 'bg-white' : 'bg-[#F8F7FA]'"
              >
                <td class="font-mono text-xs text-[#4B4B6B] py-3">{{ rep.id }}</td>
                <td class="font-mono text-xs text-[#1A1A2E] py-3">{{ rep.transactionCode }}</td>
                <td class="text-sm font-medium text-[#1A1A2E] py-3">{{ formatCurrency(rep.amount) }}</td>
                <td class="py-3">
                  <div class="text-xs text-[#4B4B6B]">{{ rep.dateRepaid }}</div>
                  <span class="mt-1 inline-block bg-[#6B2385] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {{ rep.dateLabel }}
                  </span>
                </td>
                <td class="py-3">
                  <div class="text-sm text-[#1A1A2E] font-medium">{{ rep.payerName }}</div>
                  <div class="text-xs text-[#9CA3AF]">{{ rep.payerPhone }}</div>
                </td>
                <td class="text-sm text-[#4B4B6B] py-3">{{ rep.paymentMethod }}</td>
                <td class="py-3">
                  <div class="flex items-center gap-1">
                    <Check class="w-3 h-3 text-[#166534]" />
                    <span class="text-[#166534] text-sm font-medium">Added</span>
                  </div>
                </td>
                <td class="py-3">
                  <button type="button" class="text-[#4F1964] cursor-pointer">
                    <Eye class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="mt-3">
            <span class="text-sm text-[#4B4B6B]">Total: </span>
            <span class="text-sm font-bold text-[#1A1A2E]">{{ formatCurrency(loan.repayments.reduce((sum, r) => sum + r.amount, 0)) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Not Found -->
  <div v-else class="min-h-screen flex flex-col items-center justify-center">
    <p class="text-[#9CA3AF] text-lg mb-4">Loan not found</p>
    <button
      type="button"
      @click="router.push('/loans/all')"
      class="bg-[#4F1964] text-white px-4 py-2 rounded-md text-sm font-medium"
    >
      Back to Loans
    </button>
  </div>
</template>