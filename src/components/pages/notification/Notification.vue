<template>
    <div class="min-h-screen flex flex-col">
        <div class="w-full px-6 py-8 rounded-b-xl">
            <Navbar>
                <div class="flex items-center justify-between w-full">
                    <h2 class="font-semibold text-xl">
                        Notifications [ 0 ]
                    </h2>
                </div>
            </Navbar>
        </div>
        <div class="p-6 flex-1 flex items-center justify-center">
            <div class="flex flex-col items-center justify-center">
                <p class="text-[14px] text-[#212121] text-center leading-6 tracking-[0.28px] max-w-[225px]">
                    Any transaction, permission, and updates will be appear here.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/ui/navbar/Navbar.vue';
</script>

