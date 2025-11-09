<template>
  <div class="flex flex-col items-center p-6 bg-white rounded-lg">
    <h2 class="text-2xl font-bold mb-4">Scan Employee QR Code</h2>
    
    <!-- Scanner Container -->
    <div v-if="!scannedValue" class="w-full max-w-md">
      <div class="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
        <p class="text-sm text-green-800 font-medium">⚡ Fast Scanner Active</p>
        <p class="text-xs text-green-700 mt-1">Position QR code in view - detection is instant!</p>
      </div>
      
      <div class="relative rounded-lg overflow-hidden border-2 border-gray-300 mb-4">
        <video ref="videoElement" class="w-full" playsinline></video>
        
        <!-- Overlay box -->
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute inset-0 bg-black/40"></div>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-green-500 rounded-lg shadow-lg"></div>
        </div>
      </div>
      
      <!-- Status Messages -->
      <div v-if="isInitializing" class="text-center p-4 bg-blue-50 rounded-lg mb-4">
        <div class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-blue-700">Starting camera...</p>
        </div>
      </div>
      
      <div v-if="error" class="text-center p-4 bg-red-50 rounded-lg mb-4 border border-red-200">
        <p class="text-red-700 font-medium">{{ error }}</p>
      </div>
      
      <div v-if="isScanning && !error" class="text-center p-4 bg-green-50 rounded-lg mb-4 border border-green-200">
        <div class="flex items-center justify-center gap-2">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <p class="text-green-700 font-medium">Scanning... Point at QR code</p>
        </div>
      </div>
    </div>
    
    <!-- Scanned Result -->
    <div v-else class="text-center w-full max-w-md animate-fade-in">
      <div class="p-6 bg-green-50 rounded-lg mb-4 border-2 border-green-300">
        <svg class="w-16 h-16 mx-auto mb-3 text-green-600 animate-bounce-once" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <p class="text-green-700 font-bold text-lg mb-2">QR Code Detected!</p>
        <p class="text-xs text-gray-600 break-all font-mono bg-white p-2 rounded">{{ scannedValue }}</p>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex gap-3 w-full max-w-md">
      <button 
        v-if="scannedValue"
        @click="rescan" 
        class="flex-1 bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-all transform hover:scale-105"
      >
        Scan Again
      </button>
      <button 
        @click="close" 
        class="flex-1 bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-900 transition-all transform hover:scale-105"
      >
        {{ scannedValue ? 'Use This QR' : 'Cancel' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import QrScanner from 'qr-scanner';

const emit = defineEmits<{
  (e: 'scanned', value: string): void;
  (e: 'close'): void;
}>();

const videoElement = ref<HTMLVideoElement | null>(null);
const scannedValue = ref<string>('');
const isInitializing = ref(true);
const isScanning = ref(false);
const error = ref<string>('');
let qrScanner: QrScanner | null = null;

async function startScanner() {
  try {
    if (!videoElement.value) {
      throw new Error('Video element not found');
    }
    
    isInitializing.value = true;
    error.value = '';
    
    // Create QR Scanner with optimized settings
    qrScanner = new QrScanner(
      videoElement.value,
      (result) => {
        // Success callback - QR code detected
        scannedValue.value = result.data;
        stopScanner();
      },
      {
        returnDetailedScanResult: true,
        highlightScanRegion: false,
        highlightCodeOutline: false,
        maxScansPerSecond: 25, // High scan rate for instant detection
        preferredCamera: 'environment', // Back camera
      }
    );
    
    // Start scanning
    await qrScanner.start();
    
    isInitializing.value = false;
    isScanning.value = true;
  } catch (err: any) {
    isInitializing.value = false;
    
    if (err.name === 'NotAllowedError') {
      error.value = 'Camera permission denied. Please allow camera access.';
    } else if (err.name === 'NotFoundError') {
      error.value = 'No camera found on this device.';
    } else if (err.name === 'NotReadableError') {
      error.value = 'Camera is in use by another application.';
    } else {
      error.value = err?.message || 'Failed to access camera.';
    }
    
    console.error('Error starting scanner:', err);
  }
}

function stopScanner() {
  if (qrScanner) {
    qrScanner.stop();
    qrScanner = null;
    isScanning.value = false;
  }
}

function rescan() {
  scannedValue.value = '';
  startScanner();
}

function close() {
  if (scannedValue.value) {
    emit('scanned', scannedValue.value);
  }
  emit('close');
}

onMounted(() => {
  // Small delay to ensure video element is rendered
  setTimeout(() => {
    startScanner();
  }, 100);
});

onUnmounted(() => {
  stopScanner();
});
</script>

<style scoped>
video {
  display: block;
  width: 100%;
  object-fit: cover;
  background: #000;
}

@keyframes fade-in {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes bounce-once {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-bounce-once {
  animation: bounce-once 0.5s ease-out;
}
</style>

