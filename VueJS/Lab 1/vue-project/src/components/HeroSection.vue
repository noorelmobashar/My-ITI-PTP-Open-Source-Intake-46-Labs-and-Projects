<script setup>
import { onMounted, onUnmounted } from 'vue'

defineProps({
  discount: {
    type: Number,
    required: true
  }
})

onMounted(() => {
  console.log('HeroSection mounted')
})

onUnmounted(() => {
  console.log('HeroSection unmounted')
})
</script>

<template>
  <section class="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div>
      <p class="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Featured drop</p>
      <h1 class="text-4xl font-black tracking-tight text-white sm:text-5xl">Step into a cleaner, bolder look.</h1>
      <p class="mt-3 max-w-2xl text-base text-slate-300">
        Discover premium everyday sneakers with modern comfort, standout styling, and limited seasonal offers.
      </p>
    </div>
    
    <div class="stats border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
      <div class="stat px-6 py-4">
        <div class="stat-title text-slate-300">Discount</div>
        <div class="stat-value text-primary">{{ discount }}%</div>
        <div class="stat-desc text-slate-400">Limited-time deal</div>
      </div>
    </div>
  </section>
</template>
