<template>
  <div class="flex flex-col items-center p-14 bg-[#f8f8f8] rounded-lg">
    <!-- Success View -->
    <div v-if="isTransactionCompleted" class="w-full flex flex-col items-center">
      <!-- Success Icon -->
      <div class="w-[109px] h-[109px] mb-6 flex items-center justify-center">
        <div class="w-full h-full rounded-full border-2 border-[#212121] flex items-center justify-center">
          <svg class="w-12 h-12 text-[#212121]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      </div>
      
      <!-- Title -->
      <h2 class="text-[30px] font-semibold text-[#212121] text-center mb-4">Payment Successful</h2>
      
      <!-- Store Name -->
      <p v-if="storeName" class="text-base font-medium text-[#0f181f] text-center mb-4 tracking-[0.48px]">
        {{ storeName }}
      </p>
      
      <!-- Description -->
      <p class="text-xs text-[#0f181f] text-center leading-[19px] tracking-[0.36px] mb-8 px-4" style="max-width: 268px;">
        <span>Your payment of </span>
        <span class="font-semibold">{{ formatIDR(transactionData?.total_amount || 0) }}</span>
        <span> was successful. You can view the details in your Purchase History. If you didn't make this transaction, please contact IT Support immediately.</span>
      </p>
      
      <!-- Done Button -->
      <button 
        @click="handleDone"
        class="bg-[#212121] text-white font-medium text-sm h-[45px] w-[253px] rounded-[5px] mb-4 tracking-[0.28px]"
      >
        Done
      </button>
      
      <!-- View Purchase History Link -->
      <button 
        @click="goToPurchaseHistory"
        class="text-xs font-semibold text-[#0f181f] text-center cursor-pointer"
      >
        View Purchase History
      </button>
    </div>
    
    <!-- Processing Payment View -->
    <div v-else-if="isProcessingPayment" class="w-full flex flex-col items-center">
      <!-- Loading Animation -->
      <div class="mb-8 flex items-center justify-center my-12">
        <div class="flex space-x-2">
          <div class="w-3 h-3 bg-[#212121] rounded-full animate-dot-bounce" style="animation-delay: 0s"></div>
          <div class="w-3 h-3 bg-[#212121] rounded-full animate-dot-bounce" style="animation-delay: 0.2s"></div>
          <div class="w-3 h-3 bg-[#212121] rounded-full animate-dot-bounce" style="animation-delay: 0.4s"></div>
        </div>
      </div>
      
      <!-- Title -->
      <h2 class="text-[22px] font-semibold text-[#212121] text-center mb-4">
        Finalizing Payment
      </h2>
      
      <!-- Description -->
      <p class="text-xs text-[#0f181f] text-center leading-[19px] tracking-[0.36px] px-4" style="max-width: 268px;">
        Please wait while the cashier verifies your payment details. Keep this screen open to ensure a seamless transaction.
      </p>
    </div>
    
    <!-- QR Code View -->
    <div v-else class="w-full flex flex-col items-center">
      <div class="text-center mb-4">
        <h2 class="text-2xl font-semibold mb-2">{{ qrCodeData?.card_name || cardCode || 'Loading...' }}</h2>
        <p class="text-sm">{{ qrCodeData?.epc_type || 'Loading...' }}</p>
      </div>
      <div class="p-5 bg-gray-50 rounded-3xl shadow-sm mb-3">
        <div v-if="isLoading" class="w-56 h-56 flex items-center justify-center">
          <div class="text-gray-400">Generating QR Code...</div>
        </div>
        <div v-else-if="qrCodeData && qrCodeImageUrl" class="w-56 h-56 flex items-center justify-center">
          <img :src="qrCodeImageUrl" alt="QR Code" class="w-56 h-56 mix-blend-darken" />
        </div>
        <div v-else class="w-56 h-56 flex items-center justify-center">
          <div class="text-red-500">Failed to generate QR Code</div>
        </div>
      </div>
      <!-- Countdown Timer -->
      <div v-if="qrCodeData && qrCodeImageUrl && !isLoading" class="text-center mb-5">
        <div class="inline-block px-4 py-2 rounded-full text-sm">
          Auto refreshes in {{ formatDuration(countdownSeconds) }}
        </div>
      </div>
      <div class="text-center text-gray-800 mb-5">
        <p class="font-semibold text-lg mb-2">Show QR to Pay</p>
        <p class="text-sm">Staff will scan this QR to complete your payment. Your employee discount will be applied automatically.</p>
      </div>
      <button @click="$emit('close')" class="border active:bg-gray-800 active:text-white hover:bg-gray-800 hover:text-white font-semibold py-3 w-64 rounded-md cursor-pointer">Close</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, onBeforeMount, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { generateQRCode } from '@/components/lib/card';
import { QRCodeResponse, Transaction } from '@/components/lib/types';
import QRCode from 'qrcode';
import { socket } from '@/components/lib/frappeSocket';
import { getTransactionDetail } from '@/components/lib/transaction';
import { formatNumber } from '@/components/lib/utils';
import { useAuth } from '@/components/lib/auth';

const router = useRouter();
const { state } = useAuth();
const emit = defineEmits<{
  (e: 'close'): void;
}>();

const props = defineProps<{
  cardCode: string;
}>();

const qrCodeData = ref<QRCodeResponse | null>(null);
const isLoading = ref(false);
const refreshTimer = ref<number | null>(null);
const countdownTimer = ref<number | null>(null);
  const qrTimeout = parseInt(state.epc_setting?.qr_timeout) ?? 60;
const countdownSeconds = ref(qrTimeout);
const qrCodeImageUrl = ref<string | null>(null);

// Processing payment state
const isProcessingPayment = ref(false);

