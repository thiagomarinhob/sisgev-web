import { useEffect, useState } from "react"

import {
  getSegmentAssessments,
  getSegmentEvidences,
  getSegmentOccurrences,
} from "../services/segmentService"
import type {
  AssessmentSummary,
  OccurrenceSummary,
  SegmentEvidence,
} from "../types/map.types"

interface SegmentDetails {
  assessments: AssessmentSummary[]
  evidences: SegmentEvidence[]
  occurrences: OccurrenceSummary[]
}

interface UseSegmentDetailsResult extends SegmentDetails {
  isLoading: boolean
  error: string | null
}

const EMPTY: SegmentDetails = {
  assessments: [],
  evidences: [],
  occurrences: [],
}

/** Carrega histórico, fotos aprovadas e ocorrências do trecho em paralelo. */
export function useSegmentDetails(
  segmentId: string | null,
): UseSegmentDetailsResult {
  const [details, setDetails] = useState<SegmentDetails>(EMPTY)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function load() {
      if (!segmentId) {
        setDetails(EMPTY)
        return
      }
      setIsLoading(true)
      setError(null)
      try {
        const [assessments, evidences, occurrences] = await Promise.all([
          getSegmentAssessments(segmentId),
          getSegmentEvidences(segmentId),
          getSegmentOccurrences(segmentId),
        ])
        if (active) setDetails({ assessments, evidences, occurrences })
      } catch {
        if (active) setError("Não foi possível carregar os detalhes do trecho.")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [segmentId])

  return { ...details, isLoading, error }
}
