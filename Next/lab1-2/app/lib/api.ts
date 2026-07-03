import { Product, ProductsResponse } from "./types";

const BASE_URL = "https://dummyjson.com";

export async function getProducts(): Promise<ProductsResponse> {
  const res = await fetch(`${BASE_URL}/products?limit=30&select=id,title,description,category,price,images,thumbnail,rating,stock,brand,discountPercentage,reviews`, {
    cache: "force-cache",
  });

  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function getProductById(id: number): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`Failed to fetch product ${id}`);
  return res.json();
}

export async function searchProducts(query: string): Promise<ProductsResponse> {
  const res = await fetch(`${BASE_URL}/products/search?q=${encodeURIComponent(query)}&select=id,title,description,category,price,images,thumbnail,rating,stock,brand,discountPercentage`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to search products");
  return res.json();
}

export async function getCategories(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/products/category-list`, {
    cache: "force-cache",
  });

  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function getProductsByCategory(category: string): Promise<ProductsResponse> {
  const res = await fetch(`${BASE_URL}/products/category/${encodeURIComponent(category)}?select=id,title,description,category,price,images,thumbnail,rating,stock,brand,discountPercentage`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`Failed to fetch category ${category}`);
  return res.json();
}

export async function getAllProductIds(): Promise<number[]> {
  const res = await fetch(`${BASE_URL}/products?limit=30&select=id`, {
    cache: "force-cache",
  });

  if (!res.ok) throw new Error("Failed to fetch product IDs");
  const data: ProductsResponse = await res.json();
  return data.products.map((p) => p.id);
}
