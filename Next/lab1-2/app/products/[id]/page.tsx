import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById, getAllProductIds } from "../../lib/api";
import ReviewForm from "../../components/ReviewForm";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const ids = await getAllProductIds();
    return ids.map((id) => ({ id: String(id) }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProductById(Number(id));
    return {
      title: product.title,
      description: product.description,
      openGraph: {
        title: product.title,
        description: product.description,
        images: [{ url: product.images[0] }],
      },
    };
  } catch {
    return {
      title: "Product Not Found",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  let product;

  try {
    product = await getProductById(Number(id));
  } catch {
    notFound();
  }

  const reviews = product.reviews || [];

  return (
    <main>
      <Link href="/" className="back-link">
        ← Back to Products
      </Link>

      <section className="product-detail">
        <div className="product-gallery">
          <Image
            src={product.images[0] || product.thumbnail}
            alt={product.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="product-info">
          <span className="category-badge">{product.category}</span>
          <h1>{product.title}</h1>
          <p className="price-tag">${product.price.toFixed(2)}</p>
          <p className="description">{product.description}</p>

          <div className="product-meta">
            {product.brand && (
              <div className="meta-item">
                <span>Brand</span>
                <strong>{product.brand}</strong>
              </div>
            )}
            <div className="meta-item">
              <span>Status</span>
              <strong style={{ color: product.stock > 0 ? "var(--success)" : "var(--error)" }}>
                {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
              </strong>
            </div>
            <div className="meta-item">
              <span>Discount</span>
              <strong>{product.discountPercentage}% OFF</strong>
            </div>
            <div className="meta-item">
              <span>Rating</span>
              <strong>⭐ {product.rating} / 5</strong>
            </div>
          </div>
        </div>
      </section>

      <ReviewForm productId={product.id} />

      <section className="review-section" style={{ marginTop: "2rem" }}>
        <h2>Customer Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p style={{ color: "var(--text-secondary)" }}>No reviews yet. Be the first to write one!</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((review, index) => (
              <div key={index} className="review-card">
                <div className="review-card-header">
                  <span className="review-card-name">{review.reviewerName}</span>
                  <span className="review-card-date">{new Date(review.date).toLocaleDateString()}</span>
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`star ${i < review.rating ? "filled" : ""}`}>★</span>
                  ))}
                </div>
                <p className="review-card-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
