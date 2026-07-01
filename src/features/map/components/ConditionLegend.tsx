import {
  CONDITION_COLORS,
  CONDITION_LABELS,
} from "@/shared/constants/conditions"
import type { RoadCondition } from "../types/map.types"

const ORDER: RoadCondition[] = [
  "GOOD",
  "REGULAR",
  "BAD",
  "CRITICAL",
  "IMPASSABLE",
  "UNKNOWN",
]

/** Legenda fixa no canto inferior direito do mapa (spec §10). */
export function ConditionLegend() {
  return (
    <div className="absolute bottom-4 right-4 z-10 rounded-lg border bg-card/95 p-3 text-card-foreground shadow-md backdrop-blur">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Condição
      </p>
      <ul className="space-y-1.5">
        {ORDER.map((condition) => (
          <li key={condition} className="flex items-center gap-2 text-sm">
            <span
              className="inline-block size-3 shrink-0 rounded-sm"
              style={{ backgroundColor: CONDITION_COLORS[condition] }}
            />
            {CONDITION_LABELS[condition]}
          </li>
        ))}
      </ul>
    </div>
  )
}
