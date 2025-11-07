<template>
    <div class="bg-[#f8f8f8] rounded-lg w-full">
        <div class="p-6">
            <div class="flex items-center justify-between mb-6">
                <h2 class="font-bold text-2xl text-[#151515]">
                    Select brands
                </h2>
                <button 
                    @click="$emit('close')"
                    class="w-4 h-4 cursor-pointer"
                >
                    <svg class="w-full h-full" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 8C0 9.58225 0.469192 11.129 1.34824 12.4446C2.22729 13.7602 3.47672 14.7855 4.93853 15.391C6.40034 15.9965 8.00887 16.155 9.56072 15.8463C11.1126 15.5376 12.538 14.7757 13.6569 13.6569C14.7757 12.538 15.5376 11.1126 15.8463 9.56072C16.155 8.00887 15.9965 6.40034 15.391 4.93853C14.7855 3.47672 13.7602 2.22729 12.4446 1.34824C11.129 0.469192 9.58225 0 8 0C5.87827 0 3.84344 0.842854 2.34315 2.34315C0.842854 3.84344 0 5.87827 0 8ZM3.42857 7.42857H10.3714L7.18286 4.22457L8 3.42857L12.5714 8L8 12.5714L7.18286 11.756L10.3714 8.57143H3.42857V7.42857Z" fill="#151515"/>
                    </svg>
                </button>
            </div>
            
            <div class="grid grid-cols-3 gap-4">
                <div 
                    v-for="brand in brands" 
                    :key="brand.id"
                    @click="selectBrand(brand)"
                    :class="[
                        'bg-[#f8f8f8] rounded-lg shadow-sm p-4 cursor-pointer transition-all hover:shadow-md flex flex-col items-center justify-center aspect-square',
                        selectedBrand?.id === brand.id ? 'ring-2 ring-[#cb8a2e]' : ''
                    ]"
                >
                    <div class="flex items-center justify-center flex-1 mb-2 w-full">
                        <img 
                            :src="brand.logo" 
                            :alt="brand.name"
                            class="max-w-full max-h-full object-contain"
                        />
                    </div>
                    <p class="text-xs text-center text-[#151515] font-medium">
                        {{ brand.name }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Brand {
    id: number;
    name: string;
    logo: string;
}

const props = defineProps<{
    selectedBrandId?: number;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'select', brand: Brand): void;
}>();

const selectedBrand = ref<Brand | null>(null);

const brands = ref<Brand[]>([
    {
        id: 1,
        name: 'Fred Perry',
        logo: 'http://localhost:3845/assets/9524e1ce4deeba62a8ef153c6df0dd1528eb20bf.png'
    },
    {
        id: 2,
        name: 'Atmos',
        logo: 'http://localhost:3845/assets/b8494240b2c1570de7096b8ede9fd9693ee667ef.png'
    },
    {
        id: 3,
        name: 'Melissa',
        logo: 'http://localhost:3845/assets/37f0852a7c09202efe50e846ed47b8008bbbd379.png'
    },
    {
        id: 4,
        name: 'Fuglen Coffee',
        logo: 'http://localhost:3845/assets/32df3137018e9ac9dc8e83f96e9334aecfd77e72.png'
    },
    {
        id: 5,
        name: 'Nike',
        logo: 'http://localhost:3845/assets/59312c11507f5ad72f2f5e69d6a9b21e3df0d465.png'
    },
    {
        id: 6,
        name: 'Adidas',
        logo: 'http://localhost:3845/assets/655d3296dfe6ceb855bc7da675fd025b3ad0e8fd.png'
    },
    {
        id: 7,
        name: 'Puma',
        logo: 'http://localhost:3845/assets/5ff8db071d32e4a51c40ee5c88e99dbf9d8d6adc.png'
    },
    {
        id: 8,
        name: 'Converse',
        logo: 'http://localhost:3845/assets/48ded73bdf2fb3893e4038df6bb89b4221676766.png'
    },
    {
        id: 9,
        name: 'Vans',
        logo: 'http://localhost:3845/assets/3a667b938313d5d9e680a16be98ffbda45458d6c.png'
    }
]);

onMounted(() => {
    if (props.selectedBrandId) {
        selectedBrand.value = brands.value.find(b => b.id === props.selectedBrandId) || null;
    }
});

const selectBrand = (brand: Brand) => {
    selectedBrand.value = brand;
    emit('select', brand);
    emit('close');
};
</script>

