"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Lock, User, AlertCircle, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple requests on rapid clicks
    if (isLoading) return;

    if (!username.trim() || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await login({ username, password });
    } catch (err: unknown) {
      const errorMsg =
        (err as { message?: string })?.message ||
        "Invalid username or password. Please try again.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setUsername("emilys");
    setPassword("emilyspass");
    setError(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 font-sans dark:bg-black">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-md dark:bg-zinc-100 dark:text-zinc-900">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Admin Sign In
          </h1>
          <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            Enter your credentials to access the product dashboard
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-3.5 text-xs dark:border-zinc-800 dark:bg-zinc-800/40">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              Demo Credentials:
            </span>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-xs font-medium text-zinc-900 underline hover:text-zinc-600 dark:text-zinc-200 dark:hover:text-white"
            >
              Fill Credentials
            </button>
          </div>
          <div className="mt-1 flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
            <span>User: <code className="rounded bg-zinc-200/70 px-1 py-0.5 text-[11px] font-mono text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200">emilys</code></span>
            <span>Pass: <code className="rounded bg-zinc-200/70 px-1 py-0.5 text-[11px] font-mono text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200">emilyspass</code></span>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              Username
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                <User className="h-4 w-4" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="emilys"
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 py-2.5 pl-9 pr-3 text-xs text-zinc-900 transition focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              Password
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 py-2.5 pl-9 pr-3 text-xs text-zinc-900 transition focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 py-2.5 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            <span>{isLoading ? "Signing in..." : "Sign In"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
