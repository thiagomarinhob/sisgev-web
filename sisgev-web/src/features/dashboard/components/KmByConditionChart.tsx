import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

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

interface KmByConditionChartProps {
  kmByCondition: DashboardSummary["kmByCondition"]
}

export function KmByConditionChart({ kmByCondition }: KmByConditionChartProps) {
  const data = CONDITIONS.map((condition) => ({
    label: CONDITION_LABELS[condition],
    km: kmByCondition[condition] ?? 0,
    color: CONDITION_COLORS[condition],
  }))

  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Km por Condição
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} unit=" km" width={52} />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(1)} km`, "Extensão"]}
            cursor={{ fill: "oklch(0 0 0 / 5%)" }}
          />
          <Bar dataKey="km" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.label} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
