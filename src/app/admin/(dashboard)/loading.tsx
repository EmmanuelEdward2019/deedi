/**
 * Shown the instant a dashboard link is clicked, so navigation to a
 * server-rendered page gives immediate feedback instead of appearing dead.
 */
export default function DashboardLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 border-b border-sand-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <div className="h-8 w-56 animate-pulse rounded bg-sand-200" />
          <div className="h-3.5 w-72 animate-pulse rounded bg-sand-100" />
        </div>
        <div className="h-10 w-36 animate-pulse rounded bg-sand-200" />
      </div>

      {/* Stat row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-sand-200 bg-white p-6">
            <div className="h-2.5 w-20 animate-pulse rounded bg-sand-100" />
            <div className="mt-4 h-9 w-16 animate-pulse rounded bg-sand-200" />
            <div className="mt-2 h-2.5 w-24 animate-pulse rounded bg-sand-100" />
          </div>
        ))}
      </div>

      {/* Body rows */}
      <div className="mt-8 divide-y divide-sand-200 border border-sand-200 bg-white">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <div className="size-14 shrink-0 animate-pulse rounded bg-sand-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-1/3 animate-pulse rounded bg-sand-200" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-sand-100" />
            </div>
            <div className="h-6 w-20 animate-pulse rounded bg-sand-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
