import apiClient from "@/shared/services/apiClient"
import type { MapSegment } from "../types/map.types"

/**
 * Trechos coloridos do mapa (BE-20). `municipalityId` é resolvido pelo backend
 * a partir do JWT — não deve ser enviado pelo cliente (spec §5.3).
 *
 * @param date filtro histórico opcional (ISO `YYYY-MM-DD`), preparado para FE-11.
 */
export async function getMapSegments(date?: string): Promise<MapSegment[]> {
  const { data } = await apiClient.get<MapSegment[]>("/dashboard/map-segments", {
    params: date ? { date } : undefined,
  })
  return data
}
