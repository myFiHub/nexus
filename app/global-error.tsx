"use client";

/**
 * Replaces the root layout when it crashes, so it cannot rely on Redux,
 * global CSS or fonts being available.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#0B0B1E",
          color: "#F4F3FF",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        <main style={{ maxWidth: 420, padding: 32, textAlign: "center" }}>
          <h1 style={{ fontSize: 24, margin: "0 0 8px" }}>Podium Nexus hit a snag</h1>
          <p style={{ opacity: 0.7, margin: "0 0 24px", fontSize: 14 }}>
            Something went wrong while loading the app. Please try again.
            {error.digest && (
              <span style={{ display: "block", marginTop: 8, fontFamily: "monospace", fontSize: 12 }}>
                Reference: {error.digest}
              </span>
            )}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                border: 0,
                borderRadius: 999,
                padding: "10px 20px",
                fontWeight: 600,
                cursor: "pointer",
                color: "#fff",
                background: "linear-gradient(135deg, #7C5CFF, #FF5CA8)",
              }}
            >
              Try again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full reload is intended here */}
            <a
              href="/"
              style={{
                borderRadius: 999,
                padding: "10px 20px",
                fontWeight: 600,
                color: "inherit",
                border: "1px solid rgba(255,255,255,0.2)",
                textDecoration: "none",
              }}
            >
              Go home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
