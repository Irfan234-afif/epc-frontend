<template>
  <teleport to="body">
  
    <transition leave-active-class="duration-200">
      <div v-show="show" class="fixed inset-0 overflow-y-auto z-50" scroll-region>
        <transition
          enter-active-class="ease-out duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="ease-in duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-show="show" class="fixed inset-0 transform transition-all" @click="close">
            <div class="absolute inset-0 bg-black opacity-70" />
          </div>
        </transition>

        <transition
          enter-active-class="transform transition ease-in-out duration-500 sm:duration-700"
          enter-from-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transform transition ease-in-out duration-500 sm:duration-700"
          leave-from-class="translate-x-0"
          leave-to-class="translate-x-full"
        >
          <div v-show="show" class="fixed right-0 h-full bg-white shadow-xl transform transition-all" :class="maxWidthClass">
            <div class="h-full flex flex-col">
              <div class="p-6 border-b">
                <div class="flex items-center">
                  <img class="w-16 h-16 rounded-full" src="/avatar.png" alt="User Avatar">
                  <div class="ml-4">
                    <p class="text-xl font-bold text-gray-800">Hello, Alvin</p>
                    <p class="text-sm text-gray-600">UI/UX Designer - Marketing</p>
                  </div>
                </div>
              </div>
          
              <nav class="flex-1 p-6 space-y-2">
                <router-link to="/" class="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md">
                  Home
                </router-link>
                <hr>
                <router-link to="/history" class="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md">
                  History
                </router-link>
                <hr>
                <router-link to="/offers" class="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md">
                  Offers
                </router-link>
                <hr>
                <router-link to="/stamps" class="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md">
                  707Stamp
                </router-link>
                <hr>
                <router-link to="/profile" class="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md">
                  Profile
                </router-link>
                <hr>
                <router-link to="/settings" class="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md">
                  Settings
                </router-link>
                <hr>
                <router-link to="/help" class="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md">
                  Help
                </router-link>
                <hr>
              </nav>

              <div class="mb-4 p-6">
                <div>
                  <p class="text-lg font-bold py-2">User Setting</p>
                </div>
                <div>
                  <p class="text-lg font-bold py-2 mb-2">Contact IT Support</p>
                </div>
                <div>
                  <p class="text-lg font-bold text-primary py-4">Sign Out</p>
                </div>
              </div>
          
              <!-- <div class="p-6 border-t">
                <button @click="close" class="flex items-center w-full p-3 text-red-600 hover:bg-red-50 rounded-md">
                  <IconSignOut class="w-5 h-5 mr-3"/>
                  Sign Out
                </button>
              </div> -->
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from "vue";

interface Props {
  show: boolean;
  maxWidth?: string;
  closeable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: 'sm',
  closeable: true,
});

const emit = defineEmits(["close"]);

watch(
  () => props.show,
  () => {
    if (props.show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = null;
    }
  }
);

const close = () => {
  if (props.closeable) {
    emit("close");
  }
};

const closeOnEscape = (e) => {
  if (e.key === "Escape" && props.show) {
    close();
  }
};

onMounted(() => document.addEventListener("keydown", closeOnEscape));

onUnmounted(() => {
  document.removeEventListener("keydown", closeOnEscape);
  document.body.style.overflow = null;
});

const maxWidthClass = computed(() => {
  return {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
  }[props.maxWidth];
});
</script>
