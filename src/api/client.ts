import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const apiClient = axios.create({
  baseURL: "https://dummyjson.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request interceptor: attach bearer token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor: centralized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (typeof window !== "undefined") {
      // If unauthorized, clear session and redirect to login
      if (error.response?.status === 401) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        if (window.location.pathname !== "/login") {
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = "/login?session_expired=true";
        }
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected network error occurred. Please try again.";

    // Normalize error object for consistent handling
    const customError = new Error(message) as Error & {
      status?: number;
      data?: unknown;
    };
    customError.status = error.response?.status;
    customError.data = error.response?.data;

    return Promise.reject(customError);
  }
);

export default apiClient;
