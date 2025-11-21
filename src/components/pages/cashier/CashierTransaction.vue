<template>
  <div class="min-h-screen bg-white">
    <div class="mx-auto grid grid-cols-1 lg:grid-cols-[40%_1fr] gap-6 lg:gap-8 h-full">
      <!-- Left Panel: Employee Card -->
      <div class="bg-white rounded-2xl p-6 lg:p-8 h-full flex flex-col justify-center">
        <!-- Employee Info -->
        <div class="flex items-start gap-4 mb-6 lg:mb-8 pb-6 lg:pb-8 border-b border-gray-200">
          <!-- Profile Picture -->
          <div class="w-[114px] h-[113px] rounded-full flex-shrink-0 overflow-hidden">
            <img 
              v-if="employeeData?.employee_info && (employeeData.employee_info as any).profile_picture" 
              :src="(employeeData.employee_info as any).profile_picture" 
              :alt="employeeData.employee_info.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
              <svg class="w-12 h-12 lg:w-16 lg:h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          
          <!-- Employee Details -->
          <div class="flex-1 h-full flex flex-col justify-center">
            <h2 class="text-[20px] font-bold text-[#151515] mb-1 leading-tight">
              <div>{{ employeeData?.employee_info.name }}</div>
            </h2>
            <p class="text-[12px] font-normal text-[#151515] mb-1">{{ employeeData?.employee_info.designation || 'Staff' }}{{ employeeData?.employee_info.department ? ' - ' + employeeData.employee_info.department : '' }}</p>
            <p class="text-[10px] font-normal text-[#151515] mb-3">Joined since {{ employeeData ? formatDate(employeeData.employee_info.date_of_joining) : '' }}</p>
          </div>
        </div>

        <!-- Card Badges -->
        <div class="flex justify-center items-center gap-0 mb-6 lg:mb-8 bg-[#F8F8F8] rounded-lg p-5">
          <div class="w-full text-center">
            <span class="text-[14px] font-semibold text-[#151515]">EMPLOYEE CARD</span>
          </div>
          <div class="h-[17px] w-[1px] bg-gray-300 mx-1"></div>
          <div class="w-full text-center">
            <span class="text-[14px] font-semibold text-[#151515]">{{ employeeData?.card_info.discount_percentage }}% DISCOUNT</span>
          </div>
        </div>

        <!-- Balance Section -->
        <div class="p-4 lg:p-6">
          <p class="text-[14px] font-normal text-[#151515] mb-2">{{ transactionSuccess ? 'Updated Remaining Balance' : 'Current Remaining Balance' }}</p>
          <p class="text-[35px] font-bold mb-3 text-neutral-700" style="color: #cb8a2e;">{{ formatCurrency(updatedBalance) }}</p>
          <div class="h-[3px] bg-[#efeeec] rounded-full overflow-hidden mb-2">
            <div class="h-full transition-all duration-300 bg-[#cb8a2e]" :style="{ width: balancePercentage + '%' }"></div>
          </div>
          <p class="text-[12px] font-normal text-[#212121]">The balance resets on the 1<sup class="text-[7.74px]">st</sup> of every month.</p>
        </div>
      </div>

      <!-- Right Panel: Transaction Input / Success State -->
      <div class="bg-[#f8f8f8] p-6 lg:p-8 shadow-[0px_0px_20px_10px_rgba(0,0,0,0.1)] flex flex-col justify-center">
        <!-- Success State: Transaction Details -->
        <template v-if="transactionSuccess && transactionData">
          <!-- Transaction Details Header -->
          <div class="mb-6">
            <h3 class="text-[14px] font-bold text-[#151515] mb-6">Transaction Details</h3>
            
            <!-- Transaction Date/Time -->
            <div class="flex justify-between items-center mb-4">
              <p class="text-[14px] font-normal text-[#151515]">Transaction Date/Time</p>
              <p class="text-[14px] font-semibold text-[#151515]">{{ transactionDate }}</p>
            </div>

            <!-- Total Transaction Amount -->
            <div class="flex justify-between items-center mb-4">
              <p class="text-[14px] font-normal text-[#151515]">Total Transaction Amount</p>
              <p class="text-[14px] font-semibold text-[#151515]">{{ formatCurrency(transactionData.amount) }}</p>
            </div>

            <!-- Calculated Discount -->
            <div class="flex justify-between items-center mb-4">
              <p class="text-[14px] font-normal text-[#151515]">Calculated Discount [ {{ employeeData?.card_info.discount_percentage }}% ]</p>
              <p class="text-[14px] font-semibold text-[#151515]">{{ formatCurrency(transactionDiscountAmount) }}</p>
            </div>

            <!-- Net Amount Deducted -->
            <div class="flex justify-between items-center mb-4">
              <p class="text-[14px] font-normal text-[#151515]">Net Amount Deducted</p>
              <p class="text-[14px] font-semibold text-[#151515]" style="color: #cb8a2e;">{{ formatCurrency(transactionNetAmount) }}</p>
            </div>
          </div>

          <!-- Transaction ID -->
          <div class="mb-4">
            <div class="flex items-center gap-2 mb-2">
              <p class="text-[14px] font-normal text-[#151515]">Transaction ID</p>
              <button
                @click="copyTransactionId"
                class="p-1 hover:bg-gray-200 rounded transition-colors"
                :title="copiedTransactionId ? 'Copied!' : 'Copy Transaction ID'"
              >
                <svg class="w-5 h-5 text-[#151515]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </button>
            </div>
            <div class="bg-[#f8f8f8] rounded-[10px] shadow-[0px_0px_7.6px_0px_rgba(0,0,0,0.1)] px-4 py-3 min-h-[50px] flex items-center">
              <p class="text-[24px] font-bold flex-1 text-center" style="color: #cb8a2e;">{{ transactionData.transaction_id }}</p>
            </div>
          </div>

          <!-- Note -->
          <p class="text-[14px] font-normal text-[#151515] mb-4 leading-[24px]">
            If the internal ID fails to generate, please input the Payment ID from the Main POS below.
          </p>

          <!-- Payment ID Input -->
          <div class="mb-6">
            <div class="bg-[#f8f8f8] rounded-[10px] shadow-[0px_0px_7.6px_0px_rgba(0,0,0,0.1)] px-4 py-3 min-h-[50px]">
              <input
                v-model="paymentId"
                type="text"
                placeholder="Enter Payment ID"
                class="w-full border-none bg-transparent text-[24px] font-bold text-[#151515] outline-none placeholder:opacity-20 placeholder:text-black"
              />
            </div>
          </div>

          <!-- Finish Button -->
          <button
            @click="handleFinish"
            class="w-full py-3 bg-[#212121] border-[0.5px] border-black text-white text-[14px] font-medium rounded-[5px] transition-all hover:bg-black"
          >
            Finish
          </button>
        </template>

        <!-- Normal State: Transaction Input -->
        <template v-else>
          <!-- Session Timer -->
          <div class="mb-6 lg:mb-8">
            <div class="border-[0.5px] border-black rounded-[10px] p-4 lg:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 lg:gap-4 mb-2 min-h-[70px]">
              <div class="text-[35px] font-bold text-neutral-700">{{ formattedTimer }}</div>
              <p class="text-[10px] font-normal text-[#151515] leading-[14px] max-w-xs">
                Session expires in {{ Math.ceil(remainingSeconds / 60) }} minutes. Transaction will be cancelled automatically.
              </p>
            </div>
          </div>

          <!-- Transaction Fields - Horizontal Layout -->
          <div class="grid grid-cols-1 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <!-- POS Amount Input -->
            <div>
              <label class="block text-[14px] font-normal text-[#151515] mb-2">Input POS Final Transaction Amount</label>
              <div class="flex items-center gap-2 lg:gap-4 px-4 lg:px-6 py-3 lg:py-4 bg-[#f8f8f8] rounded-[10px] shadow-[0px_0px_7.6px_0px_rgba(0,0,0,0.1)] min-h-[50px] lg:min-h-[70px]">
                <span class="text-[24px] font-bold text-neutral-700 min-w-[50px] lg:min-w-[60px]">IDR</span>
                <input 
                  v-model="posAmountDisplay" 
                  type="text" 
                  class="flex-1 border-none bg-transparent text-[24px] font-bold text-neutral-700 text-right outline-none placeholder-gray-300"
                  placeholder="0"
                  @input="handlePosAmountInput"
                  @blur="handlePosAmountBlur"
                />
              </div>
            </div>

            <!-- Calculated Discount -->
            <div>
              <label class="block text-[14px] font-normal text-[#151515] mb-2">Calculated Benefits Discount</label>
              <div class="flex items-center gap-2 lg:gap-4 px-4 lg:px-6 py-3 lg:py-4 bg-[#f8f8f8] rounded-[10px] shadow-[0px_0px_7.6px_0px_rgba(0,0,0,0.1)] min-h-[50px] lg:min-h-[70px]">
                <span class="text-[24px] font-bold text-neutral-700 min-w-[50px] lg:min-w-[60px]">IDR</span>
                <span class="flex-1 text-[24px] font-bold text-neutral-700 text-right">{{ formatNumber(calculatedDiscount) }}</span>
              </div>
            </div>

            <!-- Net Amount -->
            <div>
              <label class="block text-[14px] font-normal text-[#151515] mb-2">Net Amount Deducted from EPC</label>
              <div class="flex items-center gap-2 lg:gap-4 px-4 lg:px-6 py-3 lg:py-4 bg-[#f8f8f8] rounded-[10px] min-h-[50px] lg:min-h-[70px]" style="border: 1px solid #cb8a2e;">
                <span class="text-[24px] font-bold min-w-[50px] lg:min-w-[60px]" style="color: #cb8a2e;">IDR</span>
                <span class="flex-1 text-[24px] font-bold text-right" style="color: #cb8a2e;">{{ formatNumber(netDeducted) }}</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3 lg:space-y-4">
            <button 
              @click="handleProceed" 
              :disabled="!posAmount || isProcessing"
              class="w-full py-3 lg:py-4 bg-[#212121] text-white text-[14px] font-medium rounded-[5px] transition-all hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!isProcessing">Proceed</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            </button>
            <button 
              @click="handleDismiss"
              :disabled="isProcessing"
              class="w-full py-3 lg:py-4 bg-transparent text-neutral-700 text-[14px] font-medium rounded-lg border border-transparent transition-colors hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Dismiss Payment Process
            </button>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-600 text-sm">
            <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <span>{{ errorMessage }}</span>
          </div>
        </template>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <Modal
      :show="showConfirmModal"
      :maxWidth="'md'"
      :closeable="!isProcessing"
      @close="showConfirmModal = false"
    >
      <div class="bg-[#f8f8f8] p-8 rounded-lg min-h-[311px] ">
        <!-- Title -->
        <h3 class="text-[20px] font-bold text-[#333333] text-center mb-4 leading-[28px]">
          The Employee's limit will be deducted by 
          <span style="color: #cb8a2e;">IDR {{ formatNumber(netDeducted) }}</span>. 
          Confirm transaction?
        </h3>
        
        <!-- Subtitle -->
        <p class="text-[14px] font-normal text-black text-center mb-8 leading-[24px]">
          Please verify the amount. This action cannot be undone.
        </p>

        <!-- Buttons -->
        <div class="flex flex-col gap-3">
          <button
            @click="confirmProceed"
            :disabled="isProcessing"
            class="w-full py-3 bg-[#212121] border-[0.5px] border-black text-white text-[14px] font-medium rounded-[5px] transition-all hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isProcessing">Proceed</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          </button>
          
          <button
            @click="showConfirmModal = false"
            :disabled="isProcessing"
            class="w-full py-3 bg-transparent border-[0.5px] border-black text-black text-[14px] font-medium rounded-[5px] transition-colors hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Re-check
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import Modal from '@/components/ui/modal/Modal.vue';
import { processTransaction, submitPaymentID } from '@/components/lib/transaction';
import { QRValidationResponse, TransactionResponse } from '@/components/lib/types';
import { useAuth } from '@/components/lib/auth';

