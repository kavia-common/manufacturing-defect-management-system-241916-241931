"use client";

import React from "react";
import Link from "next/link";
import { api } from "@/lib/apiClient";

export default function DashboardPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<Awaited<ReturnType<typeof api.getDashboard>> | null>(null);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .getDashboard()
      .then((d) => {
        if (!mounted) return;
        setData(d);
        setError(null);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e?.message ?? "Failed to load dashboard");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <section className="surface p-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="card-title">Dashboard</h2>
            <p className="card-subtitle">
              Overview of defects and corrective actions (Pareto & trends).
            </p>
          </div>
          <div className="flex gap-2">
            <Link className="btn" href="/app/defects">
              Go to Defect Log
            </Link>
            <Link className="btn btn-primary" href="/app/actions">
              Review Actions
            </Link>
          </div>
        </div>

        {loading ? (
          <p className="mt-4 text-sm text-[var(--muted)]">Loading dashboard…</p>
        ) : error ? (
          <div className="mt-4 surface border-red-100 bg-red-50 p-3">
            <p className="text-sm text-red-700">{error}</p>
            <p className="text-xs text-red-600 mt-1">
              Note: backend endpoints may still be under implementation. The UI is wired and will work once available.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="surface p-3">
              <p className="text-xs text-[var(--muted)]">Open defects</p>
              <p className="text-2xl font-semibold">{data?.openDefects ?? "—"}</p>
            </div>
            <div className="surface p-3">
              <p className="text-xs text-[var(--muted)]">Overdue actions</p>
              <p className="text-2xl font-semibold">{data?.overdueActions ?? "—"}</p>
            </div>
            <div className="surface p-3">
              <p className="text-xs text-[var(--muted)]">Top defect type (Pareto)</p>
              <p className="text-sm font-medium mt-1">
                {data?.pareto?.[0] ? `${data.pareto[0].label} (${data.pareto[0].count})` : "—"}
              </p>
            </div>
            <div className="surface p-3">
              <p className="text-xs text-[var(--muted)]">Latest trend</p>
              <p className="text-sm font-medium mt-1">
                {data?.trends?.[data.trends.length - 1]
                  ? `${data.trends[data.trends.length - 1].date}: ${data.trends[data.trends.length - 1].count}`
                  : "—"}
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="surface p-4">
          <h3 className="card-title">Pareto (Top Defect Types)</h3>
          <p className="card-subtitle">Shows the most frequent defect categories.</p>

          <div className="mt-3">
            {data?.pareto?.length ? (
              <ul className="space-y-2">
                {data.pareto.slice(0, 8).map((p) => (
                  <li key={p.label} className="flex items-center justify-between">
                    <span className="text-sm">{p.label}</span>
                    <span className="text-sm font-medium">{p.count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[var(--muted)] mt-2">No Pareto data yet.</p>
            )}
          </div>
        </div>

        <div className="surface p-4">
          <h3 className="card-title">Trend (Defects Over Time)</h3>
          <p className="card-subtitle">Daily/weekly defect counts for early warning.</p>

          <div className="mt-3">
            {data?.trends?.length ? (
              <ul className="space-y-2">
                {data.trends.slice(-10).map((t) => (
                  <li key={t.date} className="flex items-center justify-between">
                    <span className="text-sm">{t.date}</span>
                    <span className="text-sm font-medium">{t.count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[var(--muted)] mt-2">No trend data yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
