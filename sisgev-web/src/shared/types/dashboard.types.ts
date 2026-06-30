import type { RoadCondition } from "./road.types"

export interface DashboardSummary {
  municipalityId: string
  period: { startDate: string; endDate: string }
  totalMappedKm: number
  kmByCondition: Record<RoadCondition, number>
  repairedKm: number
  openOccurrences: number
  resolvedOccurrences: number
}
