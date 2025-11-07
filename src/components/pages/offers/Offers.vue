<template>
    <div class="bg-[#f8f8f8] min-h-screen pb-32">
        <div class="shadow-xl w-full px-6 py-8 rounded-b-xl bg-[#f8f8f8]">
            <Navbar>
                <h2 class="font-bold text-xl">
                    Employee Offers
                </h2>
            </Navbar>
            
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
            </div>
        </div>

        <div class="px-6 py-4 space-y-4">
            <div 
                v-for="(offer, index) in filteredOffers" 
                :key="index"
                @click="openOfferDetail(offer)"
                class="bg-[#f8f8f8] rounded-[10px] shadow-[0px_0px_10.8px_0px_rgba(0,0,0,0.1)] overflow-hidden w-full cursor-pointer"
            >
                <div class="h-[158px] w-full">
                    <img 
                        :src="offer.image" 
                        :alt="offer.title"
                        class="w-full h-full object-cover rounded-t-[10px]"
                    />
                </div>
                <div class="p-4 relative">
                    <p class="text-[10px] text-black text-right mb-2">
                        Ends in {{ offer.daysLeft }} days
                    </p>
                    <p class="text-xs text-[#212121] leading-[17px]">
                        {{ offer.description }}
                    </p>
                </div>
            </div>
        </div>

        <div class="fixed bottom-0 left-0 right-0 bg-[#f8f8f8] shadow-[0px_0px_19.4px_13px_rgba(0,0,0,0.1)] rounded-tl-[10px] rounded-tr-[10px] px-6 py-4">
            <p class="text-center text-base font-bold text-[#151515]">
                Have a code? 
                <span class="underline cursor-pointer" @click="openCodeInput">
                    Type your code here.
                </span>
            </p>
        </div>

        <Modal
            :show="showRedeemModal"
            :maxWidth="'sm'"
            @close="closeRedeemModal"
        >
            <template v-slot="{ propertyModal }">
                <RedeemCodeInput
                    @close="closeRedeemModal"
                    @redeem="handleRedeem"
                />
            </template>
        </Modal>

        <Modal
            :show="showOfferDetailModal"
            :maxWidth="'sm'"
            @close="closeOfferDetailModal"
        >
            <template v-slot="{ propertyModal }">
                <OfferDetail
                    v-if="selectedOffer"
                    :offer="selectedOffer"
                    @close="closeOfferDetailModal"
                    @redeem="handleOfferRedeem"
                />
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Navbar from '@/components/ui/navbar/Navbar.vue';
import Modal from '@/components/ui/modal/Modal.vue';
import RedeemCodeInput from '@/components/pages/offers/RedeemCodeInput.vue';
import OfferDetail from '@/components/pages/offers/OfferDetail.vue';

const activeTab = ref<'ongoing' | 'used'>('ongoing');
const showRedeemModal = ref(false);
const showOfferDetailModal = ref(false);
const selectedOffer = ref<any>(null);

const offers = [
    {
        id: 1,
        title: 'LAST DROP 60% OFF',
        description: 'LAST DROP 60% OFF! Get Melissa\'s last stock in selected store. Tnc Applied',
        image: 'http://localhost:3845/assets/19e0e23bc398edab69e7b91c4138c7eb357ba28d.png',
        daysLeft: 5,
        status: 'ongoing',
        terms: [
            'Valid for selected stores only',
            'Cannot be combined with other promotions',
            'Subject to stock availability',
            'Valid until expiration date'
        ],
        additionalInfo: 'This offer is exclusive for employees. Please present your employee ID when redeeming.'
    },
    {
        id: 2,
        title: 'LAST DROP 60% OFF',
        description: 'LAST DROP 60% OFF! Get Melissa\'s last stock in selected store. Tnc Applied',
        image: 'http://localhost:3845/assets/19e0e23bc398edab69e7b91c4138c7eb357ba28d.png',
        daysLeft: 5,
        status: 'ongoing',
        terms: [
            'Valid for selected stores only',
            'Cannot be combined with other promotions',
            'Subject to stock availability',
            'Valid until expiration date'
        ],
        additionalInfo: 'This offer is exclusive for employees. Please present your employee ID when redeeming.'
    },
    {
        id: 3,
        title: 'LAST DROP 60% OFF',
        description: 'LAST DROP 60% OFF! Get Melissa\'s last stock in selected store. Tnc Applied',
        image: 'http://localhost:3845/assets/19e0e23bc398edab69e7b91c4138c7eb357ba28d.png',
        daysLeft: 5,
        status: 'ongoing',
        terms: [
            'Valid for selected stores only',
            'Cannot be combined with other promotions',
            'Subject to stock availability',
            'Valid until expiration date'
        ],
        additionalInfo: 'This offer is exclusive for employees. Please present your employee ID when redeeming.'
    },
    {
        id: 4,
        title: 'LAST DROP 60% OFF',
        description: 'LAST DROP 60% OFF! Get Melissa\'s last stock in selected store. Tnc Applied',
        image: 'http://localhost:3845/assets/19e0e23bc398edab69e7b91c4138c7eb357ba28d.png',
        daysLeft: 5,
        status: 'used',
        terms: [
            'Valid for selected stores only',
            'Cannot be combined with other promotions',
            'Subject to stock availability',
            'Valid until expiration date'
        ],
        additionalInfo: 'This offer is exclusive for employees. Please present your employee ID when redeeming.'
    }
];

const filteredOffers = computed(() => {
    return offers.filter(offer => offer.status === activeTab.value);
});

const openCodeInput = () => {
    showRedeemModal.value = true;
};

const closeRedeemModal = () => {
    showRedeemModal.value = false;
};

const openOfferDetail = (offer: any) => {
    selectedOffer.value = offer;
    showOfferDetailModal.value = true;
};

const closeOfferDetailModal = () => {
    showOfferDetailModal.value = false;
    selectedOffer.value = null;
};

const handleRedeem = (code: string) => {
    // TODO: Implement redeem logic
    console.log('Redeeming code:', code);
    // After successful redeem, you might want to refresh offers or show success message
};

const handleOfferRedeem = (offer: any) => {
    // TODO: Implement redeem logic for offer
    console.log('Redeeming offer:', offer);
    // After successful redeem, you might want to refresh offers or show success message
};
</script>

