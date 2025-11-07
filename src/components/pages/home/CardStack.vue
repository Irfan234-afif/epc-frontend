<template>
  <div class="relative" style="height: 265px;">
    <!-- Loading Shimmer Skeleton -->
    <div v-if="isLoading" class="relative h-full">
      <div 
        v-for="(_, index) in 1" 
        :key="`skeleton-${index}`"
        class="absolute rounded-[10px] bg-gray-200 skeleton-card"
        :style="getSkeletonStyle(index)"
      >
        <div class="absolute inset-0 rounded-[10px] overflow-hidden">
          <div class="shimmer-loading"></div>
        </div>
        <!-- Front card skeleton content -->
        <div v-if="index === 0" class="p-6 flex flex-col h-full relative">
          <div class="absolute top-[26px] right-[25px] w-20 h-3 bg-gray-300 rounded skeleton-item"></div>
          <div class="flex-1"></div>
          <div class="w-32 h-4 bg-gray-300 rounded skeleton-item"></div>
          <div class="flex-1"></div>
          <div class="flex justify-between items-end">
            <div class="flex-1">
              <div class="w-24 h-3 bg-gray-300 rounded mb-2 skeleton-item"></div>
              <div class="w-40 h-8 bg-gray-300 rounded mb-2 skeleton-item"></div>
              <div class="w-28 h-3 bg-gray-300 rounded skeleton-item"></div>
            </div>
            <div class="w-12 h-12 bg-gray-300 rounded-lg skeleton-item"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stacked Cards Container -->
    <transition-group v-else name="card" tag="div" class="relative h-full">
      <div 
        v-for="(card, index) in sortedCards" 
        :key="card.code"
        class="absolute rounded-[10px] flex flex-col cursor-pointer card-item"
        :class="getCardClasses(index, card)"
        :style="{
          ...getCardStyle(index, sortedCards.length),
          backgroundColor: card.bgColor || '#212121',
          boxShadow: index > 0 ? '0px 0px 12px 3px rgba(0,0,0,0.1)' : 'none'
        }"
        @click="handleCardClick(index)"
      >
        <!-- Shimmer effect overlay -->
        <div 
          v-if="isAnimating && clickedIndex === index" 
          class="absolute inset-0 rounded-[10px] overflow-hidden pointer-events-none"
        >
          <div class="shimmer-effect"></div>
        </div>
        
        <!-- Card depan (index 0) - menampilkan semua konten -->
        <div 
          v-if="index === 0" 
          class="text-white p-6 flex flex-col h-full relative card-content"
          :class="getContentClasses(card)"
        >
          <!-- Logo untuk card depan di atas kanan -->
          <div v-if="card.logoUrl" class="absolute top-[26px] right-[25px] z-10 card-logo">
            <img :src="card.logoUrl" :alt="card.logoAlt || 'Card Logo'" class="h-[10px] w-auto object-contain" />
          </div>
          
          <div class="flex-1"></div>
          <div class="card-code">
            <p class="text-sm tracking-widest">{{ card.code }}</p>
          </div>
          <div class="flex-1"></div>
          <div class="flex justify-between items-end card-info">
            <div class="card-details">
              <p class="text-sm mt-4">{{ card.limitType }}</p>
              <p class="text-3xl font-bold tracking-wider">{{ card.amount }}</p>
              <p class="text-xs mt-4">Expires in {{ card.expiresIn }} days</p>
            </div>
            <div 
              class="bg-white/10 p-2 rounded-lg cursor-pointer hover:bg-white/20 transition-all duration-300 card-qr hover:scale-110" 
              @click.stop="handleQRClick(card)"
            >
              <IconQR class="w-10 h-10"/>
            </div>
          </div>
        </div>
        
        <!-- Card belakang (index > 0) - hanya menampilkan logo di bagian bawah -->
        <div v-else class="relative h-full w-full">
          <div v-if="card.logoUrl" class="absolute bottom-4 left-[25px] z-10">
            <img :src="card.logoUrl" :alt="card.logoAlt || 'Card Logo'" class="h-4 w-auto object-contain" />
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import IconQR from '@/components/icons/IconQR.vue';
import { useCardStack, type Card } from './useCardStack';
import './cardStackAnimations.css';

// Props & Emits
const props = defineProps<{
  cards: Card[];
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'qr-click', card: Card): void;
}>();

// Composable - pass getter function to make it reactive
const {
  isAnimating,
  clickedIndex,
  sortedCards,
  handleCardClick,
  getCardClasses,
  getContentClasses,
  getCardStyle
} = useCardStack(() => props.cards);

// Skeleton loading styles
const getSkeletonStyle = (index: number) => {
  return {
    left: index === 0 ? '0' : `${7 + (index - 1) * 7}px`,
    top: index === 0 ? '0' : `${68 + (index - 1) * 6}px`,
    width: index === 0 ? '100%' : `calc(100% - ${14 + (index - 1) * 14}px)`,
    height: index === 0 ? '218px' : `${208 - (index - 1) * 6}px`,
    zIndex: 2 - index
  };
};

// Handlers
const handleQRClick = (card: Card) => {
  emit('qr-click', card);
};
</script>


