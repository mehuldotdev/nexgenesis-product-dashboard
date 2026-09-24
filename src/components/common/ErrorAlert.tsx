import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
  title?: string;
}

export function ErrorAlert({
  message,
  onRetry,
  title = "Something went wrong",
}: ErrorAlertProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50/70 p-6 text-center dark:border-red-900/50 dark:bg-red-950/20">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="mt-3 text-base font-semibold text-red-900 dark:text-red-200">
        {title}
      </h3>
      <p className="mt-1 text-sm text-red-700 dark:text-red-300 max-w-md mx-auto">
        {message}
      </p>
      {onRetry && (
        <div className="mt-4">
          <button
            onClick={onRetry}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 dark:bg-red-600 dark:hover:bg-red-700"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
