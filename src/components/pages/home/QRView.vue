<template>
  <div class="flex flex-col items-center p-5 bg-gray-50 rounded-lg shadow-md">
    <div class="text-center mb-4">
      <h2 class="text-2xl font-bold mb-2">{{ qrCodeData?.card_name || cardCode || 'Loading...' }}</h2>
      <p class="text-sm">{{ qrCodeData?.employee_name || 'Loading...' }}</p>
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
      <div class="inline-block bg-black/70 text-white px-4 py-2 rounded-full text-sm font-bold">
        Refreshes in {{ countdownSeconds }}s
      </div>
    </div>
    <div class="text-center text-gray-800 mb-5">
      <p class="font-bold text-lg mb-2">Show Payment QR to Staff</p>
      <p class="text-sm">Staff will scan this QR to apply your discount. Your balance will be updated after successful purchase.</p>
    </div>
    <button @click="$emit('close')" class="bg-gray-800 text-white font-bold py-3 w-64 rounded-md cursor-pointer">Close</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, onBeforeMount, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { generateQRCode } from '@/components/lib/card';
import { QRCodeResponse } from '@/components/lib/types';
import QRCode from 'qrcode';
import { socket } from '@/components/lib/frappeSocket';

const router = useRouter();

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
const countdownSeconds = ref(60);
const qrCodeImageUrl = ref<string | null>(null);

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
  countdownSeconds.value = 60;
  
  // Clear existing countdown timer if any
  if (countdownTimer.value !== null) {
    clearInterval(countdownTimer.value);
  }
  
  // Start countdown timer
  countdownTimer.value = window.setInterval(() => {
    countdownSeconds.value--;
    if (countdownSeconds.value <= 0) {
      countdownSeconds.value = 60;
    }
  }, 1000); // Update every second
}

async function loadQRCode() {
  if (!props.cardCode) return;
  
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

onMounted(() => {
  console.log('QRView mounted');
  console.log('Subscribing to transaction:', props.cardCode);
  socket.emit('card_subscribe', props.cardCode);
  socket.on('transaction_completed', (data) => {
    console.log('Transaction completed:', data);
    
    // Close the dialog
    emit('close');
    
    // Navigate to transaction result page
    if (data) {
      router.push({
        name: 'EmployeeTransactionResult',
        params: {
          id: data
        },
        query: {
          status: 'success',
          message: data.message || 'Transaction completed successfully'
        }
      });
    } else {
      // If no transaction_id, show error
      router.push({
        name: 'EmployeeTransactionResult',
        params: {
          id: 'error'
        },
        query: {
          status: 'error',
          message: data.message || 'Transaction completed but no transaction ID received'
        }
      });
    }
  });
  // Generate QR code immediately when component opens
  loadQRCode();
  
  // Set up 60-second interval to refresh QR code
  refreshTimer.value = window.setInterval(() => {
    loadQRCode();
  }, 60000); // 60 seconds
});

onBeforeUnmount(() => {
  console.log('QRView beforeMount');
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