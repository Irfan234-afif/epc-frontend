<template>
    <div class="bg-[#f8f8f8] min-h-screen">
        <div class="w-full py-8">
            <Navbar class="px-6">
                <h2 class="font-semibold text-[20px] text-[#151515]">
                    Employee News
                </h2>
            </Navbar>

            <!-- Loading State -->
            <div v-if="isLoading" class="mt-6 space-y-4">
                <div class="h-[200px] bg-gray-300 rounded-[10px] animate-pulse"></div>
                <div class="h-6 bg-gray-300 rounded animate-pulse w-3/4"></div>
                <div class="h-4 bg-gray-300 rounded animate-pulse w-full"></div>
                <div class="h-4 bg-gray-300 rounded animate-pulse w-5/6"></div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="mt-6 text-center py-8">
                <p class="text-[#9f9f9f] text-[14px]">{{ error }}</p>
                <router-link 
                    to="/" 
                    class="mt-4 inline-block text-[#cb8a2e] font-semibold"
                >
                    Back to Home
                </router-link>
            </div>

            <!-- News Content -->
            <div v-else-if="news" class="mt-6">
                <!-- News Image -->
                <div class="mb-6">
                    <img 
                        :src="getImageUrl(news.potrait_image || news.thumbnail)" 
                        :alt="news.title"
                        class="w-full h-auto object-cover aspect-square min-h-[300px] max-h-[400px]"
                    />
                </div>
                <div class="px-6">
                    <!-- News Title -->
                    <div class="mb-4">
                        <h1 class="text-[20px] font-semibold text-[#151515] leading-[28px]">
                            {{ news.title }}
                        </h1>
                    </div>

                    <!-- News Creation Date -->
                    <div class="mb-4">
                        <p class="text-[12px] text-[#9f9f9f] leading-[18px]">
                            Posted on {{ moment(news.creation).format('D MMMM YYYY') }}
                        </p>
                    </div>

                    <!-- Short Description -->
                    <div v-if="news.short_description" class="mb-6">
                        <p class="text-[14px] text-[#212121] leading-[20px]">
                            {{ news.short_description }}
                        </p>
                    </div>

                    <!-- Full Description -->
                    <div v-if="news.description" class="mb-8">
                        <div 
                            class="text-[14px] text-[#151515] leading-[20px] whitespace-pre-wrap"
                            v-html="news.description"
                        ></div>
                    </div>

                    <!-- Back Button -->
                    <div class="mt-8">
                        <router-link 
                            to="/" 
                            class="flex items-center justify-center w-full border border-black text-black font-semibold text-base tracking-[0.32px] h-[45px] rounded-[5px]"
                        >
                            Back to Home
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/ui/navbar/Navbar.vue';
import { getNewsByName } from '@/components/lib/news';
import { NewsResponse } from '@/components/lib/types';
import { getImageUrl } from '@/components/lib/utils';
import { formatDate } from '@/components/lib/utils';
import moment from 'moment/moment';

const route = useRoute();
const news = ref<NewsResponse | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
    const newsName = route.params.name as string;
    
    if (!newsName) {
        error.value = 'News not found';
        isLoading.value = false;
        return;
    }

    try {
        isLoading.value = true;
        const newsData = await getNewsByName(newsName);
        
        if (!newsData) {
            error.value = 'News not found';
        } else {
            news.value = newsData;
        }
    } catch (err) {
        console.error('Error fetching news:', err);
        error.value = 'Failed to load news';
    } finally {
        isLoading.value = false;
    }
});
</script>

