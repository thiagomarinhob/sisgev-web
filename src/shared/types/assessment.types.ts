import type { RoadCondition } from "./road.types"

export interface RoadAssessment {
  id: string
  roadSegmentId: string
  evidenceId: string | null
  condition: RoadCondition
  severityScore: number
  source: string
  notes: string | null
  assessedBy: string
  assessedAt: string
}
