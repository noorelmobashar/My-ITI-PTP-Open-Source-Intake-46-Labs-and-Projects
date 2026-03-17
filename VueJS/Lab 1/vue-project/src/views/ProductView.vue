<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import HeroSection from '../components/HeroSection.vue'
import ProductCard from '../components/ProductCard.vue'
import RelatedProducts from '../components/RelatedProducts.vue'
import AppFooter from '../components/AppFooter.vue'
import { useProductStore } from '@/stores/productStore'

const route = useRoute();
const productStore = useProductStore();

const productId = Number(route.params.id);
const product = computed(() => productStore.products.find(p => p.id === productId) ?? null)


onMounted(() => {
  productStore.fetchAllProducts()
  console.log('ProductView mounted')
})

onUnmounted(() => {
  console.log('ProductView unmounted')
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-base-content">
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl"></div>
      <div class="absolute right-0 top-40 h-80 w-80 rounded-full bg-secondary/20 blur-3xl"></div>
      <div class="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-accent/20 blur-3xl"></div>
    </div>
    <AppHeader />
    <div v-if="productStore.loading || productStore.products.length === 0" class="flex h-96 items-center justify-center">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>
    <main v-else-if="product" class="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <RouterLink to="/products" class="btn btn-ghost rounded-full px-6 text-white hover:bg-white/10 hover:text-white">
          ← Back to products
        </RouterLink>
      </div>

      <HeroSection />
      <ProductCard :product_id="productId" />
      <RelatedProducts :current_product_id="productId" />
    </main>

    <main v-else class="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <div class="rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-[0_20px_80px_rgba(15,23,42,0.55)] backdrop-blur-xl">
        <div class="badge badge-secondary border-0 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white">
          Product not found
        </div>
        <h1 class="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">This product is no longer in the current drop.</h1>
        <p class="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300">
          The item you requested may have moved or is unavailable right now. Browse the active collection to discover the latest styles.
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-4">
          <RouterLink to="/products" class="btn btn-primary btn-lg rounded-full border-0 px-8 shadow-lg shadow-primary/30">
            Browse products
          </RouterLink>
          <RouterLink to="/" class="btn btn-outline btn-lg rounded-full px-8 text-white hover:text-white">
            Go home
          </RouterLink>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>
