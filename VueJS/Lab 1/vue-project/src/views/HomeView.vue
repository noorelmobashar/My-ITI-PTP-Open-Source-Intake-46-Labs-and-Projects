<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
  cartItemCount: {
    type: Number,
    required: true,
  },
})

const featuredProducts = computed(() => props.products.slice(0, 3))

onMounted(() => {
  console.log('HomeView mounted')
})

onUnmounted(() => {
  console.log('HomeView unmounted')
})
</script>

<template>

  <div class="min-h-screen bg-slate-950 text-base-content">
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl"></div>
      <div class="absolute right-0 top-40 h-80 w-80 rounded-full bg-secondary/20 blur-3xl"></div>
      <div class="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-accent/20 blur-3xl"></div>
    </div>

    <AppHeader storeName="Abibos" :cartItemCount="cartItemCount"/>

    <main class="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section class="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <div class="badge badge-primary badge-outline mb-5 border-primary/40 px-4 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white">
            Modern streetwear essentials
          </div>
          <h1 class="max-w-3xl text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            Step into bold footwear designed for modern movement.
          </h1>
          <p class="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Explore curated sneakers, runners, boots, and seasonal drops crafted with premium comfort, clean silhouettes, and standout details.
          </p>
          <div class="mt-8 flex flex-wrap gap-4">
            <RouterLink to="/products" class="btn btn-primary btn-lg rounded-full border-0 px-8 shadow-lg shadow-primary/30">
              Shop collection
            </RouterLink>
            <RouterLink to="/product/1" class="btn btn-outline btn-lg rounded-full px-8 text-white hover:text-white">
              View featured pair
            </RouterLink>
          </div>

          <div class="mt-10 grid gap-4 sm:grid-cols-3">
            <div class="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p class="text-3xl font-black text-white">4+</p>
              <p class="mt-2 text-sm uppercase tracking-[0.25em] text-slate-400">Curated drops</p>
            </div>
            <div class="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p class="text-3xl font-black text-white">24h</p>
              <p class="mt-2 text-sm uppercase tracking-[0.25em] text-slate-400">Fast dispatch</p>
            </div>
            <div class="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p class="text-3xl font-black text-white">30d</p>
              <p class="mt-2 text-sm uppercase tracking-[0.25em] text-slate-400">Easy returns</p>
            </div>
          </div>
        </div>

        <div class="grid gap-4">
          <div class="rounded-[2rem] border border-white/10 bg-white/8 p-4 shadow-[0_20px_80px_rgba(15,23,42,0.55)] backdrop-blur-xl">
            <img
              :src="products[0]?.image"
              :alt="products[0]?.name"
              class="h-[420px] w-full rounded-[1.5rem] object-cover"
            />
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-[2rem] border border-white/10 bg-slate-900/70 p-5 backdrop-blur">
              <p class="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Why Abibos</p>
              <p class="mt-3 text-xl font-bold text-white">Elevated comfort. Sharp design. Everyday confidence.</p>
            </div>
            <div class="rounded-[2rem] border border-white/10 bg-slate-900/70 p-5 backdrop-blur">
              <p class="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Signature fit</p>
              <p class="mt-3 text-xl font-bold text-white">Engineered silhouettes with premium materials and modern detail.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="mt-20 grid gap-6 lg:grid-cols-3">
        <div class="rounded-[2rem] border border-white/10 bg-white/5 p-7 backdrop-blur">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Crafted finishes</p>
          <h2 class="mt-4 text-2xl font-black text-white">Designed to look premium from every angle.</h2>
          <p class="mt-3 text-slate-300">Minimal lines, expressive textures, and bold color accents keep every pair polished and versatile.</p>
        </div>
        <div class="rounded-[2rem] border border-white/10 bg-white/5 p-7 backdrop-blur">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Built for motion</p>
          <h2 class="mt-4 text-2xl font-black text-white">Comfort that carries you through every routine.</h2>
          <p class="mt-3 text-slate-300">Flexible cushioning and dependable support keep the experience smooth from morning errands to late nights.</p>
        </div>
        <div class="rounded-[2rem] border border-white/10 bg-white/5 p-7 backdrop-blur">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Limited drops</p>
          <h2 class="mt-4 text-2xl font-black text-white">Fresh edits released for every season.</h2>
          <p class="mt-3 text-slate-300">Stay ahead with selected styles and discount-driven launches that keep the lineup feeling exclusive.</p>
        </div>
      </section>

      <section class="mt-20">
        <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Featured selection</p>
            <h2 class="text-3xl font-black tracking-tight text-white sm:text-4xl">A quick preview of the collection.</h2>
          </div>
          <RouterLink to="/products" class="btn btn-ghost rounded-full px-6 text-white hover:bg-white/10 hover:text-white">
            Browse all products
          </RouterLink>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
          <RouterLink
            v-for="item in featuredProducts"
            :key="item.id"
            :to="`/product/${item.id}`"
            class="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 p-4 shadow-xl backdrop-blur transition duration-300 hover:-translate-y-2 hover:shadow-[0_18px_50px_rgba(59,130,246,0.18)]"
          >
            <img :src="item.image" :alt="item.name" class="h-64 w-full rounded-[1.5rem] object-cover" />
            <div class="pt-5">
              <div class="mb-3 flex items-center justify-between gap-3">
                <h3 class="text-2xl font-black text-white">{{ item.name }}</h3>
                <span v-if="item.badge" class="badge border-0 px-4 py-3 font-bold" :class="item.badge === 'NEW' ? 'badge-primary' : 'badge-secondary'">
                  {{ item.badge }}
                </span>
              </div>
              <p class="text-sm leading-7 text-slate-300">{{ item.description }}</p>
              <div class="mt-5 flex items-center justify-between">
                <span class="text-xl font-black text-white">${{ item.price - (item.price * item.discount) / 100 }}</span>
                <span class="text-sm font-semibold text-primary transition group-hover:translate-x-1">View details →</span>
              </div>
            </div>
          </RouterLink>
        </div>
      </section>
    </main>
    <AppFooter storeName="Abibos" />
  </div>
</template>
