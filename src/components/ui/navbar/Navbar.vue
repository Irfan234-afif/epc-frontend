<template>
    <div class="flex items-center justify-between">
        <slot/>
        <div class="flex items-center space-x-4">
            <IconNotification class="w-6 h-6"/>
            <IconMenu class="w-6 h-6" @click="showSideMenu = true"/>
        </div>
    </div>
    <SideMenu :show="showSideMenu" @close="showSideMenu = false" />
</template>

<script setup lang="ts">
import SideMenu from '@/components/SideMenu.vue';
import IconMenu from '@/components/icons/IconMenu.vue';
import IconNotification from '@/components/icons/IconNotification.vue';
import { ref } from 'vue';

const showSideMenu = ref(false);
</script>