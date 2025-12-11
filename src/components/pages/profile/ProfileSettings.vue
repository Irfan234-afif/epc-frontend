<template>
  <div class="bg-[#f8f8f8] min-h-screen relative">
    <!-- Header Section with Profile -->
    <div class="bg-[#f8f8f8] pt-6 rounded-bl-[10px] rounded-br-[10px] shadow-[0px_0px_20px_10px_rgba(0,0,0,0.1)] relative">
      <Navbar class="px-6">
        <h2 class="font-semibold text-[20px] text-[#151515]">
          Your Profile
        </h2>
      </Navbar>

      <!-- Profile Section -->
      <div class="px-6 py-8">
        <div class="flex items-start gap-6">
          <!-- Profile Picture -->
          <div class="relative w-[114px] h-[113px] flex-shrink-0">
            <div class="w-full h-full rounded-full overflow-hidden bg-gray-200">
              <img
                v-if="getImageUrl(state.user?.user_image)"
                :src="getImageUrl(state.user?.user_image)"
                alt="Profile"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-14 h-14 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
            <!-- Edit Button -->
            <button
              @click="triggerFileInput"
              class="absolute bottom-0 right-0 w-[32px] h-[32px] rounded-full bg-[#cb8a2e] flex items-center justify-center shadow-lg hover:bg-[#b87a26] transition-colors"
              aria-label="Update profile picture"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileSelect"
            />
          </div>

          <!-- User Information -->
          <div class="flex-1 pt-2">
            <h3 class="font-semibold text-[20px] text-[#151515] leading-tight mb-2">
              <div>{{ displayName }}</div>
            </h3>
            <p class="font-normal text-[12px] text-[#151515] mb-1">
              {{ userRole }}
            </p>
            <p class="font-normal text-[10px] text-[#151515]">
              Joined since {{ joinDate }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Section -->
    <div class="px-6 mt-6 flex flex-col gap-8">
      <!-- Push Notification (Disabled) -->
      <div class="opacity-50 pointer-events-none select-none" aria-disabled="true">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h4 class="font-semibold text-[16px] text-[#212121]">
              Push Notification
            </h4>
            <p class="font-normal text-[12px] text-black leading-[16px]">
              Stay updated with the latest news, employee perks, and company updates.
            </p>
          </div>
          <div class="ml-4 flex items-center">
            <!-- Toggle Switch (Disabled) -->
            <div class="relative">
              <div
                class="bg-[#9f9f9f] h-[2px] w-[25px] rounded-[1px]"
              ></div>
              <div
                class="absolute top-[-7px] left-0 h-[16px] w-[13px] rounded-[1px] transition-all duration-200 bg-[#cb8a2e]"
              ></div>
            </div>
            <button
              class="ml-2 p-2 -mr-2 cursor-not-allowed"
              aria-label="Toggle push notification"
              disabled
              tabindex="-1"
            >
              <span class="sr-only">Toggle</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Update Password -->
      <router-link
        to="/settings"
        class="flex items-start justify-between group"
      >
        <div class="flex-1">
          <h4 class="font-semibold text-[16px] text-[#212121] mb-2">
            Update your password
          </h4>
          <p class="font-normal text-[12px] text-black leading-[16px]">
            For your security, make sure to update your password regularly.
          </p>
        </div>
        <div class="ml-4 flex items-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="text-black"
          >
            <path
              d="M0 8C0 9.58225 0.469192 11.129 1.34824 12.4446C2.22729 13.7602 3.47672 14.7855 4.93853 15.391C6.40034 15.9965 8.00887 16.155 9.56072 15.8463C11.1126 15.5376 12.538 14.7757 13.6569 13.6569C14.7757 12.538 15.5376 11.1126 15.8463 9.56072C16.155 8.00887 15.9965 6.40034 15.391 4.93853C14.7855 3.47672 13.7602 2.22729 12.4446 1.34824C11.129 0.469192 9.58225 0 8 0C5.87827 0 3.84344 0.842854 2.34315 2.34315C0.842854 3.84344 0 5.87827 0 8ZM3.42857 7.42857H10.3714L7.18286 4.22457L8 3.42857L12.5714 8L8 12.5714L7.18286 11.756L10.3714 8.57143H3.42857V7.42857Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </router-link>

      <!-- Contact IT Support -->
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h4 class="font-semibold text-[16px] text-[#212121]">
            Contact IT Support
          </h4>
        </div>
        <div class="ml-4 flex items-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="text-black"
          >
            <path
              d="M0 8C0 9.58225 0.469192 11.129 1.34824 12.4446C2.22729 13.7602 3.47672 14.7855 4.93853 15.391C6.40034 15.9965 8.00887 16.155 9.56072 15.8463C11.1126 15.5376 12.538 14.7757 13.6569 13.6569C14.7757 12.538 15.5376 11.1126 15.8463 9.56072C16.155 8.00887 15.9965 6.40034 15.391 4.93853C14.7855 3.47672 13.7602 2.22729 12.4446 1.34824C11.129 0.469192 9.58225 0 8 0C5.87827 0 3.84344 0.842854 2.34315 2.34315C0.842854 3.84344 0 5.87827 0 8ZM3.42857 7.42857H10.3714L7.18286 4.22457L8 3.42857L12.5714 8L8 12.5714L7.18286 11.756L10.3714 8.57143H3.42857V7.42857Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      <!-- Sign Out Button -->
      <div class="mt-8 mb-8">
        <button
          @click="handleSignOut"
          class="w-full bg-[#f8f8f8] h-[60px] rounded-[10px] shadow-[0px_0px_8.4px_0.5px_rgba(0,0,0,0.15)] flex items-center justify-center transition-opacity hover:opacity-90"
        >
          <p class="font-bold text-[16px] text-[#cb8a2e]">Sign Out</p>
        </button>
      </div>
    </div>

    <!-- Upload Photo Modal -->
    <Modal
      :show="showUploadModal"
      :maxWidth="'sm'"
      @close="closeUploadModal"
    >
      <template v-slot="{ propertyModal }">
        <div class="p-6">
          <h3 class="font-semibold text-[18px] text-[#151515] mb-4">
            Update Profile Picture
          </h3>
          
          <!-- Preview -->
          <div v-if="profileImagePreview" class="mb-4 flex justify-center">
            <div class="w-[200px] h-[200px] rounded-full overflow-hidden bg-gray-200">
              <img
                :src="profileImagePreview"
                alt="Preview"
                class="w-full h-full object-cover"
              />
            </div>
          </div>

          <!-- File Input -->
          <div class="mb-4">
            <input
              ref="modalFileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileSelect"
            />
            <button
              @click="triggerModalFileInput"
              class="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-[10px] text-[14px] text-[#151515] hover:border-[#cb8a2e] transition-colors"
            >
              {{ profileImagePreview ? 'Change Photo' : 'Select Photo' }}
            </button>
            <p class="text-[12px] text-[#212121] mt-2 text-center">
              JPG, PNG or GIF. Max size 2MB
            </p>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[5px] text-[14px]">
            {{ errorMessage }}
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-[5px] text-[14px]">
            {{ successMessage }}
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button
              @click="closeUploadModal"
              class="flex-1 py-3 px-4 border border-gray-300 rounded-[5px] text-[14px] font-semibold text-[#151515] hover:bg-gray-50 transition-colors"
              :disabled="isUploading"
            >
              Cancel
            </button>
            <button
              @click="handleUploadPhoto"
              :disabled="!selectedFile || isUploading"
              class="flex-1 py-3 px-4 bg-[#cb8a2e] rounded-[5px] text-[14px] font-semibold text-white hover:bg-[#b87a26] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isUploading">Uploading...</span>
              <span v-else>Upload</span>
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Navbar from '@/components/ui/navbar/Navbar.vue';
import Modal from '@/components/ui/modal/Modal.vue';
import { useAuth } from '@/components/lib/auth';
import { formatDate } from '@/components/lib/utils';
import { useRouter } from 'vue-router';
import { uploadProfileImage, updateProfileInfo } from '@/components/lib/profile';
import { getImageUrl } from '@/components/lib/utils';

const { state, logout, fetchLoggedInUser } = useAuth();
const router = useRouter();

const pushNotificationEnabled = ref(false);
const currentProfileImage = ref<string | null>(state.user?.user_image);
const fileInput = ref<HTMLInputElement | null>(null);
const modalFileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const profileImagePreview = ref<string | null>(null);
const showUploadModal = ref(false);
const isUploading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const displayName = computed(() => {
  return state.user?.full_name || 'User';
});

const userRole = computed(() => {
  if (state.user?.employee) {
    const employee = state.user.employee as any;
    return employee.designation || employee.department || 'Employee';
  }
  return 'Employee';
});

const joinDate = computed(() => {
  if (state.user?.employee) {
    const employee = state.user.employee as any;
    if (employee.date_of_joining) {
      return formatDate(employee.date_of_joining);
    }
  }
  return 'N/A';
});


function triggerFileInput() {
  showUploadModal.value = true;
  // Reset state when opening modal
  selectedFile.value = null;
  profileImagePreview.value = null;
  errorMessage.value = '';
  successMessage.value = '';
}

function triggerModalFileInput() {
  modalFileInput.value?.click();
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'Please select an image file';
    setTimeout(() => {
      errorMessage.value = '';
    }, 3000);
    return;
  }
  
  // Validate file size (2MB)
  if (file.size > 2 * 1024 * 1024) {
    errorMessage.value = 'File size must be less than 2MB';
    setTimeout(() => {
      errorMessage.value = '';
    }, 3000);
    return;
  }
  
  selectedFile.value = file;
  errorMessage.value = '';
  
  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    profileImagePreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
}

