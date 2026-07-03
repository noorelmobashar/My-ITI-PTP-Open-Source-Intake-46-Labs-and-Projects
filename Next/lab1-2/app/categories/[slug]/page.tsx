import Link from "next/link";
import { Metadata } from "next";
import ProductCard from "../../components/ProductCard";
import { getProductsByCategory } from "../../lib/api";

interface CategoryProductsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryProductsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const formatted = decoded.charAt(0).toUpperCase() + decoded.slice(1).replace("-", " ");
  return {
    title: formatted,
    description: `Browse all products in the ${formatted} category.`,
  };
}

export default async function CategoryProductsPage({ params }: CategoryProductsPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const data = await getProductsByCategory(decodedSlug);
  const products = data.products || [];

  return (
    <main className="container">
      <Link href="/categories" className="back-link">
        ← Back to Categories
      </Link>

      <section className="hero" style={{ textTransform: "capitalize" }}>
        <h1>{decodedSlug.replace("-", " ")}</h1>
        <p>Showing {products.length} products in this category.</p>
      </section>

      {products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <p>No products found in this category.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
