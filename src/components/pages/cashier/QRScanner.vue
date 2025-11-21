<template>
  <div class="flex flex-col items-center p-6 bg-white rounded-lg w-full">
    <!-- Scanner Container -->
    <div class="w-full">
      <div class="relative rounded-lg overflow-hidden border-2 border-gray-300 mb-4" style="min-height: 500px; max-height: 70vh;">
        <video ref="videoElement" class="w-full" style="min-height: 500px; max-height: 70vh; object-fit: cover;" playsinline autoplay muted></video>
        
        <!-- Overlay box -->
        <div class="absolute inset-0 pointer-events-none" style="min-height: 500px; max-height: 70vh;">
          <div class="absolute inset-0 bg-black/40" style="min-height: 500px; max-height: 70vh;"></div>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-4 border-green-500 rounded-lg shadow-lg"></div>
        </div>
      </div>
      
      <!-- Error Message -->
      <div v-if="validationError" class="text-center p-4 bg-red-50 rounded-lg mb-4 border border-red-200">
        <p class="text-red-700 font-medium">{{ validationError }}</p>
        <button 
          @click="rescan" 
          class="mt-2 text-red-600 hover:text-red-800 underline text-sm"
        >
          Scan Again
        </button>
      </div>
      
      <!-- Loading State -->
      <div v-if="isValidating" class="text-center p-4 bg-blue-50 rounded-lg mb-4">
        <div class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-blue-700">Validating QR code...</p>
        </div>
      </div>
      
      <!-- Camera Error -->
      <div v-if="error && !validationError" class="text-center p-4 bg-red-50 rounded-lg mb-4 border border-red-200">
        <p class="text-red-700 font-medium">{{ error }}</p>
      </div>
    </div>
    
    <!-- Cancel Button -->
    <button 
      @click="close" 
      class="w-full max-w-2xl py-3 bg-transparent border-[0.5px] border-black text-black text-[14px] font-medium rounded-[5px] transition-colors hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Cancel
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import QrScanner from 'qr-scanner';
import { validateQRCode } from '@/components/lib/transaction';
import { useAuth } from '@/components/lib/auth';

const emit = defineEmits<{
  (e: 'scanned', value: string): void;
  (e: 'close'): void;
}>();

const { state } = useAuth();
const videoElement = ref<HTMLVideoElement | null>(null);
const isInitializing = ref(true);
const isScanning = ref(false);
const error = ref<string>('');
const isValidating = ref(false);
const validationError = ref<string>('');
let qrScanner: QrScanner | null = null;

function withTimeout<T>(promise: Promise<T>, ms: number, timeoutMessage = 'Camera start timed out'): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(timeoutMessage)), ms);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

async function startScanner() {
  try {
    if (!videoElement.value) {
      throw new Error('Video element not found');
    }
    
    // Ensure mobile autoplay without user gesture (iOS/Android)
    videoElement.value.setAttribute('playsinline', 'true');
    videoElement.value.setAttribute('autoplay', 'true');
    videoElement.value.muted = true;
    
    isInitializing.value = true;
    error.value = '';
    
    // Helper to create and start scanner with a given camera target
    const createAndStart = async (
      preferredCamera: QrScanner.FacingMode | QrScanner.DeviceId,
      timeoutMs = 3000
    ) => {
      // Clean up any existing instance before re-creating
      if (qrScanner) {
        try { qrScanner.stop(); } catch {}
        qrScanner = null;
      }
      qrScanner = new QrScanner(
        videoElement.value!,
        async (result) => {
          // Stop scanner immediately
          stopScanner();
          
          // Validate QR code
          await validateAndEmit(result.data);
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: false,
          highlightCodeOutline: false,
          maxScansPerSecond: 25,
          preferredCamera
        }
      );
      await withTimeout(qrScanner.start(), timeoutMs);
    };

    // After initial start, asynchronously switch to explicit back device if available
    const switchToBackCameraIfAvailable = async () => {
      if (!qrScanner) return;
      try {
        const camerasWithLabels = await QrScanner.listCameras(true);
        console.log('Cameras with labels:', camerasWithLabels);
        const backByLabelCamera = camerasWithLabels.find((c) => /0/i.test(c.label));
        if (backByLabelCamera) {
          console.log('Switching to back camera by label:', backByLabelCamera.id);
          await qrScanner.setCamera(backByLabelCamera.id);
          return backByLabelCamera.id;
        }
        const backByLabel = camerasWithLabels.find((c) => /back|rear|environment/i.test(c.label));
        if (backByLabel) {
          await qrScanner.setCamera(backByLabel.id);
          return backByLabel.id;
        }
      } catch (e) {
        console.warn('Could not switch to back camera:', e);
        return null;
      }
    };

    // First attempt: fast start using facingMode 'environment' (no enumeration yet)
    try {
      const backCameraId = await switchToBackCameraIfAvailable();
      await createAndStart('environment', 3000);
      isInitializing.value = false;
      isScanning.value = true;
      // Switch to explicit back device once labels are available (doesn't block UI)
      return;
    } catch (e) {
      console.warn('Primary environment start failed quickly, trying user-facing fallback...', e);
    }

    // Fallback: start with user-facing quickly, then try switching to back once labels are available
    await createAndStart('user', 3000);
    isInitializing.value = false;
    isScanning.value = true;
    switchToBackCameraIfAvailable();
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

async function validateAndEmit(qrValue: string) {
  isValidating.value = true;
  validationError.value = '';
  
  try {
    const showroom = state.showroom?.name ?? '';
    const result = await validateQRCode(qrValue, showroom);
    
    if (result && result.valid) {
      // Valid QR code, emit and close
      emit('scanned', qrValue);
      emit('close');
    } else {
      // Invalid QR code
      validationError.value = 'Invalid QR code';
      isValidating.value = false;
    }
  } catch (err: any) {
    // Handle validation errors (expired, invalid, etc.)
    validationError.value = err?.message || 'Failed to validate QR code';
    isValidating.value = false;
    console.error('QR validation error:', err);
  }
}

function rescan() {
  validationError.value = '';
  isValidating.value = false;
  startScanner();
}

function close() {
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


