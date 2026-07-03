export default function Loading() {
  return (
    <main className="container">
      <div className="hero">
        <div style={{ height: "40px", width: "300px", background: "var(--bg-secondary)", margin: "0 auto 1rem", borderRadius: "8px" }} className="skeleton" />
        <div style={{ height: "20px", width: "450px", background: "var(--bg-secondary)", margin: "0 auto", borderRadius: "8px" }} className="skeleton" />
      </div>
      <div style={{ height: "48px", maxWidth: "520px", margin: "2rem auto 3rem", borderRadius: "12px" }} className="skeleton" />
      <div className="loading-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton skeleton-card" />
        ))}
      </div>
    </main>
  );
}
