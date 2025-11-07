<template>
    <div class="bg-[#f8f8f8] rounded-tl-[10px] rounded-tr-[10px] shadow-[0px_0px_19.4px_13px_rgba(0,0,0,0.1)] w-full max-h-[90vh] overflow-y-auto">
        <div class="relative">
            <!-- Stamp Image -->
            <div class="h-[197px] w-full">
                <img 
                    :src="stamp.image" 
                    :alt="stamp.title"
                    class="w-full h-full object-cover rounded-tl-[10px] rounded-tr-[10px]"
                />
            </div>

            <!-- Stamp Content -->
            <div class="px-[23px] py-6">
                <!-- Title -->
                <div class="mb-6">
                    <h2 class="text-base font-bold text-[#212121] leading-[23px]">
                        {{ stamp.description }}
                    </h2>
                </div>

                <!-- Stamp Grid -->
                <div class="mb-8">
                    <div class="grid grid-cols-5 gap-4 justify-items-center">
                        <div 
                            v-for="(stampNumber, index) in stampNumbers" 
                            :key="index"
                            :class="[
                                'w-[35px] h-[35px] rounded-full flex items-center justify-center text-base font-semibold tracking-[0.32px]',
                                stampNumber <= stamp.currentStamps 
                                    ? 'bg-[#cb8a2e] text-white' 
                                    : 'border border-black text-black'
                            ]"
                        >
                            {{ stampNumber }}
                        </div>
                    </div>
                </div>

                <!-- How to get a stamp -->
                <div class="mb-6">
                    <h3 class="text-xs font-normal text-[#0f181f] mb-2 leading-[19px] tracking-[0.36px]">
                        How to get a stamp?
                    </h3>
                    <ol class="text-xs text-[#0f181f] leading-[19px] tracking-[0.36px] list-decimal ml-5 space-y-1">
                        <li>Berlaku hanya untuk pembelian melalui website [brand].id.</li>
                        <li>Masukkan kode voucher di halaman checkout untuk mendapatkan potongan harga.</li>
                        <li>Tidak berlaku untuk pembelian gift card, e-voucher, atau produk kolaborasi.</li>
                        <li>Voucher tidak dapat diuangkan dan tidak dapat diganti jika hilang atau kedaluwarsa.</li>
                        <li>Berlaku s.d. 30 November 2025.</li>
                    </ol>
                </div>

                <!-- Close Button -->
                <button
                    @click="$emit('close')"
                    class="w-full border border-black text-black font-bold text-base tracking-[0.32px] h-[45px] rounded-[5px]"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    stamp: {
        id: number;
        title: string;
        description: string;
        image: string;
        currentStamps: number;
        totalStamps: number;
        daysLeft: number;
        status: string;
        canRedeem: boolean;
    };
}>();

const emit = defineEmits(['close']);

// Generate array of stamp numbers (1 to totalStamps)
const stampNumbers = Array.from({ length: props.stamp.totalStamps }, (_, i) => i + 1);
</script>

