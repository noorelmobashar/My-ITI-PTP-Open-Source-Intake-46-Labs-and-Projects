import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container" style={{ minHeight: "75vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className="not-found">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for might have been removed or is temporarily unavailable.</p>
        <Link href="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
