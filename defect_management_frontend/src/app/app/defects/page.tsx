"use client";

import React from "react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/apiClient";

const createSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  line: z.string().optional(),
  part: z.string().optional(),
  shift: z.string().optional(),
  severity: z.string().optional(),
});

type CreateValues = z.infer<typeof createSchema>;

export default function DefectsPage() {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [items, setItems] = React.useState<
    Awaited<ReturnType<typeof api.listDefects>>["items"]
  >([]);

  const [creating, setCreating] = React.useState(false);
  const form = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { title: "", description: "", line: "", part: "", shift: "", severity: "" },
  });

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.listDefects({ q: q || undefined, status: status || undefined });
      setItems(res.items ?? []);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to load defects";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(values: CreateValues) {
    setCreating(true);
    try {
      const created = await api.createDefect(values);
      form.reset();
      await refresh();
      // If API returns id, let user jump to detail
      if (created?.id) {
        // no router import needed; link provided below after refresh
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to create defect";
      setError(message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-4">
      <section className="surface p-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="card-title">Defect Log</h2>
            <p className="card-subtitle">
              Capture defects at point of occurrence and track through closure.
            </p>
          </div>
          <button className="btn btn-primary" type="button" onClick={() => document.getElementById("createDefect")?.scrollIntoView({ behavior: "smooth" })}>
            New defect
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
          <input
            className="input md:col-span-2"
            placeholder="Search by title / part / line…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="CLOSED">Closed</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>

        <div className="mt-2">
          <button className="btn" type="button" onClick={refresh}>
            Apply filters
          </button>
        </div>

        {error ? (
          <div className="mt-4 surface border-red-100 bg-red-50 p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        ) : null}

        <div className="mt-4 overflow-auto">
          <table className="table min-w-[800px]">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Line</th>
                <th>Part</th>
                <th>Shift</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-4 text-sm text-[var(--muted)]">
                    Loading defects…
                  </td>
                </tr>
              ) : items.length ? (
                items.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="text-xs text-[var(--muted)]">{d.id}</td>
                    <td className="font-medium">
                      <Link className="text-blue-700 hover:underline" href="/app/defects/detail">
                        {d.title}
                      </Link>
                    </td>
                    <td>{d.line ?? "—"}</td>
                    <td>{d.part ?? "—"}</td>
                    <td>{d.shift ?? "—"}</td>
                    <td>{d.severity ?? "—"}</td>
                    <td>
                      <span
                        className={[
                          "badge",
                          d.status === "OPEN"
                            ? "badge-open"
                            : d.status === "IN_PROGRESS"
                              ? "badge-inprogress"
                              : d.status === "CLOSED"
                                ? "badge-closed"
                                : "badge-blocked",
                        ].join(" ")}
                      >
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-4 text-sm text-[var(--muted)]">
                    No defects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section id="createDefect" className="surface p-4">
        <h3 className="card-title">New defect</h3>
        <p className="card-subtitle">
          Start with minimal details; attach photos and complete RCA later.
        </p>

        <form className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={form.handleSubmit(onCreate)}>
          <div className="md:col-span-2 space-y-1">
            <label className="label" htmlFor="title">
              Title *
            </label>
            <input id="title" className="input" {...form.register("title")} />
            {form.formState.errors.title?.message ? (
              <p className="text-xs text-[var(--danger)]">{form.formState.errors.title.message}</p>
            ) : null}
          </div>

          <div className="space-y-1">
            <label className="label" htmlFor="line">
              Line
            </label>
            <input id="line" className="input" {...form.register("line")} />
          </div>

          <div className="space-y-1">
            <label className="label" htmlFor="part">
              Part
            </label>
            <input id="part" className="input" {...form.register("part")} />
          </div>

          <div className="space-y-1">
            <label className="label" htmlFor="shift">
              Shift
            </label>
            <input id="shift" className="input" placeholder="A / B / C" {...form.register("shift")} />
          </div>

          <div className="space-y-1">
            <label className="label" htmlFor="severity">
              Severity
            </label>
            <input id="severity" className="input" placeholder="Low / Medium / High" {...form.register("severity")} />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="label" htmlFor="description">
              Description
            </label>
            <textarea id="description" className="input min-h-24" {...form.register("description")} />
          </div>

          <div className="md:col-span-2 flex gap-2">
            <button className="btn btn-primary" type="submit" disabled={creating}>
              {creating ? "Creating…" : "Create defect"}
            </button>
            <button className="btn" type="button" onClick={() => form.reset()}>
              Clear
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
