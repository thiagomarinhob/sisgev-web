import { LngLatBounds } from "maplibre-gl"

import type { MapSegment } from "../types/map.types"

/**
 * Calcula o bounding box que envolve todos os trechos, para `fitBounds`.
 * Retorna `null` quando não há coordenadas (ex.: lista vazia).
 */
export function segmentsBounds(segments: MapSegment[]): LngLatBounds | null {
  let bounds: LngLatBounds | null = null

  for (const segment of segments) {
    for (const [lng, lat] of segment.geometry.coordinates) {
      if (bounds) {
        bounds.extend([lng, lat])
      } else {
        bounds = new LngLatBounds([lng, lat], [lng, lat])
      }
    }
  }

  return bounds
}
