<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useCartStore } from '@/stores/cartStore'

const cartStore = useCartStore()
const customerName = ref('')
const shippingAddress = ref('')

const isFormValid = computed(() => {
  return customerName.value.trim().length > 0 && shippingAddress.value.trim().length > 0
})

async function submitCheckout() {
  if (!isFormValid.value) return

  await cartStore.clearCart()
  customerName.value = ''
  shippingAddress.value = ''
}


onMounted(() => {
  console.log('CartView mounted')
})

onUnmounted(() => {
  console.log('CartView unmounted')
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
      <section class="mb-10">
        <p class="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Your selection</p>
        <h1 class="text-4xl font-black tracking-tight text-white sm:text-5xl">Shopping Cart</h1>
      </section>

      <!-- Empty cart -->
      <section v-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center py-20">
        <div class="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center shadow-[0_20px_80px_rgba(15,23,42,0.55)] backdrop-blur-xl">
          <div class="badge badge-secondary border-0 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white">
            Nothing here yet
          </div>
          <h2 class="mt-6 text-3xl font-black tracking-tight text-white">Your cart is empty</h2>
          <p class="mx-auto mt-4 max-w-md text-base leading-7 text-slate-300">
            Browse the collection and add your favorite pairs to get started.
          </p>
          <div class="mt-8">
            <RouterLink to="/products" class="btn btn-primary btn-lg rounded-full border-0 px-8 shadow-lg shadow-primary/30">
              Browse products
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- Cart with items -->
      <section v-else>
        <div class="space-y-4">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/8 p-5 shadow-xl backdrop-blur sm:flex-row sm:items-center"
          >
            <figure class="shrink-0">
              <img :src="item.image" :alt="item.name" class="h-28 w-28 rounded-2xl object-cover ring-1 ring-white/10" />
            </figure>

            <div class="flex-1">
              <h3 class="text-xl font-black text-white">{{ item.name }}</h3>
              <p class="mt-1 text-sm text-slate-400" v-if="item.discount > 0">
                <span class="line-through text-slate-500">${{ item.price.toFixed(2) }}</span>
                <span class="ml-2 text-success font-semibold">${{ (item.price * (1 - item.discount / 100)).toFixed(2) }}</span>
                <span class="ml-1 text-success text-xs">({{ item.discount }}% off)</span>
              </p>
              <p class="mt-1 text-sm text-slate-400" v-else>${{ item.price.toFixed(2) }} each</p>
            </div>

            <div class="flex items-center gap-3">
              <button
                type="button"
                class="btn btn-outline btn-sm rounded-full px-4 text-white hover:text-white"
                @click="cartStore.removeFromCart(item)"
              >
                −
              </button>
              <span class="min-w-[2rem] text-center text-lg font-bold text-white">{{ item.quantity }}</span>
              <button
                type="button"
                class="btn btn-outline btn-sm rounded-full px-4 text-white hover:text-white"
                @click="cartStore.addToCart(item)"
              >
                +
              </button>
            </div>

            <div class="min-w-[6rem] text-right">
              <p class="text-sm uppercase tracking-[0.2em] text-slate-400">Subtotal</p>
              <p class="text-2xl font-black text-white">${{ (item.price * (1 - item.discount / 100) * item.quantity).toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <div class="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section class="rounded-[2rem] border border-white/10 bg-slate-900/60 p-6 backdrop-blur">
            <p class="text-sm font-medium uppercase tracking-[0.25em] text-slate-400">Total</p>
            <p class="text-4xl font-black tracking-tight text-white">${{ cartStore.totalPrice.toFixed(2) }}</p>
            <p class="mt-1 text-sm text-slate-400">{{ cartStore.totalItems }} item{{ cartStore.totalItems !== 1 ? 's' : '' }} in cart</p>

            <div class="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                class="btn btn-outline rounded-full px-6 text-white hover:text-white"
                @click="cartStore.clearCart()"
              >
                Clear cart
              </button>
              <RouterLink to="/products" class="btn btn-primary rounded-full border-0 px-8 shadow-lg shadow-primary/30">
                Continue shopping
              </RouterLink>
            </div>
          </section>

          <form
            class="rounded-[2rem] border border-white/10 bg-white/8 p-6 shadow-xl backdrop-blur"
            @submit.prevent="submitCheckout"
          >
            <p class="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Checkout</p>
            <h2 class="mt-3 text-2xl font-black text-white">Delivery details</h2>

            <label class="mt-6 block">
              <span class="mb-2 block text-sm font-semibold text-slate-200">Name</span>
              <input
                v-model="customerName"
                type="text"
                class="input input-bordered w-full border-white/10 bg-slate-950/70 text-white placeholder:text-slate-500"
                placeholder="Enter your full name"
              />
            </label>

            <label class="mt-4 block">
              <span class="mb-2 block text-sm font-semibold text-slate-200">Address</span>
              <textarea
                v-model="shippingAddress"
                rows="4"
                class="textarea textarea-bordered w-full border-white/10 bg-slate-950/70 text-white placeholder:text-slate-500"
                placeholder="Enter your shipping address"
              ></textarea>
            </label>

            <button
              type="submit"
              class="btn btn-primary mt-6 w-full rounded-full border-0 px-8 shadow-lg shadow-primary/30 disabled:bg-slate-700 disabled:text-slate-400"
              :disabled="!isFormValid"
            >
              Place order
            </button>
          </form>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>