function closeUploadModal() {
  showUploadModal.value = false;
  selectedFile.value = null;
  profileImagePreview.value = null;
  errorMessage.value = '';
  successMessage.value = '';
  // Reset file inputs
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  if (modalFileInput.value) {
    modalFileInput.value.value = '';
  }
}

async function handleUploadPhoto() {
  if (!selectedFile.value) return;

  errorMessage.value = '';
  successMessage.value = '';
  isUploading.value = true;

  try {
    // Step 1: Upload file
    let uploadedImagePath: string | null = null;
    try {
      uploadedImagePath = await uploadProfileImage(selectedFile.value);
      if (!uploadedImagePath) {
        errorMessage.value = 'Failed to upload profile image';
        return;
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      errorMessage.value = error?.message || 'Failed to upload profile image';
      return;
    }

    // Step 2: Update profile info
    try {
      await updateProfileInfo({
        user_image: uploadedImagePath,
      });
      
      // Refresh user data
      await fetchLoggedInUser();
      
      // Update current profile image
      currentProfileImage.value = uploadedImagePath;
      
      successMessage.value = 'Profile picture updated successfully!';
      
      // Close modal after 1.5 seconds
      setTimeout(() => {
        closeUploadModal();
        // Clear success message after modal closes
        setTimeout(() => {
          successMessage.value = '';
        }, 500);
      }, 1500);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      errorMessage.value = error?.message || 'Failed to update profile';
    }
  } finally {
    isUploading.value = false;
  }
}

function togglePushNotification() {
  pushNotificationEnabled.value = !pushNotificationEnabled.value;
  // TODO: Implement push notification toggle API call
}

function handleSignOut() {
  logout();
}
</script>
