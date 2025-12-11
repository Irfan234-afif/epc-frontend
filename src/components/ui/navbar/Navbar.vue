<template>
    <div class="flex items-start justify-between" :class="$attrs.class">
        <slot/>
        <div class="flex items-center">
            <router-link to="/notifications" class="px-3 pt-1 h-full rounded">
                <IconNotification class="w-5 h-5 cursor-pointer"/>
            </router-link>
            <button @click="showSideMenu = true" class="pl-3 pt-1 h-full rounded">
                <IconMenu class="w-5 h-5 cursor-pointer"/>
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