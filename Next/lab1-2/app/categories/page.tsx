import Link from "next/link";
import { getCategories } from "../lib/api";

export const metadata = {
  title: "Categories",
  description: "Browse all product categories available in our store.",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="container">
      <section className="hero">
        <h1>Product Categories</h1>
        <p>Explore our wide selection of categories to find exactly what you need.</p>
      </section>

      <div className="categories-grid">
        {categories.map((category) => (
          <Link key={category} href={`/categories/${category}`} className="category-card">
            {category.replace("-", " ")}
          </Link>
        ))}
      </div>
    </main>
  );
}
