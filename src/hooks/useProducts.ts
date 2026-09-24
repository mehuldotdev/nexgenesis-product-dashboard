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

  // Track active request ID to discard out-of-order race condition responses
  const activeRequestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadData = useCallback(async () => {
    // 1. Cancel previous in-flight request if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Increment request ID sequence
    const currentRequestId = ++activeRequestIdRef.current;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchProducts(params, controller.signal);

      // Verify this is still the latest request (guarantees race condition safety)
      if (currentRequestId === activeRequestIdRef.current) {
        const { products: mergedProducts, total: adjustedTotal } =
          applyOverrides(
            data.products,
            data.total,
            params.category,
            params.search
          );

        setProducts(mergedProducts);
        setTotal(adjustedTotal);
        setLoading(false);
      }
    } catch (err: unknown) {
      // Ignore cancellations (from AbortController when user types fast)
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
    params.page,
    params.limit,
    params.search,
    params.category,
    params.sortBy,
    params.order,
    params.delay,
    retryCount,
    applyOverrides,
  ]);

  useEffect(() => {
    loadData();

    return () => {
      // Abort request on unmount or query change
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadData]);

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
