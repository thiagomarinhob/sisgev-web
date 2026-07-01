import { useMemo, useState } from "react"

import { ConditionLegend } from "../components/ConditionLegend"
import { MapView } from "../components/MapView"
import { RoadSegmentLayer } from "../components/RoadSegmentLayer"
import type { SegmentFeatureProps } from "../components/RoadSegmentLayer"
import { SegmentDetailsDrawer } from "../components/SegmentDetailsDrawer"
import { SegmentTooltip } from "../components/SegmentTooltip"
import { useMapSegments } from "../hooks/useMapSegments"

interface HoverState {
  segment: SegmentFeatureProps
  x: number
  y: number
}

export function MapPage() {
  const { data, isLoading, error } = useMapSegments()
  const [hover, setHover] = useState<HoverState | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = useMemo<SegmentFeatureProps | null>(() => {
    const s = data.find((seg) => seg.id === selectedId)
    if (!s) return null
    return {
      id: s.id,
      name: s.name,
      roadName: s.roadName,
      condition: s.condition,
      lengthMeters: s.lengthMeters,
    }
  }, [data, selectedId])

  return (
    <div className="flex h-full flex-col gap-4">
      <h1 className="shrink-0 text-xl font-semibold">Mapa</h1>

      <div className="relative flex-1 overflow-hidden rounded-lg border bg-muted">
        {isLoading && (
          <div className="absolute inset-0 z-10 animate-pulse bg-muted" />
        )}

        {error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-destructive/5">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <MapView segments={data}>
              <RoadSegmentLayer
                segments={data}
                onHover={(segment, point) =>
                  setHover(
                    segment ? { segment, x: point.x, y: point.y } : null,
                  )
                }
                onSelect={setSelectedId}
              />
              <ConditionLegend />
              {hover && (
                <SegmentTooltip
                  segment={hover.segment}
                  x={hover.x}
                  y={hover.y}
                />
              )}
              {selected && (
                <SegmentDetailsDrawer
                  segment={selected}
                  onClose={() => setSelectedId(null)}
                />
              )}
            </MapView>

            {data.length === 0 && (
              <div className="pointer-events-none absolute inset-x-0 top-4 z-10 flex justify-center">
                <span className="rounded-full bg-card/95 px-3 py-1 text-sm text-muted-foreground shadow">
                  Nenhum trecho publicado para exibir.
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
