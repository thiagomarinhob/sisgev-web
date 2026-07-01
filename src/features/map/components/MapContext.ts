import { createContext, useContext } from "react"
import type { Map as MapLibreMap } from "maplibre-gl"

/**
 * Instância do MapLibre exposta pelo `MapView` para os layers filhos
 * (RoadSegmentLayer, e futuros: markers de evidência no FE-12).
 * `null` até o mapa terminar de inicializar.
 */
export const MapContext = createContext<MapLibreMap | null>(null)

export function useMap(): MapLibreMap | null {
  return useContext(MapContext)
}
