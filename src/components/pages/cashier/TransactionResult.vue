<template>
  <div class="min-h-screen bg-gray-50 p-6 relative overflow-hidden">
    <!-- Animated Background Circles -->
    <div class="absolute top-0 left-0 w-96 h-96 bg-gray-200/30 rounded-full blur-3xl animate-blob"></div>
    <div class="absolute top-0 right-0 w-96 h-96 bg-gray-300/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
    <div class="absolute bottom-0 left-1/2 w-96 h-96 bg-gray-200/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
    
    <div class="max-w-2xl mx-auto relative z-10">
      <!-- Loading State -->
      <div v-if="isLoading" class="min-h-[calc(100vh-12rem)] flex items-center justify-center">
        <div class="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full border border-gray-100 text-center">
          <div class="relative inline-block mb-6">
            <div class="w-20 h-20 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
          </div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-2">Loading Transaction...</h2>
          <p class="text-gray-600">Please wait</p>
        </div>
      </div>

      <!-- Success Result -->
      <div v-else-if="transactionData && success" class="min-h-[calc(100vh-12rem)] flex items-center justify-center animate-fade-in-scale">
        <div class="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full border border-gray-100">
          <div class="text-center">
            <!-- Success Animation -->
            <div class="relative inline-block mb-6">
              <div class="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl animate-success-pop">
                <svg class="w-12 h-12 text-white animate-check-draw" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <!-- Confetti-like circles -->
              <div class="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-confetti-1"></div>
              <div class="absolute -top-4 left-8 w-3 h-3 bg-green-400 rounded-full animate-confetti-2"></div>
              <div class="absolute -top-2 -right-2 w-4 h-4 bg-gray-400 rounded-full animate-confetti-3"></div>
              <div class="absolute top-2 -right-6 w-3 h-3 bg-green-300 rounded-full animate-confetti-4"></div>
            </div>
            
            <h2 class="text-4xl font-semibold text-green-600 mb-3 animate-fade-in-up">Transaction Successful!</h2>
            <p class="text-gray-600 mb-8 text-lg animate-fade-in-up animation-delay-200">{{ message || 'Transaction successful' }}</p>
            
            <div class="bg-gray-50 rounded-2xl p-6 text-left space-y-3 mb-8 border-2 border-gray-200 animate-fade-in-up animation-delay-400">
              <div class="flex justify-between items-center pb-3 border-b-2 border-gray-200">
                <span class="text-sm font-semibold text-gray-600 flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clip-rule="evenodd"></path>
                  </svg>
                  Transaction ID
                </span>
                <span class="text-sm font-semibold text-gray-900 font-mono">{{ transactionData.name }}</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-sm font-medium text-gray-600">Employee</span>
                <span class="text-sm font-semibold text-gray-900">{{ transactionData.employee_name }}</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-sm font-medium text-gray-600">Card ID</span>
                <span class="text-sm font-semibold text-gray-900 font-mono">{{ transactionData.epc_card }}</span>
              </div>
              <div class="flex justify-between items-center pt-4 pb-2 border-t-2 border-gray-200">
                <span class="text-sm font-semibold text-gray-600">Amount</span>
                <span class="text-xl font-semibold text-gray-900">{{ formatCurrency(transactionData.total_amount) }}</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-sm font-medium text-gray-600">Previous Balance</span>
                <span class="text-sm font-semibold text-gray-700">{{ formatCurrency(transactionData.from_balance) }}</span>
              </div>
              <div class="flex justify-between items-center pt-2 pb-4 border-b-2 border-gray-200">
                <span class="text-sm font-semibold text-gray-600">New Balance</span>
                <span class="text-2xl font-semibold text-green-600">{{ formatCurrency(transactionData.to_balance) }}</span>
              </div>
            </div>
            
            <button
              @click="goBackToCashier"
              class="w-full bg-gray-800 text-white font-semibold py-5 rounded-xl hover:bg-gray-900 transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] animate-fade-in-up animation-delay-600"
            >
              Process Another Transaction
            </button>
          </div>
        </div>
      </div>
      
      <!-- Error Result -->
      <div v-else-if="transactionData && !success" class="min-h-[calc(100vh-12rem)] flex items-center justify-center animate-fade-in-scale">
        <div class="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full border border-gray-100">
          <div class="text-center">
            <div class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-success-pop">
              <svg class="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 class="text-4xl font-semibold text-red-600 mb-3 animate-fade-in-up">Transaction Failed</h2>
            <div class="bg-red-50 rounded-2xl p-6 mb-8 animate-fade-in-up animation-delay-200">
              <p class="text-red-800">{{ message || 'An error occurred while processing the transaction' }}</p>
            </div>
            
            <button
              @click="goBackToCashier"
              class="w-full bg-gray-800 text-white font-semibold py-5 rounded-xl hover:bg-gray-900 transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] animate-fade-in-up animation-delay-400"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>

      <!-- No Data - Redirect -->
      <div v-else class="min-h-[calc(100vh-12rem)] flex items-center justify-center">
        <div class="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full border border-gray-100 text-center">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">No Transaction Data</h2>
          <p class="text-gray-600 mb-6">Redirecting to cashier...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { formatCurrency } from '@/components/lib/utils';
