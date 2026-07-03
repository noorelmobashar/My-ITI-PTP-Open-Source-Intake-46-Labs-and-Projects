import SearchBar from "./components/SearchBar";
import ProductCard from "./components/ProductCard";
import Newsletter from "./components/Newsletter";
import { getProducts, searchProducts } from "./lib/api";

interface HomeProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { q } = await searchParams;
  const isSearch = typeof q === "string" && q.trim().length > 0;

  const data = isSearch ? await searchProducts(q) : await getProducts();
  const products = data.products || [];

  return (
    <main className="container">
      <section className="hero">
        <h1>{isSearch ? `Search Results for "${q}"` : "Discover Premium Products"}</h1>
        <p>
          {isSearch
            ? `We found ${products.length} products matching your query.`
            : "Curated collection of the finest products, delivered to your doorstep."}
        </p>
      </section>

      <SearchBar />

      {products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
          <h3>No products found</h3>
          <p>Try searching for something else or browse the homepage.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {!isSearch && <Newsletter />}
    </main>
  );
}
