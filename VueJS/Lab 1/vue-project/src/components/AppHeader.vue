<script setup>
import { computed, onMounted, onUnmounted } from "vue";
import { useCartStore } from "@/stores/cartStore";

const cartStore = useCartStore();
const cartItemCount = computed(() => cartStore.totalItems);
const storeName = "Abibos";

onMounted(() => {
  console.log("AppHeader mounted");
});

onUnmounted(() => {
  console.log("AppHeader unmounted");
});
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl"
  >
    <div class="navbar mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="flex-1">
        <RouterLink
          to="/"
          class="text-2xl font-black tracking-tight text-white transition hover:text-primary"
        >
          {{ storeName }}
        </RouterLink>
      </div>

      <nav
        class="hidden items-center gap-6 pr-6 text-sm font-semibold text-slate-300 md:flex"
      >
        <RouterLink to="/" class="transition hover:text-white">Home</RouterLink>
        <RouterLink to="/products" class="transition hover:text-white"
          >Products</RouterLink
        >
        <RouterLink to="/about" class="transition hover:text-white"
          >About</RouterLink
        >
        <!--making cart icon with a red badge counter-->
        <RouterLink to="/cart" class="relative transition hover:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="{2}"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M17 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6m14 0l-.4 2M9 13l-3.6 6M21 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6"
            />
          </svg>
          <span
            class="absolute -top-3 -right-5 badge badge-error text-xs font-bold text-white"
          >
            {{ cartItemCount }}
          </span>
        </RouterLink>
      </nav>

      <div class="flex-none">
        <div
          class="badge badge-primary badge-outline px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white"
        >
          New Collection
        </div>
      </div>
    </div>
  </header>
</template>
