"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/apiClient";

const schema = z.object({
  defectId: z.string().min(1, "Defect is required"),
  rootCause: z.string().min(10, "Provide a concise root cause"),
  why1: z.string().optional(),
  why2: z.string().optional(),
  why3: z.string().optional(),
  why4: z.string().optional(),
  why5: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export default function RcaPage() {
  const sp = useSearchParams();
  const presetDefectId = sp.get("defectId") ?? "";

  const [queue, setQueue] = React.useState<Awaited<ReturnType<typeof api.listRcaQueue>>["items"]>([]);
  const [loadingQueue, setLoadingQueue] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      defectId: presetDefectId,
      rootCause: "",
      why1: "",
      why2: "",
      why3: "",
      why4: "",
      why5: "",
    },
  });

  async function loadQueue() {
    setLoadingQueue(true);
    setError(null);
    try {
      const res = await api.listRcaQueue();
      setQueue(res.items ?? []);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to load RCA queue";
      setError(message);
    } finally {
      setLoadingQueue(false);
    }
  }

  React.useEffect(() => {
    loadQueue();
  }, []);

  async function onSubmit(values: Values) {
    setBusy(true);
    setError(null);
    try {
      const fiveWhys = [values.why1, values.why2, values.why3, values.why4, values.why5].filter(Boolean) as string[];
      await api.submitRca(values.defectId, { rootCause: values.rootCause, fiveWhys });
      form.reset({ ...values, rootCause: "", why1: "", why2: "", why3: "", why4: "", why5: "" });
      await loadQueue();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to submit RCA";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <section className="surface p-4">
        <h2 className="card-title">RCA</h2>
        <p className="card-subtitle">Complete root cause analysis (5 Whys) before closure.</p>

        {error ? (
          <div className="mt-4 surface border-red-100 bg-red-50 p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        ) : null}

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="surface p-3">
            <p className="text-sm font-medium">RCA queue</p>
            <p className="text-xs text-[var(--muted)]">Defects requiring analysis.</p>
            <div className="mt-2 max-h-72 overflow-auto">
              {loadingQueue ? (
                <p className="text-sm text-[var(--muted)]">Loading…</p>
              ) : queue.length ? (
                <ul className="space-y-2">
                  {queue.map((q) => (
                    <li key={q.defectId} className="flex items-center justify-between gap-3">
                      <button
                        className="btn"
                        type="button"
                        onClick={() => form.setValue("defectId", q.defectId)}
                      >
                        Select
                      </button>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{q.title}</p>
                        <p className="text-xs text-[var(--muted)]">
                          ID: <span className="font-mono">{q.defectId}</span> • {q.status}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--muted)]">Nothing in queue.</p>
              )}
            </div>
          </div>

          <div className="surface p-3">
            <p className="text-sm font-medium">Submit RCA</p>
            <p className="text-xs text-[var(--muted)]">Enter root cause + optional 5 Whys.</p>

            <form className="mt-3 space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
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
                <label className="label" htmlFor="rootCause">
                  Root cause *
                </label>
                <textarea id="rootCause" className="input min-h-24" {...form.register("rootCause")} />
                {form.formState.errors.rootCause?.message ? (
                  <p className="text-xs text-[var(--danger)]">{form.formState.errors.rootCause.message}</p>
                ) : null}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input className="input" placeholder="Why #1 (optional)" {...form.register("why1")} />
                <input className="input" placeholder="Why #2 (optional)" {...form.register("why2")} />
                <input className="input" placeholder="Why #3 (optional)" {...form.register("why3")} />
                <input className="input" placeholder="Why #4 (optional)" {...form.register("why4")} />
                <input className="input sm:col-span-2" placeholder="Why #5 (optional)" {...form.register("why5")} />
              </div>

              <div className="flex gap-2">
                <button className="btn btn-primary" type="submit" disabled={busy}>
                  {busy ? "Submitting…" : "Submit RCA"}
                </button>
                <button className="btn" type="button" onClick={() => form.reset()}>
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
