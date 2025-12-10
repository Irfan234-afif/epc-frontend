<template>
    <div>
        <div class="shadow-xl w-full px-6 py-8 rounded-b-xl">
            <Navbar>
                <h2 class="font-bold text-xl">
                    Purchase History
                </h2>
            </Navbar>
            
            <!-- Card Selector Loading Skeleton -->
            <div v-if="isLoadingCards" class="mt-6 mb-6 flex justify-center">
                <div class="bg-[#f8f8f8] h-[45px] rounded-[10px] shadow-[0px_0px_8.5px_0px_rgba(0,0,0,0.1)] flex items-center justify-between w-full px-4">
                    <div class="w-4 h-4 bg-gray-300 rounded skeleton-item"></div>
                    <div class="flex-1 mx-4">
                        <div class="h-4 bg-gray-300 rounded skeleton-item w-3/4 mx-auto"></div>
                    </div>
                    <div class="w-4 h-4 bg-gray-300 rounded skeleton-item"></div>
                </div>
            </div>

            <!-- Card Selector -->
            <div v-else-if="cards.length > 0" class="mt-6 mb-6 flex justify-center">
                <div class="bg-[#f8f8f8] h-[45px] rounded-lg shadow-[0px_0px_8.5px_0px_rgba(0,0,0,0.1)] flex items-center justify-between w-full overflow-hidden">
                    <button 
                        @click="selectPreviousCard"
                        class="flex items-center justify-center min-w-[44px] h-full px-4 active:opacity-70 transition-opacity"
                        :disabled="cards.length <= 1"
                        :class="{ 'opacity-30 cursor-not-allowed': cards.length <= 1 }"
                    >
                        <IconArrowLeft class="w-5 h-5 mx-4" />
                    </button>
                    <p class="font-medium text-[14px] text-[#151515] tracking-[0.84px] text-center flex-1 px-2">
                        {{ selectedCard ? selectedCard.epcType.toUpperCase() : '' }}
                    </p>
                    <button 
                        @click="selectNextCard"
                        class="flex items-center justify-center min-w-[44px] h-full px-4 active:opacity-70 transition-opacity"
                        :disabled="cards.length <= 1"
                        :class="{ 'opacity-30 cursor-not-allowed': cards.length <= 1 }"
                    >
                        <IconArrowRight class="w-5 h-5 mx-4" />
                    </button>
                </div>
            </div>

            <!-- Balance Display Loading Skeleton -->
            <div v-if="isLoadingCards" class="my-12 text-center">
                <div class="h-4 bg-gray-300 rounded skeleton-item w-32 mx-auto mb-2"></div>
                <div class="h-10 bg-gray-300 rounded skeleton-item w-48 mx-auto mb-6 mt-4"></div>
                <div class="h-[6px] mb-4 mt-6">
                    <div class="relative w-full">
                        <div class="absolute bg-[#EFEEEC] h-[6px] w-full"></div>
                        <div class="absolute bg-gray-300 h-[6px] w-1/3 skeleton-item"></div>
                    </div>
                </div>
                <div class="h-3 bg-gray-300 rounded skeleton-item w-64 mx-auto"></div>
            </div>

            <!-- Balance Display -->
            <div v-else-if="selectedCard" class="mt-8 text-center">
                <p class="text-[#151515] text-[14px] mb-2">Remaining Balance</p>
                <h2 class="font-bold text-[35px] text-primary">{{ animatedBalance }}</h2>
                
                <div class="h-[6px] mb-8 mt-6">
                    <div class="relative w-full">
                        <div class="absolute bg-[#EFEEEC] h-[6px] w-full"></div>
                        <div 
                            class="absolute bg-[#CB8A2E] h-[6px]"
                            :style="{ width: `${animatedProgressPercentage}%` }"
                        ></div>
                    </div>
                </div>

                <div class="text-center">
                    <p class="text-[#212121] text-[12px]">
                        The balance resets on the 1<span class="text-[7.74px]" style="vertical-align: top;">st</span> of every month.
                    </p>
                </div>
            </div>
        </div>
        <div class="px-6 py-8">
            <div class="flex items-start justify-between">
                <div>
                    <h2 class="font-bold text-xl mb-1">{{ formattedMonthYear }}</h2>
                    <p class="text-sm">
                        <span>{{ transactions.length }} Transaction(s) · </span>
                        <span class="font-bold">Total {{ formattedTotalAmount }}</span>
                    </p>
                </div>
                <div>
                    <button 
                        @click="openMonthPicker"
                        class="text-primary font-bold text-base"
                    >
                        Change
                    </button>
                </div>
            </div>
            <div v-if="isLoadingTransactions" class="py-4 space-y-2">
                <!-- Transaction Loading Skeletons -->
                <div 
                    v-for="i in 5" 
                    :key="`skeleton-${i}`"
                    class="flex items-center space-x-2 py-4"
                >
                    <div class="px-2">
                        <div class="w-12 h-12 bg-gray-300 rounded skeleton-item"></div>
                    </div>
                    <div class="flex-1">
                        <div class="h-4 bg-gray-300 rounded skeleton-item w-32 mb-2"></div>
                        <div class="h-3 bg-gray-300 rounded skeleton-item w-24"></div>
                    </div>
                    <div class="text-right">
                        <div class="h-4 bg-gray-300 rounded skeleton-item w-20 mb-2 ml-auto"></div>
                        <div class="h-3 bg-gray-300 rounded skeleton-item w-28 ml-auto"></div>
                    </div>
                </div>
            </div>
            <div v-else-if="transactions.length === 0" class="py-32 text-center">
                <p class="text-muted">No transactions found for this period.</p>
            </div>
            <div v-else class="py-4 space-y-2">
                <div 
                    v-for="transaction in transactions" 
                    :key="transaction.name"
                    class="flex items-center space-x-2 py-4"
                >
                    <div class="px-2">
                        <img 
                            v-if="getLogoUrl(transaction.sbu_logo)"
                            :src="getLogoUrl(transaction.sbu_logo)" 
                            :alt="transaction.sbu" 
                            class="max-w-12 max-h-12 object-contain"
                        >
                        <div 
                            v-else
                            class="w-12 h-12 bg-gray-200 rounded flex items-center justify-center"
                        >
                            <span class="text-xs text-gray-500">{{ transaction.sbu?.charAt(0) }}</span>
                        </div>
                    </div>
                    <div class="flex-1">
                        <h3 class="text-[14px] text-[#212121]">
                            {{ transaction.sbu }}
                        </h3>
                        <p class="text-muted text-[12px] text-[#9f9f9f]">
                            {{ transaction.showroom_name || transaction.description || 'N/A' }}
                        </p>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-[14px] text-[#212121] tracking-[0.28px]">
                            {{ formatIDR(transaction.total_amount) }}
                        </p>
                        <p class="text-muted text-[12px] text-[#9f9f9f]">
                            <span>{{ formatDate(transaction.date) }}</span>
                            <span> | </span>
                            <span>{{ formatTime(transaction.posting_time) }}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Month Picker Modal -->
        <Modal
            :show="showMonthPicker"
            :maxWidth="'md'"
            @close="closeMonthPicker"
        >
            <template v-slot="{ propertyModal }">
                <MonthPicker
                    v-model="selectedDate"
                    @done="closeMonthPicker"
                />
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import Navbar from '@/components/ui/navbar/Navbar.vue';
import Modal from '@/components/ui/modal/Modal.vue';
import MonthPicker from '@/components/pages/purchase_history/MonthPicker.vue';
import { fetchUserCards } from '@/components/lib/card';
import { listTransactionsByCard } from '@/components/lib/transaction';
import { Card } from '@/components/pages/home/useCardStack';
import { TransactionListItem } from '@/components/lib/types';
import { UserCardResponse } from '@/components/lib/types';
import IconArrowRight from '@/components/icons/IconArrowRight.vue';
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue';

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

// State management
const cards = ref<Card[]>([]);
const cardRawData = ref<UserCardResponse[]>([]); // Store raw data for balance calculations
const selectedCardIndex = ref<number>(0);
const transactions = ref<TransactionListItem[]>([]);
const isLoadingCards = ref(false);
const isLoadingTransactions = ref(false);
const selectedDate = ref({ month: new Date().getMonth(), year: new Date().getFullYear() });
const showMonthPicker = ref(false);

// Animation states
const animatedBalance = ref<string>('IDR 0');
const animatedProgressPercentage = ref<number>(0);

// Computed properties
const selectedCard = computed(() => {
    return cards.value[selectedCardIndex.value] || null;
});

const selectedCardRaw = computed(() => {
    return cardRawData.value[selectedCardIndex.value] || null;
});

const formattedMonthYear = computed(() => {
    return `${months[selectedDate.value.month]} ${selectedDate.value.year}`;
});

const totalTransactionAmount = computed(() => {
    return transactions.value.reduce((sum, t) => sum + t.total_amount, 0);
});

const formattedTotalAmount = computed(() => {
    return formatIDR(totalTransactionAmount.value);
});

const balanceProgressPercentage = computed(() => {
    if (!selectedCardRaw.value) return 0;
    const { current_balance, current_limit } = selectedCardRaw.value;
    if (current_limit === 0) return 0;
    const used = current_limit - current_balance;
    return Math.min(100, Math.max(0, (used / current_limit) * 100));
});

// Animate balance counter
const animateBalance = (targetAmount: string) => {
    // Extract number from "IDR 1.234.567" format
    const targetNumber = parseInt(targetAmount.replace(/[^\d]/g, '')) || 0;
    const startNumber = parseInt(animatedBalance.value.replace(/[^\d]/g, '')) || 0;
    const duration = 500; // 1.5 seconds
    const startTime = Date.now();
    
    const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const currentNumber = Math.floor(startNumber + (targetNumber - startNumber) * easeOut);
        animatedBalance.value = formatIDR(currentNumber);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            animatedBalance.value = targetAmount; // Ensure final value is exact
        }
    };
    
    requestAnimationFrame(animate);
};

