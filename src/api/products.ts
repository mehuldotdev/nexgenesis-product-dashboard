import apiClient from "./client";
import {
  CategoryItem,
  Product,
  ProductFilterParams,
  ProductFormData,
  ProductsResponse,
} from "@/types/product";

/**
 * Fetches products list supporting search, category filter, sorting, pagination, and signal cancellation.
 * 
 * Note on DummyJSON limitation:
 * The DummyJSON API doesn't support simultaneous /products/search?q= and category filters.
 * When both are provided, this service queries the search endpoint and then client-filters 
 * the results by category to provide the most cohesive UX for the user.
 */
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

  // Build query parameters
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
    // When searching, use DummyJSON search endpoint
    endpoint = "/products/search";
    queryParams.q = search.trim();

    // If both search AND category are present:
    // DummyJSON does not accept &category= on search. We fetch matching search results
    // and filter them by category on the client.
    if (category) {
      // To filter accurately across the category on search, fetch a broader set of search matches
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

      // Apply client-side sorting if needed
      if (sortBy) {
        filtered.sort((a, b) => {
          const valA = a[sortBy as keyof Product] ?? "";
          const valB = b[sortBy as keyof Product] ?? "";
          if (valA < valB) return order === "asc" ? -1 : 1;
          if (valA > valB) return order === "asc" ? 1 : -1;
          return 0;
        });
      }

      const paginated = filtered.slice(skip, skip + limit);

      return {
        products: paginated,
        total: filtered.length,
        skip,
        limit,
      };
    }
  } else if (category) {
    // Category filter without search query
    endpoint = `/products/category/${encodeURIComponent(category)}`;
  }

  const response = await apiClient.get<ProductsResponse>(endpoint, {
    params: queryParams,
    signal,
  });

  return response.data;
}

/**
 * Fetches a single product by ID
 */
export async function fetchProductById(
  id: number | string,
  signal?: AbortSignal
): Promise<Product> {
  const response = await apiClient.get<Product>(`/products/${id}`, { signal });
  return response.data;
}

/**
 * Fetches all available product categories
 */
export async function fetchCategories(): Promise<CategoryItem[]> {
  const response = await apiClient.get<Array<string | CategoryItem>>(
    "/products/categories"
  );

  // Normalize categories whether API returns strings or { slug, name } objects
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

/**
 * Creates a new product (mocked by DummyJSON)
 */
export async function createProduct(data: ProductFormData): Promise<Product> {
  const response = await apiClient.post<Product>("/products/add", data);
  return response.data;
}

/**
 * Updates an existing product (mocked by DummyJSON)
 */
export async function updateProduct(
  id: number,
  data: Partial<ProductFormData>
): Promise<Product> {
  const response = await apiClient.put<Product>(`/products/${id}`, data);
  return response.data;
}

/**
 * Deletes a product by ID (mocked by DummyJSON)
 */
export async function deleteProduct(id: number): Promise<Product> {
  const response = await apiClient.delete<Product>(`/products/${id}`);
  return response.data;
}
