<script setup>
import { onMounted, onUnmounted } from 'vue'

defineProps({
  storeName: {
    type: String,
    required: true
  }
})

onMounted(() => {
  console.log('AppFooter mounted')
})

onUnmounted(() => {
  console.log('AppFooter unmounted')
})
</script>

<template>
  <footer class="mt-16 border-t border-white/10 bg-slate-950/70 backdrop-blur-xl">
    <div class="footer footer-center mx-auto max-w-6xl gap-3 px-4 py-10 text-slate-300 sm:px-6 lg:px-8">
      <div class="badge badge-outline border-primary/40 px-4 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
        Style meets comfort
      </div>
      <p class="text-lg font-semibold text-white">{{ storeName }}</p>
      <p>&copy; 2026 {{ storeName }}. All rights reserved.</p>
    </div>
  </footer>
</template>
