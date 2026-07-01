import type { RoadCondition } from "@/shared/types/road.types"

export const CONDITION_COLORS: Record<RoadCondition, string> = {
  GOOD: "#22c55e",
  REGULAR: "#eab308",
  BAD: "#f97316",
  CRITICAL: "#ef4444",
  IMPASSABLE: "#7c3aed",
  UNKNOWN: "#9ca3af",
}

export const CONDITION_LABELS: Record<RoadCondition, string> = {
  GOOD: "Bom",
  REGULAR: "Regular",
  BAD: "Ruim",
  CRITICAL: "Crítico",
  IMPASSABLE: "Intransitável",
  UNKNOWN: "Não avaliado",
}