const router = useRouter();
const { state } = useAuth();

// Session Storage Keys
const SESSION_KEYS = {
  EMPLOYEE_DATA: 'cashier_employee_data',
  QR_VALUE: 'cashier_qr_value',
  POS_AMOUNT: 'cashier_pos_amount',
  REMAINING_SECONDS: 'cashier_remaining_seconds',
  TIMER_START: 'cashier_timer_start',
  SHOWROOM: 'cashier_showroom'
};

// State
const employeeData = ref<QRValidationResponse | null>(null);
const qrValue = ref('');
const posAmount = ref<number | null>(null);
const posAmountDisplay = ref<string>('');
const calculatedDiscount = ref(0);
const netDeducted = ref(0);
const remainingSeconds = ref(180);
const isProcessing = ref(false);
const errorMessage = ref('');
const showConfirmModal = ref(false);
const transactionSuccess = ref(false);
const transactionData = ref<TransactionResponse | null>(null);
const paymentId = ref('');
const copiedTransactionId = ref(false);

let timerInterval: number | null = null;

// Computed
const balancePercentage = computed(() => {
  if (!employeeData.value) return 0;
  const { current_limit } = employeeData.value.card_info;
  // Use to_balance if transaction success, otherwise use current_balance
  const balance = transactionSuccess.value && transactionData.value 
    ? transactionData.value.to_balance 
    : employeeData.value.card_info.current_balance;
  return (balance / current_limit) * 100;
});

