"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Product, CategoryItem, SortField, SortOrder, ProductFormData } from "@/types/product";
import { fetchCategories, createProduct, updateProduct, deleteProduct } from "@/api/products";
import { useProducts } from "@/hooks/useProducts";
import { useProductOverrides } from "@/context/ProductContext";
import { ProductTable } from "@/components/products/ProductTable";
import { ProductCardGrid } from "@/components/products/ProductCardGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Pagination } from "@/components/products/Pagination";
import { ProductFormModal } from "@/components/products/ProductFormModal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { TableSkeleton, CardSkeleton } from "@/components/common/Skeleton";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { Plus, PackageOpen } from "lucide-react";

function ProductDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Sanitize query params from URL (resilient to ?page=abc, ?page=9999, etc.)
  const rawPage = parseInt(searchParams.get("page") || "1", 10);
  const safePage = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const rawLimit = parseInt(searchParams.get("limit") || "10", 10);
  const safeLimit = [10, 20, 50].includes(rawLimit) ? rawLimit : 10;

  const searchQuery = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("category") || "";
  const sortBy = (searchParams.get("sortBy") as SortField) || "";
  const order = (searchParams.get("order") as SortOrder) || "asc";
  const delayParam = parseInt(searchParams.get("delay") || "0", 10);

  // 2. Fetch categories list for dropdown filter
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  // 3. Custom product fetch hook with AbortController, race condition prevention & overrides
  const { products, total, loading, error, retry } = useProducts({
    page: safePage,
    limit: safeLimit,
    search: searchQuery,
    category: categoryFilter,
    sortBy,
    order,
    delay: delayParam > 0 ? delayParam : undefined,
  });

  const {
    addLocalProduct,
    updateLocalProduct,
    deleteLocalProduct,
  } = useProductOverrides();

  // 4. Modal States: Add / Edit / Delete
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 5. Update URL params helper
  const updateUrl = useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === undefined) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Filter & Search Handlers
  const handleSearchChange = useCallback(
    (query: string) => {
      if (query !== searchQuery) {
        // Reset to page 1 whenever search changes
        updateUrl({ q: query || null, page: 1 });
      }
    },
    [searchQuery, updateUrl]
  );

  const handleCategoryChange = useCallback(
    (cat: string) => {
      updateUrl({ category: cat || null, page: 1 });
    },
    [updateUrl]
  );

  const handleSortChange = useCallback(
    (newSortBy: SortField, newOrder: SortOrder) => {
      updateUrl({
        sortBy: newSortBy || null,
        order: newSortBy ? newOrder : null,
      });
    },
    [updateUrl]
  );

  const handleResetFilters = useCallback(() => {
    updateUrl({ q: null, category: null, sortBy: null, order: null, page: 1 });
  }, [updateUrl]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      updateUrl({ page: newPage });
    },
    [updateUrl]
  );

  const handlePageSizeChange = useCallback(
    (newLimit: number) => {
      updateUrl({ limit: newLimit, page: 1 });
    },
    [updateUrl]
  );

  // CRUD Actions
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (formData: ProductFormData) => {
    if (editingProduct) {
      // 1. Send update to DummyJSON API
      const updated = await updateProduct(editingProduct.id, formData);
      // 2. Persist in local session overrides
      updateLocalProduct(editingProduct.id, {
        ...formData,
        ...updated,
      });
    } else {
      // 1. Send create to DummyJSON API
      const created = await createProduct(formData);
      // 2. Prepend to local session overrides
      addLocalProduct({
        ...created,
        id: created.id || Date.now(),
        images: [created.thumbnail || ""],
        rating: 5.0,
      });
    }
  };

  const handleOpenDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);

    try {
      // 1. Call DummyJSON delete endpoint
      await deleteProduct(productToDelete.id);
      // 2. Apply deletion override
      deleteLocalProduct(productToDelete.id);
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (e) {
      console.error("Failed to delete product:", e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
            Product Inventory
          </h1>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            Manage your catalog, stock quantities, pricing, and category filters
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          type="button"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <ProductFilters
        initialSearch={searchQuery}
        category={categoryFilter}
        sortBy={sortBy}
        order={order}
        categories={categories}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        onReset={handleResetFilters}
        isLoading={loading}
      />

      {/* Main Content Area */}
      {error ? (
        <ErrorAlert message={error} onRetry={retry} />
      ) : loading ? (
        <div>
          <div className="hidden md:block">
            <TableSkeleton rows={safeLimit} />
          </div>
          <div className="block md:hidden">
            <CardSkeleton cards={Math.min(safeLimit, 6)} />
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-800">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
            <PackageOpen className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            No products found
          </h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            {searchQuery || categoryFilter
              ? "We couldn't find any products matching your active filters. Try adjusting your search query or category."
              : "Your inventory is currently empty."}
          </p>
          {(searchQuery || categoryFilter) && (
            <div className="mt-4">
              <button
                type="button"
                onClick={handleResetFilters}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <ProductTable
              products={products}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteDialog}
            />
          </div>

          {/* Mobile Card Grid */}
          <div className="block md:hidden">
            <ProductCardGrid
              products={products}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteDialog}
            />
          </div>

          {/* Pagination Controls */}
          <Pagination
            currentPage={safePage}
            totalItems={total}
            pageSize={safeLimit}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            disabled={loading}
          />
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingProduct}
        categories={categories}
      />

      {/* Delete Confirmation Popup */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
}

export default function ProductDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4">
          <TableSkeleton rows={8} />
        </div>
      }
    >
      <ProductDashboardContent />
    </Suspense>
  );
}
