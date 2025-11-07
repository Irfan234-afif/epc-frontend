<template>
    <div>
        <div class="shadow-xl w-full px-6 py-8 rounded-b-xl">
            <Navbar>
                <h2 class="font-bold text-xl">
                    Purchase History
                </h2>
            </Navbar>
            <div class="my-12 text-center">
                <h2 class="font-bold text-4xl">IDR 8.998.000</h2>
                <h3 class="text-primary font-bold text-2xl mt-4">IDR 2.998.000</h3>
            </div>

            <div class="h-[6px] mb-4">
                <div class="relative w-full">
                    <div class="absolute bg-[#EFEEEC] h-[6px] w-full"></div>
                    <div class="absolute bg-[#CB8A2E] h-[6px] w-[20%]"></div>
                </div>
            </div>

            <div class="text-center mb-4">
                <div>
                    <span>
                        Remaining Balance
                    </span>
                    <span>
                        ·
                    </span>
                    <span>
                        Expires in 11 days
                    </span>
                </div>
            </div>
        </div>
        <div class="p-6">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="font-bold text-xl mb-1">{{ formattedMonthYear }}</h2>
                    <p class="text-sm">
                        <span>0 Transaction(s) · </span>
                        <span class="font-bold">Total IDR 0</span>
                    </p>
                </div>
                <div>
                    <button 
                        @click="openMonthPicker"
                        class="text-primary font-bold text-base"
                    >
                        Change
                    </button>
                </div>
            </div>
            <div class="py-4 space-y-2">
                <div class="flex items-center space-x-2 py-4">
                    <div class="px-2">
                        <img src="/stanley.png" alt="Brand Logo" class="max-w-12 max-h-12">
                    </div>
                    <div class="flex-1">
                        <h3>
                            Stanley Indonesia
                        </h3>
                        <p class="text-muted">
                            Grand Indonesia
                        </p>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-base">
                            IDR 319.000 
                        </p>
                        <p class="text-muted text-sm">
                            <span>
                                2025-09-15
                            </span>
                            <span>
                                |
                            </span>
                            <span>
                                12:01 AM
                            </span>
                        </p>
                    </div>
                </div>
                <hr>
                <div class="flex items-center space-x-2 py-4">
                    <div class="px-2">
                        <img src="/stanley.png" alt="Brand Logo" class="max-w-12 max-h-12">
                    </div>
                    <div class="flex-1">
                        <h3>
                            Stanley Indonesia
                        </h3>
                        <p class="text-muted">
                            Grand Indonesia
                        </p>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-base">
                            IDR 319.000 
                        </p>
                        <p class="text-muted text-sm">
                            <span>
                                2025-09-15
                            </span>
                            <span>
                                |
                            </span>
                            <span>
                                12:01 AM
                            </span>
                        </p>
                    </div>
                </div>
                <hr>
                <div class="flex items-center space-x-2 py-4">
                    <div class="px-2">
                        <img src="/stanley.png" alt="Brand Logo" class="max-w-12 max-h-12">
                    </div>
                    <div class="flex-1">
                        <h3>
                            Stanley Indonesia
                        </h3>
                        <p class="text-muted">
                            Grand Indonesia
                        </p>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-base">
                            IDR 319.000 
                        </p>
                        <p class="text-muted text-sm">
                            <span>
                                2025-09-15
                            </span>
                            <span>
                                |
                            </span>
                            <span>
                                12:01 AM
                            </span>
                        </p>
                    </div>
                </div>

            </div>
        </div>
        
        <!-- Month Picker Modal -->
        <Modal
            :show="showMonthPicker"
            :maxWidth="'sm'"
            @close="closeMonthPicker"
        >
            <template v-slot="{ propertyModal }">
                <MonthPicker
                    v-model="selectedDate"
                    @done="closeMonthPicker"
                />
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import CompanyLogo from '@/components/icons/CompanyLogo.vue';
import Navbar from '@/components/ui/navbar/Navbar.vue';
import Modal from '@/components/ui/modal/Modal.vue';
import MonthPicker from '@/components/pages/purchase_history/MonthPicker.vue';

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const selectedDate = ref({ month: 8, year: 2025 }); // September 2025 (month is 0-indexed, but we'll use 1-indexed for display)
const showMonthPicker = ref(false);

const formattedMonthYear = computed(() => {
    return `${months[selectedDate.value.month]} ${selectedDate.value.year}`;
});

const openMonthPicker = () => {
    showMonthPicker.value = true;
};

const closeMonthPicker = () => {
    showMonthPicker.value = false;
};
</script>