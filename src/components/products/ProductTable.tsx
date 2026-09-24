"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { Star, Edit2, Trash2, Eye, Package } from "lucide-react";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
      <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-300">
        <thead className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
          <tr>
            <th scope="col" className="py-3 pl-4 pr-3">Product</th>
            <th scope="col" className="px-3 py-3">Category</th>
            <th scope="col" className="px-3 py-3">Price</th>
            <th scope="col" className="px-3 py-3">Rating</th>
            <th scope="col" className="px-3 py-3">Stock</th>
            <th scope="col" className="py-3 pl-3 pr-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200/70 dark:divide-zinc-800/70">
          {products.map((product) => {
            const hasLowStock = product.stock <= 5;
            const isOutOfStock = product.stock === 0;

            return (
              <tr
                key={product.id}
                className="transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40"
              >
                {/* Image and Title */}
                <td className="py-3 pl-4 pr-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800">
                      {product.thumbnail ? (
                        <Image
                          src={product.thumbnail}
                          alt={product.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-zinc-400">
                          <Package className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="max-w-xs truncate">
                      <Link
                        href={`/products/${product.id}`}
                        className="font-medium text-zinc-900 hover:underline dark:text-zinc-100"
                        title={product.title}
                      >
                        {product.title}
                      </Link>
                      {product.brand && (
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate">
                          {product.brand}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="whitespace-nowrap px-3 py-3">
                  <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700 capitalize dark:bg-zinc-800 dark:text-zinc-300">
                    {product.category}
                  </span>
                </td>

                {/* Price */}
                <td className="whitespace-nowrap px-3 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                  ${product.price.toFixed(2)}
                </td>

                {/* Rating */}
                <td className="whitespace-nowrap px-3 py-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      {product.rating?.toFixed(1) ?? "N/A"}
                    </span>
                  </div>
                </td>

                {/* Stock status */}
                <td className="whitespace-nowrap px-3 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      isOutOfStock
                        ? "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400"
                        : hasLowStock
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                    }`}
                  >
                    {isOutOfStock
                      ? "Out of stock"
                      : `${product.stock} units`}
                  </span>
                </td>

                {/* Action buttons */}
                <td className="whitespace-nowrap py-3 pl-3 pr-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/products/${product.id}`}
                      className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                      title="Edit Product"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(product)}
                      className="rounded-md p-1.5 text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-950/40"
                      title="Delete Product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
