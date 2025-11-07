<template>
  <div class="bg-[#f8f8f8] p-6" @click.stop>
    <!-- Year Display with Arrows -->
    <div class="flex items-center justify-between mb-8">
      <button
        @click="decrementYear"
        class="p-2 hover:bg-gray-200 rounded-full transition-colors flex items-center justify-center"
        aria-label="Previous year"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-6 h-6 text-[#212121]"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <h2 class="text-primary font-bold text-[30px]">{{ selectedYear }}</h2>
      <button
        @click="incrementYear"
        class="p-2 hover:bg-gray-200 rounded-full transition-colors flex items-center justify-center"
        aria-label="Next year"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-6 h-6 text-[#212121]"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>

    <!-- Month Grid -->
    <div class="grid grid-cols-3 gap-y-4 mb-8">
      <button
        v-for="(month, index) in months"
        :key="index"
        @click="selectMonth(index)"
        :class="[
          'text-base tracking-[0.32px] py-2',
          getMonthAlignment(index),
          selectedMonth === index 
            ? 'text-primary font-bold' 
            : 'text-[#212121] font-semibold'
        ]"
      >
        {{ month }}
      </button>
    </div>

    <!-- Done Button -->
    <div class="mt-6">
      <button
        @click="handleDone"
        class="w-full bg-[#212121] text-white font-semibold text-base tracking-[0.32px] py-3 rounded-[5px] hover:bg-[#212121]/90 transition-colors"
      >
        Done
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: { month: number; year: number };
}>();

const emit = defineEmits<{
  'update:modelValue': [{ month: number; year: number }];
  'done': [];
}>();

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

const selectedMonth = ref(props.modelValue.month);
const selectedYear = ref(props.modelValue.year);

// Update local state when modelValue changes
watch(() => props.modelValue, (newValue) => {
  selectedMonth.value = newValue.month;
  selectedYear.value = newValue.year;
}, { deep: true });

const selectMonth = (monthIndex: number) => {
  selectedMonth.value = monthIndex;
};

const decrementYear = () => {
  selectedYear.value -= 1;
};

const incrementYear = () => {
  selectedYear.value += 1;
};

const getMonthAlignment = (index: number) => {
  // First column (0, 3, 6, 9): left aligned
  // Second column (1, 4, 7, 10): center aligned
  // Third column (2, 5, 8, 11): right aligned
  const column = index % 3;
  if (column === 0) return 'text-left';
  if (column === 1) return 'text-center';
  return 'text-right';
};

const handleDone = () => {
  emit('update:modelValue', {
    month: selectedMonth.value,
    year: selectedYear.value,
  });
  emit('done');
};
</script>

