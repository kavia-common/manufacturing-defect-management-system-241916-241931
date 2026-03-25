"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { api } from "@/lib/apiClient";

const schema = z.object({
  defectId: z.string().min(1, "Defect ID required"),
  title: z.string().min(3, "Title required"),
  owner: z.string().optional(),
  dueDate: z.string().optional(), // yyyy-mm-dd
});

type Values = z.infer<typeof schema>;

export default function ActionsPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [items, setItems] = React.useState<Awaited<ReturnType<typeof api.listActions>>["items"]>([]);
  const [busy, setBusy] = React.useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { defectId: "", title: "", owner: "", dueDate: "" },
  });

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.listActions();
      setItems(res.items ?? []);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to load actions";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    refresh();
  }, []);

  async function onCreate(values: Values) {
    setBusy(true);
    setError(null);
    try {
      await api.createAction(values);
      form.reset();
      await refresh();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to create action";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  async function onClose(id: string) {
    setBusy(true);
    setError(null);
    try {
      await api.closeAction(id);
      await refresh();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to close action";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <section className="surface p-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="card-title">Corrective Actions</h2>
            <p className="card-subtitle">
              Assign, track, and close actions with due dates and owners.
            </p>
          </div>
          <button className="btn btn-primary" type="button" onClick={() => document.getElementById("newAction")?.scrollIntoView({ behavior: "smooth" })}>
            New action
          </button>
        </div>

        {error ? (
          <div className="mt-4 surface border-red-100 bg-red-50 p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        ) : null}

        <div className="mt-4 overflow-auto">
          <table className="table min-w-[900px]">
            <thead>
              <tr>
                <th>Action</th>
                <th>Defect</th>
                <th>Owner</th>
                <th>Due</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-4 text-sm text-[var(--muted)]">
                    Loading actions…
                  </td>
                </tr>
              ) : items.length ? (
                items.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="font-medium">{a.title}</td>
                    <td>
                      <Link className="text-blue-700 hover:underline font-mono text-xs" href={`/app/defects/${encodeURIComponent(a.defectId)}`}>
                        {a.defectId}
                      </Link>
                    </td>
                    <td>{a.owner ?? "—"}</td>
                    <td>{a.dueDate ?? "—"}</td>
                    <td>
                      <span className="badge badge-inprogress">{a.status}</span>
                    </td>
                    <td className="text-right">
                      <button className="btn" type="button" disabled={busy} onClick={() => onClose(a.id)}>
                        Close
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-sm text-[var(--muted)]">
                    No actions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section id="newAction" className="surface p-4">
        <h3 className="card-title">New action</h3>
        <p className="card-subtitle">Tie actions to a defect for traceability.</p>

        <form className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={form.handleSubmit(onCreate)}>
          <div className="space-y-1">
            <label className="label" htmlFor="defectId">
              Defect ID *
            </label>
            <input id="defectId" className="input font-mono" {...form.register("defectId")} />
            {form.formState.errors.defectId?.message ? (
              <p className="text-xs text-[var(--danger)]">{form.formState.errors.defectId.message}</p>
            ) : null}
          </div>

          <div className="space-y-1">
            <label className="label" htmlFor="owner">
              Owner
            </label>
            <input id="owner" className="input" placeholder="Name or email" {...form.register("owner")} />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="label" htmlFor="title">
              Action title *
            </label>
            <input id="title" className="input" {...form.register("title")} />
            {form.formState.errors.title?.message ? (
              <p className="text-xs text-[var(--danger)]">{form.formState.errors.title.message}</p>
            ) : null}
          </div>

          <div className="space-y-1">
            <label className="label" htmlFor="dueDate">
              Due date
            </label>
            <input id="dueDate" className="input" type="date" {...form.register("dueDate")} />
          </div>

          <div className="md:col-span-2 flex gap-2">
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? "Saving…" : "Create action"}
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
