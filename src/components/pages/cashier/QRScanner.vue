<template>
  <div class="flex flex-col items-center p-6 bg-white rounded-lg">
    <h2 class="text-2xl font-bold mb-4">Scan Employee QR Code</h2>
    
    <!-- Scanner Container -->
    <div v-if="!scannedValue" class="w-full max-w-md">
      <div class="mb-4 p-3 bg-blue-50 rounded-lg">
        <p class="text-sm text-blue-800 font-medium">💡 Tips for faster scanning:</p>
        <ul class="text-xs text-blue-700 mt-2 space-y-1 list-disc list-inside">
          <li>Hold phone steady and parallel to QR code</li>
          <li>Ensure good lighting</li>
          <li>Keep QR code centered in the box</li>
          <li>Move closer if detection is slow</li>
        </ul>
      </div>
      <div id="qr-reader" class="rounded-lg overflow-hidden border-2 border-gray-300 mb-4"></div>
      
      <!-- Status Messages -->
      <div v-if="isInitializing" class="text-center p-4 bg-blue-50 rounded-lg mb-4">
        <p class="text-blue-700">Initializing camera...</p>
      </div>
      
      <div v-if="error" class="text-center p-4 bg-red-50 rounded-lg mb-4">
        <p class="text-red-700 font-medium">{{ error }}</p>
      </div>
      
      <div v-if="isScanning && !error" class="text-center p-4 bg-green-50 rounded-lg mb-4">
        <p class="text-green-700">Camera ready. Point at QR code to scan.</p>
      </div>
    </div>
    
    <!-- Scanned Result -->
    <div v-else class="text-center w-full max-w-md">
      <div class="p-6 bg-green-50 rounded-lg mb-4">
        <svg class="w-16 h-16 mx-auto mb-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <p class="text-green-700 font-bold text-lg mb-2">QR Code Scanned Successfully!</p>
        <p class="text-sm text-gray-600 break-all">{{ scannedValue }}</p>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex gap-3 w-full max-w-md">
      <button 
        v-if="scannedValue"
        @click="rescan" 
        class="flex-1 bg-gray-600 text-white font-bold py-3 rounded-md hover:bg-gray-700 transition"
      >
        Scan Again
      </button>
      <button 
        @click="close" 
        class="flex-1 bg-gray-800 text-white font-bold py-3 rounded-md hover:bg-gray-900 transition"
      >
        {{ scannedValue ? 'Use This QR' : 'Cancel' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Html5Qrcode } from 'html5-qrcode';

const emit = defineEmits<{
  (e: 'scanned', value: string): void;
  (e: 'close'): void;
}>();

const scannedValue = ref<string>('');
const isInitializing = ref(true);
const isScanning = ref(false);
const error = ref<string>('');
let html5QrCode: Html5Qrcode | null = null;

async function startScanner() {
  try {
    isInitializing.value = true;
    error.value = '';
    
    html5QrCode = new Html5Qrcode('qr-reader', {
      formatsToSupport: [0], // 0 = QR_CODE only, faster detection
      verbose: false
    });
    
    // Start scanning with optimized settings
    await html5QrCode.start(
      { facingMode: 'environment' }, // Use back camera
      {
        fps: 30, // Higher FPS for faster detection
        qrbox: function(viewfinderWidth, viewfinderHeight) {
          // Dynamic QR box size based on viewport
          let minEdge = Math.min(viewfinderWidth, viewfinderHeight);
          let qrboxSize = Math.floor(minEdge * 0.8); // 80% of min edge
          return {
            width: qrboxSize,
            height: qrboxSize
          };
        },
        aspectRatio: 1.0,
        disableFlip: false, // Allow flipped QR codes
      },
      (decodedText) => {
        // Success callback - QR code scanned
        scannedValue.value = decodedText;
        stopScanner();
      },
      (errorMessage) => {
        // Error callback - usually just means no QR code in view, ignore
        // console.log('Scanning...', errorMessage);
      }
    );
    
    isInitializing.value = false;
    isScanning.value = true;
  } catch (err: any) {
    isInitializing.value = false;
    error.value = err?.message || 'Failed to access camera. Please check permissions.';
    console.error('Error starting scanner:', err);
  }
}

async function stopScanner() {
  if (html5QrCode && html5QrCode.isScanning) {
    try {
      await html5QrCode.stop();
      isScanning.value = false;
    } catch (err) {
      console.error('Error stopping scanner:', err);
    }
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
  startScanner();
});

onUnmounted(() => {
  stopScanner();
});
</script>

<style scoped>
#qr-reader {
  width: 100%;
}
</style>


