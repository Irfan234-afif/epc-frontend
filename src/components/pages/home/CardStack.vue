<template>
  <div class="relative h-[16.5rem]">
    <!-- Loading Shimmer Skeleton -->
    <div v-if="isLoading" class="relative h-full">
      <div 
        v-for="(_, index) in 1" 
        :key="`skeleton-${index}`"
        class="absolute rounded-xl bg-gray-200 skeleton-card"
        :style="getSkeletonStyle(index)"
      >
        <div class="absolute inset-0 rounded-xl overflow-hidden">
          <div class="shimmer-loading"></div>
        </div>
        <!-- Front card skeleton content -->
        <div v-if="index === 0" class="p-6 flex flex-col h-full relative">
          <!-- Logo skeleton -->
          <div class="absolute top-5 right-6 w-24 h-2 bg-gray-300 rounded skeleton-item"></div>
          
          <!-- Remaining balance label -->
          <div class="w-28 h-2.5 bg-gray-300 rounded skeleton-item"></div>
          
          <!-- Amount skeleton -->
          <div class="flex-1 flex items-center">
            <div class="w-48 h-7 bg-gray-300 rounded skeleton-item"></div>
          </div>
          
          <!-- Bottom section -->
          <div class="space-y-3">
            <!-- Expires info skeleton -->
            <div class="flex items-center gap-1">
              <div class="w-4 h-4 bg-gray-300 rounded-full skeleton-item"></div>
              <div class="w-28 h-2.5 bg-gray-300 rounded skeleton-item"></div>
            </div>
            
            <!-- Card number section -->
            <div class="flex justify-between items-end">
              <div class="space-y-2">
                <div class="w-24 h-2.5 bg-gray-300 rounded skeleton-item"></div>
                <div class="w-36 h-3.5 bg-gray-300 rounded skeleton-item"></div>
              </div>
              
              <!-- Icon buttons skeleton -->
              <div class="flex flex-row gap-1">
                <div class="w-11 h-11 bg-gray-300 rounded-md skeleton-item"></div>
                <div class="w-11 h-11 bg-gray-300 rounded-md skeleton-item"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stacked Cards Container -->
    <transition-group v-else name="card" tag="div" class="relative h-full">
      <div 
        v-for="(card, index) in sortedCards" 
        :key="card.code"
        class="absolute rounded-xl flex flex-col cursor-pointer card-item"
        :class="[
          getCardClasses(index, card),
          index > 0 ? 'shadow-lg' : ''
        ]"
        :style="{
          ...getCardStyle(index, sortedCards.length),
          backgroundColor: card.bgColor || '#212121'
        }"
        @click="handleCardClick(index)"
      >
        <!-- Shimmer effect overlay -->
        <div 
          v-if="isAnimating && clickedIndex === index" 
          class="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
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
          <div v-if="card.logoUrl" class="card-logo flex justify-end">
            <img :src="card.logoUrl" :alt="card.logoAlt || 'Card Logo'" class="h-2 w-auto object-contain" />
          </div>

          <div class="flex-1"></div>
          
          <!-- Remaining Balance Label -->
          <div class="card-balance-label">
            <p class="text-xs tracking-[0.075rem] font-normal">REMAINING BALANCE</p>
          </div>
          
          <!-- Amount -->
          <div class="card-amount">
            <p class="text-3xl font-semibold tracking-[0.0675rem] leading-normal">{{ card.amount }}</p>
          </div>
          
          <!-- Bottom section with card info and icons -->
          <!-- Expires info -->
          <div class="flex items-center gap-1 card-expires">
            <IconTime class="w-4 h-4 opacity-100" />
            <p class="text-xs font-normal leading-normal">Expires in {{ card.expiresIn }} days</p>
          </div>

          <div class="flex-1"></div>

          <!-- Card number section with icons -->
          <div class="flex justify-between items-end card-info">
            <div class="card-details space-y-2">
              <p class="text-xs tracking-[0.075rem] font-normal">EMPLOYEE CARD</p>
              <p class="text-[0.875rem] tracking-[0.1925rem] leading-normal font-normal">{{ card.code }}</p>
            </div>
            
            <!-- Icon buttons arranged horizontally -->
            <div class="flex flex-row gap-1">
              <!-- Card Swap Icon - only show if multiple cards -->
              <div 
                v-if="sortedCards.length > 1"
                class="bg-white/10 p-2 rounded-md cursor-pointer hover:bg-white/20 transition-all duration-300 card-swap hover:scale-110 w-11 h-11 flex items-center justify-center" 
                @click.stop="handleCardClick(1)"
              >
                <IconCardSwap class="w-8 h-8"/>
              </div>
              
              <!-- QR Code Icon -->
              <div 
                class="bg-white/10 p-2 rounded-md cursor-pointer hover:bg-white/20 transition-all duration-300 card-qr hover:scale-110 w-11 h-11 flex items-center justify-center" 
                @click.stop="handleQRClick(card)"
              >
                <IconQR class="w-8 h-8"/>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Card belakang (index > 0) - hanya menampilkan logo di bagian bawah -->
        <div v-else class="relative h-full w-full">
          <!-- <div v-if="card.logoUrl" class="absolute bottom-4 left-6 z-10">
            <img :src="card.logoUrl" :alt="card.logoAlt || 'Card Logo'" class="h-4 w-auto object-contain" />
          </div> -->
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import IconQR from '@/components/icons/IconQR.vue';
import IconTime from '@/components/icons/IconTime.vue';
import IconCardSwap from '@/components/icons/IconCardSwap.vue';
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
  const leftRem = 0.4375 + (index - 1) * 0.4375; // 0.4375rem = 7px
  const topRem = 3.25 + (index - 1) * 0.375; // 3.25rem = 68px base, 0.375rem = 6px increment
  const widthReduction = 0.875 + (index - 1) * 0.875; // 0.875rem = 14px
  const heightRem = index === 0 ? 14 : 13 - (index - 1) * 0.375; // 14rem = 218px, 13rem = 208px
  
  return {
    left: index === 0 ? '0' : `${leftRem}rem`,
    top: index === 0 ? '0' : `${topRem}rem`,
    width: index === 0 ? '100%' : `calc(100% - ${widthReduction}rem)`,
    height: `${heightRem}rem`,
    zIndex: 2 - index
  };
};

// Handlers
const handleQRClick = (card: Card) => {
  emit('qr-click', card);
};
</script>


