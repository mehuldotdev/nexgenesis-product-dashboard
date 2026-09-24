"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Product, ProductFilterParams } from "@/types/product";
import { fetchProducts } from "@/api/products";
import { useProductOverrides } from "@/context/ProductContext";

interface UseProductsResult {
  products: Product[];
  total: number;
  loading: boolean;
  error: string | null;
  retry: () => void;
  refresh: () => void;
}

export function useProducts(params: ProductFilterParams): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const { applyOverrides } = useProductOverrides();

  // Track request IDs to discard out-of-order responses from slow searches
  const activeRequestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { page, limit, search, category, sortBy, order, delay } = params;

  const loadData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const currentRequestId = ++activeRequestIdRef.current;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchProducts(
        { page, limit, search, category, sortBy, order, delay },
        controller.signal
      );

      // Only update state if this is still the most recent request
      if (currentRequestId === activeRequestIdRef.current) {
        const { products: mergedProducts, total: adjustedTotal } =
          applyOverrides(data.products, data.total, category, search);

        setProducts(mergedProducts);
        setTotal(adjustedTotal);
        setLoading(false);
      }
    } catch (err: unknown) {
      const errorObj = err as { name?: string; code?: string; message?: string };
      if (
        errorObj?.name === "CanceledError" ||
        errorObj?.name === "AbortError" ||
        errorObj?.code === "ERR_CANCELED"
      ) {
        return;
      }

      if (currentRequestId === activeRequestIdRef.current) {
        setError(
          errorObj?.message || "Failed to load products. Please check your connection."
        );
        setLoading(false);
      }
    }
  }, [
    page,
    limit,
    search,
    category,
    sortBy,
    order,
    delay,
    applyOverrides,
  ]);

  useEffect(() => {
    loadData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadData, retryCount]);

  const retry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
  }, []);

  return {
    products,
    total,
    loading,
    error,
    retry,
    refresh: retry,
  };
}
