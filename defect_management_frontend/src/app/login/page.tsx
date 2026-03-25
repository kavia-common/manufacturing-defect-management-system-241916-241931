"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { useAuth } from "@/components/auth/AuthProvider";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { user, supabaseConfigured } = useAuth();

  const [serverError, setServerError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  React.useEffect(() => {
    if (user) router.replace("/app/dashboard");
  }, [user, router]);

  async function onSubmit(values: FormValues) {
    setServerError(null);

    if (!supabaseConfigured) {
      setServerError(
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable sign-in.",
      );
      return;
    }

    setBusy(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword(values);
      if (error) {
        setServerError(error.message);
        return;
      }
      router.replace("/app/dashboard");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <section className="surface w-full max-w-md p-6">
        <header className="mb-4">
          <h1 className="text-xl font-semibold">Defect Management</h1>
          <p className="text-sm text-[var(--muted)]">
            Sign in to log defects, complete RCA, and manage corrective actions.
          </p>
        </header>

        {!supabaseConfigured ? (
          <div className="surface border-amber-100 bg-amber-50 p-3">
            <p className="text-sm text-amber-800 font-medium">
              Supabase auth is not configured
            </p>
            <p className="text-xs text-amber-800 mt-1">
              To enable login, set{" "}
              <span className="font-mono">NEXT_PUBLIC_SUPABASE_URL</span> and{" "}
              <span className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>. The app can still be
              viewed locally, but protected routes will redirect here.
            </p>
          </div>
        ) : null}

        <form className="space-y-4 mt-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="input"
              inputMode="email"
              autoComplete="email"
              disabled={!supabaseConfigured}
              {...form.register("email")}
            />
            {form.formState.errors.email?.message ? (
              <p className="text-xs text-[var(--danger)]">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1">
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="input"
              type="password"
              autoComplete="current-password"
              disabled={!supabaseConfigured}
              {...form.register("password")}
            />
            {form.formState.errors.password?.message ? (
              <p className="text-xs text-[var(--danger)]">
                {form.formState.errors.password.message}
              </p>
            ) : null}
          </div>

          {serverError ? (
            <div className="surface border-red-100 bg-red-50 p-3">
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          ) : null}

          <button
            className="btn btn-primary w-full"
            type="submit"
            disabled={busy || !supabaseConfigured}
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-xs text-[var(--muted)]">
          Need an account? Ask your quality admin to provision a Supabase user.
        </p>
      </section>
    </main>
  );
}
