import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Page Not Found
      </h1>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/products"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Return to Products
      </Link>
    </div>
  );
}
