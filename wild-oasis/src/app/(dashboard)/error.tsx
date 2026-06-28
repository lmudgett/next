"use client";

import { useEffect } from "react";

// Segment error boundary for the dashboard area. Rendered inside the dashboard
// layout, so the sidebar/header shell stays in place when a page errors.
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface for logging/observability.
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
      <h1 className="text-[2.4rem] font-semibold text-gray-700">
        Something went wrong
      </h1>
      <p className="text-gray-500 max-w-lg">
        We couldn&apos;t load this page. Try again, or contact the admin if the
        problem persists.
      </p>
      {error.digest && (
        <p className="text-[1.2rem] text-gray-400">Reference: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="button-type-primary size-medium-button"
      >
        Try again
      </button>
    </div>
  );
}
