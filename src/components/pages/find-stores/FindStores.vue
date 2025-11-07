<template>
    <div class="bg-[#f8f8f8] min-h-screen pb-8">
        <!-- Header Section -->
        <div class="bg-[#f8f8f8] h-48 relative">
            <div class="px-6 pt-8 pb-4">
                <Navbar>
                    <div class="flex items-center justify-between w-full">
                        <h2 class="font-bold text-2xl text-[#151515]">
                            Find stores
                        </h2>
                    </div>
                </Navbar>
            </div>
            
            <!-- Search Bar -->
            <div class="px-6 mt-4">
                <div class="bg-white h-11 rounded shadow-sm flex items-center justify-between px-4">
                    <p class="font-bold text-base text-[#151515]">{{ selectedBrand?.name || 'Select Brand' }}</p>
                    <button 
                        @click="openBrandModal"
                        class="text-[#cb8a2e] text-xs font-bold"
                    >
                        Change
                    </button>
                </div>
            </div>
        </div>

        <!-- Store List -->
        <div class="px-6 mt-8 space-y-4">
            <div 
                v-for="(store, index) in stores" 
                :key="index"
                class="relative"
            >
                <!-- Store Image -->
                <div class="h-96 w-full rounded-lg overflow-hidden relative">
                    <img 
                        :src="store.image" 
                        :alt="store.name"
                        class="w-full h-full object-cover rounded-lg"
                    />
                    
                    <!-- Store Info Overlay -->
                    <div class="absolute bottom-5 left-5 right-5">
                        <div class="backdrop-blur-sm bg-[rgba(255,255,255,0.9)] h-24 rounded-lg shadow-md relative">
                            <div class="flex items-start justify-between h-full px-5 pt-5 pb-5">
                                <div class="flex-1">
                                    <p class="font-bold text-sm text-[#212121] leading-tight mb-0">
                                        {{ store.name }}
                                    </p>
                                    <p class="font-bold text-sm text-[#212121] leading-tight mb-0">
                                        {{ store.location }}
                                    </p>
                                    <p class="font-normal text-xs text-[#212121] leading-tight mt-3">
                                        {{ store.distance }} | {{ store.status }} • {{ store.hours }}
                                    </p>
                                </div>
                                
                                <!-- Action Buttons -->
                                <div class="flex items-center gap-3 ml-4">
                                    <button 
                                        @click="handleCall(store.phone)"
                                        class="w-8 h-8 flex items-center justify-center cursor-pointer mt-0.5"
                                    >
                                        <img 
                                            src="http://localhost:3845/assets/73e7bfd179cf7837754c6675c06ad680f681c681.svg" 
                                            alt="Call" 
                                            class="w-full h-full"
                                        />
                                    </button>
                                    <button 
                                        @click="handleDirection(store)"
                                        class="w-6 h-6 flex items-center justify-center cursor-pointer mt-1"
                                    >
                                        <img 
                                            src="http://localhost:3845/assets/962250426a5adf0f47a0ed2e4d27da47f9c0f8e7.svg" 
                                            alt="Direction" 
                                            class="w-full h-full"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Brand Selection Modal -->
        <Modal
            :show="showBrandModal"
            :maxWidth="'md'"
            @close="closeBrandModal"
        >
            <template v-slot="{ propertyModal }">
                <BrandSelector
                    :selectedBrandId="selectedBrand?.id"
                    @close="closeBrandModal"
                    @select="handleBrandSelect"
                />
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Navbar from '@/components/ui/navbar/Navbar.vue';
import Modal from '@/components/ui/modal/Modal.vue';
import BrandSelector from '@/components/pages/find-stores/BrandSelector.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

interface Brand {
    id: number;
    name: string;
    logo: string;
}

const showBrandModal = ref(false);
const selectedBrand = ref<Brand | null>({
    id: 1,
    name: 'Fred Perry',
    logo: 'http://localhost:3845/assets/9524e1ce4deeba62a8ef153c6df0dd1528eb20bf.png'
});

const openBrandModal = () => {
    showBrandModal.value = true;
};

const closeBrandModal = () => {
    showBrandModal.value = false;
};

const handleBrandSelect = (brand: Brand) => {
    selectedBrand.value = brand;
    // TODO: Filter stores based on selected brand
    // You can add logic here to filter stores by brand
};

interface Store {
    name: string;
    location: string;
    distance: string;
    status: string;
    hours: string;
    image: string;
    phone: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

const stores = ref<Store[]>([
    {
        name: 'Fred Perry',
        location: 'Grand Indonesia',
        distance: '1.3 km',
        status: 'Open',
        hours: '10:00 - 22:00',
        image: '/stores/store fred perry.png',
        phone: '+62-21-12345678',
        coordinates: { lat: -6.1944, lng: 106.8229 }
    },
    {
        name: 'Fred Perry',
        location: 'Plaza Indonesia',
        distance: '1.5 km',
        status: 'Open',
        hours: '10:00 - 22:00',
        image: '/stores/store fred perry 1.png',
        phone: '+62-21-12345679',
        coordinates: { lat: -6.1944, lng: 106.8229 }
    },
    {
        name: 'Fred Perry',
        location: 'Plaza Senayan',
        distance: '2.9 km',
        status: 'Open',
        hours: '10:00 - 22:00',
        image: '/stores/store fred perry 2.png',
        phone: '+62-21-12345680',
        coordinates: { lat: -6.2277, lng: 106.8003 }
    },
    {
        name: 'Fred Perry',
        location: 'Grand Indonesia',
        distance: '1.3 km',
        status: 'Open',
        hours: '10:00 - 22:00',
        image: '/stores/store fred perry 1.png',
        phone: '+62-21-12345681',
        coordinates: { lat: -6.1944, lng: 106.8229 }
    }
]);

const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
};

const handleDirection = (store: Store) => {
    if (store.coordinates) {
        // Open in Google Maps or default maps app
        const url = `https://www.google.com/maps/dir/?api=1&destination=${store.coordinates.lat},${store.coordinates.lng}`;
        window.open(url, '_blank');
    }
};
</script>

