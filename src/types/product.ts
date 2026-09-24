export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  stock: number;
  brand?: string;
  sku?: string;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: ProductReview[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  images: string[];
  thumbnail: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CategoryItem {
  slug: string;
  name: string;
  url?: string;
}

export type SortField = "title" | "price" | "rating" | "";
export type SortOrder = "asc" | "desc";

export interface ProductFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: SortField;
  order?: SortOrder;
  delay?: number; // for testing simulated latency (e.g. &delay=2000)
}

export interface ProductFormData {
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  rating?: number;
  brand?: string;
  thumbnail?: string;
}