const updatedBalance = computed(() => {
  if (transactionSuccess.value && transactionData.value) {
    return transactionData.value.to_balance;
  }
  return employeeData.value?.card_info.current_balance ?? 0;
});

const transactionDate = computed(() => {
  const now = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = dayNames[now.getDay()];
  const date = now.getDate();
  const month = monthNames[now.getMonth()];
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${day}, ${date} ${month} ${year} | ${hours}:${minutes}`;
});

const transactionDiscountAmount = computed(() => {
  if (!transactionData.value || !employeeData.value) return 0;
  const discountPercentage = employeeData.value.card_info.discount_percentage;
  return Math.round(transactionData.value.amount * (discountPercentage / 100));
});

const transactionNetAmount = computed(() => {
  if (!transactionData.value) return 0;
  return transactionData.value.amount - transactionDiscountAmount.value;
});

const formattedTimer = computed(() => {
  const minutes = Math.floor(remainingSeconds.value / 60);
  const seconds = remainingSeconds.value % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});


// Session Storage Helpers
function saveToSession() {
  if (employeeData.value) {
    sessionStorage.setItem(SESSION_KEYS.EMPLOYEE_DATA, JSON.stringify(employeeData.value));
  }
  if (qrValue.value) {
    sessionStorage.setItem(SESSION_KEYS.QR_VALUE, qrValue.value);
  }
  if (posAmount.value !== null) {
    sessionStorage.setItem(SESSION_KEYS.POS_AMOUNT, posAmount.value.toString());
  }
  sessionStorage.setItem(SESSION_KEYS.REMAINING_SECONDS, remainingSeconds.value.toString());
  sessionStorage.setItem(SESSION_KEYS.TIMER_START, Date.now().toString());
  if (state.showroom?.name) {
    sessionStorage.setItem(SESSION_KEYS.SHOWROOM, state.showroom.name);
  }
}

function loadFromSession() {
  try {
    const savedEmployeeData = sessionStorage.getItem(SESSION_KEYS.EMPLOYEE_DATA);
    if (savedEmployeeData) {
      employeeData.value = JSON.parse(savedEmployeeData);
    }

    const savedQRValue = sessionStorage.getItem(SESSION_KEYS.QR_VALUE);
    if (savedQRValue) {
      qrValue.value = savedQRValue;
    }

    const savedPosAmount = sessionStorage.getItem(SESSION_KEYS.POS_AMOUNT);
    if (savedPosAmount) {
      posAmount.value = Number(savedPosAmount);
      posAmountDisplay.value = formatNumber(posAmount.value);
      calculateAmounts();
    }

    const savedRemainingSeconds = sessionStorage.getItem(SESSION_KEYS.REMAINING_SECONDS);
    const timerStart = sessionStorage.getItem(SESSION_KEYS.TIMER_START);
    
    if (savedRemainingSeconds && timerStart) {
      // Calculate elapsed time
      const elapsed = Math.floor((Date.now() - Number(timerStart)) / 1000);
      const savedSeconds = Number(savedRemainingSeconds);
      remainingSeconds.value = Math.max(0, savedSeconds - elapsed);
      
      if (remainingSeconds.value > 0) {
        startTimer();
      } else {
        handleTimeout();
      }
    }
  } catch (error) {
    console.error('Error loading from session:', error);
    clearSession();
  }
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEYS.EMPLOYEE_DATA);
  sessionStorage.removeItem(SESSION_KEYS.QR_VALUE);
  sessionStorage.removeItem(SESSION_KEYS.POS_AMOUNT);
  sessionStorage.removeItem(SESSION_KEYS.REMAINING_SECONDS);
  sessionStorage.removeItem(SESSION_KEYS.TIMER_START);
  sessionStorage.removeItem(SESSION_KEYS.SHOWROOM);
}

// Watch for changes and save to session
watch([employeeData, qrValue, posAmount, remainingSeconds], () => {
  saveToSession();
}, { deep: true });

function startTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  timerInterval = window.setInterval(() => {
    remainingSeconds.value--;
    saveToSession();
    
    if (remainingSeconds.value <= 0) {
      handleTimeout();
    }
  }, 1000);
}

function handleTimeout() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  errorMessage.value = 'Session expired. Please scan QR code again.';
  clearSession();
  setTimeout(() => {
    router.push({ name: 'Cashier' });
  }, 2000);
}

function handlePosAmountInput(event: Event) {
  const target = event.target as HTMLInputElement;
  // Remove all non-digit characters
  const rawValue = target.value.replace(/\D/g, '');
  
  if (rawValue === '') {
    posAmount.value = null;
    posAmountDisplay.value = '';
    calculatedDiscount.value = 0;
    netDeducted.value = 0;
    return;
  }
  
  // Convert to number
  const numValue = Number(rawValue);
  posAmount.value = numValue;
  
  // Update display with formatted value
  posAmountDisplay.value = formatNumber(numValue);
  
  calculateAmounts();
}

function handlePosAmountBlur() {
  if (posAmount.value !== null) {
    // Format with currency on blur
    posAmountDisplay.value = formatNumber(posAmount.value);
  }
}

function calculateAmounts() {
  if (!posAmount.value || !employeeData.value) {
    calculatedDiscount.value = 0;
    netDeducted.value = 0;
    return;
  }
  
  const amount = Number(posAmount.value);
  const discountPercentage = employeeData.value.card_info.discount_percentage;
  
  calculatedDiscount.value = Math.round(amount * (discountPercentage / 100));
  netDeducted.value = amount - calculatedDiscount.value;
}

function handleProceed() {
  if (!posAmount.value || !employeeData.value || !qrValue.value) return;
  
  // Show confirmation modal
  showConfirmModal.value = true;
  errorMessage.value = '';
}

async function confirmProceed() {
  if (!posAmount.value || !employeeData.value || !qrValue.value) return;
  
  const showroom = sessionStorage.getItem(SESSION_KEYS.SHOWROOM) || state.showroom?.name;
  if (!showroom) {
    errorMessage.value = 'Showroom not found. Please contact IT support.';
    showConfirmModal.value = false;
    return;
  }
  
  isProcessing.value = true;
  errorMessage.value = '';
  
  try {
    const result = await processTransaction({
      qr_value: qrValue.value,
      amount: Number(posAmount.value),
      showroom: showroom,
      title: `POS Transaction - ${employeeData.value.employee_info.name}`,
      description: `Discount: ${calculatedDiscount.value}, Net: ${netDeducted.value}`
    });
    
    if (result && result.transaction_id) {
      // Set success state instead of navigating
      transactionData.value = result;
      transactionSuccess.value = true;
      showConfirmModal.value = false;
      isProcessing.value = false;
      
      // Stop timer
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    } else {
      throw new Error('Transaction failed');
    }
  } catch (error: any) {
    console.error('Transaction error:', error);
    errorMessage.value = error?.message || 'An error occurred while processing the transaction';
    isProcessing.value = false;
    showConfirmModal.value = false;
  }
}

function handleDismiss() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  clearSession();
  router.push({ name: 'Cashier' });
}

function formatCurrency(amount: number): string {
  const formatted = Math.abs(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `IDR ${formatted}`;
}

function formatNumber(amount: number): string {
  return Math.abs(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

async function copyTransactionId() {
  if (!transactionData.value) return;
  
  try {
    await navigator.clipboard.writeText(transactionData.value.transaction_id);
    copiedTransactionId.value = true;
    setTimeout(() => {
      copiedTransactionId.value = false;
    }, 2000);
  } catch (error) {
    console.error('Failed to copy transaction ID:', error);
  }
}

async function handleFinish() {
  // Submit payment ID if provided
  if (paymentId.value.trim() && transactionData.value) {
    try {
      await submitPaymentID(transactionData.value.transaction_id, paymentId.value.trim());
    } catch (error: any) {
      console.error('Failed to submit payment ID:', error);
      // Continue anyway, payment ID is optional
    }
  }
  
  // Clear session and navigate back to cashier portal
  clearSession();
  router.push({ name: 'Cashier' });
}

// Load from session on mount
onMounted(() => {
  loadFromSession();
  
  // If no session data, redirect to landing page
  if (!employeeData.value) {
    router.push({ name: 'Cashier' });
  }
});

// Cleanup timer on unmount
onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});
</script>