import { getTransactionDetail } from '@/components/lib/transaction';
import type { Transaction } from '@/components/lib/types';

const router = useRouter();
const route = useRoute();
const success = ref(false);
const message = ref('');

const transactionData = ref<Transaction | null>(null);
const isLoading = ref(true);

onMounted(async () => {
  const transactionId = route.params.id as string;
  const status = route.query.status as string;
  message.value = route.query.message as string;
  success.value = status === 'success';
  
  // Handle error status from query
  if (status === 'error') {
    transactionData.value = {
      name: '',
      epc_card: '',
      employee_name: '',
      total_amount: 0,
      from_balance: 0,
      to_balance: 0,
    };
    isLoading.value = false;
    return;
  }
  
  // Fetch transaction detail from database
  if (transactionId && transactionId !== 'error') {
    try {
      const result = await getTransactionDetail(transactionId);
      if (result) {
        transactionData.value = {
          ...result,
        };
      } else {
        throw new Error('Transaction not found');
      }
    } catch (error) {
      console.error('Failed to fetch transaction detail:', error);
      transactionData.value = {
        name: transactionId,
        epc_card: '',
        employee_name: '',
        total_amount: 0,
        from_balance: 0,
        to_balance: 0,
      };
    } finally {
      isLoading.value = false;
    }
  } else {
    // Redirect to cashier if no transaction ID
    setTimeout(() => {
      router.push('/cashier');
    }, 1500);
  }
});

function goBackToCashier() {
  router.push('/cashier');
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

@keyframes success-pop {
  0% { transform: scale(0); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes check-draw {
  0% { stroke-dashoffset: 100; }
  100% { stroke-dashoffset: 0; }
}

@keyframes confetti-1 {
  0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translate(-100px, 200px) rotate(360deg); opacity: 0; }
}

@keyframes confetti-2 {
  0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translate(50px, 250px) rotate(-360deg); opacity: 0; }
}

@keyframes confetti-3 {
  0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translate(100px, 200px) rotate(360deg); opacity: 0; }
}

@keyframes confetti-4 {
  0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translate(150px, 180px) rotate(-360deg); opacity: 0; }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out;
}

.animate-fade-in-scale {
  animation: fade-in-scale 0.5s ease-out;
}

.animate-success-pop {
  animation: success-pop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.animate-check-draw {
  stroke-dasharray: 100;
  animation: check-draw 0.5s ease-out forwards;
  animation-delay: 0.3s;
}

.animate-confetti-1 {
  animation: confetti-1 2s ease-out forwards;
  animation-delay: 0.4s;
}

.animate-confetti-2 {
  animation: confetti-2 2s ease-out forwards;
  animation-delay: 0.5s;
}

.animate-confetti-3 {
  animation: confetti-3 2s ease-out forwards;
  animation-delay: 0.6s;
}

.animate-confetti-4 {
  animation: confetti-4 2s ease-out forwards;
  animation-delay: 0.7s;
}

.animation-delay-200 {
  animation-delay: 200ms;
}

.animation-delay-400 {
  animation-delay: 400ms;
}

.animation-delay-600 {
  animation-delay: 600ms;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>

