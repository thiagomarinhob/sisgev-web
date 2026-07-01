import apiClient from "@/shared/services/apiClient"
import type { PagedResponse } from "@/shared/types/api.types"
import type {
  AssessmentSummary,
  OccurrenceSummary,
  SegmentEvidence,
} from "../types/map.types"

const PAGE = { params: { page: 0, size: 50, sort: "assessedAt,desc" } }

/** Histórico de avaliações do trecho, mais recentes primeiro (BE-18). */
export async function getSegmentAssessments(
  segmentId: string,
): Promise<AssessmentSummary[]> {
  const { data } = await apiClient.get<PagedResponse<AssessmentSummary>>(
    `/road-segments/${segmentId}/history`,
    PAGE,
  )
  return data.content
}

/** Evidências aprovadas do trecho (galeria de fotos). */
export async function getSegmentEvidences(
  segmentId: string,
): Promise<SegmentEvidence[]> {
  const { data } = await apiClient.get<PagedResponse<SegmentEvidence>>(
    `/road-segments/${segmentId}/evidences`,
    { params: { page: 0, size: 50 } },
  )
  return data.content.filter((e) => e.status === "APPROVED")
}

/** Ocorrências do trecho. */
export async function getSegmentOccurrences(
  segmentId: string,
): Promise<OccurrenceSummary[]> {
  const { data } = await apiClient.get<PagedResponse<OccurrenceSummary>>(
    `/road-segments/${segmentId}/occurrences`,
    { params: { page: 0, size: 50 } },
  )
  return data.content
}
