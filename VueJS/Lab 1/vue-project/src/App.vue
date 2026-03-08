<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import cozySneakersImage from "./assets/images/1.jpg";
import runningShoesImage from "./assets/images/2.jpg";
import casualBootsImage from "./assets/images/3.jpg";
import flipFlopsImage from "./assets/images/4.jpg";


const products = ref([
  {
    "id": 1,
    "name": "Cozy Sneakers",
    "description": "High-quality sneakers that go with everything you wear.",
    "image": cozySneakersImage,
    "badge": "NEW",
    "price": 120,
    "discount": 20,
    "stock": 10,
    "tags": ["Fashion", "Casual", "Sport"],
    "isAvailable": true
  },
  {
    "id": 2,
    "name": "Running Shoes",
    "description": "Built for speed and comfort on any terrain.",
    "image": runningShoesImage,
    "badge": "",
    "price": 90,
    "discount": 10,
    "stock": 5,
    "tags": ["Sport", "Running"],
    "isAvailable": true
  },
  {
    "id": 3,
    "name": "Casual Boots",
    "description": "Rugged boots for everyday adventures.",
    "image": casualBootsImage,
    "badge": "SALE",
    "price": 150,
    "discount": 0,
    "stock": 8,
    "tags": ["Casual", "Winter"],
    "isAvailable": true
  },
  {
    "id": 4,
    "name": "Flip Flops",
    "description": "Light and breezy for sunny days.",
    "image": flipFlopsImage,
    "badge": "",
    "price": 30,
    "discount": 50,
    "stock": 20,
    "tags": ["Summer", "Casual"],
    "isAvailable": true
  }
]);

const cartItemCount = ref(Number(0));

onMounted(() => {
  console.log("App mounted");
});

onUnmounted(() => {
  console.log("App unmounted");
});

const decreaseStock = (productId) => {
  const product = products.value.find((p) => p.id === productId);
  if (product && product.isAvailable) {
    if (product.stock > 0) {
      product.stock -= 1;
      cartItemCount.value += 1;
      if (product.stock === 0) {
        product.isAvailable = false;
      }
    } else {
      product.isAvailable = false;
  }
}};

</script>

<template>

  <RouterView v-slot="{Component}">
    <component 
      :is="Component" 
      :products="products"
      :cartItemCount="cartItemCount"
      @decrease-stock="decreaseStock"   />
  </RouterView>

</template>
