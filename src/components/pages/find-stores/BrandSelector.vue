<template>
    <div class="bg-[#f8f8f8] rounded-lg w-full">
        <div class="p-6">
            <div class="flex items-center justify-between mb-6">
                <h2 class="font-semibold text-2xl text-[#151515]">
                    Select brands
                </h2>
                <button 
                    @click="$emit('close')"
                    class="w-8 h-8 cursor-pointer flex justify-center items-center"
                >
                    <IconClose class="w-6 h-6" />
                </button>
            </div>
            
            <div v-if="isLoading" class="flex items-center justify-center py-8">
                <p class="text-[#151515]">Loading brands...</p>
            </div>
            <div v-else-if="brands.length === 0" class="flex items-center justify-center py-8">
                <p class="text-[#151515]">No brands available</p>
            </div>
            <div v-else class="grid grid-cols-3 gap-4">
                <div 
                    v-for="brand in brands" 
                    :key="brand.id"
                    @click="selectBrand(brand)"
                    :class="[
                        'bg-white rounded-lg shadow-sm p-4 cursor-pointer transition-all duration-200 flex items-center justify-center min-h-0',
                        'hover:shadow-lg hover:scale-105 active:scale-95',
                        selectedBrand?.id === brand.id ? 'ring-2 ring-[#cb8a2e] shadow-md' : ''
                    ]"
                    style="aspect-ratio: 1 / 1;"
                >
                    <div class="flex items-center justify-center w-full h-full">
                        <img 
                            v-if="brand.logo"
                            :src="brand.logo" 
                            :alt="brand.name"
                            class="max-w-full max-h-full object-contain"
                        />
                        <div v-else class="w-full h-full flex items-center justify-center bg-gray-200 rounded">
                            <p class="text-xs text-gray-400">No logo</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchBrands, type Brand } from '@/components/lib/brand';
import IconClose from '@/components/icons/IconClose.vue';

const props = defineProps<{
    selectedBrandId?: number;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'select', brand: Brand): void;
}>();

const selectedBrand = ref<Brand | null>(null);
const brands = ref<Brand[]>([]);
const isLoading = ref(false);

onMounted(async () => {
    isLoading.value = true;
    try {
        const fetchedBrands = await fetchBrands();
        brands.value = fetchedBrands;
        
        if (props.selectedBrandId) {
            selectedBrand.value = brands.value.find(b => b.id === props.selectedBrandId) || null;
        }
    } catch (error) {
        console.error('Failed to fetch brands:', error);
    } finally {
        isLoading.value = false;
    }
});

const selectBrand = (brand: Brand) => {
    selectedBrand.value = brand;
    emit('select', brand);
    emit('close');
};
</script>

