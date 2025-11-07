import { ref, computed, nextTick, watch } from 'vue';

export interface Card {
  code: string;
  limitType: string;
  amount: string;
  expiresIn: number;
  bgColor: string;
  logoUrl?: string;
  logoAlt?: string;
}

export function useCardStack(cards: () => Card[]) {
  // State management
  const activeIndex = ref(0);
  const isAnimating = ref(false);
  const clickedIndex = ref<number | null>(null);
  const exitingCardCode = ref<string | null>(null);

  // Create computed for cards array to watch changes
  const cardsArray = computed(() => cards());

  // Reset activeIndex when cards change (e.g., from empty to populated)
  watch(cardsArray, (newCards) => {
    if (newCards.length > 0 && activeIndex.value >= newCards.length) {
      activeIndex.value = 0;
    }
  }, { immediate: true });

  // Computed properties - now reactive to cards changes
  const sortedCards = computed(() => {
    const cardsCopy = [...cardsArray.value];
    
    // Move active card to front
    if (activeIndex.value > 0 && activeIndex.value < cardsCopy.length) {
      const activeCard = cardsCopy[activeIndex.value];
      cardsCopy.splice(activeIndex.value, 1);
      cardsCopy.unshift(activeCard);
    }

    
    return cardsCopy;
  });

  // Animation duration in milliseconds
  const ANIMATION_DURATION = 700;

  // Methods
  const handleCardClick = (index: number) => {
    // Only allow clicking on back cards when not animating
    if (index <= 0 || isAnimating.value) {
      return;
    }

    const clickedCard = sortedCards.value[index];
    const originalIndex = cardsArray.value.findIndex(c => c.code === clickedCard.code);
    
    // Validate original index
    if (originalIndex === -1 || originalIndex === activeIndex.value) {
      return;
    }

    // Start animation sequence
    startAnimationSequence(index, originalIndex);
  };

  const startAnimationSequence = async (clickIndex: number, newActiveIndex: number) => {
    // Set animation flags and exiting card
    isAnimating.value = true;
    clickedIndex.value = clickIndex;
    exitingCardCode.value = sortedCards.value[0].code;

    // Wait for next tick to ensure DOM updates with exiting state
    await nextTick();
    
    // Small delay to let exit animation start
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Now change the active index which will trigger position change
    activeIndex.value = newActiveIndex;
    
    // Reset animation state after animation completes
    setTimeout(() => {
      isAnimating.value = false;
      clickedIndex.value = null;
      exitingCardCode.value = null;
    }, ANIMATION_DURATION);
  };

  const getCardClasses = (index: number, card: Card) => {
    const isExiting = isAnimating.value && card.code === exitingCardCode.value;
    
    return {
      'card-front': index === 0 && !isExiting,
      'card-back': index > 0 && !isExiting,
      'card-animating': isAnimating.value && clickedIndex.value === index,
      'card-exiting': isExiting
    };
  };

  const getContentClasses = (card: Card) => {
    return {
      'content-exiting': isAnimating.value && card.code === exitingCardCode.value
    };
  };

  const getCardStyle = (index: number, totalCards: number) => {
    return {
      left: index === 0 ? '0' : `${7 + (index - 1) * 7}px`,
      top: index === 0 ? '0' : `${68 + (index - 1) * 6}px`,
      width: index === 0 ? '100%' : `calc(100% - ${14 + (index - 1) * 14}px)`,
      height: index === 0 ? '218px' : `${208 - (index - 1) * 6}px`,
      zIndex: totalCards - index
    };
  };

  return {
    // State
    isAnimating,
    clickedIndex,
    sortedCards,
    
    // Methods
    handleCardClick,
    getCardClasses,
    getContentClasses,
    getCardStyle
  };
}

