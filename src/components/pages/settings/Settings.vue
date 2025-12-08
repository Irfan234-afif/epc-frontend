<template>
  <div class="p-6">
    <div class="shadow-xl w-full px-6 py-8 rounded-b-xl">
      <Navbar>
        <h2 class="font-bold text-xl">Settings</h2>
      </Navbar>
    </div>

    <div class="mt-8">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h3 class="text-lg font-bold mb-6">Update Password</h3>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">


          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div class="relative">
              <Input
                v-model="newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                placeholder="Enter new password"
                class="w-full"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                @click="showNewPassword = !showNewPassword"
              >
                <svg
                  v-if="!showNewPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div class="relative">
              <Input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm new password"
                class="w-full"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <svg
                  v-if="!showConfirmPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {{ errorMessage }}
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {{ successMessage }}
          </div>

          <Button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="w-full !border-none !rounded !h-11 !text-white !font-bold !text-base !tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Updating...</span>
            <span v-else>Update Password</span>
          </Button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Navbar from '@/components/ui/navbar/Navbar.vue';
import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { useAuth } from '@/components/lib/auth';

const { updatePassword } = useAuth();

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const isFormValid = computed(() => {
  return (
    newPassword.value.trim() !== '' &&
    confirmPassword.value.trim() !== '' &&
    newPassword.value === confirmPassword.value
  );
});

const handleSubmit = async () => {
  // Clear previous messages
  errorMessage.value = '';
  successMessage.value = '';

  // Validate passwords match
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'New password and confirm password do not match';
    return;
  }

  // Validate password length
  if (newPassword.value.length < 6) {
    errorMessage.value = 'New password must be at least 6 characters long';
    return;
  }

  isLoading.value = true;

  try {
    const result = await updatePassword(newPassword.value);

    if (result.success) {
      successMessage.value = result.message;
      // Clear form
      currentPassword.value = '';
      newPassword.value = '';
      confirmPassword.value = '';
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        successMessage.value = '';
      }, 5000);
    } else {
      errorMessage.value = result.message;
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

