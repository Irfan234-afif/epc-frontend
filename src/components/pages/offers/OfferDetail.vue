<template>
    <div class="bg-[#f8f8f8] rounded-tl-[10px] rounded-tr-[10px] shadow-[0px_0px_19.4px_13px_rgba(0,0,0,0.1)] w-full max-h-[90vh] overflow-y-auto">
        <div class="relative">
            <!-- Close button -->
            <button
                @click="$emit('close')"
                class="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/80 rounded-full hover:bg-white transition-colors"
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L4 12M4 4L12 12" stroke="#151515" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>

            <!-- Offer Image -->
            <div class="h-[200px] w-full">
                <img 
                    :src="offer.image" 
                    :alt="offer.title"
                    class="w-full h-full object-cover rounded-tl-[10px] rounded-tr-[10px]"
                />
            </div>

            <!-- Offer Content -->
            <div class="p-6">
                <!-- Title and Expiry -->
                <div class="mb-4">
                    <h2 class="text-xl font-semibold text-[#151515] mb-2">
                        {{ offer.title }}
                    </h2>
                    <p class="text-[10px] text-black text-right mb-4">
                        Ends in {{ offer.daysLeft }} days
                    </p>
                </div>

                <!-- Description -->
                <div class="mb-6">
                    <p class="text-sm text-[#212121] leading-[17px] mb-4">
                        {{ offer.description }}
                    </p>
                    
                    <!-- Terms & Conditions -->
                    <div v-if="offer.terms" class="mt-4">
                        <h3 class="text-xs font-semibold text-[#151515] mb-2">Terms & Conditions:</h3>
                        <ul class="text-xs text-[#212121] leading-[17px] list-disc list-inside space-y-1">
                            <li v-for="(term, index) in offer.terms" :key="index">
                                {{ term }}
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Additional Info -->
                <div v-if="offer.additionalInfo" class="mb-6 p-4 bg-white/50 rounded-[5px]">
                    <p class="text-xs text-[#212121] leading-[17px]">
                        {{ offer.additionalInfo }}
                    </p>
                </div>

                <!-- Action Buttons -->
                <div class="space-y-3">
                    <button
                        @click="handleRedeem"
                        class="w-full bg-[#212121] text-white font-semibold text-base tracking-[0.32px] h-[45px] rounded-[5px]"
                    >
                        Redeem Now
                    </button>
                    <button
                        @click="$emit('close')"
                        class="w-full bg-transparent border border-black text-black font-semibold text-base h-[45px] rounded-[5px]"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    offer: {
        id: number;
        title: string;
        description: string;
        image: string;
        daysLeft: number;
        status: string;
        terms?: string[];
        additionalInfo?: string;
    };
}>();

const emit = defineEmits(['close', 'redeem']);

const handleRedeem = () => {
    emit('redeem', props.offer);
    emit('close');
};
</script>

