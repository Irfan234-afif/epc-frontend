<template>
  <div class="relative min-h-screen overflow-hidden flex items-center justify-center bg-gray-900">
      <!-- Background Image -->
      <div class="absolute inset-0 opacity-85">
        <img src="/cashier-portal.png" alt="" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30"></div>
      </div>
      
      <!-- Content -->
      <div class="relative z-10 w-full h-screen flex flex-col items-center justify-between py-12 px-8">
        <!-- Header Section -->
        <div class="flex-1 flex flex-col items-center justify-center text-center">
          <h1 class="text-5xl font-normal text-white mb-2 tracking-tight" style="text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);">
            Cashier Portal
          </h1>
          <p class="text-base text-white opacity-95" style="text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);">
            {{ locationName }}
          </p>
        </div>
        
        <!-- Bottom Actions -->
        <div class="flex items-end justify-center gap-12 w-full max-w-4xl pb-8">
          <button disabled class="bg-transparent border-none text-white text-sm font-medium cursor-not-allowed opacity-70 p-4 transition-opacity" style="text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);">
            <span>Transaction History</span>
          </button>
          
          <button @click="openScanner" class="flex flex-col items-center gap-3 bg-transparent border-none text-white cursor-pointer transition-transform hover:-translate-y-1 active:-translate-y-0.5">
            <div class="w-[68px] h-[68px] bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md transition-all hover:bg-white/30 hover:shadow-xl">
              <svg class="w-10 h-10" style="stroke-width: 2;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
              </svg>
            </div>
            <span class="text-sm font-medium" style="text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);">Scan QR</span>
          </button>
          
          <button disabled class="bg-transparent border-none text-white text-sm font-medium cursor-not-allowed opacity-70 p-4 transition-opacity" style="text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);">
            <span>Contact IT Support</span>
          </button>
        </div>

        <!-- Debug: Manual QR Input -->
        <div class="absolute top-4 right-4 bg-black/60 backdrop-blur-md rounded-lg p-4 max-w-md w-[500px]">
          <p class="text-xs text-white mb-2 font-medium">🔧 Debug Mode - Manual QR Input</p>
          <div class="flex gap-2 mb-2">
            <input 
              v-model="debugQRValue" 
              type="text" 
              placeholder="Paste QR value (base64 encoded)..."
              class="flex-1 px-3 py-2 bg-white/90 text-gray-900 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="handleManualQR"
            />
            <button 
              @click="handleManualQR"
              :disabled="!debugQRValue"
              class="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              Submit
            </button>
          </div>
          <p class="text-[10px] text-white/70">Press Enter to submit or click the button</p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="absolute top-4 left-4 bg-red-600/90 backdrop-blur-md rounded-lg p-4 max-w-md">
          <div class="flex items-center gap-3 text-white text-sm">
            <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <span>{{ errorMessage }}</span>
            <button @click="errorMessage = ''" class="ml-auto text-white/80 hover:text-white">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

    <!-- QR Scanner Modal -->
    <Modal
      :show="showScanner"
      :maxWidth="'4xl'"
      @close="closeScanner"
    >
      <QRScanner 
        @scanned="handleQRScanned"
        @close="closeScanner"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Modal from '@/components/ui/modal/Modal.vue';
import QRScanner from './QRScanner.vue';
import { validateQRCode } from '@/components/lib/transaction';
import { useAuth } from '@/components/lib/auth';

const { state } = useAuth();
const router = useRouter();

// State
const showScanner = ref(false);
const errorMessage = ref('');
const debugQRValue = ref('');
const selectedShowroom = ref(state.showroom?.name ?? '');
const locationName = ref(state.showroom?.showroom_name ?? '');

// Session Storage Keys
const SESSION_KEYS = {
  EMPLOYEE_DATA: 'cashier_employee_data',
  QR_VALUE: 'cashier_qr_value',
  REMAINING_SECONDS: 'cashier_remaining_seconds',
  TIMER_START: 'cashier_timer_start',
  SHOWROOM: 'cashier_showroom'
};

// Methods
function openScanner() {
  errorMessage.value = '';
  showScanner.value = true;
}

function closeScanner() {
  showScanner.value = false;
}

function saveToSession(employeeData: any, qrValue: string, remainingSeconds: number) {
  sessionStorage.setItem(SESSION_KEYS.EMPLOYEE_DATA, JSON.stringify(employeeData));
  sessionStorage.setItem(SESSION_KEYS.QR_VALUE, qrValue);
  sessionStorage.setItem(SESSION_KEYS.REMAINING_SECONDS, remainingSeconds.toString());
  sessionStorage.setItem(SESSION_KEYS.TIMER_START, Date.now().toString());
  if (selectedShowroom.value) {
    sessionStorage.setItem(SESSION_KEYS.SHOWROOM, selectedShowroom.value);
  }
}

async function handleQRScanned(value: string) {
  closeScanner();
  errorMessage.value = '';
  
  // QR code sudah divalidasi di QRScanner, langsung simpan dan navigate
  try {
    const result = await validateQRCode(value, selectedShowroom.value);
    if (result && result.valid) {
      saveToSession(result, value, result.cashier_timeout);
      // Navigate to transaction screen
      router.push({ name: 'CashierTransaction' });
    }
  } catch (error: any) {
    // Error sudah ditangani di QRScanner, tapi tetap tampilkan di portal juga
    errorMessage.value = error?.message || 'Failed to validate QR code';
    console.error('QR validation error:', error);
  }
}

async function handleManualQR() {
  if (!debugQRValue.value.trim()) return;
  
  errorMessage.value = '';
  
  try {
    const result = await validateQRCode(debugQRValue.value.trim(), selectedShowroom.value);
    if (result && result.valid) {
      saveToSession(result, debugQRValue.value.trim(), result.cashier_timeout);
      debugQRValue.value = ''; // Clear input after success
      // Navigate to transaction screen
      router.push({ name: 'CashierTransaction' });
    } else {
      errorMessage.value = 'Invalid QR code';
    }
  } catch (error: any) {
    errorMessage.value = error?.message || 'Failed to validate QR code';
    console.error('QR validation error:', error);
  }
}
</script>

<style scoped>
/* Minimal custom styles - most styling is done with Tailwind */
</style>

