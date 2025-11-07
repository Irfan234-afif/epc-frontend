<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/components/lib/utils'
import { useVModel } from '@vueuse/core'
import { inputVariants, type InputVariants } from '.'

interface Props {
  modelValue?: string | number
  defaultValue?: string | number
  class?: HTMLAttributes['class']
  variant?: InputVariants['variant']
}

// const props = defineProps<{
//   modelValue?: string | number
//   defaultValue?: string | number
//   class?: HTMLAttributes['class']
//   variant?: InputVariants['variant']
// }>()

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <div class="relative w-full">
    <input
      v-model="modelValue"
      v-bind="$attrs"
      :tabindex="0"
      :class="[
        'w-full h-11 px-4',
        'bg-transparent',
        'border border-solid rounded-md',
        cn(inputVariants({ variant: props.variant })),
        'transition-all duration-200',
        'outline-none focus:outline-none',
        '[&:disabled]:opacity-50 [&:disabled]:cursor-not-allowed',
        props.class
      ]"
      style=""
    />
    <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
      <slot name="suffix"></slot>
    </div>
  </div>
</template>