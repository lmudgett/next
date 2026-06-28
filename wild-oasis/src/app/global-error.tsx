"use client";

import { useEffect } from "react";

// Last-resort boundary: catches errors thrown in the root layout itself.
// It replaces the root layout, so it renders its own <html>/<body> and uses
// inline styles (the global stylesheet may not be applied here).
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9fafb",
          color: "#374151",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 480, padding: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>
            Something went wrong
          </h1>
          <p style={{ marginBottom: 24 }}>
            A critical error occurred. Please try again.
          </p>
          {error.digest && (
            <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 24 }}>
              Reference: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: 6,
              background: "#4f46e5",
              color: "white",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
