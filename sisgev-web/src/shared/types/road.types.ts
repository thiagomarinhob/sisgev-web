export type RoadCondition =
  | "GOOD"
  | "REGULAR"
  | "BAD"
  | "CRITICAL"
  | "IMPASSABLE"
  | "UNKNOWN"

export interface Road {
  id: string
  municipalityId: string
  name: string
  description: string | null
  totalLengthMeters: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface LineStringGeometry {
  type: "LineString"
  coordinates: [number, number][]
}

export interface RoadSegment {
  id: string
  roadId: string
  roadName: string
  name: string
  segmentOrder: number
  geometry: LineStringGeometry
  lengthMeters: number
  currentCondition: RoadCondition
  lastAssessmentAt: string | null
  published: boolean
}
