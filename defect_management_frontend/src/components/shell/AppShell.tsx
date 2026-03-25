"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useAuth } from "@/components/auth/AuthProvider";

type NavItem = { href: string; label: string; description: string };

const NAV: NavItem[] = [
  {
    href: "/app/dashboard",
    label: "Dashboard",
    description: "Pareto & trends overview",
  },
  {
    href: "/app/defects",
    label: "Defect Log",
    description: "Capture & manage defects",
  },
  {
    href: "/app/rca",
    label: "RCA",
    description: "Root cause analysis",
  },
  {
    href: "/app/actions",
    label: "Actions",
    description: "Corrective actions",
  },
  {
    href: "/app/settings",
    label: "Settings",
    description: "Config lists & profile",
  },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="app-shell">
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/30 z-30 transition-opacity lg:hidden",
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setSidebarOpen(false)}
        aria-hidden
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed z-40 top-0 left-0 h-full w-80 max-w-[85vw] bg-[var(--surface)] border-r border-[var(--border)]",
          "transition-transform lg:translate-x-0 lg:static lg:w-72",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Sidebar navigation"
      >
        <div className="p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500" />
            <div>
              <p className="text-sm font-semibold">Defect Management</p>
              <p className="text-xs text-[var(--muted)]">Quality & production</p>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "block rounded-xl px-3 py-2 border",
                  active
                    ? "bg-blue-50 border-blue-100"
                    : "bg-white border-transparent hover:bg-gray-50 hover:border-[var(--border)]",
                )}
              >
                <p className={cn("text-sm font-medium", active ? "text-blue-700" : "text-[var(--text)]")}>
                  {item.label}
                </p>
                <p className="text-xs text-[var(--muted)]">{item.description}</p>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-[var(--border)]">
          <div className="text-xs text-[var(--muted)] truncate">
            Signed in as <span className="font-medium text-[var(--text)]">{user?.email ?? "Unknown"}</span>
          </div>
          <button
            className="btn w-full mt-3"
            onClick={async () => {
              await signOut();
            }}
            type="button"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="lg:pl-0 lg:flex-1">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-[var(--bg)]/90 backdrop-blur border-b border-[var(--border)]">
          <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center gap-3">
            <button
              className="btn lg:hidden"
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
            >
              Menu
            </button>

            <div className="flex-1">
              <p className="text-sm font-semibold">
                {NAV.find((n) => isActive(pathname, n.href))?.label ?? "App"}
              </p>
              <p className="text-xs text-[var(--muted)]">
                Tablet-friendly workflow for defects → RCA → actions → closure.
              </p>
            </div>

            <div className="hidden sm:block text-xs text-[var(--muted)]">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </header>

        <main className="max-w-[1400px] mx-auto p-4">{children}</main>
      </div>
    </div>
  );
}
