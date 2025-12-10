<template>
    <div class="bg-white rounded-lg w-full p-6">
        <div class="flex flex-col items-center text-center">
            <!-- Icon or Image -->
            <div class="w-16 h-16 mb-4 flex items-center justify-center">
                <svg class="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#cb8a2e"/>
                </svg>
            </div>
            
            <!-- Title -->
            <h2 class="font-semibold text-xl text-[#151515] mb-2">
                Enable Location Access
            </h2>
            
            <!-- Description -->
            <p class="text-sm text-[#666] mb-6 leading-relaxed">
                We need your location to show you the nearest stores and calculate distances accurately.
            </p>
            
            <!-- Buttons -->
            <div class="flex flex-col gap-3 w-full">
                <button
                    @click="handleAllow"
                    :disabled="isRequesting"
                    class="bg-[#cb8a2e] text-white font-semibold py-3 px-6 rounded-lg transition-all hover:bg-[#b87a26] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {{ isRequesting ? 'Requesting...' : 'Allow Location' }}
                </button>
                <button
                    @click="handleSkip"
                    :disabled="isRequesting"
                    class="bg-transparent text-[#151515] font-semibold py-3 px-6 rounded-lg border border-[#e0e0e0] transition-all hover:bg-[#f8f8f8] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Skip for Now
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getUserLocation } from '@/components/lib/showroom';

const emit = defineEmits<{
    (e: 'allow', location: { latitude: number; longitude: number }): void;
    (e: 'skip'): void;
}>();

const isRequesting = ref(false);

const handleAllow = async () => {
    isRequesting.value = true;
    try {
        const location = await getUserLocation();
        if (location) {
            emit('allow', location);
        } else {
            // Permission denied
            emit('skip');
        }
    } catch (error) {
        console.error('Error getting location:', error);
        emit('skip');
    } finally {
        isRequesting.value = false;
    }
};

const handleSkip = () => {
    emit('skip');
};
</script>

