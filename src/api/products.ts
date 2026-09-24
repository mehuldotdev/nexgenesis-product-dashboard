import apiClient from "./client";
import {
  CategoryItem,
  Product,
  ProductFilterParams,
  ProductFormData,
  ProductsResponse,
} from "@/types/product";

export async function fetchProducts(
  params: ProductFilterParams = {},
  signal?: AbortSignal
): Promise<ProductsResponse> {
  const {
    page = 1,
    limit = 10,
    search = "",
    category = "",
    sortBy = "",
    order = "asc",
    delay,
  } = params;

  const skip = (page - 1) * limit;

  const queryParams: Record<string, string | number> = {
    limit,
    skip,
  };

  if (sortBy) {
    queryParams.sortBy = sortBy;
    queryParams.order = order;
  }

  if (delay && delay > 0) {
    queryParams.delay = delay;
  }

  let endpoint = "/products";

  if (search.trim()) {
    endpoint = "/products/search";
    queryParams.q = search.trim();

    // DummyJSON doesn't support search + category query together, so filter on client
    if (category) {
      const response = await apiClient.get<ProductsResponse>(endpoint, {
        params: {
          q: search.trim(),
          limit: 100,
          skip: 0,
          ...(delay && delay > 0 ? { delay } : {}),
        },
        signal,
      });

      const filtered = response.data.products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );

      if (sortBy) {
        filtered.sort((a, b) => {
          const valA = a[sortBy as keyof Product] ?? "";
          const valB = b[sortBy as keyof Product] ?? "";
          if (valA < valB) return order === "asc" ? -1 : 1;
          if (valA > valB) return order === "asc" ? 1 : -1;
          return 0;
        });
      }

      return {
        products: filtered.slice(skip, skip + limit),
        total: filtered.length,
        skip,
        limit,
      };
    }
  } else if (category) {
    endpoint = `/products/category/${encodeURIComponent(category)}`;
  }

  const response = await apiClient.get<ProductsResponse>(endpoint, {
    params: queryParams,
    signal,
  });

  return response.data;
}

export async function fetchProductById(
  id: number | string,
  signal?: AbortSignal
): Promise<Product> {
  const response = await apiClient.get<Product>(`/products/${id}`, { signal });
  return response.data;
}

export async function fetchCategories(): Promise<CategoryItem[]> {
  const response = await apiClient.get<Array<string | CategoryItem>>(
    "/products/categories"
  );

  return response.data.map((cat) => {
    if (typeof cat === "string") {
      return {
        slug: cat,
        name: cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, " "),
      };
    }
    return cat;
  });
}

export async function createProduct(data: ProductFormData): Promise<Product> {
  const response = await apiClient.post<Product>("/products/add", data);
  return response.data;
}

export async function updateProduct(
  id: number,
  data: Partial<ProductFormData>
): Promise<Product> {
  const response = await apiClient.put<Product>(`/products/${id}`, data);
  return response.data;
}

export async function deleteProduct(id: number): Promise<Product> {
  const response = await apiClient.delete<Product>(`/products/${id}`);
  return response.data;
}
