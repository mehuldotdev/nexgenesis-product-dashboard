import apiClient from "./client";
import { LoginCredentials, LoginResponse } from "@/types/auth";

export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/auth/login", {
    username: credentials.username.trim(),
    password: credentials.password,
    expiresInMins: credentials.expiresInMins || 120,
  });

  return response.data;
}

export async function getCurrentUser(): Promise<LoginResponse> {
  const response = await apiClient.get<LoginResponse>("/auth/me");
  return response.data;
}
