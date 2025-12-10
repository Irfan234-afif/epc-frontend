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
          <div v-show="show" class="fixed right-0 h-full bg-white shadow-xl transform transition-all min-w-[300px]" :class="maxWidthClass">
            <div class="h-full flex flex-col items-end p-6">
              <div class="flex">
                <router-link to="/notifications" class="p-3 rounded">
                    <IconNotification class="w-5 h-5 cursor-pointer"/>
                </router-link>
                <button class="p-3 rounded" type="button" @click="close()">
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M20.25 10.25C20.25 15.775 15.775 20.25 10.25 20.25C4.725 20.25 0.25 15.775 0.25 10.25C0.25 4.725 4.725 0.25 10.25 0.25C15.775 0.25 20.25 4.725 20.25 10.25ZM19.625 10.25C19.625 15.425 15.425 19.625 10.25 19.625C5.075 19.625 0.875 15.425 0.875 10.25C0.875 5.075 5.075 0.875 10.25 0.875C15.425 0.875 19.625 5.075 19.625 10.25Z" fill="black" stroke="black" stroke-width="0.5"/>
                    <path d="M6.85553 13.9271L13.9272 6.85547M13.9272 13.9271L6.85553 6.85547" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>

                </button>
              </div>
              <nav class="flex-1 space-y-2 mt-12">
                <router-link to="/" class="flex items-center justify-end p-3 hover:bg-gray-100 rounded-md">
                  Home
                </router-link>
                <router-link to="/purchase-history" class="flex items-center justify-end p-3 hover:bg-gray-100 rounded-md">
                  Purchase history
                </router-link>
                <router-link to="/benefits" class="flex items-center justify-end p-3 hover:bg-gray-100 rounded-md">
                  Your EPC Benefits
                </router-link>
                <router-link to="/profile" class="flex items-center justify-end p-3 hover:bg-gray-100 rounded-md">
                  Your Profile
                </router-link>
              </nav>

              <div class="mb-4 flex flex-col items-end">
                <router-link to="/settings">
                  <p class="font-semibold py-2 text-right">User Setting</p>
                </router-link>
                <router-link to="/find-stores" class="flex justify-between items-center py-4">
                  <p class="font-semibold">Find Stores Near You</p>
                </router-link>
                <!-- <div>
                  <p class="font-semibold py-2 mb-2 text-right">Contact IT Support</p>
                </div> -->
                <button @click="logout" class="mt-6 py-3 px-8 rounded-xl" style="box-shadow: 0 0 20px 0 rgba(0,0,0,0.20);">
                  <p class="font-semibold text-[#cb8a2e]">Sign Out</p>
                </button>
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
import { useAuth } from "./lib/auth";
import IconNotification from "./icons/IconNotification.vue";

const { logout, state } = useAuth();

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
