<template>
  <div class="fixed inset-0 bg-[#1b1b1b] bg-opacity-80 flex items-center justify-center z-50">
      <div class="relative w-[177px] h-[5px] overflow-hidden">
        <div class="absolute bg-[#d9d9d9] h-px w-full top-1/2 -translate-y-1/2"></div>
        <div class="absolute bg-[#cb8a2e] h-[3px] w-[90px] top-1/2 -translate-y-1/2 animate-loading"></div>
      </div>
  </div>
</template>

<style scoped>
@keyframes loading {
  0% {
    left: -90px;
  }
  100% {
    left: 177px;
  }
}

.animate-loading {
  animation: loading 1.5s infinite linear;
}
</style>
