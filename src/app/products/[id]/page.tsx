"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { fetchProductById } from "@/api/products";
import { useProductOverrides } from "@/context/ProductContext";
import { ProductDetailsSkeleton } from "@/components/common/Skeleton";
import {
  ArrowLeft,
  Star,
  Package,
  ShieldCheck,
  Truck,
  RotateCcw,
  AlertCircle,
  User,
} from "lucide-react";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { getOverriddenProduct, deletedProductIds } = useProductOverrides();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    const numId = parseInt(id, 10);

    // If ID was deleted locally in this session
    if (!isNaN(numId) && deletedProductIds.includes(numId)) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    // Check if it's a locally created product
    const localProduct = getOverriddenProduct(numId);
    if (localProduct && !localProduct.description?.includes("from-server")) {
      setProduct(localProduct);
      setSelectedImage(localProduct.images?.[0] || localProduct.thumbnail || "");
      setLoading(false);
      return;
    }

    setLoading(true);
    setNotFound(false);

    fetchProductById(id)
      .then((data) => {
        // Apply any local edits from session
        const merged = getOverriddenProduct(data.id, data) || data;
        setProduct(merged);
        setSelectedImage(merged.images?.[0] || merged.thumbnail || "");
      })
      .catch((err) => {
        console.error("Error fetching product details:", err);
        setNotFound(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, getOverriddenProduct, deletedProductIds]);

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (notFound || !product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Product Not Found
        </h1>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
          The product ID &ldquo;{id}&rdquo; does not exist or has been removed from inventory.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-medium text-white shadow-xs hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Product List
        </Link>
      </div>
    );
  }

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : product.thumbnail
      ? [product.thumbnail]
      : [];

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-4">
      {/* Back button */}
      <div>
        <button
          onClick={() => router.back()}
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Images Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-400">
                <Package className="h-16 w-16" />
              </div>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 p-1 bg-white dark:bg-zinc-800 ${
                    selectedImage === img
                      ? "border-zinc-900 dark:border-zinc-100"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} ${idx + 1}`}
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Specs */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {product.category}
              </span>
              {product.brand && (
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  by <strong>{product.brand}</strong>
                </span>
              )}
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
              {product.title}
            </h1>

            {/* Price & Rating */}
            <div className="mt-4 flex items-center gap-4">
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                ${product.price.toFixed(2)}
              </span>
              {product.discountPercentage && (
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700 dark:bg-red-950/60 dark:text-red-400">
                  {product.discountPercentage}% OFF
                </span>
              )}
              <div className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 dark:bg-amber-950/40">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                  {product.rating?.toFixed(1) ?? "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Overview
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              {product.description}
            </p>
          </div>

          {/* Stock & Meta Highlights */}
          <div className="grid grid-cols-2 gap-3 border-y border-zinc-200 py-4 dark:border-zinc-800 text-xs">
            <div>
              <span className="text-zinc-500">Stock Availability:</span>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
                {product.stock > 0 ? `${product.stock} units available` : "Out of stock"}
              </p>
            </div>
            {product.sku && (
              <div>
                <span className="text-zinc-500">SKU:</span>
                <p className="font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {product.sku}
                </p>
              </div>
            )}
          </div>

          {/* Value Badges */}
          <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
            {product.warrantyInformation && (
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>{product.warrantyInformation}</span>
              </div>
            )}
            {product.shippingInformation && (
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-blue-600" />
                <span>{product.shippingInformation}</span>
              </div>
            )}
            {product.returnPolicy && (
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-amber-600" />
                <span>{product.returnPolicy}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="border-t border-zinc-200 pt-8 dark:border-zinc-800">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Customer Reviews ({product.reviews?.length || 0})
        </h2>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {product.reviews.map((rev, i) => (
              <div
                key={i}
                className="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        {rev.reviewerName}
                      </p>
                      <p className="text-[10px] text-zinc-400">
                        {new Date(rev.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        className={`h-3 w-3 ${
                          starIndex < rev.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-zinc-200 dark:text-zinc-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-300 italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs text-zinc-500">
            No customer reviews available for this product yet.
          </p>
        )}
      </div>
    </div>
  );
}
