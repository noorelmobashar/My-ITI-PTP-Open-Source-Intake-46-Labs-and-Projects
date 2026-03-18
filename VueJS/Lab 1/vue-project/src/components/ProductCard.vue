<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore'

const props = defineProps({
  product_id: {
    type: Number,
    required: true
  }
})

const productStore = useProductStore();
const cartStore = useCartStore();

const product = computed(() => productStore.products.find(p => p.id === props.product_id) ?? null)

const discountedPrice = computed(() => {
  if (!product.value) return 0
  return product.value.price - (product.value.price * product.value.discount) / 100
})

function buyProduct() {
  if (product.value) {
    cartStore.addToCart(product.value)
  }
}

onMounted(() => {
  console.log('ProductCard mounted')
})

onUnmounted(() => {
  console.log('ProductCard unmounted')
})
</script>

<template>
  <div v-if="product" class="card card-side overflow-hidden border border-white/10 bg-white/8 shadow-[0_20px_80px_rgba(15,23,42,0.55)] backdrop-blur-xl flex-col md:flex-row">

    <figure class="relative md:w-1/2 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 p-5">
      <img :src="product.image" :alt="product.name" class="h-full min-h-[320px] w-full rounded-3xl object-cover shadow-2xl ring-1 ring-white/10" />
    </figure>

    <div class="card-body gap-5 md:w-1/2 md:p-8">
      <div class="flex flex-wrap items-center gap-3">
        <h2 class="card-title text-3xl font-black tracking-tight text-white">{{ product.name }}</h2>

        <span
          v-if="product.badge"
          class="badge border-0 px-4 py-3 font-bold shadow-lg"
          :class="{
            'badge-primary': product.badge === 'NEW',
            'badge-secondary': product.badge !== 'NEW'
          }"
        >
          {{ product.badge }}
        </span>
        <span v-if="!product.isAvailable" class="badge badge-error border-0 px-4 py-3 font-bold shadow-lg">Out of Stock</span>
      </div>

      <p class="max-w-xl text-base leading-7 text-slate-300">{{ product.description }}</p>

      <div class="flex flex-wrap gap-3 my-1">
        <span
          v-for="tag in product.tags"
          :key="tag"
          class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur"
        >
          {{ tag }}
        </span>
      </div>

      <div class="mt-2 rounded-3xl border border-white/10 bg-slate-900/60 p-5">
        <p class="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-slate-400">Price</p>
        <span v-if="product.discount > 0" class="mr-3 text-lg text-slate-500 line-through">
          ${{ product.price }}
        </span>

        <span
          class="text-4xl font-black tracking-tight"
          :style="{ color: product.discount > 0 ? '#16a34a' : '#ffffff' }"
        >
          ${{ discountedPrice }}
        </span>
        <span v-if="product.discount > 0" class="ml-3 text-sm font-semibold text-success">
          ({{ product.discount }}% off)
        </span>
        <p class="mt-3 text-sm font-medium text-slate-300">
          Stock: <span class="font-bold text-white">{{ product.stock }}</span> units available
        </p>
      </div>

      <div class="card-actions mt-2 items-center justify-between gap-4">
        <div class="text-sm text-slate-400">
          Free shipping • 30-day returns
        </div>
        <button
          type="button"
          class="btn btn-primary btn-lg rounded-full border-0 px-8 shadow-lg shadow-primary/30"
          :disabled="!product.isAvailable"
          @click="buyProduct"
        >
          {{ product.isAvailable ? 'Add to Cart' : 'Out of Stock' }}
        </button>
      </div>

    </div>
  </div>
</template>
