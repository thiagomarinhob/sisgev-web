import type { DashboardSummary } from "@/shared/types/dashboard.types"

interface KmRepairedCardProps {
  repairedKm: DashboardSummary["repairedKm"]
}

export function KmRepairedCard({ repairedKm }: KmRepairedCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Km Recuperados
      </p>
      <p className="mt-2 text-3xl font-semibold">{repairedKm.toFixed(1)}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">km no período</p>
    </div>
  )
}
