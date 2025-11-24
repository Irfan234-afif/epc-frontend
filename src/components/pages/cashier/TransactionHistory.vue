<template>
  <div class="min-h-screen bg-white flex">
    <!-- Left Sidebar -->
    <div class="bg-[#f8f8f8] w-[322px] rounded-bl-[10px] rounded-br-[10px] shadow-[0px_0px_20px_10px_rgba(0,0,0,0.1)] flex flex-col sticky top-0 h-screen">
      <!-- Showroom Name -->
      <div class="px-8 pt-8 pb-4">
        <h2 class="font-semibold text-[16px] text-[#151515] text-center">
          {{ showroomName }}
        </h2>
      </div>

      <!-- Month/Year Selector -->
      <div class="px-8 mb-6">
        <div class="bg-[rgba(255,255,255,0.4)] h-[45px] rounded-[5px] shadow-[0px_0px_6.1px_0px_rgba(0,0,0,0.15)] flex items-center justify-between px-4">
          <p class="font-medium text-[16px] text-[#151515]">
            {{ formattedMonthYear }}
          </p>
          <button 
            @click="showMonthPicker = true"
            class="font-bold text-[12px] text-primary"
          >
            Change
          </button>
        </div>
      </div>

      <!-- Total Transactions -->
      <div class="px-8 mb-4">
        <p class="font-semibold text-[12px] text-[#151515] mb-2">Total Transactions</p>
        <p class="font-bold text-[24px] text-primary">
          {{ formatIDR(totalAmount) }}
        </p>
      </div>

      <div class="px-8 mb-6">
        <p class="font-semibold text-[12px] text-[#151515] mb-4">Show Transactions by:</p>
        <div class="grid grid-cols-2 gap-2">
            <button 
                v-for="value in transactionCountByEPCType" :key="value.name" 
                @click="selectedFilter = value.name; loadTransactions();"
                :class="[
                    'h-[92px] rounded-[10px] border-[0.5px] border-black border-solid flex flex-col items-center justify-center',
                    selectedFilter === value.name 
                        ? 'bg-[#212121]' 
                        : 'bg-[#f8f8f8]'
                ]"
            >
                <p :class="[
                'font-bold text-[24px]',
                selectedFilter === value.name ? 'text-primary' : 'text-primary'
                ]">
                {{ value.count }}
                </p>
                <p :class="[
                'font-normal text-[10px] text-center',
                selectedFilter === value.name ? 'text-white' : 'text-[#151515]'
                ]">
                <span class="block">{{ value.name }}</span>
                <span class="block">TRANSACTIONS</span>
                </p>
            </button>
        </div>
      </div>

      <!-- Show Transactions by -->


      <!-- Sign Out Button -->
      <div class="px-8 mt-auto mb-8">
        <button
          @click="handleSignOut"
          class="bg-[rgba(255,255,255,0.4)] h-[45px] rounded-[5px] shadow-[0px_0px_6.1px_0px_rgba(0,0,0,0.15)] w-full flex items-center justify-center"
        >
          <p class="font-semibold text-[16px] text-primary">Sign Out</p>
        </button>
      </div>
    </div>

    <!-- Right Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <div class="px-8 pt-8 pb-4 flex items-center justify-between">
        <h1 class="font-semibold text-[16px] text-[#151515]">Transaction History</h1>
        
        <!-- Search Bar -->
        <div class="relative">
          <div class="bg-[rgba(255,255,255,0.4)] h-[45px] rounded-[5px] shadow-[0px_0px_6.1px_0px_rgba(0,0,0,0.15)] w-[261px] flex items-center px-4">
            <svg 
              class="w-6 h-6 text-[#cb8a2e] mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by ID, Name, or Amount"
              class="flex-1 bg-transparent outline-none text-[12px] text-[#cb8a2e] placeholder:text-[#cb8a2e]"
            />
          </div>
        </div>
      </div>

      <!-- Table Header -->
      <div class="px-8 pb-2">
        <div class="bg-white h-[50px] rounded-[10px] flex items-center">
          <div class="flex-1 text-center">
            <p class="font-semibold text-[12px] text-[#212121]">Transaction Date/Time</p>
          </div>
          <div class="flex-1 text-center">
            <p class="font-semibold text-[12px] text-[#212121]">Employee Name</p>
          </div>
          <div class="flex-1 text-center">
            <p class="font-semibold text-[12px] text-[#212121]">EPC Class</p>
          </div>
          <div class="flex-1 text-center">
            <p class="font-semibold text-[12px] text-[#212121]">EPC Used</p>
          </div>
        </div>
      </div>

      <!-- Transaction List -->
      <div class="flex-1 overflow-y-auto px-8 pb-8">
        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-2">
          <div 
            v-for="i in 5" 
            :key="i"
            class="bg-[#f8f8f8] h-[50px] rounded-[10px] animate-pulse"
          ></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="transactions.length === 0" class="py-8 text-center">
          <p class="text-[#9f9f9f] text-[14px]">No transactions found</p>
        </div>

        <!-- Transaction Items -->
        <div v-else class="space-y-2">
          <div
            v-for="transaction in transactions"
            :key="transaction.name"
            class="bg-[#f8f8f8] h-[50px] rounded-[10px] flex items-center"
          >
            <div class="flex-1 text-center">
              <p class="font-medium text-[12px] text-[#212121]">
                {{ formatTransactionDateTime(transaction.date, transaction.posting_time) }}
              </p>
            </div>
            <div class="flex-1 text-center">
              <p class="font-medium text-[12px] text-[#212121]">
                {{ transaction.employee_name }}
              </p>
            </div>
            <div class="flex-1 text-center">
              <p class="font-medium text-[12px] text-[#212121]">
                {{ getEPCClass(transaction) }}
              </p>
            </div>
            <div class="flex-1 text-center">
              <p class="font-bold text-[12px] text-[#212121]">
                {{ formatIDR(transaction.total_amount) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Month Picker Modal -->
    <Modal
      :show="showMonthPicker"
      :maxWidth="'md'"
      @close="showMonthPicker = false"
    >
      <template v-slot="{ propertyModal }">
        <MonthPicker
          v-model="selectedDate"
          @done="handleMonthChange"
        />
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/components/lib/auth';
import { listTransactionHistoryByShowroom } from '@/components/lib/transaction';
import { TransactionHistoryResponse, TransactionListItem, TransactionCountByEPCType } from '@/components/lib/types';
import Modal from '@/components/ui/modal/Modal.vue';
import MonthPicker from '@/components/pages/purchase_history/MonthPicker.vue';

const router = useRouter();
const { state, logout } = useAuth();

// State
const isLoading = ref(false);
const transactions = ref<TransactionListItem[]>([]);
const transactionCountByEPCType = ref<TransactionCountByEPCType[]>([]);
const selectedFilter = ref<string | null>('All');
const searchQuery = ref('');
const showMonthPicker = ref(false);
const selectedDate = ref({
  month: new Date().getMonth(),
  year: new Date().getFullYear()
});

// Computed
const showroomName = computed(() => {
  return state.showroom?.showroom_name || 'Showroom';
});

const formattedMonthYear = computed(() => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${months[selectedDate.value.month]} - ${selectedDate.value.year}`;
});

const totalTransactionCount = computed(() => {
    const item = transactionCountByEPCType.value.find(item => item.name.toLowerCase().includes('all'));
  return item?.count || 0;
});

const employeeCardCount = computed(() => {
  const item = transactionCountByEPCType.value.find(item => 
    item.name.toLowerCase().includes('employee') || 
    item.name.toLowerCase().includes('707')
  );
  return item?.count || 0;
});

const relationsCardCount = computed(() => {
  const item = transactionCountByEPCType.value.find(item => 
    item.name.toLowerCase().includes('relation')
  );
  return item?.count || 0;
});

const partnersCardCount = computed(() => {
  const item = transactionCountByEPCType.value.find(item => 
    item.name.toLowerCase().includes('partner')
  );
  return item?.count || 0;
});

const totalAmount = computed(() => {
  return transactions.value.reduce((sum, t) => sum + t.total_amount, 0);
});

// const filteredTransactions = computed(() => {
//     return transactions.value;
// });

// Methods
async function loadTransactions() {
  if (!state.showroom?.name) {
    console.error('Showroom not found');
    return;
  }

  isLoading.value = true;
  try {
    const response = await listTransactionHistoryByShowroom(state.showroom.name, selectedDate.value.year, selectedDate.value.month + 1, selectedFilter.value);
    if (response) {
      transactions.value = response.transactions || [];
      transactionCountByEPCType.value = response.transaction_count_by_epc_type || [];
    }
  } catch (error) {
    console.error('Failed to load transactions:', error);
    transactions.value = [];
    transactionCountByEPCType.value = [];
  } finally {
    isLoading.value = false;
  }
}

function formatIDR(amount: number): string {
  const formatted = Math.abs(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `IDR ${formatted}`;
}

function formatTransactionDateTime(dateString: string, timeString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  const time = timeString ? timeString.substring(0, 5) : '';
  
  return `${dayName}, ${day} ${month} ${year} | ${time}`;
}

function getEPCClass(transaction: TransactionListItem): string {
  return transaction.epc_type || 'EMPLOYEE CARD';
}

function handleMonthChange() {
  showMonthPicker.value = false;
  // Transactions are already filtered by month in computed property
}

function handleSignOut() {
  logout();
  router.push('/login');
}

// Lifecycle
onMounted(() => {
  loadTransactions();
});

// Watch for date changes to reload if needed
watch([() => selectedDate.value.month, () => selectedDate.value.year], () => {
  // Transactions are filtered by date in computed property, no need to reload
});
</script>