// Transaction completion state
const isTransactionCompleted = ref(false);
const transactionData = ref<Transaction | null>(null);
const isLoadingTransaction = ref(false);
const storeName = ref<string>('');

async function generateQRCodeImage(qrCodeString: string) {
  try {
    // Generate QR code image directly from the base64 string
    // Backend expects base64, so we don't decode it
    const dataUrl = await QRCode.toDataURL(qrCodeString, {
      width: 224,
      margin: 2,
    });
    qrCodeImageUrl.value = dataUrl;
  } catch (error) {
    console.error('Error generating QR code image:', error);
    qrCodeImageUrl.value = null;
  }
}

function startCountdown() {
  // Reset countdown to 60 seconds
  countdownSeconds.value = qrTimeout;
  
  // Clear existing countdown timer if any
  if (countdownTimer.value !== null) {
    clearInterval(countdownTimer.value);
  }
  
  // Start countdown timer
  countdownTimer.value = window.setInterval(() => {
    countdownSeconds.value--;
    if (countdownSeconds.value <= 0) {
      countdownSeconds.value = qrTimeout;
    }
  }, 1000); // Update every second
}

async function loadQRCode() {
  if (!props.cardCode) return;
  // Stop generating QR code if payment is being processed
  if (isProcessingPayment.value) return;
  
  isLoading.value = true;
  try {
    const response = await generateQRCode(props.cardCode);
    if (response) {
      qrCodeData.value = response;
      // Generate QR code image from the qr_code data
      if (response.qr_code) {
        await generateQRCodeImage(response.qr_code);
        // Start countdown after QR code is generated
        startCountdown();
      }
    }
  } catch (error) {
    console.error('Failed to generate QR code:', error);
    qrCodeImageUrl.value = null;
  } finally {
    isLoading.value = false;
  }
}

function handleQRCodeValidated(data: any) {
  console.log('QR code validated:', data);
  
  // Stop timers
  if (refreshTimer.value !== null) {
    clearInterval(refreshTimer.value);
    refreshTimer.value = null;
  }
  if (countdownTimer.value !== null) {
    clearInterval(countdownTimer.value);
    countdownTimer.value = null;
  }
  
  // Set processing payment state
  isProcessingPayment.value = true;
}

async function handleTransactionCompleted(data: any) {
  console.log('Transaction completed:', data);
  
  // Stop timers
  if (refreshTimer.value !== null) {
    clearInterval(refreshTimer.value);
    refreshTimer.value = null;
  }
  if (countdownTimer.value !== null) {
    clearInterval(countdownTimer.value);
    countdownTimer.value = null;
  }
  
  // Set transaction completed state (processing will be automatically hidden)
  isProcessingPayment.value = false;
  isTransactionCompleted.value = true;
  isLoadingTransaction.value = true;
  
  try {
    let transactionId: string;
    
    // Handle different data formats
    if (typeof data === 'string') {
      transactionId = data;
    } else if (data && data.transaction_id) {
      transactionId = data.transaction_id;
    } else if (data && data.name) {
      transactionId = data.name;
    } else {
      console.error('Invalid transaction data format:', data);
      isLoadingTransaction.value = false;
      return;
    }
    
    // Fetch transaction details
    const transaction = await getTransactionDetail(transactionId);
    if (transaction) {
      transactionData.value = transaction;
      // Try to get store name from transaction data if available
      // For now, we'll use a placeholder or fetch it separately if needed
      storeName.value = 'Store'; // This can be enhanced later if store name is in transaction data
    } else {
      console.error('Failed to fetch transaction details');
    }
  } catch (error) {
    console.error('Error handling transaction completion:', error);
  } finally {
    isLoadingTransaction.value = false;
  }
}

function handleDone() {
  emit('close');
}

function formatIDR(amount: number): string {
  return `IDR ${formatNumber(amount)}`;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts: string[] = [];
  
  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  }
  
  if (minutes > 0) {
    parts.push(`${minutes} ${secs > 0 ? ':' : 'minutes'}`);
  }
  
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs} ${secs === 1 ? '' : ''}`);
  }
  
  return parts.join(' ');
}

function goToPurchaseHistory() {
  emit('close');
  router.push('/purchase-history');
}

onMounted(() => {
  console.log('QRView mounted');
  console.log('Subscribing to transaction:', props.cardCode);
  socket.emit('card_subscribe', props.cardCode);
  socket.on('qr_code_validated', handleQRCodeValidated);
  socket.on('transaction_completed', handleTransactionCompleted);
  
  // Generate QR code immediately when component opens
  loadQRCode();
  
  // Set up 60-second interval to refresh QR code
  refreshTimer.value = window.setInterval(() => {
    // Only refresh QR code if not processing payment
    if (!isProcessingPayment.value) {
      loadQRCode();
    }
  }, qrTimeout * 1000); // qrTimeout seconds
});

onBeforeUnmount(() => {
  console.log('QRView beforeUnmount');
  socket.off('qr_code_validated', handleQRCodeValidated);
  socket.off('transaction_completed', handleTransactionCompleted);
  socket.emit('card_unsubscribe', props.cardCode);
});

onUnmounted(() => {
  // Clear refresh interval when component is unmounted
  if (refreshTimer.value !== null) {
    clearInterval(refreshTimer.value);
    refreshTimer.value = null;
  }
  // Clear countdown timer when component is unmounted
  if (countdownTimer.value !== null) {
    clearInterval(countdownTimer.value);
    countdownTimer.value = null;
  }
});
</script>

<style scoped>
@keyframes dot-bounce {
  0%, 80%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  40% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.animate-dot-bounce {
  animation: dot-bounce 1.4s infinite ease-in-out;
}
</style>