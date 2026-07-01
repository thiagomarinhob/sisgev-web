export type EvidenceStatus =
  | "PENDING_UPLOAD"
  | "UPLOADED"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "DUPLICATED"
  | "INVALID_LOCATION"

export interface InspectionEvidence {
  id: string
  inspectionId: string
  fieldAgentId: string
  suggestedRoadSegmentId: string | null
  confirmedRoadSegmentId: string | null
  fileUrl: string
  thumbnailUrl: string | null
  latitude: number
  longitude: number
  gpsAccuracyMeters: number | null
  takenAt: string
  uploadedAt: string
  reviewedAt: string | null
  status: EvidenceStatus
  fieldNote: string | null
  adminNote: string | null
}
