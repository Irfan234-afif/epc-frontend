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

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleSubmit = async () => {
    const ok = await login(email.value, password.value);
    if (ok) {
        router.replace('/');
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
                placeholder="example@sosco.id"
                variant="dark"
                class="!bg-transparent !h-11 !text-white"
              />
            </div>
            
            <div class="relative">
              <Input 
                :type="showPassword ? 'text' : 'password'"
                v-model="password" 
                placeholder="rsdcdcss74"
                variant="dark"
                class="!bg-transparent !h-11 !text-white"
              />
              <button 
                type="button" 
                class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10"
                @click="togglePassword"
              >
                <img :src="viewIcon" alt="Toggle password visibility" class="w-full h-full" />
              </button>
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