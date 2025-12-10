<template>
    <div class="bg-[#f8f8f8] min-h-screen">
        <div class="w-full px-6 py-8">
            <Navbar>
                <h2 class="font-semibold text-[20px] text-[#151515]">
                    Your EPC Benefits
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
            <div v-else-if="cards.length > 0" class="mt-6 flex justify-center">
                <div class="bg-[#f8f8f8] h-[45px] rounded-[10px] shadow-[0px_0px_8.5px_0px_rgba(0,0,0,0.1)] flex items-center justify-between w-full overflow-hidden">
                    <button 
                        @click="selectPreviousCard"
                        class="flex items-center justify-center min-w-[44px] h-full px-4 active:opacity-70 transition-opacity"
                        :disabled="cards.length <= 1"
                        :class="{ 'opacity-30 cursor-not-allowed': cards.length <= 1 }"
                    >
                        <IconArrowLeft class="w-4 h-4" />
                    </button>
                    <p class="font-medium text-[14px] text-[#151515] tracking-[0.84px] text-center flex-1 px-2 whitespace-pre-wrap">
                        {{ selectedCard.epcType }}
                    </p>
                    <button 
                        @click="selectNextCard"
                        class="flex items-center justify-center min-w-[44px] h-full px-4 active:opacity-70 transition-opacity"
                        :disabled="cards.length <= 1"
                        :class="{ 'opacity-30 cursor-not-allowed': cards.length <= 1 }"
                    >
                        <IconArrowRight class="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>

        <div class="px-6">
            <!-- Monthly Balance Section -->
            <div v-if="isLoadingCards" class="text-center mb-8">
                <div class="h-4 bg-gray-300 rounded skeleton-item w-32 mx-auto mb-2"></div>
                <div class="h-10 bg-gray-300 rounded skeleton-item w-48 mx-auto mb-6 mt-4"></div>
                <div class="h-3 bg-gray-300 rounded skeleton-item w-64 mx-auto"></div>
            </div>

            <div v-else-if="selectedEPCType" class="text-left mb-8">
                <p class="text-[#151515] text-[14px] mb-2">Monthly Limit</p>
                <h2 class="font-semibold text-[35px] text-[#cb8a2e] mb-2">
                    {{ formatIDR(selectedEPCType.default_limit) }}
                </h2>
                <p class="text-[#212121] text-[12px]">
                    The balance resets on the 1<span class="text-[7.74px]" style="vertical-align: top;">st</span> of every month.
                </p>
            </div>

            <!-- Description Text -->
            <div v-if="!isLoadingCards && maxDiscountPercentage > 0" class="mb-8">
                <p class="text-[#151515] text-[14px] leading-[20px]">
                    <span>Enjoy exclusive employee privileges with discounts of </span>
                    <span class="font-semibold">up to {{ maxDiscountPercentage }}% across our brand stores.</span>
                </p>
            </div>

            <!-- Discount Groups -->
            <div v-if="isLoadingDiscounts" class="space-y-4">
                <div 
                    v-for="i in 3" 
                    :key="i"
                    class="bg-[#f8f8f8] h-[171px] rounded-[10px] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] animate-pulse"
                ></div>
            </div>

            <div v-else-if="groupedDiscounts.length > 0" class="space-y-4 mb-8">
                <div 
                    v-for="group in groupedDiscounts" 
                    :key="group.percentage"
                    class="bg-[#f8f8f8] rounded-[10px] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] p-6"
                >
                    <h3 class="font-semibold text-[14px] text-black mb-4">
                        {{ group.percentage }}% Discount
                    </h3>
                    <div class="flex flex-wrap gap-4 items-center">
                        <div 
                            v-for="item in group.items" 
                            :key="item.sbu"
                            class="flex items-center justify-center"
                            :style="{ minWidth: '60px', maxHeight: '50px' }"
                        >
                            <img 
                                v-if="item.logo"
                                :src="item.logo" 
                                :alt="item.sbu"
                                class="max-h-[50px] max-w-[120px] object-contain"
                            />
                            <div 
                                v-else
                                class="w-12 h-12 bg-gray-200 rounded flex items-center justify-center"
                            >
                                <span class="text-xs text-gray-500 font-medium">{{ item.sbu?.charAt(0) || '?' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="!isLoadingDiscounts && groupedDiscounts.length === 0" class="text-center py-8">
                <p class="text-[#9f9f9f] text-[14px]">No discounts available for this card.</p>
            </div>

            <!-- Footer Links -->
            <div class="space-y-4 mt-8">
                <router-link 
                    to="/find-stores" 
                    class="flex justify-between items-center py-4"
                >
                    <p class="font-semibold text-[16px] text-[#212121]">Find Stores Near You</p>
                    <svg class="w-4 h-4" preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path id="Vector" d="M0 8C0 9.58225 0.469192 11.129 1.34824 12.4446C2.22729 13.7602 3.47672 14.7855 4.93853 15.391C6.40034 15.9965 8.00887 16.155 9.56072 15.8463C11.1126 15.5376 12.538 14.7757 13.6569 13.6569C14.7757 12.538 15.5376 11.1126 15.8463 9.56072C16.155 8.00887 15.9965 6.40034 15.391 4.93853C14.7855 3.47672 13.7602 2.22729 12.4446 1.34824C11.129 0.469192 9.58225 0 8 0C5.87827 0 3.84344 0.842854 2.34315 2.34315C0.842854 3.84344 0 5.87827 0 8ZM3.42857 7.42857H10.3714L7.18286 4.22457L8 3.42857L12.5714 8L8 12.5714L7.18286 11.756L10.3714 8.57143H3.42857V7.42857Z" fill="black"/>
                    </svg>
                </router-link>
                <div class="flex justify-between items-center py-4">
                    <p class="font-semibold text-[16px] text-[#212121]">Contact IT Support</p>
                    <svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4">
                        <path id="Vector" d="M0 8C0 9.58225 0.469192 11.129 1.34824 12.4446C2.22729 13.7602 3.47672 14.7855 4.93853 15.391C6.40034 15.9965 8.00887 16.155 9.56072 15.8463C11.1126 15.5376 12.538 14.7757 13.6569 13.6569C14.7757 12.538 15.5376 11.1126 15.8463 9.56072C16.155 8.00887 15.9965 6.40034 15.391 4.93853C14.7855 3.47672 13.7602 2.22729 12.4446 1.34824C11.129 0.469192 9.58225 0 8 0C5.87827 0 3.84344 0.842854 2.34315 2.34315C0.842854 3.84344 0 5.87827 0 8ZM3.42857 7.42857H10.3714L7.18286 4.22457L8 3.42857L12.5714 8L8 12.5714L7.18286 11.756L10.3714 8.57143H3.42857V7.42857Z" fill="black"/>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import Navbar from '@/components/ui/navbar/Navbar.vue';
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue';
import IconArrowRight from '@/components/icons/IconArrowRight.vue';
import { fetchUserCards } from '@/components/lib/card';
import { getCardTypes } from '@/components/lib/card';
import { fetchBrands } from '@/components/lib/brand';
import { Card } from '@/components/pages/home/useCardStack';
import { UserCardResponse, EPCType, EPCTypeDiscount } from '@/components/lib/types';
import { Brand } from '@/components/lib/brand';

interface DiscountGroup {
    percentage: number;
    items: Array<{
        sbu: string;
        logo: string;
    }>;
}

// State management
const cards = ref<Card[]>([]);
const cardRawData = ref<UserCardResponse[]>([]);
const selectedCardIndex = ref<number>(0);
const epcTypes = ref<EPCType[]>([]);
const brands = ref<Brand[]>([]);
const isLoadingCards = ref(false);
const isLoadingDiscounts = ref(false);

// Computed properties
const selectedCard = computed(() => {
    return cards.value[selectedCardIndex.value] || null;
});

const selectedCardRaw = computed(() => {
    return cardRawData.value[selectedCardIndex.value] || null;
});

const selectedEPCType = computed(() => {
    if (!selectedCard.value) return null;
    return epcTypes.value.find(type => type.name === selectedCard.value.epcType) || null;
});

const groupedDiscounts = computed((): DiscountGroup[] => {
    if (!selectedEPCType.value || !selectedEPCType.value.discount) {
        return [];
    }

    // Create a map to group discounts by percentage
    const discountMap = new Map<number, Array<{ sbu: string; logo: string }>>();

    selectedEPCType.value.discount.forEach((discount: EPCTypeDiscount) => {
        const percentage = discount.discount_percentage;
        if (!discountMap.has(percentage)) {
            discountMap.set(percentage, []);
        }

        // Find brand logo for this SBU
        const brand = brands.value.find(b => 
            b.name.toLowerCase() === discount.sbu.toLowerCase() ||
            b.name === discount.sbu
        );

        discountMap.get(percentage)!.push({
            sbu: discount.sbu,
            logo: brand?.logo || ''
        });
    });

    // Convert map to array and sort by percentage (descending)
    const groups: DiscountGroup[] = Array.from(discountMap.entries())
        .map(([percentage, items]) => ({
            percentage,
            items
        }))
        .sort((a, b) => b.percentage - a.percentage);

    return groups;
});

const maxDiscountPercentage = computed(() => {
    if (groupedDiscounts.value.length === 0) return 0;
    return Math.max(...groupedDiscounts.value.map(g => g.percentage));
});

// Helper functions
function formatIDR(amount: number): string {
    const formatted = Math.abs(amount)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `IDR ${formatted}`;
}

function selectPreviousCard() {
    if (selectedCardIndex.value > 0) {
        selectedCardIndex.value--;
    } else {
        selectedCardIndex.value = cards.value.length - 1;
    }
}

function selectNextCard() {
    if (selectedCardIndex.value < cards.value.length - 1) {
        selectedCardIndex.value++;
    } else {
        selectedCardIndex.value = 0;
    }
}

// Fetch data
async function loadCards() {
    isLoadingCards.value = true;
    try {
        const fetchedCards = await fetchUserCards();
        cards.value = fetchedCards;

        // Fetch raw card data for balance display
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
}

async function loadEPCTypes() {
    isLoadingDiscounts.value = true;
    try {
        const types = await getCardTypes();
        epcTypes.value = types;
    } catch (error) {
        console.error('Error fetching EPC Types:', error);
        epcTypes.value = [];
    } finally {
        isLoadingDiscounts.value = false;
    }
}

async function loadBrands() {
    try {
        const fetchedBrands = await fetchBrands();
        brands.value = fetchedBrands;
    } catch (error) {
        console.error('Error fetching brands:', error);
        brands.value = [];
    }
}

// Lifecycle
onMounted(async () => {
    await Promise.all([
        loadCards(),
        loadEPCTypes(),
        loadBrands()
    ]);
});
</script>
