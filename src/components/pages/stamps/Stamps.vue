<template>
    <div class="bg-[#f8f8f8] min-h-screen pb-32">
        <div class="shadow-xl w-full px-6 py-8 rounded-b-xl bg-[#f8f8f8]">
            <Navbar>
                <h2 class="font-bold text-[22px] text-[#151515]">
                    707STAMP
                </h2>
            </Navbar>
            
            <div class="mt-6">
                <p class="text-[14px] text-[#212121] leading-[20px] tracking-[0.28px]">
                    Redeem exclusive rewards from the brand by earn a stamp with every purchase.
                </p>
            </div>

            <div class="mt-8 flex items-center gap-2">
                <button 
                    @click="activeTab = 'ongoing'"
                    :class="[
                        'h-[31px] rounded-[5px] px-4 text-xs font-bold tracking-[0.24px]',
                        activeTab === 'ongoing' 
                            ? 'bg-[#cb8a2e] text-white' 
                            : 'border border-black text-black'
                    ]"
                >
                    On-going
                </button>
                <button 
                    @click="activeTab = 'used'"
                    :class="[
                        'h-[31px] rounded-[5px] px-4 text-xs font-bold tracking-[0.24px]',
                        activeTab === 'used' 
                            ? 'bg-[#cb8a2e] text-white' 
                            : 'border border-black text-black'
                    ]"
                >
                    Used
                </button>
                <button 
                    @click="activeTab = 'upcoming'"
                    :class="[
                        'h-[31px] rounded-[5px] px-4 text-xs font-bold tracking-[0.24px]',
                        activeTab === 'upcoming' 
                            ? 'bg-[#cb8a2e] text-white' 
                            : 'border border-black text-black'
                    ]"
                >
                    Upcoming
                </button>
            </div>

            <div class="mt-6 flex items-center justify-between">
                <p class="text-base font-bold text-[#212121]">
                    View redeemed e-voucher
                </p>
                <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 8C0 9.58225 0.469192 11.129 1.34824 12.4446C2.22729 13.7602 3.47672 14.7855 4.93853 15.391C6.40034 15.9965 8.00887 16.155 9.56072 15.8463C11.1126 15.5376 12.538 14.7757 13.6569 13.6569C14.7757 12.538 15.5376 11.1126 15.8463 9.56072C16.155 8.00887 15.9965 6.40034 15.391 4.93853C14.7855 3.47672 13.7602 2.22729 12.4446 1.34824C11.129 0.469192 9.58225 0 8 0C5.87827 0 3.84344 0.842854 2.34315 2.34315C0.842854 3.84344 0 5.87827 0 8ZM3.42857 7.42857H10.3714L7.18286 4.22457L8 3.42857L12.5714 8L8 12.5714L7.18286 11.756L10.3714 8.57143H3.42857V7.42857Z" fill="black"/>
                </svg>
            </div>
        </div>

        <div class="px-6 py-4 space-y-4">
            <div 
                v-for="(stamp, index) in filteredStamps" 
                :key="index"
                @click="openStampDetail(stamp)"
                class="bg-[#f8f8f8] rounded-[10px] shadow-[0px_0px_10.8px_0px_rgba(0,0,0,0.1)] overflow-hidden w-full cursor-pointer"
            >
                <div class="h-[158px] w-full">
                    <img 
                        :src="stamp.image" 
                        :alt="stamp.title"
                        class="w-full h-full object-cover rounded-t-[10px]"
                    />
                </div>
                <div class="p-4 relative">
                    <div class="mb-2">
                        <p class="text-xs text-[#212121] leading-[17px]">
                            {{ stamp.description }}
                        </p>
                    </div>
                    <div class="flex items-center justify-between mt-4">
                        <p class="text-xs font-bold text-black">
                            Total Stamp: {{ stamp.currentStamps }} of {{ stamp.totalStamps }}
                        </p>
                        <p 
                            :class="[
                                'text-[10px] font-bold text-right',
                                stamp.status === 'ongoing' ? 'text-[#cb8a2e]' : 'text-black'
                            ]"
                        >
                            Ends in {{ stamp.daysLeft }} days
                        </p>
                    </div>
                    <button 
                        v-if="stamp.canRedeem"
                        @click.stop="handleRedeem(stamp)"
                        class="w-full mt-4 bg-[#cb8a2e] text-white text-base font-semibold rounded-[5px] h-[45px] tracking-[0.32px]"
                    >
                        Redeem
                    </button>
                </div>
            </div>
        </div>

        <Modal
            :show="showStampDetailModal"
            :maxWidth="'sm'"
            @close="closeStampDetailModal"
        >
            <template v-slot="{ propertyModal }">
                <StampDetail
                    v-if="selectedStamp"
                    :stamp="selectedStamp"
                    @close="closeStampDetailModal"
                />
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Navbar from '@/components/ui/navbar/Navbar.vue';
import Modal from '@/components/ui/modal/Modal.vue';
import StampDetail from '@/components/pages/stamps/StampDetail.vue';

