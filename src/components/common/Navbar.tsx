"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Package, User as UserIcon } from "lucide-react";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="flex items-center gap-2.5 font-semibold text-zinc-900 transition-colors hover:text-zinc-700 dark:text-zinc-100"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900">
            <Package className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">NexGenesis <span className="text-zinc-500 font-normal text-sm">Admin</span></span>
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.username}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-zinc-400">
                    <UserIcon className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold leading-none text-zinc-900 dark:text-zinc-100">
                  {user.firstName ? `${user.firstName} ${user.lastName}` : user.username}
                </p>
                <p className="text-[11px] leading-tight text-zinc-500 dark:text-zinc-400">
                  @{user.username}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700/60 dark:hover:text-white"
            title="Log out of session"
          >
            <LogOut className="h-3.5 w-3.5 text-zinc-500" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
