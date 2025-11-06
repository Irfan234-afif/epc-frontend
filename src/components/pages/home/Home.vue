<template>
    <div class="p-6">
      <Navbar>
        <div class="flex items-center">
            <img class="w-16 h-16 rounded-full" src="/avatar.png" alt="User Avatar">
            <div class="ml-4">
            <p class="text-xl font-bold text-gray-800">Hello, Alvin</p>
            <p class="text-sm text-gray-600">UI/UX Designer - Marketing</p>
            </div>
        </div>
      </Navbar>

      <div class="mt-8 relative">
        <div class="bg-black text-white p-6 rounded-lg shadow-lg relative min-h-[218px] flex flex-col">
          <div class="text-right">
            <company-logo/>
          </div>
          
          <div class="flex-1"></div> <!-- Spacer di sini -->
          
          <div>
            <p class="text-sm tracking-widest">07-1234-3738-2828</p>
          </div>

          <div class="flex-1"></div> <!-- Spacer di sini -->
          
          <div class="flex justify-between items-end">
            <div>
              <p class="text-sm mt-4">Monthly Limit</p>
              <p class="text-3xl font-bold tracking-wider">IDR 22.981.902</p>
              <p class="text-xs mt-4">Expires in 17 days</p>
            </div>
            <div class="bg-white/10 p-2 rounded-lg" @click="openModal({
              mode: 'qr',
              width: 'xl',
              data: {
                code: '07-1234-3738-2828',
              }
            })">
              <!-- <img src="http://localhost:3845/assets/f0734302df95667c9f2e775645c29045323ef63e.svg" alt="QR Code" class="w-10 h-10"> -->
              <IconQR class="w-10 h-10"/>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4 flex">
        <router-link to="/purchase-history" class="text-center flex-1">
          <div class="text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33 34" fill="none" class="w-10 h-10 mx-auto">
              <path d="M16.3018 33.3333C12.3004 33.3333 8.78934 32.1056 5.7685 29.65C2.74767 27.1944 0.840724 24.0472 0.0476686 20.2083C-0.0384426 19.9014 -0.00788669 19.6174 0.139336 19.3563C0.286558 19.0951 0.517808 18.9437 0.833086 18.9021C1.12892 18.8604 1.38934 18.925 1.61434 19.0958C1.83795 19.2667 1.99697 19.5097 2.09142 19.825C2.8442 23.1361 4.54281 25.8681 7.18725 28.0208C9.8317 30.1736 12.8699 31.25 16.3018 31.25C20.3643 31.25 23.8102 29.8354 26.6393 27.0062C29.4685 24.1771 30.8838 20.7306 30.8852 16.6667C30.8866 12.6028 29.4713 9.15625 26.6393 6.32708C23.8074 3.49792 20.3616 2.08333 16.3018 2.08333C14.1449 2.08333 12.1185 2.53889 10.2227 3.45C8.32684 4.35972 6.65322 5.61319 5.20184 7.21042H9.32892C9.62475 7.21042 9.87267 7.31042 10.0727 7.51042C10.2727 7.71042 10.372 7.95833 10.3706 8.25417C10.3692 8.55 10.2699 8.79722 10.0727 8.99583C9.87545 9.19444 9.62753 9.29375 9.32892 9.29375H3.40184C2.92545 9.29375 2.52614 9.13264 2.20392 8.81042C1.8817 8.48819 1.72059 8.08889 1.72059 7.6125V1.68333C1.72059 1.3875 1.82059 1.14028 2.02059 0.941667C2.22059 0.743056 2.46781 0.643056 2.76225 0.641667C3.0567 0.640278 3.30392 0.740278 3.50392 0.941667C3.70392 1.14306 3.80392 1.39028 3.80392 1.68333V5.61667C5.41503 3.84861 7.30253 2.47083 9.46642 1.48333C11.6303 0.495833 13.9088 0.00138889 16.3018 0C18.6143 0 20.7803 0.434722 22.7998 1.30417C24.8192 2.17361 26.5838 3.36389 28.0935 4.875C29.6032 6.38611 30.7935 8.15 31.6643 10.1667C32.5352 12.1833 32.9699 14.3493 32.9685 16.6646C32.9671 18.9799 32.5324 21.1465 31.6643 23.1646C30.7963 25.1826 29.606 26.9479 28.0935 28.4604C26.581 29.9729 24.8164 31.1625 22.7998 32.0292C20.7831 32.8958 18.6185 33.3306 16.3018 33.3333ZM17.4623 16.2333L23.7123 22.4833C23.9067 22.6778 24.0109 22.9167 24.0248 23.2C24.0386 23.4847 23.9345 23.7375 23.7123 23.9583C23.49 24.1806 23.2449 24.2917 22.9768 24.2917C22.706 24.2917 22.4602 24.1806 22.2393 23.9583L15.8852 17.6042C15.7032 17.4236 15.5734 17.2333 15.4956 17.0333C15.4178 16.8333 15.3789 16.6271 15.3789 16.4146V7.29167C15.3789 6.99583 15.4789 6.74861 15.6789 6.55C15.8789 6.35 16.1268 6.25 16.4227 6.25C16.7185 6.25 16.9657 6.35 17.1643 6.55C17.3629 6.75 17.4623 6.99722 17.4623 7.29167V16.2333Z" fill="black"/>
            </svg>
            <p class="text-sm font-bold mt-4">History</p>
          </div>
        </router-link>
        <router-link to="/offers" class="text-center flex-1">
          <div class="text-center p-4">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 mx-auto">
              <path d="M16.6488 2.38723C17.0396 1.95076 17.5181 1.60162 18.053 1.36258C18.5878 1.12355 19.1671 1 19.753 1C20.3388 1 20.9181 1.12355 21.453 1.36258C21.9879 1.60162 22.4663 1.95076 22.8571 2.38723L24.3155 4.0164C24.7323 4.48201 25.2485 4.84792 25.8258 5.08701C26.4032 5.32611 27.0269 5.43227 27.6509 5.39765L29.8384 5.27681C30.4235 5.24456 31.0088 5.33608 31.5561 5.5454C32.1034 5.75472 32.6005 6.07714 33.0147 6.49159C33.429 6.90604 33.7511 7.4032 33.9602 7.95062C34.1693 8.49804 34.2605 9.0834 34.228 9.66848L34.1071 11.8539C34.0728 12.4775 34.1792 13.1009 34.4182 13.6778C34.6573 14.2548 35.0231 14.7707 35.4884 15.1872L37.1176 16.6456C37.5544 17.0364 37.9038 17.515 38.1431 18.05C38.3823 18.5851 38.506 19.1646 38.506 19.7508C38.506 20.3369 38.3823 20.9164 38.1431 21.4515C37.9038 21.9866 37.5544 22.4652 37.1176 22.856L35.4884 24.3143C35.0228 24.7311 34.6569 25.2473 34.4178 25.8247C34.1787 26.402 34.0725 27.0258 34.1071 27.6497L34.228 29.8372C34.2602 30.4223 34.1687 31.0076 33.9594 31.555C33.7501 32.1023 33.4277 32.5993 33.0132 33.0136C32.5988 33.4278 32.1016 33.75 31.5542 33.959C31.0067 34.1681 30.4214 34.2593 29.8363 34.2268L27.6509 34.106C27.0273 34.0717 26.4039 34.178 25.827 34.4171C25.25 34.6562 24.7341 35.0219 24.3176 35.4872L22.8592 37.1164C22.4684 37.5532 21.9898 37.9026 21.4548 38.1419C20.9197 38.3811 20.3401 38.5048 19.754 38.5048C19.1679 38.5048 18.5884 38.3811 18.0533 38.1419C17.5182 37.9026 17.0396 37.5532 16.6488 37.1164L15.1905 35.4872C14.7737 35.0216 14.2575 34.6557 13.6801 34.4166C13.1028 34.1775 12.479 34.0714 11.8551 34.106L9.66756 34.2268C9.08247 34.2591 8.49715 34.1675 7.94983 33.9582C7.40251 33.7489 6.9055 33.4265 6.49124 33.012C6.07699 32.5976 5.75481 32.1004 5.54575 31.553C5.33669 31.0056 5.24545 30.4202 5.27798 29.8351L5.39881 27.6497C5.43312 27.0261 5.3268 26.4028 5.08771 25.8258C4.84863 25.2488 4.4829 24.733 4.01756 24.3164L2.3884 22.8581C1.95159 22.4672 1.60214 21.9887 1.3629 21.4536C1.12366 20.9185 1 20.339 1 19.7529C1 19.1667 1.12366 18.5872 1.3629 18.0521C1.60214 17.517 1.95159 17.0385 2.3884 16.6476L4.01756 15.1893C4.48318 14.7725 4.84908 14.2563 5.08818 13.679C5.32727 13.1016 5.43344 12.4779 5.39881 11.8539L5.27798 9.6664C5.24603 9.08147 5.33778 8.49639 5.54723 7.94932C5.75669 7.40225 6.07915 6.90549 6.49356 6.49147C6.90798 6.07745 7.40504 5.75546 7.95231 5.54652C8.49958 5.33758 9.08475 5.24639 9.66964 5.2789L11.8551 5.39973C12.4787 5.43404 13.102 5.32772 13.679 5.08864C14.256 4.84955 14.7718 4.48381 15.1884 4.01848L16.6488 2.38723Z" stroke="black" stroke-width="2"/>
              <path d="M14.5447 14.5435H14.5655V14.5643H14.5447V14.5435ZM24.9613 24.9602H24.9822V24.981H24.9613V24.9602Z" stroke="black" stroke-width="2" stroke-linejoin="round"/>
              <path d="M26.0029 13.5018L13.5029 26.0018" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            
            <p class="text-sm font-bold mt-4">Offers</p>
          </div>
        </router-link>
        <router-link to="/stamps" class="text-center flex-1">
          <div class="text-center p-4">
            <svg class="h-10 w-10 mx-auto" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0_227_202" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="38" height="38">
              <path d="M1 4.5625L4.5625 1L8.125 3.67188L11.6875 1L15.25 3.67188L18.8125 1L22.375 3.67188L25.9375 1L29.5 3.67188L33.0625 1L36.625 4.5625L33.9531 8.125L36.625 11.6875L33.9531 15.25L36.625 18.8125L33.9531 22.375L36.625 25.9375L33.9531 29.5L36.625 33.0625L33.0625 36.625L29.5 33.9531L25.9375 36.625L22.375 33.9531L18.8125 36.625L15.25 33.9531L11.6875 36.625L8.125 33.9531L4.5625 36.625L1 33.0625L3.67188 29.5L1 25.9375L3.67188 22.375L1 18.8125L3.67188 15.25L1 11.6875L3.67188 8.125L1 4.5625Z" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M18.8125 27.25C23.4724 27.25 27.25 23.4724 27.25 18.8125C27.25 14.1526 23.4724 10.375 18.8125 10.375C14.1526 10.375 10.375 14.1526 10.375 18.8125C10.375 23.4724 14.1526 27.25 18.8125 27.25Z" fill="black" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </mask>
              <g mask="url(#mask0_227_202)">
              <path d="M-3.6875 -3.6875H41.3125V41.3125H-3.6875V-3.6875Z" fill="black"/>
              </g>
            </svg>
  
            <p class="text-sm font-bold mt-4">707Stamp</p>
          </div>
        </router-link>
      </div>

      <div class="mt-8">
        <div class="flex justify-between items-center">
          <p class="text-lg font-bold">Latest Employee Offers</p>
          <svg class="w-4 h-4" preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path id="Vector" d="M0 8C0 9.58225 0.469192 11.129 1.34824 12.4446C2.22729 13.7602 3.47672 14.7855 4.93853 15.391C6.40034 15.9965 8.00887 16.155 9.56072 15.8463C11.1126 15.5376 12.538 14.7757 13.6569 13.6569C14.7757 12.538 15.5376 11.1126 15.8463 9.56072C16.155 8.00887 15.9965 6.40034 15.391 4.93853C14.7855 3.47672 13.7602 2.22729 12.4446 1.34824C11.129 0.469192 9.58225 0 8 0C5.87827 0 3.84344 0.842854 2.34315 2.34315C0.842854 3.84344 0 5.87827 0 8ZM3.42857 7.42857H10.3714L7.18286 4.22457L8 3.42857L12.5714 8L8 12.5714L7.18286 11.756L10.3714 8.57143H3.42857V7.42857Z" fill="var(--fill-0, #CB8A2E)"/>
          </svg>
        </div>
        <div class="mt-4 flex space-x-4 overflow-x-auto">
          <div class="bg-white rounded-lg shadow-lg w-64 flex-shrink-0">
            <img src="/event1.png" alt="Offer 1" class="w-full h-32 object-cover rounded-t-lg">
            <div class="p-4">
              <p class="text-sm">Exclusive deals for employees only at Fuglen Coffee ASHTA. First timer visit employee only.</p>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-lg w-64 flex-shrink-0">
            <img src="/event2.png" alt="Offer 2" class="w-full h-32 object-cover rounded-t-lg">
            <div class="p-4">
              <p class="text-sm">LAST DROP 60% OFF! Get Melissa’s last stock in selected store.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 space-y-4">
        <div class="flex justify-between items-center">
          <p class="text-lg font-bold">Find Stores Near You</p>
          <svg class="w-4 h-4" preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path id="Vector" d="M0 8C0 9.58225 0.469192 11.129 1.34824 12.4446C2.22729 13.7602 3.47672 14.7855 4.93853 15.391C6.40034 15.9965 8.00887 16.155 9.56072 15.8463C11.1126 15.5376 12.538 14.7757 13.6569 13.6569C14.7757 12.538 15.5376 11.1126 15.8463 9.56072C16.155 8.00887 15.9965 6.40034 15.391 4.93853C14.7855 3.47672 13.7602 2.22729 12.4446 1.34824C11.129 0.469192 9.58225 0 8 0C5.87827 0 3.84344 0.842854 2.34315 2.34315C0.842854 3.84344 0 5.87827 0 8ZM3.42857 7.42857H10.3714L7.18286 4.22457L8 3.42857L12.5714 8L8 12.5714L7.18286 11.756L10.3714 8.57143H3.42857V7.42857Z" fill="var(--fill-0, black)"/>
          </svg>
        </div>
        <div class="flex justify-between items-center">
          <p class="text-lg font-bold">Contact IT Support</p>
          <svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4">
            <path id="Vector" d="M0 8C0 9.58225 0.469192 11.129 1.34824 12.4446C2.22729 13.7602 3.47672 14.7855 4.93853 15.391C6.40034 15.9965 8.00887 16.155 9.56072 15.8463C11.1126 15.5376 12.538 14.7757 13.6569 13.6569C14.7757 12.538 15.5376 11.1126 15.8463 9.56072C16.155 8.00887 15.9965 6.40034 15.391 4.93853C14.7855 3.47672 13.7602 2.22729 12.4446 1.34824C11.129 0.469192 9.58225 0 8 0C5.87827 0 3.84344 0.842854 2.34315 2.34315C0.842854 3.84344 0 5.87827 0 8ZM3.42857 7.42857H10.3714L7.18286 4.22457L8 3.42857L12.5714 8L8 12.5714L7.18286 11.756L10.3714 8.57143H3.42857V7.42857Z" fill="var(--fill-0, black)"/>
          </svg>
        </div>
        <div class="flex justify-between items-center">
          <p class="text-lg font-bold text-[#cb8a2e]">Sign Out</p>
          <svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4"  >
            <path id="Vector" d="M0 8C0 9.58225 0.469192 11.129 1.34824 12.4446C2.22729 13.7602 3.47672 14.7855 4.93853 15.391C6.40034 15.9965 8.00887 16.155 9.56072 15.8463C11.1126 15.5376 12.538 14.7757 13.6569 13.6569C14.7757 12.538 15.5376 11.1126 15.8463 9.56072C16.155 8.00887 15.9965 6.40034 15.391 4.93853C14.7855 3.47672 13.7602 2.22729 12.4446 1.34824C11.129 0.469192 9.58225 0 8 0C5.87827 0 3.84344 0.842854 2.34315 2.34315C0.842854 3.84344 0 5.87827 0 8ZM3.42857 7.42857H10.3714L7.18286 4.22457L8 3.42857L12.5714 8L8 12.5714L7.18286 11.756L10.3714 8.57143H3.42857V7.42857Z" fill="var(--fill-0, black)"/>
          </svg>
        </div>
      </div>
    </div>
  <Modal
    :show="showModal"
    :maxWidth="'sm'"
    @close="closeModal"
    :property="propertyModal"
  >
    <template v-slot="{propertyModal}">
      <QRView :show="propertyModal.mode === 'qr'" @close="closeModal" :code="propertyModal.data.code"/>
    </template>
  </Modal>
  
</template>

<script setup lang="ts">
import CompanyLogo from '@/components/icons/CompanyLogo.vue';
import IconQR from '@/components/icons/IconQR.vue';
import QRView from '@/components/pages/home/QRView.vue';
import { ref } from 'vue';
import Modal from '@/components/ui/modal/Modal.vue';
import Navbar from '@/components/ui/navbar/Navbar.vue';
import { useAuth } from '@/components/lib/auth';

const { state } = useAuth();

const showModal = ref(false);
const propertyModal = ref<{
    title: string | null;
    mode: string | null;
    maxWidth: string | null;
    data: Record<string, any> | null;
}>(null) as Record<string, any> | null;

function closeModal() {
    showModal.value = false;
    propertyModal.value = {
    title: null,
    mode: null,
    maxWidth: null,
    data: null,
    };
};

function openModal(property: Record<string, any>) {
    showModal.value = true;
    propertyModal.value = property;
};
</script>
