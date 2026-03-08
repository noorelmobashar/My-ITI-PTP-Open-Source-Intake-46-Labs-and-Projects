<script setup>
import { onMounted, onUnmounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const props = defineProps({
  cartItemCount: {
    type: Number,
    required: true,
  },
})

const highlights = [
    {
        label: 'Craftsmanship first',
        text: 'Every collection starts with silhouette, comfort, and material quality so each pair feels premium from the first step.',
    },
    {
        label: 'Modern identity',
        text: 'We blend clean streetwear aesthetics with expressive details that feel current without losing versatility.',
    },
    {
        label: 'Everyday performance',
        text: 'Our footwear is designed to move with real routines, from quick commutes and campus days to long city nights.',
    },
]

const milestones = [
    {
        year: '2022',
        title: 'The first concept drop',
        text: 'Abibos began as a focused experiment: create a compact footwear line with bold visual identity and dependable comfort.',
    },
    {
        year: '2024',
        title: 'Collection expansion',
        text: 'The catalog grew from signature sneakers into runners, boots, and seasonal essentials shaped by customer feedback.',
    },
    {
        year: '2026',
        title: 'Refined modern storefront',
        text: 'Today the brand continues building sharper digital experiences and curated drops with a stronger premium feel.',
    },
]

const values = [
    'Intentional design decisions over unnecessary noise.',
    'Durable comfort that supports daily use.',
    'Seasonal edits that keep the catalog fresh and relevant.',
    'A shopping experience that feels clear, elevated, and modern.',
]

onMounted(() => {
    console.log('AboutView mounted')
})

onUnmounted(() => {
    console.log('AboutView unmounted')
})
</script>

<template>
    <div class="min-h-screen bg-slate-950 text-base-content">
        <div class="pointer-events-none absolute inset-0 overflow-hidden">
            <div class="absolute left-0 top-0 h-80 w-80 rounded-full bg-primary/20 blur-3xl"></div>
            <div class="absolute right-0 top-32 h-96 w-96 rounded-full bg-secondary/20 blur-3xl"></div>
            <div class="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-accent/20 blur-3xl"></div>
        </div>

        <AppHeader storeName="Abibos" :cartItemCount="cartItemCount" />
        <main class="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <section class="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                <div>
                    <div class="badge badge-primary badge-outline mb-5 border-primary/40 px-4  text-xs font-semibold uppercase tracking-[0.35em] text-white">
                        About Abibos
                    </div>
                    <h1 class="max-w-3xl text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                        We build footwear stories around comfort, clarity, and confident style.
                    </h1>
                    <p class="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                        Abibos is a modern footwear concept focused on creating a cleaner and more expressive everyday look. Our goal is simple: deliver collections that feel premium, wearable, and visually sharp while keeping the shopping experience elegant and easy to explore.
                    </p>
                    <p class="mt-4 max-w-2xl text-base leading-7 text-slate-400">
                        From first sketch to final storefront presentation, every decision is made to balance visual impact with long-term comfort. We care about fit, silhouette, texture, and the mood each pair brings to a wardrobe.
                    </p>

                    <div class="mt-8 flex flex-wrap gap-4">
                        <RouterLink to="/products" class="btn btn-primary btn-lg rounded-full border-0 px-8 shadow-lg shadow-primary/30">
                            Explore products
                        </RouterLink>
                        <RouterLink to="/" class="btn btn-outline btn-lg rounded-full px-8 text-white hover:text-white">
                            Back home
                        </RouterLink>
                    </div>
                </div>

                <div class="grid gap-4">
                    <div class="rounded-[2rem] border border-white/10 bg-white/8 p-7 shadow-[0_20px_80px_rgba(15,23,42,0.55)] backdrop-blur-xl">
                        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Brand philosophy</p>
                        <h2 class="mt-4 text-3xl font-black text-white">Style should feel effortless, not complicated.</h2>
                        <p class="mt-4 leading-7 text-slate-300">
                            We believe great products speak through shape, comfort, and consistency. That is why Abibos focuses on details that make a product feel elevated without losing practicality.
                        </p>
                    </div>

                    <div class="grid gap-4 sm:grid-cols-2">
                        <div class="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 backdrop-blur">
                            <p class="text-3xl font-black text-white">4+</p>
                            <p class="mt-2 text-sm uppercase tracking-[0.25em] text-slate-400">Signature categories</p>
                        </div>
                        <div class="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 backdrop-blur">
                            <p class="text-3xl font-black text-white">100%</p>
                            <p class="mt-2 text-sm uppercase tracking-[0.25em] text-slate-400">Design-led direction</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="mt-20 grid gap-6 lg:grid-cols-3">
                <div
                    v-for="item in highlights"
                    :key="item.label"
                    class="rounded-[2rem] border border-white/10 bg-white/5 p-7 backdrop-blur"
                >
                    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{{ item.label }}</p>
                    <p class="mt-4 text-base leading-7 text-slate-300">{{ item.text }}</p>
                </div>
            </section>

            <section class="mt-20 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
                <div class="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
                    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-primary">What we stand for</p>
                    <h2 class="mt-4 text-3xl font-black tracking-tight text-white">A modern brand built on thoughtful fundamentals.</h2>
                    <p class="mt-4 leading-7 text-slate-300">
                        Abibos is not only about selling products. It is about shaping a recognizable identity that customers can trust. We want every visit to feel curated, every page to feel intentional, and every product to communicate purpose.
                    </p>

                    <ul class="mt-6 space-y-4">
                        <li v-for="value in values" :key="value" class="flex gap-4 rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-4">
                            <span class="mt-1 h-3 w-3 shrink-0 rounded-full bg-primary"></span>
                            <span class="leading-7 text-slate-300">{{ value }}</span>
                        </li>
                    </ul>
                </div>

                <div class="rounded-[2rem] border border-white/10 bg-white/8 p-8 shadow-xl backdrop-blur">
                    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Our journey</p>
                    <div class="mt-8 space-y-6">
                        <div
                            v-for="milestone in milestones"
                            :key="milestone.year"
                            class="relative rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-6"
                        >
                            <div class="mb-3 inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                                {{ milestone.year }}
                            </div>
                            <h3 class="text-2xl font-black text-white">{{ milestone.title }}</h3>
                            <p class="mt-3 leading-7 text-slate-300">{{ milestone.text }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="mt-20 rounded-[2rem] border border-white/10 bg-gradient-to-r from-white/8 via-slate-900/80 to-white/8 p-8 shadow-xl backdrop-blur lg:p-10">
                <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Looking ahead</p>
                        <h2 class="mt-4 max-w-2xl text-3xl font-black tracking-tight text-white sm:text-4xl">
                            We are continuing to refine the collection with sharper details, better storytelling, and stronger product experiences.
                        </h2>
                        <p class="mt-4 max-w-3xl leading-7 text-slate-300">
                            As Abibos grows, the mission stays the same: create a premium-feeling brand presence with products that people genuinely enjoy wearing. We aim to keep improving every release, every interaction, and every detail that shapes the customer journey.
                        </p>
                    </div>

                    <RouterLink to="/products" class="btn btn-primary btn-lg rounded-full border-0 px-8 shadow-lg shadow-primary/30">
                        Shop the collection
                    </RouterLink>
                </div>
            </section>
        </main>
        <AppFooter storeName="Abibos" />
    </div>
</template>