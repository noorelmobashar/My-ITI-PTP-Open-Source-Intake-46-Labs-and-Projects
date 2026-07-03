"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled Route Error:", error);
  }, [error]);

  return (
    <main className="container" style={{ minHeight: "70vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <div className="not-found">
        <h1>Oops!</h1>
        <h2>Something went wrong!</h2>
        <p style={{ color: "var(--error)", margin: "1rem 0" }}>{error.message || "An unexpected error occurred."}</p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={() => reset()} className="btn btn-primary">
            Try Again
          </button>
          <Link href="/" className="btn btn-outline">
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
