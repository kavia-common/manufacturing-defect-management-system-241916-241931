"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

export default function HomeRedirect() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? "/app/dashboard" : "/login");
  }, [loading, user, router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="surface px-6 py-5">
        <p className="text-sm text-[var(--muted)]">Loading…</p>
      </div>
    </main>
  );
}
