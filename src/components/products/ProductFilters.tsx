"use client";

import React, { useState, useEffect } from "react";
import { Search, X, ArrowUpDown, Filter, Loader2 } from "lucide-react";
import { CategoryItem, SortField, SortOrder } from "@/types/product";
import { useDebounce } from "@/hooks/useDebounce";

interface ProductFiltersProps {
  initialSearch?: string;
  category?: string;
  sortBy?: SortField;
  order?: SortOrder;
  categories: CategoryItem[];
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sortBy: SortField, order: SortOrder) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export function ProductFilters({
  initialSearch = "",
  category = "",
  sortBy = "",
  order = "asc",
  categories,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onReset,
  isLoading = false,
}: ProductFiltersProps) {
  const [searchInput, setSearchInput] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchInput, 350);

  // Sync internal search input if parent changes it (e.g. on reset or URL change)
  useEffect(() => {
    setSearchInput(initialSearch);
  }, [initialSearch]);

  // Propagate debounced search to parent hook
  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  const handleClearSearch = () => {
    setSearchInput("");
    onSearchChange("");
  };

  const hasActiveFilters = Boolean(searchInput || category || sortBy);

  return (
    <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search input with debounce */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title or description..."
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 py-2 pl-9 pr-8 text-xs text-zinc-900 placeholder-zinc-400 transition focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-300 dark:focus:ring-zinc-300"
          />
          {searchInput && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category dropdown */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
            <Filter className="h-4 w-4" />
          </div>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full appearance-none rounded-lg border border-zinc-200 bg-zinc-50/50 py-2 pl-9 pr-8 text-xs text-zinc-900 transition focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-100"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort by selector */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
            <ArrowUpDown className="h-4 w-4" />
          </div>
          <select
            value={sortBy}
            onChange={(e) =>
              onSortChange(e.target.value as SortField, order || "asc")
            }
            className="w-full appearance-none rounded-lg border border-zinc-200 bg-zinc-50/50 py-2 pl-9 pr-8 text-xs text-zinc-900 transition focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-100"
          >
            <option value="">Default Sorting</option>
            <option value="title">Sort by Title</option>
            <option value="price">Sort by Price</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>

        {/* Sort Order Toggle & Reset */}
        <div className="flex items-center gap-2">
          {sortBy && (
            <button
              type="button"
              onClick={() => onSortChange(sortBy, order === "asc" ? "desc" : "asc")}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white py-2 px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700/60"
              title="Toggle sort direction"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>{order === "asc" ? "Ascending (A-Z, Low-High)" : "Descending (Z-A, High-Low)"}</span>
            </button>
          )}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              title="Reset all filters"
            >
              <X className="h-3.5 w-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Helpful note if both search and category are active */}
      {searchInput && category && (
        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 pt-1 border-t border-zinc-100 dark:border-zinc-800">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">Note:</span>
          Showing results for &ldquo;{searchInput}&rdquo; filtered within &ldquo;{category}&rdquo;.
        </div>
      )}
    </div>
  );
}
