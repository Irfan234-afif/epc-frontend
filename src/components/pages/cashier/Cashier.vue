<template>
  <div class="min-h-screen bg-gray-50 p-6 relative overflow-hidden">
    <div class="max-w-2xl mx-auto relative z-10">
      <!-- Header -->
      <div class="bg-white rounded-2xl shadow-lg p-8 mb-6 transform hover:scale-[1.01] transition-all duration-300 border border-gray-100">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 bg-gray-800 rounded-xl flex items-center justify-center shadow-lg animate-pulse-slow">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-1">Cashier Portal</h1>
            <p class="text-gray-600">Process employee discount transactions</p>
          </div>
        </div>
      </div>

      <!-- Transaction Form -->
      <div class="bg-white rounded-2xl shadow-lg p-8 mb-6 animate-fade-in-up border border-gray-100">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800">Transaction Details</h2>
        </div>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Amount Input -->
          <div class="group">
            <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"></path>
              </svg>
              Amount <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <Input
                v-model="form.amount"
                type="number"
                placeholder="Enter amount (e.g., 500000)"
                required
                :disabled="isProcessing"
                class="w-full pl-12 transition-all duration-300 focus:shadow-lg focus:ring-2 focus:ring-gray-800"
              />
              <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">IDR</div>
            </div>
            <p class="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
              </svg>
              Enter amount in IDR (without dots or commas)
            </p>
          </div>

          <!-- Showroom Dropdown -->
          <div class="group">
            <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"></path>
              </svg>
              Showroom <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <select
                v-model="form.showroom"
                required
                :disabled="isProcessing || isLoadingShowrooms"
                class="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer hover:border-gray-300 focus:shadow-lg"
              >
                <option value="" disabled>Select a showroom</option>
                <option
                  v-for="showroom in showrooms"
                  :key="showroom.name"
                  :value="showroom.name"
                >
                  {{ showroom.showroom_name }} ({{ showroom.sbu }})
                </option>
              </select>
              <svg class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            <p v-if="isLoadingShowrooms" class="text-xs text-gray-500 mt-1.5 flex items-center gap-1 animate-pulse">
              <svg class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading showrooms...
            </p>
          </div>

          <!-- Title Input (Required) -->
          <div class="group">
            <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path>
              </svg>
              Title <span class="text-red-500">*</span>
            </label>
            <Input
              v-model="form.title"
              type="text"
              placeholder="e.g., Purchase of Shoes"
              :disabled="isProcessing"
              required
              class="w-full transition-all duration-300 focus:shadow-lg focus:ring-2 focus:ring-gray-800"
            />
          </div>

          <!-- Description Input (Optional) -->
          <div class="group">
            <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clip-rule="evenodd"></path>
              </svg>
              Description <span class="text-gray-400 text-xs">(Optional)</span>
            </label>
            <textarea
              v-model="form.description"
              placeholder="Add any additional notes here..."
              :disabled="isProcessing"
              rows="3"
              class="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300 resize-none hover:border-gray-300 focus:shadow-lg"
            ></textarea>
          </div>

          <!-- QR Code Section -->
          <div class="pt-6 border-t-2 border-gray-200 mt-2">
            <label class="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <div class="w-6 h-6 bg-gray-800 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clip-rule="evenodd"></path>
                  <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3zM17 13a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM16 17a1 1 0 100-2h-3a1 1 0 100 2h3z"></path>
                </svg>
              </div>
              Employee QR Code <span class="text-red-500">*</span>
            </label>
            
            <!-- Error message for QR expired -->
            <div v-if="errorMessage" class="p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border-2 border-red-300 mb-4 animate-fade-in-scale">
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                </svg>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-red-800 mb-1">QR Code Expired</p>
                  <p class="text-xs text-red-700">{{ errorMessage }}</p>
                  <button
                    @click="errorMessage = ''"
                    class="mt-2 text-xs font-semibold text-red-700 hover:text-red-900 underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Info message when mandatory fields not filled -->
            <div v-if="!canScanQR" class="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 mb-4 animate-fade-in">
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                <div>
                  <p class="text-sm font-semibold text-amber-800 mb-1">Complete Required Fields First</p>
                  <p class="text-xs text-amber-700">Please fill in Amount, Showroom, and Title fields before scanning QR code.</p>
                </div>
              </div>
            </div>
            
            <div v-if="!isProcessing" class="space-y-4">
              <!-- Scan Button -->
              <button
                type="button"
                @click="openScanner"
                :disabled="!canScanQR"
                class="w-full bg-gray-800 text-white font-bold py-5 rounded-xl hover:bg-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] group"
              >
                <div class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                  </svg>
                </div>
                <span class="text-lg">Scan QR Code with Camera</span>
              </button>
              
              <!-- Divider -->
              <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t-2 border-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                </div>
                <div class="relative flex justify-center">
                  <span class="px-4 py-1 bg-white text-sm font-medium text-gray-500 rounded-full border-2 border-gray-200">or enter manually</span>
                </div>
              </div>
              
              <!-- Manual Input -->
              <div class="space-y-3">
                <Input
                  v-model="manualQRInput"
                  type="text"
                  placeholder="Paste or type QR code value here"
                  :disabled="!canScanQR"
                  class="w-full transition-all duration-300 focus:shadow-lg"
                  @keyup.enter="setManualQR"
                />
                <button
                  type="button"
                  @click="setManualQR"
                  :disabled="!canScanQR || !manualQRInput"
                  class="w-full bg-gray-600 text-white font-bold py-4 rounded-xl hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  Use Manual QR Code
                </button>
              </div>
            </div>
            
            <!-- Processing state -->
            <div v-else class="p-12 text-center animate-fade-in">
              <div class="relative inline-block">
                <div class="w-20 h-20 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-12 h-12 bg-gray-800 rounded-full animate-pulse"></div>
                </div>
              </div>
              <p class="text-xl font-bold text-gray-800 mt-6 mb-2">Processing Transaction...</p>
              <p class="text-sm text-gray-500">Please wait while we process your request</p>
              <div class="flex justify-center gap-1 mt-4">
                <div class="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                <div class="w-2 h-2 bg-gray-700 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                <div class="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
              </div>
            </div>
          </div>
        </form>
      </div>

    </div>

    <!-- QR Scanner Modal -->
    <Modal
      :show="showScanner"
      :maxWidth="'md'"
      @close="closeScanner"
    >
      <QRScannerFast 
        @scanned="handleQRScanned"
        @close="closeScanner"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Input from '@/components/ui/input/Input.vue';
