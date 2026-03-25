import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <section className="surface p-6 max-w-lg w-full" role="alert" aria-live="assertive">
        <header className="space-y-2">
          <h1 className="text-xl font-semibold">404 – Page Not Found</h1>
          <p className="text-sm text-[var(--muted)]">
            The page you’re looking for doesn’t exist.
          </p>
        </header>

        <div className="mt-4 flex gap-2">
          <Link className="btn btn-primary" href="/app/dashboard">
            Go to Dashboard
          </Link>
          <Link className="btn" href="/login">
            Sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
