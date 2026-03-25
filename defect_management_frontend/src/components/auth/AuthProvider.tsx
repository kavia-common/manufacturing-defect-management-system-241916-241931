"use client";

import React from "react";
import type {
  AuthChangeEvent,
  Session,
  User,
  SupabaseClient,
} from "@supabase/supabase-js";
import { getSupabaseBrowserClient, hasSupabaseEnv } from "@/lib/supabaseClient";

export type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  /**
   * When false, Supabase is not configured (missing NEXT_PUBLIC_SUPABASE_URL / KEY).
   * The app will run in a local "no-auth" mode.
   */
  supabaseConfigured: boolean;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

/**
 * PUBLIC_INTERFACE
 * useAuth provides access to Supabase session and user for authenticated navigation.
 */
export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider />");
  }
  return ctx;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabaseConfigured = React.useMemo(() => hasSupabaseEnv(), []);
  const [supabase, setSupabase] = React.useState<SupabaseClient | null>(null);

  const [session, setSession] = React.useState<Session | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!supabaseConfigured) {
      // Run in "no-auth" mode without crashing the whole app.
      setSupabase(null);
      setSession(null);
      setUser(null);
      setLoading(false);
      return;
    }

    // Safe because supabaseConfigured implies env vars exist.
    setSupabase(getSupabaseBrowserClient());
    setLoading(true);
  }, [supabaseConfigured]);

  React.useEffect(() => {
    if (!supabase) return;

    let mounted = true;

    // Initial session load
    supabase.auth
      .getSession()
      .then(({ data }: { data: { session: Session | null } }) => {
        if (!mounted) return;
        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, s: Session | null) => {
        setSession(s ?? null);
        setUser(s?.user ?? null);
      },
    );

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = React.useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, [supabase]);

  return (
    <AuthContext.Provider
      value={{ session, user, loading, signOut, supabaseConfigured }}
    >
      {children}
    </AuthContext.Provider>
  );
}
