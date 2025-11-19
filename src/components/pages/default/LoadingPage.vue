<template>
  <div class="min-h-screen flex items-center justify-center bg-primary-dark w-full">
    <div class="flex flex-col items-center">
      <svg
        class="animate-spin h-12 w-12 text-[#cb8a2e] mb-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      <div class="text-lg font-semibold text-white mb-2">Loading, please wait...</div>
      <div class="text-sm text-gray-300">We're preparing your employee portal.</div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../lib/auth';

const router = useRouter();
const { state, userHomePage } = useAuth();

// Watch for changes in isFetchingUser
watch(() => state.isFetchingUser, (newValue, oldValue) => {
  // When fetching is done (from true to false), redirect to home
  if (oldValue === true && newValue === false) {
    console.log('Fetching user completed, redirecting to home...');
    // router.replace(router.currentRoute.value.query.redirect);
  }
});
</script>
