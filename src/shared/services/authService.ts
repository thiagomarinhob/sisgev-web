import type { AuthUser } from "@/shared/types/auth.types"

import apiClient from "./apiClient"

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", { email, password })
  return data
}

export async function logoutApi(): Promise<void> {
  await apiClient.post("/auth/logout")
}

export async function getMeApi(): Promise<AuthUser> {
  const { data } = await apiClient.get<AuthUser>("/auth/me")
  return data
}
