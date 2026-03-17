<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { useProductStore } from '@/stores/productStore'

const productStore = useProductStore()
const products = computed(() => productStore.products)

function getDiscountedPrice(product) {
  return product.price - (product.price * product.discount) / 100
}

onMounted(() => {
  productStore.fetchAllProducts()
  console.log('ProductsView mounted')
})

onUnmounted(() => {
  console.log('ProductsView unmounted')
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-base-content">
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute left-0 top-0 h-80 w-80 rounded-full bg-primary/20 blur-3xl"></div>
      <div class="absolute right-0 top-32 h-96 w-96 rounded-full bg-secondary/20 blur-3xl"></div>
      <div class="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-accent/20 blur-3xl"></div>
    </div>
    <AppHeader />
    <main class="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section class="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Full collection</p>
          <h1 class="text-4xl font-black tracking-tight text-white sm:text-5xl">Choose the pair that fits your energy.</h1>
          <p class="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Discover every drop in one place, from sleek daily sneakers to rugged statement boots and lightweight seasonal essentials.
          </p>
        </div>

        <div class="stats border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
          <div class="stat px-6 py-4">
            <div class="stat-title text-slate-300">Available products</div>
            <div class="stat-value text-primary">{{ products.length }}</div>
            <div class="stat-desc text-slate-400">Curated modern picks</div>
          </div>
        </div>
      </section>

      <section class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <RouterLink
          v-for="product in products"
          :key="product.id"
          :to="`/product/${product.id}`"
          class="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 p-4 shadow-xl backdrop-blur transition duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(59,130,246,0.20)]"
        >
          <div class="relative">
            <div v-if="product.discount > 0" class="badge badge-success absolute left-4 top-4 z-10 border-0 px-3 py-3 font-bold shadow">
              -{{ product.discount }}%
            </div>
            <div v-if="product.badge" class="badge badge-secondary absolute right-4 top-4 z-10 border-0 px-3 py-3 font-bold shadow">
              {{ product.badge }}
            </div>
            <img :src="product.image" :alt="product.name" class="h-72 w-full rounded-[1.5rem] object-cover" />
          </div>

          <div class="pt-5">
            <div class="mb-3 flex items-start justify-between gap-4">
              <div>
                <h2 class="text-2xl font-black text-white">{{ product.name }}</h2>
                <p class="mt-2 text-sm leading-6 text-slate-400">{{ product.description }}</p>
              </div>
              <span
                class="badge px-4 py-3 font-semibold shrink-0 whitespace-nowrap"
                :class="product.isAvailable ? 'badge-primary border-0' : 'badge-error border-0'"
              >
                {{ product.isAvailable ? 'In stock' : 'Sold out' }}
              </span>
            </div>

            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in product.tags"
                :key="tag"
                class="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-300"
              >
                {{ tag }}
              </span>
            </div>

            <p class="mt-4 text-sm font-medium text-slate-300">
              Stock available: <span class="font-bold text-white">{{ product.stock }}</span>
            </p>

            <div class="mt-6 flex items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-slate-900/70 px-5 py-4">
              <div>
                <span v-if="product.discount > 0" class="mr-2 text-sm text-slate-500 line-through">
                  ${{ product.price }}
                </span>
                <span class="text-3xl font-black text-white">${{ getDiscountedPrice(product) }}</span>
              </div>
              <span class="btn btn-primary rounded-full border-0 px-6 shadow-lg shadow-primary/20">
                Explore
              </span>
            </div>
          </div>
        </RouterLink>
      </section>
    </main>
    <AppFooter />
  </div>
</template>
