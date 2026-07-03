export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  images: string[];
  thumbnail: string;
  rating: number;
  stock: number;
  brand?: string;
  discountPercentage: number;
  reviews: Review[];
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