const activeTab = ref<'ongoing' | 'used' | 'upcoming'>('ongoing');
const showStampDetailModal = ref(false);
const selectedStamp = ref<any>(null);

const stamps = [
    {
        id: 1,
        title: 'LAST DROP 60% OFF',
        description: 'LAST DROP 60% OFF! Get Melissa\'s last stock in selected store. Tnc Applied',
        image: 'http://localhost:3845/assets/19e0e23bc398edab69e7b91c4138c7eb357ba28d.png',
        currentStamps: 10,
        totalStamps: 10,
        daysLeft: 11,
        status: 'ongoing',
        canRedeem: true
    },
    {
        id: 2,
        title: 'LAST DROP 60% OFF',
        description: 'LAST DROP 60% OFF! Get Melissa\'s last stock in selected store. Tnc Applied',
        image: 'http://localhost:3845/assets/59c52763263211d8951f52c9aaca4b8696f4dbf3.png',
        currentStamps: 5,
        totalStamps: 10,
        daysLeft: 11,
        status: 'ongoing',
        canRedeem: false
    },
    {
        id: 3,
        title: 'STANLEY SUMMER LIMITED COLLECTION',
        description: 'STANLEY SUMMER LIMITED COLLECTION. Get Free by completing this challenge!',
        image: 'http://localhost:3845/assets/d3aada1f49c13485c822e7aa8d9be082b9616c4a.png',
        currentStamps: 8,
        totalStamps: 10,
        daysLeft: 4,
        status: 'ongoing',
        canRedeem: false
    },
    {
        id: 4,
        title: 'STANLEY SUMMER LIMITED COLLECTION',
        description: 'STANLEY SUMMER LIMITED COLLECTION. Get Free by completing this challenge!',
        image: 'http://localhost:3845/assets/d3aada1f49c13485c822e7aa8d9be082b9616c4a.png',
        currentStamps: 10,
        totalStamps: 10,
        daysLeft: 0,
        status: 'used',
        canRedeem: false
    },
    {
        id: 5,
        title: 'UPCOMING CHALLENGE',
        description: 'New challenge coming soon! Stay tuned for exciting rewards.',
        image: 'http://localhost:3845/assets/d3aada1f49c13485c822e7aa8d9be082b9616c4a.png',
        currentStamps: 0,
        totalStamps: 10,
        daysLeft: 30,
        status: 'upcoming',
        canRedeem: false
    }
];

const filteredStamps = computed(() => {
    return stamps.filter(stamp => stamp.status === activeTab.value);
});

const openStampDetail = (stamp: any) => {
    selectedStamp.value = stamp;
    showStampDetailModal.value = true;
};

const closeStampDetailModal = () => {
    showStampDetailModal.value = false;
    selectedStamp.value = null;
};

const handleRedeem = (stamp: any) => {
    // TODO: Implement redeem logic
    console.log('Redeeming stamp:', stamp);
    // After successful redeem, you might want to refresh stamps or show success message
};
</script>