// Animate progress bar
const animateProgress = (targetPercentage: number) => {
    const startPercentage = animatedProgressPercentage.value;
    const duration = 1000; // 1 second
    const startTime = Date.now();
    
    const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        animatedProgressPercentage.value = startPercentage + (targetPercentage - startPercentage) * easeOut;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            animatedProgressPercentage.value = targetPercentage; // Ensure final value is exact
        }
    };
    
    requestAnimationFrame(animate);
};

// Format IDR currency
function formatIDR(amount: number): string {
    const formatted = Math.abs(amount)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `IDR ${formatted}`;
}

// Format date from YYYY-MM-DD to DD.MM.YYYY
function formatDate(dateString: string): string {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
}

// Format time from HH:MM:SS to HH:MM
function formatTime(timeString: string): string {
    if (!timeString) return '';
    return timeString.substring(0, 5);
}

// Get logo URL (similar to card.ts)
function getLogoUrl(logoPath: string | null | undefined): string | undefined {
    if (!logoPath) return undefined;
    
    // @ts-ignore - import.meta.env is available in Vite
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) return undefined;
    
    const cleanBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
    const cleanPath = logoPath.startsWith('/') ? logoPath : `/${logoPath}`;
    
    return `${cleanBackendUrl}${cleanPath}`;
}

