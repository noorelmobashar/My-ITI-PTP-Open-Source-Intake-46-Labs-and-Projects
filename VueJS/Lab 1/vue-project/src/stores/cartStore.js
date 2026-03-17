import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { useProductStore } from './productStore';

export const useCartStore = defineStore('cartStore', () => {
  const productStore = useProductStore();
  const items = useLocalStorage('cart', []);

  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + ((item.price * (1 - item.discount / 100)) * item.quantity), 0);
  });

  async function addToCart(product) {
    const availableStock = await productStore.checkQuantity(product.id, product);

    if (availableStock <= 0) {
      alert('Sorry, this product is out of stock!');
      return;
    }

    const existingItem = items.value.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      items.value.push({ ...product, quantity: 1 });
    }

    await productStore.decreaseStock(product.id, 1, product);
  }

  async function removeFromCart(item) {
    if (item && item.quantity > 1) {
      item.quantity--;
      await productStore.increaseStock(item.id, 1, item);
    } else if (item && item.quantity === 1) {
      items.value = items.value.filter(i => i.id !== item.id);
      await productStore.increaseStock(item.id, 1, item);
    } else {
      alert('Item not found in cart!');
    }
  }

  async function clearCart() {
    await Promise.all(items.value.map(item => productStore.increaseStock(item.id, item.quantity, item)));
    items.value = [];
  }

  return {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    clearCart
  };
});
