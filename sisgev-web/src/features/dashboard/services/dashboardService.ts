import apiClient from "@/shared/services/apiClient"
import type { DashboardSummary } from "@/shared/types/dashboard.types"

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await apiClient.get<DashboardSummary>("/dashboard/summary")
  return data
}
