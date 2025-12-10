<template>
    <div class="bg-[#f8f8f8] rounded-tl-[10px] rounded-tr-[10px] shadow-[0px_0px_19.4px_13px_rgba(0,0,0,0.1)] w-full">
        <div class="p-6 pb-8">
            <p class="text-center text-base font-semibold text-[#151515] mb-4">
                Type your code
            </p>
            
            <div class="mb-6">
                <Input
                    v-model="code"
                    type="text"
                    placeholder="Enter code"
                    class="w-full bg-transparent text-base text-[#151515] placeholder:text-[#151515]/50 px-0 outline-none"
                    @keyup.enter="handleRedeem"
                />
            </div>
            
            <button
                @click="handleRedeem"
                class="w-full bg-[#212121] text-white font-semibold text-base tracking-[0.32px] h-[45px] rounded-[5px] mb-6"
            >
                Redeem
            </button>
            
            <div class="flex justify-center items-center">
                <div class="rotate-90 cursor-pointer" @click="$emit('close')">
                    <img 
                        src="http://localhost:3845/assets/9a2ce839606d566f5cde2bc6b4a01c808b8a0184.svg" 
                        alt="Close" 
                        class="w-3 h-6"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Input from '@/components/ui/input/Input.vue';
import { ref } from 'vue';

const emit = defineEmits(['close', 'redeem']);

const code = ref('');

const handleRedeem = () => {
    if (code.value.trim()) {
        emit('redeem', code.value);
        code.value = '';
        emit('close');
    }
};
</script>

