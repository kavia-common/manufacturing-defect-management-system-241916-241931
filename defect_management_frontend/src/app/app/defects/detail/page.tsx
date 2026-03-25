import Link from "next/link";

export default function DefectDetailInfoPage() {
  return (
    <div className="surface p-4">
      <h2 className="card-title">Defect detail</h2>
      <p className="card-subtitle">
        Defect detail pages are dynamic (they depend on the defect ID). This build is
        configured as a static export, so ID-based pages are not generated at build time.
      </p>

      <div className="mt-4 flex gap-2">
        <Link className="btn btn-primary" href="/app/defects">
          Back to Defect Log
        </Link>
        <Link className="btn" href="/app/dashboard">
          Dashboard
        </Link>
      </div>

      <p className="mt-4 text-sm text-[var(--muted)]">
        To enable live defect detail pages, deploy Next.js with server rendering (remove{" "}
        <span className="font-mono">output: &quot;export&quot;</span> in{" "}
        <span className="font-mono">next.config.ts</span>).
      </p>
    </div>
  );
}
