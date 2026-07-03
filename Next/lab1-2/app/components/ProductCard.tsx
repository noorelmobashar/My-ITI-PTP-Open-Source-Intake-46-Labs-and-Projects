import Image from "next/image";
import Link from "next/link";
import { Product } from "../lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="product-card" id={`product-card-${product.id}`}>
      <div className="product-card-image">
        <Image
          src={product.images[0] || product.thumbnail}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <span className="product-card-badge">{product.category}</span>
      </div>
      <div className="product-card-body">
        <h3 className="product-card-title">{product.title}</h3>
        <p className="product-card-desc">{product.description}</p>
        <div className="product-card-footer">
          <span className="product-card-price">${product.price.toFixed(2)}</span>
          <span className="product-card-rating">⭐ {product.rating?.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}
