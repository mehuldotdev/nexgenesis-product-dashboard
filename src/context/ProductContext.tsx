"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/types/product";

interface ProductContextType {
  addedProducts: Product[];
  updatedProducts: Record<number, Partial<Product>>;
  deletedProductIds: number[];
  addLocalProduct: (product: Product) => void;
  updateLocalProduct: (id: number, updates: Partial<Product>) => void;
  deleteLocalProduct: (id: number) => void;
  getOverriddenProduct: (id: number, baseProduct?: Product) => Product | null;
  applyOverrides: (
    apiProducts: Product[],
    apiTotal: number,
    category?: string,
    search?: string
  ) => { products: Product[]; total: number };
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const STORAGE_KEY_ADDED = "dashboard_added_products";
const STORAGE_KEY_UPDATED = "dashboard_updated_products";
const STORAGE_KEY_DELETED = "dashboard_deleted_product_ids";

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [addedProducts, setAddedProducts] = useState<Product[]>([]);
  const [updatedProducts, setUpdatedProducts] = useState<Record<number, Partial<Product>>>({});
  const [deletedProductIds, setDeletedProductIds] = useState<number[]>([]);

  // Restore session overrides on initial mount
  useEffect(() => {
    try {
      const storedAdded = sessionStorage.getItem(STORAGE_KEY_ADDED);
      const storedUpdated = sessionStorage.getItem(STORAGE_KEY_UPDATED);
      const storedDeleted = sessionStorage.getItem(STORAGE_KEY_DELETED);

      if (storedAdded) setAddedProducts(JSON.parse(storedAdded));
      if (storedUpdated) setUpdatedProducts(JSON.parse(storedUpdated));
      if (storedDeleted) setDeletedProductIds(JSON.parse(storedDeleted));
    } catch (e) {
      console.error("Failed to restore local product state overrides:", e);
    }
  }, []);

  const addLocalProduct = (product: Product) => {
    setAddedProducts((prev) => {
      const next = [product, ...prev];
      try {
        sessionStorage.setItem(STORAGE_KEY_ADDED, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const updateLocalProduct = (id: number, updates: Partial<Product>) => {
    setUpdatedProducts((prev) => {
      const next = {
        ...prev,
        [id]: { ...(prev[id] || {}), ...updates },
      };
      try {
        sessionStorage.setItem(STORAGE_KEY_UPDATED, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });

    // Also update in addedProducts if it was a locally added item
    setAddedProducts((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      try {
        sessionStorage.setItem(STORAGE_KEY_ADDED, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const deleteLocalProduct = (id: number) => {
    setDeletedProductIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        sessionStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });

    // Also remove from addedProducts if locally added
    setAddedProducts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        sessionStorage.setItem(STORAGE_KEY_ADDED, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const getOverriddenProduct = (
    id: number,
    baseProduct?: Product
  ): Product | null => {
    if (deletedProductIds.includes(id)) return null;

    // Check if it's a locally created item
    const localItem = addedProducts.find((p) => p.id === id);
    if (localItem) {
      return { ...localItem, ...(updatedProducts[id] || {}) };
    }

    if (!baseProduct) return null;

    // Apply any local edits to the base fetched item
    return { ...baseProduct, ...(updatedProducts[id] || {}) };
  };

  const applyOverrides = (
    apiProducts: Product[],
    apiTotal: number,
    category?: string,
    search?: string
  ): { products: Product[]; total: number } => {
    let result = apiProducts.filter((p) => !deletedProductIds.includes(p.id));

    result = result.map((p) => {
      if (updatedProducts[p.id]) {
        return { ...p, ...updatedProducts[p.id] };
      }
      return p;
    });

    const matchingAdded = addedProducts.filter((item) => {
      if (deletedProductIds.includes(item.id)) return false;
      if (category && item.category.toLowerCase() !== category.toLowerCase()) {
        return false;
      }
      if (
        search &&
        !item.title.toLowerCase().includes(search.toLowerCase()) &&
        !item.description.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

    const existingIds = new Set(result.map((p) => p.id));
    const toPrepend = matchingAdded.filter((p) => !existingIds.has(p.id));

    result = [...toPrepend, ...result];

    const adjustedTotal = Math.max(
      0,
      apiTotal - deletedProductIds.length + matchingAdded.length
    );

    return {
      products: result,
      total: adjustedTotal,
    };
  };

  return (
    <ProductContext.Provider
      value={{
        addedProducts,
        updatedProducts,
        deletedProductIds,
        addLocalProduct,
        updateLocalProduct,
        deleteLocalProduct,
        getOverriddenProduct,
        applyOverrides,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProductOverrides() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error(
      "useProductOverrides must be used within a ProductProvider"
    );
  }
  return context;
}
