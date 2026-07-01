import type { EvidenceStatus } from "@/shared/types/evidence.types"
import type {
  OccurrenceStatus,
  ProblemType,
} from "@/shared/types/occurrence.types"
import type { LineStringGeometry, RoadCondition } from "@/shared/types/road.types"

export type { RoadCondition } from "@/shared/types/road.types"

/**
 * Trecho colorido para o mapa. Espelha `MapSegmentResponse` do backend
 * (BE-20): `geometry` é o GeoJSON cru da LineString.
 */
export interface MapSegment {
  id: string
  name: string
  roadName: string
  condition: RoadCondition
  lengthMeters: number
  geometry: LineStringGeometry
}

/** Avaliação resumida (histórico do trecho) — espelha `AssessmentSummary`. */
export interface AssessmentSummary {
  id: string
  condition: RoadCondition
  severityScore: number
  source: string
  notes: string | null
  assessedBy: string
  assessedAt: string
  evidenceId: string | null
}

/** Evidência do trecho — subconjunto de `EvidenceResponse` usado no drawer. */
export interface SegmentEvidence {
  id: string
  status: EvidenceStatus
  fileUrl: string
  thumbnailUrl: string | null
  takenAt: string
}

/** Ocorrência resumida do trecho — espelha `OccurrenceSummary`. */
export interface OccurrenceSummary {
  id: string
  problemType: ProblemType
  status: OccurrenceStatus
  severityScore: number
  description: string | null
  openedAt: string
  resolvedAt: string | null
}
