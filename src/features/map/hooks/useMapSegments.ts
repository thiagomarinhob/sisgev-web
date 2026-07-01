import { useEffect, useState } from "react"

import { getMapSegments } from "../services/mapService"
import type { MapSegment } from "../types/map.types"

interface UseMapSegmentsResult {
  data: MapSegment[]
  isLoading: boolean
  error: string | null
}

/** Carrega os trechos do mapa. `date` recarrega ao mudar (FE-11). */
export function useMapSegments(date?: string): UseMapSegmentsResult {
  const [data, setData] = useState<MapSegment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const segments = await getMapSegments(date)
        if (active) setData(segments)
      } catch {
        if (active) setError("Não foi possível carregar os trechos do mapa.")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [date])

  return { data, isLoading, error }
}
