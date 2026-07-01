import {
  CONDITION_COLORS,
  CONDITION_LABELS,
} from "@/shared/constants/conditions"
import type { SegmentFeatureProps } from "./RoadSegmentLayer"

interface SegmentTooltipProps {
  segment: SegmentFeatureProps
  x: number
  y: number
}

/**
 * Tooltip exibido ao passar o mouse sobre um trecho (spec §10): nome + condição.
 * Posicionado em pixels dentro do container do mapa, acima do cursor.
 */
export function SegmentTooltip({ segment, x, y }: SegmentTooltipProps) {
  return (
    <div
      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-md border bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-md"
      style={{ left: x, top: y - 12 }}
    >
      <p className="font-medium">{segment.name}</p>
      <p className="text-muted-foreground">{segment.roadName}</p>
      <p className="mt-1 flex items-center gap-1.5">
        <span
          className="inline-block size-2.5 rounded-sm"
          style={{ backgroundColor: CONDITION_COLORS[segment.condition] }}
        />
        {CONDITION_LABELS[segment.condition]}
      </p>
    </div>
  )
}
