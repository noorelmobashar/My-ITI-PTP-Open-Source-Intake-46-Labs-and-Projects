import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProduct } from '../models/iproduct';
import { ICategory } from '../models/icategory';

interface ICartItem {
  product: IProduct;
  count: number;
}

@Component({
  selector: 'app-product',
  imports: [CommonModule],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product {
  products: IProduct[] = [
    {
      id: 1,
      name: "Laptop",
      imgUrl: "https://fastly.picsum.photos/id/842/200/200.jpg?hmac=RW9iEgAYLKwoinQWSz_zrZHyOwmVEgqvoZTPebkRGMM",
      price: 1200,
      quantity: 10,
      catId: 1
    },
    {
      id: 2,
      name: "Mouse",
      imgUrl: "https://picsum.photos/200?random=2",
      price: 25,
      quantity: 0,
      catId: 1
    },
    {
      id: 3,
      name: "T-Shirt",
      imgUrl: "https://picsum.photos/200?random=3",
      price: 30,
      quantity: 1,
      catId: 2
    },
    {
      id: 4,
      name: "Jeans",
      imgUrl: "https://picsum.photos/200?random=4",
      price: 70,
      quantity: 25,
      catId: 2
    },
    {
      id: 5,
      name: "Coffee Mug",
      imgUrl: "https://picsum.photos/200?random=5",
      price: 12,
      quantity: 0,
      catId: 3
    },
    {
      id: 6,
      name: "Notebook",
      imgUrl: "https://picsum.photos/200?random=6",
      price: 8,
      quantity: 100,
      catId: 3
    }
  ];

  categories: ICategory[] = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Clothing" },
    { id: 3, name: "Stationery" }
  ];

  selectedCategoryId: number = 0;
  cart: ICartItem[] = [];

  getCategoryName(catId: number): string {
    return this.categories.find(c => c.id === catId)?.name || 'Unknown';
  }

  selectCategory(catId: number) {
    this.selectedCategoryId = catId;
  }

  get filteredProducts(): IProduct[] {
    if (this.selectedCategoryId === 0) {
      return this.products;
    }
    return this.products.filter(p => p.catId === this.selectedCategoryId);
  }

  addToCart(product: IProduct) {
    if (product.quantity > 0) {
      const cartItem = this.cart.find(item => item.product.id === product.id);
      if (cartItem) {
        cartItem.count++;
      } else {
        this.cart.push({ product, count: 1 });
      }
      product.quantity--;
    }
  }

  removeFromCart(cartItem: ICartItem) {
    const index = this.cart.findIndex(item => item.product.id === cartItem.product.id);
    if (index !== -1) {
      const originalProduct = this.products.find(p => p.id === cartItem.product.id);
      if (originalProduct) {
        originalProduct.quantity++;
      }

      this.cart[index].count--;
      if (this.cart[index].count === 0) {
        this.cart.splice(index, 1);
      }
    }
  }

  removeItemFromCart(cartItem: ICartItem) {
    const index = this.cart.findIndex(item => item.product.id === cartItem.product.id);
    if (index !== -1) {
      const originalProduct = this.products.find(p => p.id === cartItem.product.id);
      if (originalProduct) {
        originalProduct.quantity += cartItem.count;
      }
      this.cart.splice(index, 1);
    }
  }

  get totalCartPrice(): number {
    return this.cart.reduce((sum, item) => sum + (item.product.price * item.count), 0);
  }

  get totalCartItemsCount(): number {
    return this.cart.reduce((sum, item) => sum + item.count, 0);
  }
}
