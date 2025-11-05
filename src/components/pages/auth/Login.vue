<script setup lang="ts">
import { ref } from 'vue';
import CompanyLogo from '@/components/icons/CompanyLogo.vue'
import Input from '@/components/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'

const email = ref('');
const password = ref('');
</script>

<template>
    <div>
        <CompanyLogo class="mb-4"></CompanyLogo>
        <div>
            <div class="font-bold text-3xl">
                Employee Discount<br>Access Portal
            </div>
            <Input v-model="email" placeholder="Email" type="email"/>
            <Input v-model="password" placeholder="Password" type="password"/>
            <Button>Submit</Button>
        </div>
    </div>
</template>

