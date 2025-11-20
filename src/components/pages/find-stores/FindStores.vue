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
                        class="text-[#cb8a2e] text-xs font-bold h-full px-4"
                    >
                        Change
                    </button>
                </div>
            </div>
        </div>

        <!-- Store List -->
        <div class="px-6 mt-8">
            <div v-if="isLoadingStores" class="flex items-center justify-center py-8">
                <p class="text-[#151515]">Loading stores...</p>
            </div>
            <div v-else-if="stores.length === 0" class="flex items-center justify-center py-8">
                <p class="text-[#151515]">No stores available</p>
            </div>
            <div v-else class="space-y-4">
                <div 
                    v-for="(store, index) in stores" 
                    :key="store.name || index"
                    class="relative"
                >
                    <!-- Store Image -->
                    <div class="h-96 w-full rounded-lg overflow-hidden relative">
                        <img 
                            v-if="store.image"
                            :src="store.image" 
                            :alt="store.name"
                            class="w-full h-full object-cover rounded-lg"
                        />
                        <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                            <p class="text-gray-400">No image</p>
                        </div>
                        
                        <!-- Store Info Overlay -->
                        <div class="absolute bottom-5 left-5 right-5">
                            <div class="backdrop-blur-sm bg-[rgba(255,255,255,0.9)] h-24 rounded-lg shadow-md relative">
                                <div class="flex items-start justify-between h-full px-5 pt-5 pb-5">
                                    <div class="flex-1">
                                        <p class="font-bold text-sm text-[#212121] leading-tight mb-0">
                                            {{ store.showroom_name || store.name }}
                                        </p>
                                        <p class="font-bold text-sm text-[#212121] leading-tight mb-0">
                                            {{ store.location }}
                                        </p>
                                    <p class="font-normal text-xs text-[#212121] leading-tight mt-3">
                                        <span v-if="store.distance">{{ store.distance }} | </span>{{ store.status }} • {{ store.hours }}
                                    </p>
                                    </div>
                                    
                                    <!-- Action Buttons -->
                                    <div class="flex items-center gap-1 ml-4">
                                        <button 
                                            v-if="store.phone"
                                            @click="handleCall(store.phone)"
                                            class="w-12 h-12 flex items-center justify-center cursor-pointer mt-0.5"
                                        >
                                            <IconPhone class="w-8 h-8" />
                                        </button>
                                        <button 
                                            @click="handleDirection(store)"
                                            class="w-12 h-12 flex items-center justify-center cursor-pointer mt-1"
                                        >
                                            <IconDirection class="w-6 h-6" />
                                        </button>
                                    </div>
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

        <!-- Location Permission Modal -->
        <Modal
            :show="showLocationModal"
            :maxWidth="'sm'"
            :closeable="false"
            @close="closeLocationModal"
        >
            <template v-slot="{ propertyModal }">
                <LocationPermissionModal
                    @allow="handleLocationAllow"
                    @skip="handleLocationSkip"
                />
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import Navbar from '@/components/ui/navbar/Navbar.vue';
import Modal from '@/components/ui/modal/Modal.vue';
import BrandSelector from '@/components/pages/find-stores/BrandSelector.vue';
import LocationPermissionModal from '@/components/pages/find-stores/LocationPermissionModal.vue';
import { useRouter } from 'vue-router';
import { type Brand } from '@/components/lib/brand';
import { type Showroom, fetchShowroomsBySBU, getUserLocation } from '@/components/lib/showroom';
import IconPhone from '@/components/icons/IconPhone.vue';
import IconDirection from '@/components/icons/IconDirection.vue';

const router = useRouter();

const LOCATION_PERMISSION_KEY = 'location_permission_asked';

const showBrandModal = ref(false);
const showLocationModal = ref(false);
const selectedBrand = ref<Brand | null>(null);
const stores = ref<Showroom[]>([]);
const isLoadingStores = ref(false);
const userLocation = ref<{ latitude: number; longitude: number } | null>(null);

// Check if location permission has been asked before
const hasAskedLocationPermission = (): boolean => {
    try {
        return localStorage.getItem(LOCATION_PERMISSION_KEY) === 'true';
    } catch {
        return false;
    }
};

// Mark location permission as asked
const markLocationPermissionAsked = (): void => {
    try {
        localStorage.setItem(LOCATION_PERMISSION_KEY, 'true');
    } catch (error) {
        console.error('Failed to save location permission status:', error);
    }
};

// Get user location on mount
onMounted(async () => {
    // Check if we've asked for location permission before
    const hasAsked = hasAskedLocationPermission();
    
    if (!hasAsked) {
        // Show modal to ask for permission
        showLocationModal.value = true;
    } else {
        // Try to get location silently
        try {
            const location = await getUserLocation();
            userLocation.value = location;
        } catch (error) {
            console.error('Failed to get user location:', error);
            userLocation.value = null;
        }
    }
    
    await loadStores();
});

// Watch for brand changes and reload stores
watch(selectedBrand, async (newBrand) => {
    if (newBrand) {
        await loadStores();
    }
});

const loadStores = async () => {
    // if (!selectedBrand.value) {
    //     stores.value = [];
    //     return;
    // }

    isLoadingStores.value = true;
    try {
        const showrooms = await fetchShowroomsBySBU(
            selectedBrand.value?.name,
            userLocation.value
        );
        stores.value = showrooms;
    } catch (error) {
        console.error('Failed to load stores:', error);
        stores.value = [];
    } finally {
        isLoadingStores.value = false;
    }
};

const openBrandModal = () => {
    showBrandModal.value = true;
};

const closeBrandModal = () => {
    showBrandModal.value = false;
};

const handleBrandSelect = async (brand: Brand) => {
    selectedBrand.value = brand;
    await loadStores();
};

const handleLocationAllow = (location: { latitude: number; longitude: number }) => {
    userLocation.value = location;
    markLocationPermissionAsked();
    showLocationModal.value = false;
    // Reload stores with location
    loadStores();
};

const handleLocationSkip = () => {
    markLocationPermissionAsked();
    showLocationModal.value = false;
    userLocation.value = null;
    // Reload stores without location
    loadStores();
};

const closeLocationModal = () => {
    // Don't allow closing without action
    // User must choose Allow or Skip
};

const handleCall = (phone: string) => {
    if (phone) {
        window.location.href = `tel:${phone}`;
    }
};

const handleDirection = (store: Showroom) => {
    if (store.coordinates) {
        // Open in Google Maps or default maps app
        const url = `https://www.google.com/maps/dir/?api=1&destination=${store.coordinates.lat},${store.coordinates.lng}`;
        window.open(url, '_blank');
    }
};
</script>

