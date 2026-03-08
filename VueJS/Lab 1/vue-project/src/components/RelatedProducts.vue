<script setup>
import { onMounted, onUnmounted } from 'vue'

defineProps({
  products: {
    type: Array,
    required: true
  }
})

function getDiscountedPrice(item) {
  return item.price - (item.price * item.discount) / 100
}

onMounted(() => {
  console.log('RelatedProducts mounted')
})

onUnmounted(() => {
  console.log('RelatedProducts unmounted')
})
</script>

<template>
  <section class="mt-14">
    <div class="mb-6 flex items-end justify-between gap-4">
      <div>
        <p class="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Curated picks</p>
        <h3 class="text-3xl font-black tracking-tight text-white">Related Products</h3>
      </div>
      <p class="hidden max-w-sm text-right text-sm text-slate-400 md:block">
        Handpicked styles that match the same premium look and all-day comfort.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="item in products"
        :key="item.id"
        class="card overflow-hidden border border-white/10 bg-white/8 shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_18px_50px_rgba(59,130,246,0.18)] backdrop-blur"
      >
        <figure class="relative p-4 pb-0">
          <div v-if="item.discount > 0" class="absolute left-7 top-7 badge badge-success border-0 px-3 py-3 font-bold shadow">
            -{{ item.discount }}%
          </div>
          <img :src="item.image" :alt="item.name" class="h-56 w-full rounded-3xl object-cover" />
        </figure>
        <div class="card-body">
          <h4 class="card-title text-xl font-bold text-white">{{ item.name }}</h4>
          <p class="text-sm text-slate-400">Stock: <span class="font-semibold text-white">{{ item.stock }}</span></p>
          <div class="flex items-center flex-wrap gap-2">
            
                <span v-if="item.discount > 0" class="mr-1 text-slate-500 line-through">
              ${{ item.price }}
            </span>
            <span class="text-2xl font-black text-white">${{ getDiscountedPrice(item) }}</span>
            <span v-if="item.discount > 0" class="ml-1 text-sm font-semibold text-success">
              ({{ item.discount }}% off)
            </span>
          </div>
          <div class="card-actions mt-4">
            <RouterLink :to="`/product/${item.id}`" class="btn btn-outline btn-primary rounded-full px-6">
              View Product
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
