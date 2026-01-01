<template>
    <div v-if="needRefresh"
        class="fixed bottom-4 left-4 right-4 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-2xl p-4 transform transition-all duration-300 ease-in-out">
        <div class="flex items-center justify-between gap-4">
            <div class="flex-1">
                <h3 class="font-semibold text-base mb-1">Update Tersedia!</h3>
                <p class="text-sm text-blue-100">
                    Versi baru aplikasi tersedia. Klik "Update" untuk mendapatkan fitur terbaru.
                </p>
            </div>
            <div class="flex gap-2 flex-shrink-0">
                <button @click="close"
                    class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
                    Nanti
                </button>
                <button @click="updateServiceWorker"
                    class="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">
                    Update
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'

const { needRefresh, updateServiceWorker } = useRegisterSW({
    onRegistered(r) {
        console.log('Service Worker registered:', r)
        // Check for updates every hour
        r && setInterval(() => {
            r.update()
        }, 60 * 60 * 1000) // 1 hour
    },
    onRegisterError(error) {
        console.error('Service Worker registration error:', error)
    },
})

const close = () => {
    needRefresh.value = false
}
</script>