// Card navigation
const selectPreviousCard = () => {
    if (cards.value.length <= 1) return;
    selectedCardIndex.value = selectedCardIndex.value === 0 
        ? cards.value.length - 1 
        : selectedCardIndex.value - 1;
};

const selectNextCard = () => {
    if (cards.value.length <= 1) return;
    selectedCardIndex.value = (selectedCardIndex.value + 1) % cards.value.length;
};

// Fetch transactions
const fetchTransactions = async () => {
    if (!selectedCard.value) {
        transactions.value = [];
        return;
    }

    isLoadingTransactions.value = true;
    try {
        // Month in API is 1-indexed (1-12), but our selectedDate.month is 0-indexed (0-11)
        const apiMonth = selectedDate.value.month + 1;
        const fetchedTransactions = await listTransactionsByCard(
            selectedCard.value.code,
            selectedDate.value.year,
            apiMonth
        );
        transactions.value = fetchedTransactions;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        transactions.value = [];
    } finally {
        isLoadingTransactions.value = false;
    }
};

// Fetch user cards
const loadCards = async () => {
    isLoadingCards.value = true;
    try {
        const fetchedCards = await fetchUserCards();
        cards.value = fetchedCards;
        
        // Also fetch raw card data for balance calculations
        // We need to get the raw data, but fetchUserCards only returns transformed cards
        // Fetch the raw data directly using frappe
        const { frappe } = await import('@/components/lib/frappe');
        const res = await frappe
            .call()
            .get<{ message: UserCardResponse[] }>(
                'employeediscount.api.card.get_user_card'
            );
        cardRawData.value = res?.message ?? [];
        
        // Ensure selectedCardIndex is valid
        if (cards.value.length > 0) {
            if (selectedCardIndex.value >= cards.value.length || selectedCardIndex.value < 0) {
                selectedCardIndex.value = 0;
            }
        }
    } catch (error) {
        console.error('Error fetching cards:', error);
        cards.value = [];
        cardRawData.value = [];
    } finally {
        isLoadingCards.value = false;
    }
};

// Month picker
const openMonthPicker = () => {
    showMonthPicker.value = true;
};

const closeMonthPicker = () => {
    showMonthPicker.value = false;
};

// Watch for changes
watch(selectedCardIndex, () => {
    if (cards.value.length > 0) {
        fetchTransactions();
    }
});

watch(() => selectedCard.value, (newCard, oldCard) => {
    if (newCard && newCard !== oldCard) {
        // Reset and animate when card changes
        animatedBalance.value = 'IDR 0';
        animatedProgressPercentage.value = 0;
        // Use nextTick to ensure DOM is updated
        setTimeout(() => {
            animateBalance(newCard.amount);
            animateProgress(balanceProgressPercentage.value);
        }, 50);
    }
});

watch(() => balanceProgressPercentage.value, (newPercentage, oldPercentage) => {
    // Only animate if percentage actually changed and card is selected
    if (selectedCard.value && newPercentage !== oldPercentage && oldPercentage !== undefined) {
        animateProgress(newPercentage);
    }
});

watch(() => selectedDate.value, () => {
    if (cards.value.length > 0 && selectedCard.value) {
        fetchTransactions();
    }
}, { deep: true });

// Lifecycle
onMounted(async () => {
    await loadCards();
    // Explicitly fetch transactions after cards are loaded
    if (cards.value.length > 0 && selectedCard.value) {
        await fetchTransactions();
        // Trigger initial animations
        animatedBalance.value = 'IDR 0';
        animatedProgressPercentage.value = 0;
        animateBalance(selectedCard.value.amount);
        animateProgress(balanceProgressPercentage.value);
    }
});
</script>

<style scoped>
@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.skeleton-item {
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}
</style>