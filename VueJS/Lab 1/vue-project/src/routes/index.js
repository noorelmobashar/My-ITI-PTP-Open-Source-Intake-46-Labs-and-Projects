import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductsView from '../views/ProductsView.vue'
import ProductView from '../views/ProductView.vue'
import AboutView from '@/views/AboutView.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/products',
    name: 'products',
    component: ProductsView,
  },
  {
    path: '/product/:id',
    name: 'product',
    component: ProductView,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