import Modal from '@/components/ui/modal/Modal.vue';
import QRScannerFast from './QRScanner.vue';
import { fetchShowrooms, processTransaction } from '@/components/lib/transaction';
import { Showroom } from '@/components/lib/types';

const router = useRouter();

// Form state
const form = ref({
  amount: '',
  showroom: '',
  title: '',
  description: '',
  qrValue: ''
});

// Showrooms
const showrooms = ref<Showroom[]>([]);
const isLoadingShowrooms = ref(false);

// Scanner state
const showScanner = ref(false);
const manualQRInput = ref('');

// Transaction state
const isProcessing = ref(false);
const errorMessage = ref('');

// Load showrooms on mount
onMounted(async () => {
  // Reset form when returning to this page
  form.value = {
    amount: '',
    showroom: '',
    title: '',
    description: '',
    qrValue: ''
  };
  manualQRInput.value = '';
  
  isLoadingShowrooms.value = true;
  try {
    showrooms.value = await fetchShowrooms();
  } catch (error) {
    console.error('Failed to load showrooms:', error);
  } finally {
    isLoadingShowrooms.value = false;
  }
});

// Computed
const canScanQR = computed(() => {
  return form.value.amount && form.value.showroom && form.value.title;
});

// Methods

function openScanner() {
  errorMessage.value = ''; // Clear error when opening scanner
  showScanner.value = true;
}

function closeScanner() {
  showScanner.value = false;
}

function handleQRScanned(value: string) {
  form.value.qrValue = value;
  closeScanner();
  // Auto submit transaction after QR scanned
  handleSubmit();
}

function clearQR() {
  form.value.qrValue = '';
  manualQRInput.value = '';
}

function setManualQR() {
  if (manualQRInput.value.trim()) {
    form.value.qrValue = manualQRInput.value.trim();
    // Auto submit transaction after manual QR set
    handleSubmit();
  }
}

async function handleSubmit() {
  if (!form.value.amount || !form.value.showroom || !form.value.title || !form.value.qrValue) return;
  
  isProcessing.value = true;
  errorMessage.value = ''; // Clear previous error
  
  try {
    const result = await processTransaction({
      qr_value: form.value.qrValue,
      amount: Number(form.value.amount),
      showroom: form.value.showroom,
      title: form.value.title,
      description: form.value.description || undefined
    });
    
    if (result && result.transaction_id) {
      // Navigate to result page with transaction ID only
      router.push({
        name: 'TransactionResult',
        params: {
          id: result.transaction_id
        },
        query: {
          status: 'success'
        }
      });
    } else {
      throw new Error('Transaction failed');
    }
  } catch (error: any) {
    console.error('Transaction error:', error);
    
    // Check if this is a QR expired error
    if (error?.exc_type === 'QRExpiredError') {
      // Stay on the page and show error message
      errorMessage.value = error?.message || 'QR code has expired. Please scan again.';
      // Clear the QR value to allow re-scanning
      form.value.qrValue = '';
    } else {
      // For other errors, navigate to result page
      router.push({
        name: 'TransactionResult',
        params: {
          id: 'error'
        },
        query: {
          status: 'error',
          message: error?.message || 'An error occurred while processing the transaction'
        }
      });
    }
  } finally {
    isProcessing.value = false;
  }
}

</script>

<style scoped>
/* Custom Animations */
@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(20px, -50px) scale(1.1); }
  50% { transform: translate(-20px, 20px) scale(0.9); }
  75% { transform: translate(50px, 50px) scale(1.05); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(0.98); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-in-up {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-scale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
