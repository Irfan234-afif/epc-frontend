<template>
  <div class="flex flex-col items-center p-5 bg-gray-50 rounded-lg shadow-md">
    <div class="text-center mb-4">
      <h2 class="text-2xl font-bold mb-2">{{ code }}</h2>
      <p class="text-sm">Alvin Decourus</p>
    </div>
    <div class="p-5 bg-gray-50 rounded-3xl shadow-sm mb-5">
      <img src="http://localhost:3845/assets/7394bbd90ddace986aa0d1ce1a7dc798ca61fab.png" alt="QR Code" class="w-56 h-56 mix-blend-darken" />
    </div>
    <div class="text-center text-gray-800 mb-5">
      <p class="font-bold text-lg mb-2">Show Payment QR to Staff</p>
      <p class="text-sm">Staff will scan this QR to apply your discount. Your balance will be updated after successful purchase.</p>
    </div>
    <button @click="$emit('close')" class="bg-gray-800 text-white font-bold py-3 w-64 rounded-md cursor-pointer">Close</button>
  </div>
</template>

<script setup>
defineEmits(['close']);

const props = defineProps({
  code: String,
});

</script>