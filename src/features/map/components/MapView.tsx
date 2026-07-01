import { useEffect, useRef, useState } from "react"
import { Map as MapLibreMap } from "maplibre-gl"

import { MapContext } from "./MapContext"
import { resolveMapStyle } from "../mapStyle"
import { segmentsBounds } from "../utils/bounds"
import type { MapSegment } from "../types/map.types"

// Fallback (centro aproximado do Brasil) quando ainda não há trechos para enquadrar.
const DEFAULT_CENTER: [number, number] = [-51.9, -14.2]
const DEFAULT_ZOOM = 3

interface MapViewProps {
  segments: MapSegment[]
  children?: React.ReactNode
}

/**
 * Container do mapa (MapLibre). Inicializa a instância uma única vez, expõe-a
 * via `MapContext` para os layers filhos e reenquadra (`fitBounds`) sempre que
 * o conjunto de trechos muda.
 */
export function MapView({ segments, children }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const [map, setMap] = useState<MapLibreMap | null>(null)

  // Inicialização única.
  useEffect(() => {
    if (!containerRef.current) return

    const instance = new MapLibreMap({
      container: containerRef.current,
      style: resolveMapStyle(),
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    })

    mapRef.current = instance
    setMap(instance)

    return () => {
      instance.remove()
      mapRef.current = null
      setMap(null)
    }
  }, [])

  // Reenquadra ao mudar os trechos.
  useEffect(() => {
    if (!map) return
    const bounds = segmentsBounds(segments)
    if (!bounds) return
    map.fitBounds(bounds, { padding: 48, maxZoom: 15, duration: 400 })
  }, [map, segments])

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Div dedicado ao MapLibre (sem filhos React — evita conflito de DOM). */}
      <div ref={containerRef} className="absolute inset-0" />
      {/* Overlays (layers, legenda, tooltip, drawer) como irmãos do canvas. */}
      <MapContext.Provider value={map}>{children}</MapContext.Provider>
    </div>
  )
}
