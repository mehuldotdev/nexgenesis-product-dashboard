"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { Star, Edit2, Trash2, Eye, Package } from "lucide-react";

interface ProductCardGridProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductCardGrid({
  products,
  onEdit,
  onDelete,
}: ProductCardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {products.map((product) => {
        const hasLowStock = product.stock <= 5;
        const isOutOfStock = product.stock === 0;

        return (
          <div
            key={product.id}
            className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div>
              {/* Product Thumbnail & Category */}
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/60">
                {product.thumbnail ? (
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-zinc-400">
                    <Package className="h-10 w-10" />
                  </div>
                )}
                <span className="absolute top-2 left-2 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-zinc-800 shadow-xs backdrop-blur-xs capitalize dark:bg-zinc-900/90 dark:text-zinc-200">
                  {product.category}
                </span>
              </div>

              {/* Title & Brand */}
              <div className="mt-3">
                <Link
                  href={`/products/${product.id}`}
                  className="font-medium text-zinc-900 hover:underline dark:text-zinc-100 text-sm line-clamp-1"
                >
                  {product.title}
                </Link>
                {product.brand && (
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    {product.brand}
                  </p>
                )}
              </div>

              {/* Price & Rating */}
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  ${product.price.toFixed(2)}
                </span>
                <div className="flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 dark:bg-amber-950/40">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    {product.rating?.toFixed(1) ?? "N/A"}
                  </span>
                </div>
              </div>

              {/* Stock status badge */}
              <div className="mt-2">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    isOutOfStock
                      ? "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400"
                      : hasLowStock
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                  }`}
                >
                  {isOutOfStock ? "Out of stock" : `${product.stock} in stock`}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-4 flex items-center justify-end gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
              <Link
                href={`/products/${product.id}`}
                className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <Eye className="h-3.5 w-3.5" />
                Details
              </Link>
              <button
                type="button"
                onClick={() => onEdit(product)}
                className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(product)}
                className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
