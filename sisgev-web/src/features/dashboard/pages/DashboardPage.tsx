import { DashboardCards } from "../components/DashboardCards"
import { KmByConditionChart } from "../components/KmByConditionChart"
import { KmRepairedCard } from "../components/KmRepairedCard"
import { OccurrencesSummaryCard } from "../components/OccurrencesSummaryCard"
import { useDashboard } from "../hooks/useDashboard"

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-6 w-32 animate-pulse rounded bg-muted" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="h-24 animate-pulse rounded-lg bg-muted" />
        <div className="h-24 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="h-64 animate-pulse rounded-lg bg-muted" />
    </div>
  )
}

export function DashboardPage() {
  const { data, isLoading, error } = useDashboard()

  if (isLoading) return <DashboardSkeleton />

  if (error) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <DashboardCards kmByCondition={data.kmByCondition} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KmRepairedCard repairedKm={data.repairedKm} />
        <OccurrencesSummaryCard
          openOccurrences={data.openOccurrences}
          resolvedOccurrences={data.resolvedOccurrences}
        />
      </div>
      <KmByConditionChart kmByCondition={data.kmByCondition} />
    </div>
  )
}
