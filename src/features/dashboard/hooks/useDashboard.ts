import { useEffect, useState } from "react"

import type { DashboardSummary } from "@/shared/types/dashboard.types"
import { getDashboardSummary } from "../services/dashboardService"

interface UseDashboardResult {
  data: DashboardSummary | null
  isLoading: boolean
  error: string | null
}

export function useDashboard(): UseDashboardResult {
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getDashboardSummary()
      .then(setData)
      .catch(() => setError("Não foi possível carregar os dados do dashboard."))
      .finally(() => setIsLoading(false))
  }, [])

  return { data, isLoading, error }
}
