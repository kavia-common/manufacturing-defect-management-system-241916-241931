"use client";

import React from "react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <section className="surface p-4">
        <h2 className="card-title">Settings</h2>
        <p className="card-subtitle">
          Configuration lists (defect types, lines, shifts, parts) and your profile.
        </p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="surface p-3">
            <p className="text-xs text-[var(--muted)]">User</p>
            <p className="text-sm font-medium">{user?.email ?? "—"}</p>
          </div>

          <div className="surface p-3">
            <p className="text-xs text-[var(--muted)]">Role</p>
            <p className="text-sm font-medium">To be enforced by backend (RBAC)</p>
          </div>
        </div>
      </section>

      <section className="surface p-4">
        <h3 className="card-title">Configuration</h3>
        <p className="card-subtitle">
          Backend endpoints will expose CRUD for these lists; UI placeholders are ready.
        </p>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="surface p-3">
            <p className="text-sm font-medium">Defect Types</p>
            <p className="text-xs text-[var(--muted)]">e.g., Scratch, Dent, Mislabel…</p>
            <p className="text-sm text-[var(--muted)] mt-2">Coming soon.</p>
          </div>
          <div className="surface p-3">
            <p className="text-sm font-medium">Lines / Shifts / Parts</p>
            <p className="text-xs text-[var(--muted)]">Shop-floor selectable lists.</p>
            <p className="text-sm text-[var(--muted)] mt-2">Coming soon.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
