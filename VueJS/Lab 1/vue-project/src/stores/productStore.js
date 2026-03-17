import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApi } from '@/composables/useApi';

export const useProductStore = defineStore('productStore', () => {
  const products = ref([]);
  
  const api = useApi('/products');

  function normalizeProduct(product) {
    if (!product) return null;

    return {
      ...product,
      id: Number(product.id),
      stock: Number(product.stock)
    };
  }

  function upsertProduct(product) {
    const normalizedProduct = normalizeProduct(product);
    if (!normalizedProduct) return null;

    const existingIndex = products.value.findIndex(p => p.id === normalizedProduct.id);
    if (existingIndex >= 0) {
      products.value[existingIndex] = normalizedProduct;
    } else {
      products.value.push(normalizedProduct);
    }

    return products.value.find(p => p.id === normalizedProduct.id) ?? null;
  }

  async function fetchAllProducts() {
    try {
      const result = await api.getAll();
      products.value = result.map(normalizeProduct);
    } catch (err) {
      console.error("Store failed to load products:", err);
    }
  }

  async function fetchProductById(id) {
    try {
      const result = await api.getOne(id);
      return upsertProduct(result);
    } catch (err) {
      console.error(`Failed to fetch product with id ${id}:`, err);
      return null;
    }
  }

  async function updateProduct(id, updatedData) {
    try {
      await api.update(id, updatedData);
    } catch (err) {
      console.error("Update failed:", err);
    }
  }

  async function ensureProduct(id, fallbackProduct = null) {
    const productId = Number(id);
    const existingProduct = products.value.find(p => p.id === productId);
    if (existingProduct) return existingProduct;

    const fetchedProduct = await fetchProductById(productId);
    if (fetchedProduct) return fetchedProduct;

    if (fallbackProduct) {
      return upsertProduct(fallbackProduct);
    }

    return null;
  }

  async function adjustStock(id, amount, fallbackProduct = null) {
    const product = await ensureProduct(id, fallbackProduct);

    if (!product) return false;
    if (amount < 0 && product.stock < Math.abs(amount)) return false;

    product.stock += amount;
    product.isAvailable = product.stock > 0;

    await updateProduct(product.id, product);
    return true;
  }

  async function decreaseStock(id, amount = 1, fallbackProduct = null) {
    return adjustStock(id, -Math.abs(amount), fallbackProduct);
  }

  async function increaseStock(id, amount = 1, fallbackProduct = null) {
    return adjustStock(id, Math.abs(amount), fallbackProduct);
  }

  async function checkQuantity(id, fallbackProduct = null) {
    const product = await ensureProduct(id, fallbackProduct);
    if (product) {
      return product.stock;
    }

    return fallbackProduct ? Number(fallbackProduct.stock ?? 0) : 0;
  }

  return { 
    products, 
    loading: api.loading, 
    error: api.error, 
    fetchAllProducts,
    updateProduct,
    decreaseStock,
    increaseStock,
    checkQuantity,
    fetchProductById
  };
});
