import React from "react";

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full animate-pulse divide-y divide-zinc-200 dark:divide-zinc-800">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3.5 px-4">
          <div className="h-12 w-12 shrink-0 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3 w-1/4 rounded bg-zinc-100 dark:bg-zinc-850" />
          </div>
          <div className="hidden sm:block h-6 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="hidden md:block h-4 w-12 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-8 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {Array.from({ length: cards }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="h-40 w-full rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-3 space-y-2">
            <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3 w-1/2 rounded bg-zinc-100 dark:bg-zinc-850" />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="h-5 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-5 w-14 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="animate-pulse space-y-8 max-w-5xl mx-auto py-8 px-4">
      <div className="h-6 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="h-80 w-full rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-6 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-20 w-full rounded bg-zinc-100 dark:bg-zinc-850" />
        </div>
      </div>
    </div>
  );
}
