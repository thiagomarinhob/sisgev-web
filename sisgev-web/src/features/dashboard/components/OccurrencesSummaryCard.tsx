import type { DashboardSummary } from "@/shared/types/dashboard.types"

interface OccurrencesSummaryCardProps {
  openOccurrences: DashboardSummary["openOccurrences"]
  resolvedOccurrences: DashboardSummary["resolvedOccurrences"]
}

export function OccurrencesSummaryCard({
  openOccurrences,
  resolvedOccurrences,
}: OccurrencesSummaryCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Ocorrências
      </p>
      <div className="mt-2 flex items-end gap-6">
        <div>
          <p className="text-3xl font-semibold text-destructive">{openOccurrences}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">abertas</p>
        </div>
        <div>
          <p className="text-3xl font-semibold text-green-500">{resolvedOccurrences}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">resolvidas</p>
        </div>
      </div>
    </div>
  )
}
