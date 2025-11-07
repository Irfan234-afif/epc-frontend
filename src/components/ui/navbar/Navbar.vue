<template>
    <div class="flex items-center justify-between">
        <slot/>
        <div class="flex items-center">
            <router-link to="/notifications" class="p-4 rounded">
                <IconNotification class="w-6 h-6 cursor-pointer"/>
            </router-link>
            <button @click="showSideMenu = true" class="p-4 rounded">
                <IconMenu class="w-6 h-6 cursor-pointer"/>
            </button>
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