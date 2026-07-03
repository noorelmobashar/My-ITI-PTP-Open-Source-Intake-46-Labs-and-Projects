import Link from "next/link";

export default function Loading() {
  return (
    <main>
      <Link href="/" className="back-link">
        ← Back to Products
      </Link>

      <section className="product-detail">
        <div className="skeleton skeleton-detail" />
        <div className="product-info" style={{ gap: "1.5rem" }}>
          <div style={{ height: "24px", width: "100px", borderRadius: "20px" }} className="skeleton" />
          <div style={{ height: "48px", width: "80%", borderRadius: "8px" }} className="skeleton" />
          <div style={{ height: "36px", width: "150px", borderRadius: "8px" }} className="skeleton" />
          <div style={{ height: "80px", width: "100%", borderRadius: "8px" }} className="skeleton" />
          <div style={{ height: "120px", width: "100%", borderRadius: "12px" }} className="skeleton" />
        </div>
      </section>
    </main>
  );
}
