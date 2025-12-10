<script setup lang="ts">
import { ref } from 'vue';
import CompanyLogo from '@/components/icons/CompanyLogo.vue'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import { frappe } from '@/components/lib/frappe';
import { useRouter } from 'vue-router';
import Loader from '@/components/ui/loader/Loader.vue';
import { useAuth } from '@/components/lib/auth';

const router = useRouter()

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(false);
const viewIcon = 'http://localhost:3845/assets/3eecf9e9e51cb40cff9a7e704a12eeed3ab52a90.svg';
const { state, login } = useAuth();
const errorMessage = ref('');

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const clearError = () => {
  errorMessage.value = '';
};

const handleSubmit = async () => {
    errorMessage.value = '';
    try {
        const ok = await login(email.value, password.value);
        if (ok) {
            router.replace('/');
        } else {
            errorMessage.value = 'Username atau password salah';
        }
    } catch (error: any) {
        errorMessage.value = 'Username atau password salah';
    }
};
</script>

<template>
  <div class="bg-primary-dark min-w-screen min-h-screen flex items-center justify-center">
    <div class="min-h-screen flex flex-col">
      <Loader v-if="state.isLoading" />
      <nav class="w-full p-6 flex items-center">
        <div class="w-40">
          <CompanyLogo class="w-full h-auto text-white" />
        </div>
      </nav>

      <div class="flex-1 flex items-center justify-center p-6">
        <div class="w-full max-w-sm space-y-8">
          <h1 class="font-helvetica font-bold text-4xl leading-[2.8rem] text-white tracking-tight">
            Employee Discount Access Portal
          </h1>
          
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="relative">
              <Input 
                v-model="email" 
                @input="clearError"
                placeholder="example@sosco.id"
                variant="dark"
                type="text"
                class="!bg-transparent !h-11 !text-white"
              />
            </div>
            
            <div class="relative">
              <Input 
                :type="showPassword ? 'text' : 'password'"
                v-model="password" 
                @input="clearError"
                placeholder="password"
                variant="dark"
                class="!bg-transparent !h-11 !text-white"
              />
              <button 
                type="button" 
                class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10 text-white"
                @click="togglePassword"
              >
              <svg
                  v-if="!showPassword"
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

            <!-- Error Message -->
            <div v-if="errorMessage" class="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded text-sm">
              {{ errorMessage }}
            </div>

            <Button 
              type="submit"
              class="w-full !bg-[#cb8a2e] !border-none !rounded !h-11 !text-white !font-bold !text-base !tracking-wider"
            >
              Sign in
            </Button>

            <div class="flex items-center">
              <div class="relative mr-4">
                <input 
                  type="checkbox" 
                  id="remember" 
                  v-model="rememberMe"
                  class="absolute opacity-0 cursor-pointer"
                />
                <div class="w-5 h-5 bg-[#d9d9d9] rounded">
                  <div 
                    v-if="rememberMe" 
                    class="absolute w-3.5 h-3.5 bg-[#cb8a2e] rounded-sm top-[3px] left-[3px]"
                  ></div>
                </div>
              </div>
              <label for="remember" class="text-white font-helvetica text-xs">
                Remember Me
              </label>
            </div>
          </form>

          <div class="space-y-3">
            <a href="#" class="block text-[#cb8a2e] font-helvetica font-bold text-sm no-underline">
              Forgot password?
            </a>
            <p class="text-white font-helvetica text-xs leading-normal max-w-[18rem]">
              For security reasons, please change your password regularly. Never share your EPC details with others.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>