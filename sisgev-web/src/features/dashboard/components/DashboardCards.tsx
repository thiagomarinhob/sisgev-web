import { CONDITION_COLORS, CONDITION_LABELS } from "@/shared/constants/conditions"
import type { DashboardSummary } from "@/shared/types/dashboard.types"
import type { RoadCondition } from "@/shared/types/road.types"

const CONDITIONS: RoadCondition[] = [
  "GOOD",
  "REGULAR",
  "BAD",
  "CRITICAL",
  "IMPASSABLE",
  "UNKNOWN",
]

interface DashboardCardsProps {
  kmByCondition: DashboardSummary["kmByCondition"]
}

export function DashboardCards({ kmByCondition }: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
      {CONDITIONS.map((condition) => (
        <div key={condition} className="rounded-lg border bg-card p-4">
          <div className="mb-2 flex items-center gap-2">
            <span
              className="inline-block size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: CONDITION_COLORS[condition] }}
            />
            <span className="text-xs font-medium text-muted-foreground">
              {CONDITION_LABELS[condition]}
            </span>
          </div>
          <p className="text-2xl font-semibold">
            {(kmByCondition[condition] ?? 0).toFixed(1)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">km</p>
        </div>
      ))}
    </div>
  )
}
