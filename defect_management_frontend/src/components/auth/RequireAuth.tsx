"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="surface p-4">
          <p className="text-sm text-[var(--muted)]">Checking session…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;
  return <>{children}</>;
}
