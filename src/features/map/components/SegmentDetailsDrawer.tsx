import { X } from "lucide-react"

import {
  CONDITION_COLORS,
  CONDITION_LABELS,
} from "@/shared/constants/conditions"
import { formatDate, formatKm } from "@/shared/utils/format"
import type {
  OccurrenceStatus,
  ProblemType,
} from "@/shared/types/occurrence.types"
import type { RoadCondition } from "../types/map.types"
import type { SegmentFeatureProps } from "./RoadSegmentLayer"
import { useSegmentDetails } from "../hooks/useSegmentDetails"

const PROBLEM_LABELS: Record<ProblemType, string> = {
  POTHOLES: "Buracos",
  MUD: "Lama",
  FLOODING: "Alagamento",
  EROSION: "Erosão",
  BRIDGE_DAMAGE: "Dano em ponte",
  VEGETATION: "Vegetação",
  BLOCKAGE: "Bloqueio",
  DUST: "Poeira",
  DRAINAGE_PROBLEM: "Drenagem",
  RUTTING: "Sulcos",
  OTHER: "Outro",
}

const OCCURRENCE_STATUS_LABELS: Record<OccurrenceStatus, string> = {
  OPEN: "Aberta",
  IN_ANALYSIS: "Em análise",
  SCHEDULED: "Agendada",
  IN_PROGRESS: "Em andamento",
  RESOLVED: "Resolvida",
  CANCELLED: "Cancelada",
}

function ConditionBadge({ condition }: { condition: RoadCondition }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
      style={{ backgroundColor: CONDITION_COLORS[condition] }}
    >
      {CONDITION_LABELS[condition]}
    </span>
  )
}

function Section({
  title,
  count,
  children,
}: {
  title: string
  count?: number
  children: React.ReactNode
}) {
  return (
    <section className="border-t px-4 py-3">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
        {count !== undefined && (
          <span className="ml-1 text-muted-foreground/70">({count})</span>
        )}
      </h3>
      {children}
    </section>
  )
}

interface SegmentDetailsDrawerProps {
  segment: SegmentFeatureProps
  onClose: () => void
}

/**
 * Drawer lateral com detalhes do trecho (spec §9.4): condição, extensão,
 * histórico de avaliações, fotos aprovadas e ocorrências.
 */
export function SegmentDetailsDrawer({
  segment,
  onClose,
}: SegmentDetailsDrawerProps) {
  const { assessments, evidences, occurrences, isLoading, error } =
    useSegmentDetails(segment.id)

  return (
    <div className="absolute right-0 top-0 z-30 flex h-full w-80 flex-col overflow-y-auto border-l bg-card text-card-foreground shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 px-4 py-3">
        <div>
          <p className="text-xs text-muted-foreground">{segment.roadName}</p>
          <h2 className="text-base font-semibold leading-tight">
            {segment.name}
          </h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Condição + extensão */}
      <div className="flex items-center justify-between px-4 pb-3">
        <ConditionBadge condition={segment.condition} />
        <span className="text-sm text-muted-foreground">
          {formatKm(segment.lengthMeters)}
        </span>
      </div>

      {error && (
        <p className="border-t px-4 py-3 text-sm text-destructive">{error}</p>
      )}
      {isLoading && (
        <p className="border-t px-4 py-3 text-sm text-muted-foreground">
          Carregando detalhes…
        </p>
      )}

      {!isLoading && !error && (
        <>
          {/* Histórico de avaliações */}
          <Section title="Histórico de avaliações" count={assessments.length}>
            {assessments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem avaliações.</p>
            ) : (
              <ul className="space-y-2">
                {assessments.map((a) => (
                  <li key={a.id} className="text-sm">
                    <div className="flex items-center justify-between">
                      <ConditionBadge condition={a.condition} />
                      <span className="text-xs text-muted-foreground">
                        {formatDate(a.assessedAt)}
                      </span>
                    </div>
                    {a.notes && (
                      <p className="mt-1 text-muted-foreground">{a.notes}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Section>

          {/* Fotos aprovadas */}
          <Section title="Fotos aprovadas" count={evidences.length}>
            {evidences.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem fotos.</p>
            ) : (
              <div className="grid grid-cols-3 gap-1.5">
                {evidences.map((e) => (
                  <a
                    key={e.id}
                    href={e.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block aspect-square overflow-hidden rounded-md border bg-muted"
                  >
                    <img
                      src={e.thumbnailUrl ?? e.fileUrl}
                      alt="Evidência do trecho"
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  </a>
                ))}
              </div>
            )}
          </Section>

          {/* Ocorrências */}
          <Section title="Ocorrências" count={occurrences.length}>
            {occurrences.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem ocorrências.</p>
            ) : (
              <ul className="space-y-2">
                {occurrences.map((o) => (
                  <li key={o.id} className="text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {PROBLEM_LABELS[o.problemType]}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {OCCURRENCE_STATUS_LABELS[o.status]}
                      </span>
                    </div>
                    {o.description && (
                      <p className="mt-0.5 text-muted-foreground">
                        {o.description}
                      </p>
                    )}
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Aberta em {formatDate(o.openedAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </>
      )}
    </div>
  )
}
